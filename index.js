const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { publicPath, productosFilePath, PORT } = require('./config');
const flash = require("express-flash");
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const routes = require('./src/routes/routes');
const userRoutes = require('./src/routes/usersRoutes');
const initizalizePassport = require("./config/passportConfig");
require('dotenv').config();

initizalizePassport(passport);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
//Session
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // limpia las sesiones expiradas cada 24 horas
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true en producción, false en desarrollo
      sameSite: 'none', // agregamos el atributo sameSite con valor 'none'
      maxAge: 86400000, // 24 horas
    },
  })
);


app.use(passport.initialize())
app.use(passport.session())
app.use(flash());



fs.access(productosFilePath, fs.constants.R_OK, (err) => {
  if (err) {
    console.error(`No se puede leer el archivo ${productosFilePath}: ${err}`);
  } else {
    const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf8'));
    app.locals.productos = productos;
    console.log(`Tiene permisos para leer el archivo ${productosFilePath}`);
  }
});
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath, {
  setHeaders: function (res, path, stat) {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));

app.set('views', path.join(__dirname, '/src/views'));
app.set("view engine", "ejs");



app.use('/', routes);
app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log(`Server echando chispas en el puerto: ${PORT}`);
});

module.exports = { app, publicPath };