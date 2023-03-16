const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { publicPath, productosFilePath, PORT } = require('./config');


const app = express();

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

app.set('views', path.join(__dirname, './src/views'));
app.set("view engine", "ejs");


const routes = require('./src/routes/routes');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server echando chispas en el puerto: ${PORT}`);
});

module.exports = { app, publicPath };