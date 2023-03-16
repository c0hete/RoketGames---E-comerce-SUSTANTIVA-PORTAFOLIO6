const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const productosController = require('../controllers/productosController');
const { publicPath, productosFilePath } = require('../../config');

// Middleware para manejar errores
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
}

router.get('/', (req, res) => {
  res.render('index');
});


router.get('/productos', async (req, res, next) => {
  try {
    const data = await fs.readFile(productosFilePath, 'utf8');
    const productos = JSON.parse(data);
    const producto = productos[0]; // define producto como el primer producto del archivo
    res.render('productos', { producto });
  } catch (err) {
    next(err);
  }
});

router.get('/productos/:id/resumen', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await fs.readFile(productosFilePath, 'utf8');
    const productos = JSON.parse(data);
    const producto = productos.find((prod) => prod.id === parseInt(id));
    if (producto) {
      res.render('resumen', { producto });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (err) {
    next(err);
  }
});



router.use(errorHandler);

module.exports = router;