const express = require("express");
const router = express.Router();
const { pool } = require("../../config/dbConfig");
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// Middleware para manejar errores
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
}

function getProductoById(productos, id) {
  return productos.find((prod) => prod.id === id);
}

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/productos", async (req, res, next) => {
  try {
    const productosQuery = "SELECT * FROM productos";
    const productosResult = await pool.query(productosQuery);
    const productos = productosResult.rows;
    res.render("productos", { productos });
  } catch (err) {
    next(err);
  }
});

router.get('/carrito', async function(req, res) {
  // Obtener la información del carrito del usuario desde la sesión
  const carrito = req.session.carrito || {};

  if (Object.keys(carrito).length === 0) {
    // Si el carrito está vacío, renderizar la vista del carrito con una lista vacía de productos
    res.render('carrito', { productos: [], carrito, total: 0 });
  } else {
    // Crear una lista vacía de objetos de productos del carrito
    const productosCarrito = [];

    // Iterar sobre los productos en el carrito
    let total = 0;
    for (var productoId in carrito) {
      // Buscar el producto por su id en la base de datos
      const productosQuery = "SELECT * FROM productos WHERE id = $1";
      const productosResult = await pool.query(productosQuery, [productoId]);
      const producto = productosResult.rows[0];

      if (producto) {
         // Si se encontró el producto, agregarlo a la lista de productos del carrito con la cantidad correspondiente
         productosCarrito.push({
            producto: producto,
            cantidad: carrito[productoId]
         });
         total += producto.precio * carrito[productoId];
      } else {
         // Si no se encontró el producto, eliminarlo del carrito
         delete carrito[productoId];
      }
    }
    // Actualizar el carrito en la sesión con los productos que todavía están en el carrito
    req.session.carrito = carrito;

    // Renderizar la vista del carrito con la lista de productos del carrito y el objeto carrito
    res.render('carrito', { productos: productosCarrito, carrito, total });
  }
});


router.post('/carrito/actualizar-cantidad/:id', function(req, res) {
  const productoId = req.params.id;
  const cantidad = req.body.cantidad;
  const carrito = req.session.carrito || {};

  if (carrito[productoId]) {
    carrito[productoId] = cantidad;
    req.session.carrito = carrito;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

//--------------------------------------------------------------------POST---------------------------
router.post('/productos/agregar-al-carrito/:id', async function(req, res) {
  const productId = req.params.id;
  const productosQuery = "SELECT * FROM productos WHERE id = $1";
  const productosResult = await pool.query(productosQuery, [productId]);
  const producto = productosResult.rows[0];

  if (producto) {
    if (!req.session.carrito) {
      req.session.carrito = {};
    }
    if (!req.session.carrito[productId]) {
      req.session.carrito[productId] = 1;
    } else {
      req.session.carrito[productId] += 1;
    }

    console.log('Carrito actualizado:', req.session.carrito);
    res.status(200).send({ message: 'Producto agregado al carrito' });
  } else {
    res.status(404).send('Producto no encontrado');
  }
});



module.exports = router;
// exportar el módulo para usarlo en app.js
