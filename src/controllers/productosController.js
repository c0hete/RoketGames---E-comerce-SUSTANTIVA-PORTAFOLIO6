// const fs = require('fs');
// const path = require('path');

// const productosFilePath = path.join(__dirname, '../public/productos.json');

// async function leerArchivoJson(path) {
//   try {
//     const data = await fs.promises.readFile(path, 'utf8');
//     return JSON.parse(data);
//   } catch (err) {
//     console.error(err);
//     throw new Error('Error interno del servidor');
//   }
// }

// async function getProductoById(id) {
//     const productos = await leerArchivoJson(productosFilePath);
//     const producto = productos.find(p => p.id === parseInt(id));
//     return producto ? { ...producto } : null;
//   }

// module.exports = { getProductoById };
