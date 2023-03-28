document.addEventListener('DOMContentLoaded', function() {
  const agregarCarritoBotones = document.querySelectorAll('.agregar-carrito');
  const carritoContador = document.getElementById('carrito-contador');

  agregarCarritoBotones.forEach((btn) => {
    btn.addEventListener('click', async function() {
      const id = btn.getAttribute('data-id');
      const response = await fetch(`/productos/agregar-al-carrito/${id}`, { method: 'GET' });

      if (response.ok) {
        // Incrementa el contador de elementos en el carrito
        if (carritoContador) {
          carritoContador.textContent = parseInt(carritoContador.textContent) + 1;
        }
        console.log('Producto agregado al carrito');
      } else {
        console.error('Error al agregar producto al carrito');
      }
    });
  });
});
