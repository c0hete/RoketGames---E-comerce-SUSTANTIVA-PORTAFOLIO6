const { Router } = require("express");
const { pool } = require("../../config/dbConfig");
const bcrypt = require("bcrypt");
const path = require("path");
const router = Router();
const passport = require("passport");
const upload = require('../../config/multerConfig');
const { getUserByEmail, createUser } = require('../controllers/dbOperations');

// Middleware para verificar si el usuario está autenticado
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

//----------------------------------------------------------------------GET--------------------------------------------------
router.get('/admin', function(req, res) {
  // Verificar si el usuario está autenticado y si es un usuario con isadmin "verdadero"
  if (req.isAuthenticated() && req.user.isadmin) {
    res.render('admin', { user: req.user });
  } else {
    res.redirect('/login');
  }
});


router.get("/", (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/', function(req, res) {
  res.render('index', { user: req.user, message: 'You have logged out successfully' });
});

router.get("/login", (req, res) => res.render("login", { user: req.user }));

router.get('/register', (req, res) => {
  res.render('register', { user: req.user });
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
const query = `SELECT *, CAST(isadmin AS BOOLEAN) AS is_admin FROM users WHERE id = ${userId}`;
const result = await pool.query(query);
const user = result.rows[0];

// Verificar si el usuario es administrador
const isAdmin = user.is_admin;
console.log(`isAdmin: ${isAdmin}`);

res.render('dashboard', { user: user.name, userId: user.id, isAdmin: isAdmin });

    
  } catch (err) {
    console.error(err);
    res.isadmin(500).send("Something went wrong");
  }
});




router.get('/isadmin', (req, res) => {
  // Verificar si el usuario está autenticado y si es un usuario con isadmin "verdadero"
  if (req.isAuthenticated() && req.user.isadmin) {
    res.render('isadmin', { user: req.user });
  } else {
    res.redirect('/login');
  }
});




router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.render("index", { user: req.user, message: "You have logged out successfully" });
  });
});

router.get('/:id/image', async (req, res) => {
  const id = req.params.id;
  const query = `SELECT photo FROM users WHERE id = ${id}`;
  try {
    const result = await pool.query(query);
    const user = result.rows[0];
    const imagePath = path.join(__dirname, '..', '..', 'public', 'img', user.photo);
    res.sendFile(imagePath);
  } catch (err) {
    console.error(err);
    res.isadmin(500).send("Something went wrong");
  }
});
router.get('/esadmin', (req, res) => {
  // Verificar si el usuario está autenticado y si es un usuario con isadmin "verdadero"
  if (req.isAuthenticated() && req.user.isadmin) {
    res.render('esadmin', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

// router.get('/autos/:id/image', async (req, res) => {
//   const id = req.params.id;
//   const query = `SELECT foto FROM autos WHERE id = ${id}`;
//   try {
//     const result = await pool.query(query);
//     const auto = result.rows[0];
//     const imagePath = path.join(__dirname, '..', 'public', 'img', auto.foto);
//     res.sendFile(imagePath);
//   } catch (err) {
//     console.error(err);
//     res.isadmin(500).send("Something went wrong");
//   }
// });

//-----------------------------------------------------------------POST-------------------------------------------------------


router.post("/register", upload.single("photo"), async (req, res) => {
  // manejar la imagen cargada
  const photo = req.file;

  let { name, email, password, password2 } = req.body;

  console.log({
    name,
    email,
    password,
    password2,
    photo,
  });

  let errors = [];

  if (
    !name ||
    !email ||
    !password ||
    !password2 ||
    !photo
  ) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Passwords should be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, user: req.user });

  } else {
    //form validation has passed

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    getUserByEmail(email).then((user) => {
      if (user) {
        errors.push({ message: "Email already registered" });
        res.render("register", { errors });
      } else {
        // Reemplazar la consulta SQL en bruto con la función createUser
        createUser(name, email, hashedPassword, photo.filename).then((user) => {
          console.log(user);
          req.flash("success_msg", "You are now registered. Please log in");
          res.redirect("/login");
        }).catch((err) => {
          throw err;
        });
      }
    }).catch((err) => {
      throw err;
    });
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  req.session.userId = req.user.id;
  res.redirect('/dashboard');
});


// Agregar un nuevo usuario
router.post("/users/add", async (req, res) => {
  const { name, email, password, photo, isadmin } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users(name, email, password, photo, isadmin) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [name, email, password, photo, isadmin]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// Ruta para mostrar la página de administración
router.get('/admin', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    const users = result.rows;
    res.render('admin', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// Ruta para agregar un nuevo usuario
router.post('/admin/add', async (req, res) => {
  try {
    const { name, isadmin, email, password } = req.body;
    const query = 'INSERT INTO users (name, isadmin, email, password) VALUES ($1, $2, $3, $4)';
    const values = [name, isadmin, email, password];
    await pool.query(query, values);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});
// Ruta para mostrar el formulario de edición de un usuario
router.get('/admin/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    res.render('edit', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});
//---------------------------------------------------------------PUT-------------------
// Ruta para actualizar un usuario
router.post('/admin/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, isadmin, email, password } = req.body;
    const query = 'UPDATE users SET name = $1, isadmin = $2, email = $3, password = $4 WHERE id = $5';
    const values = [name, isadmin, email, password, id];
    await pool.query(query, values);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

//-----------------------------------------------------------------------DELETE
// Ruta para eliminar un usuario
router.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const query = `DELETE FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});




module.exports = router;