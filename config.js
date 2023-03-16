const path = require('path');

const publicPath = path.resolve(__dirname, 'public');
const productosFilePath = path.join(__dirname, 'public', 'productos.json');
const PORT = process.env.PORT || 4000;

module.exports = { publicPath, productosFilePath, PORT };