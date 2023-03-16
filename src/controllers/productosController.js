const fs = require('fs'); // Se importa el módulo fs (file system) para trabajar con archivos en el sistema.
const path = require('path'); // Se importa el módulo path para trabajar con rutas de archivo.

const productosFilePath = path.join(__dirname, '/public/productos.json');
 // Se define la ruta del archivo de productos.

 async function leerArchivoJson(path) {
  try {
    const data = await fs.promises.readFile(path, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw new Error('Error interno del servidor');
  }
}

async function renderizarProductos(req, res) {
  try {
    const productos = await leerArchivoJson(productosFilePath);
    res.render('productos', { productos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  }
}

async function getProductos(req, res) {
  try {
  const productos = await leerArchivoJson(productosFilePath);
  res.render('productos', { productos });
  // Pasa la variable productos como datos para mostrar.
  } catch (err) {
  console.error(err);
  res.status(500).send('Error interno del servidor');
  }
  }


function obtenerProductoPorId(id) { // Función para obtener un producto por su ID.
  const productos = leerArchivoJson(productosFilePath); // Lee el archivo de productos.
  const producto = productos.find(p => p.id === id); // Busca el producto que tenga el ID indicado.
  return { ...producto }; // Retorna el producto encontrado como un nuevo objeto con los mismos datos.
}
function mostrarResumen(req, res) { // Controlador para mostrar el resumen de un producto específico.
  const idProducto = req.params.id; // Obtiene el ID del producto a partir de los parámetros de la URL.
  const producto = obtenerProductoPorId(idProducto); // Busca el producto en el archivo de productos.
  res.render('productoResumen', { producto }); // Renderiza la vista de resumen de producto y pasa el producto como datos para mostrar.
}

function getCarrito(req, res) { // Controlador para obtener el carrito.
  // Código para obtener el carrito
}

module.exports = { // Exporta los controladores para que puedan ser utilizados por otros archivos.
  getProductos,
  mostrarResumen,
  getCarrito,
  renderizarProductos
};
