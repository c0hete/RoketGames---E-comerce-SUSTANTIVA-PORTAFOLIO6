const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const productosController = require("../controllers/productosController");
const { productosFilePath } = require("../../config");
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// Configurar el middleware de sesión
router.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MemoryStore({
    checkPeriod: 86400000 // Limpiar la memoria de almacenamiento cada 24 horas
  })
}));

// Middleware para manejar errores
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
}

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/productos", async (req, res, next) => {
  try {
    const data = await fs.readFile(productosFilePath, "utf8");
    const productos = JSON.parse(data);
    res.render("productos", { productos });
  } catch (err) {
    next(err);
  }
});

router.get("/productos/:id/resumen", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await fs.readFile(productosFilePath, "utf8");
    const productos = JSON.parse(data);
    const producto = productos.find((prod) => prod.id === parseInt(id));
    if (producto) {
      res.render("resumen", { producto });
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/carrito", function (req, res) {
  // Obtener la información del carrito del usuario
  var carrito = req.session.carrito || {};
  var productosCarrito = req.session.productosCarrito || {};

  // Renderizar la vista del carrito
  res.render("carrito", { carrito, productosCarrito });
});

router.post("/carrito/agregar", async (req, res, next) => {
  try {
    const id = req.body.id;
    const data = await fs.readFile(productosFilePath, "utf8");
    const productos = JSON.parse(data);
    const producto = productos.find((prod) => prod.id === parseInt(id));
    if (producto) {
      // Agregar el producto al carrito del usuario
      var carrito = req.session.carrito || {};
      var productosCarrito = req.session.productosCarrito || {};
      if (carrito.hasOwnProperty(id)) {
        carrito[id]++;
      } else {
        carrito[id] = 1;
        productosCarrito[id] = producto;
      }
      req.session.carrito = carrito;
      req.session.productosCarrito = productosCarrito;
      res.redirect("/carrito");
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
