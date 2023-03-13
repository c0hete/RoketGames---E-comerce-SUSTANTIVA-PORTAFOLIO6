const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')('<Stripe Secret Key>');
const publicPath = path.resolve(__dirname, 'public');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));

app.set('views', path.join(__dirname, './public/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
res.render('index', );
});


const PORT = process.env.ENV || 4000;

// Aquí irán las funciones y rutas de tu aplicación

app.listen(PORT, () => {
  console.log(`Server echando chispas en el puerto: ${PORT}`);
});