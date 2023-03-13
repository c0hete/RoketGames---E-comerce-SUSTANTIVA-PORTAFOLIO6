// Definir variables
const Clickbutton = document.querySelectorAll('.button');
const tbody = document.querySelector('.tbody');
const carrito = [];

// Función para agregar un item al carrito
function addToCarritoItem(e) {
// Obtener información del item
const button = e.target;
const item = button.closest('.card');
const itemTitle = item.querySelector('.card-title').textContent;
const itemPrice = item.querySelector('.precio').textContent;
const itemImg = item.querySelector('.card-img-top').src;

// Crear objeto con la información del item
const newItem = {
title: itemTitle,
precio: itemPrice,
img: itemImg,
cantidad: 1
};

// Agregar el item al carrito
addItemCarrito(newItem);
}

// Función para agregar un item al carrito
function addItemCarrito(newItem) {
// Validar que no se pueda agregar un item con cantidad menor o igual a cero
if (newItem.cantidad <= 0) {
return;
}

// Actualizar cantidad de un item si ya existe en el carrito
for (let i = 0; i < carrito.length; i++) {
if (carrito[i].title.trim() === newItem.title.trim()) {
carrito[i].cantidad++;
const inputValue = tbody.getElementsByClassName('input__elemento')[i];
inputValue.value++;
CarritoTotal();
return;
}
}

// Agregar el item al carrito si no existe aún
carrito.push(newItem);

// Renderizar el carrito
renderCarrito();
}

// Función para renderizar el carrito
function renderCarrito() {
tbody.innerHTML = '';
carrito.forEach((item, i) => {
// Crear elemento HTML para el item
const tr = document.createElement('tr');
tr.classList.add('ItemCarrito');
tr.innerHTML = `
<th scope="row"></th> 
<td class="table__productos"> <img src="${item.img}" alt=""> 
<h6 class="title">${item.title}</h6>
 </td> <td class="table__price"><p>${item.precio}</p>
 </td> <td class="table__cantidad"> 
 <input type="number" min="1" value="${item.cantidad}" class="input__elemento"> 
 <button class="delete btn btn-danger">x</button> </td> `;
tbody.append(tr);

less

// Agregar evento para eliminar el item del carrito
tr.querySelector(".delete").addEventListener('click', removeItemCarrito

);

// Agregar evento para actualizar el total del carrito cuando se cambie la cantidad de un item
tr.querySelector(".input__elemento").addEventListener('change', (e) => {
const inputValue = e.target;
const newValue = inputValue.value;
carrito[i].cantidad = newValue;
CarritoTotal();
});

});

// Actualizar el total del carrito
CarritoTotal();
}

// Función para eliminar un item del carrito
function removeItemCarrito(e) {
const buttonDelete = e.target;
const tr = buttonDelete.closest('.ItemCarrito');
const title = tr.querySelector('.title').textContent;
for (let i = 0; i < carrito.length; i++) {
if (carrito[i].title.trim() === title.trim()) {
carrito.splice(i, 1);
}
}

// Eliminar el item del DOM y renderizar el carrito actualizado
tr.remove();
CarritoTotal();
}

// Función para vaciar el carrito
function vaciarCarrito() {
// Eliminar todos los items del carrito
carrito.splice(0, carrito.length);

// Eliminar los elementos del DOM y renderizar el carrito vacío
while (tbody.firstChild) {
tbody.removeChild(tbody.firstChild);
}

// Actualizar el total del carrito
CarritoTotal();
}

// Función para actualizar el total del carrito
function CarritoTotal() {
// Obtener el total del carrito
let Total = 0;
const itemCartTotal = document.querySelector('.itemCartTotal');
carrito.forEach((item) => {
const precio = Number(item.precio.replace("$", ""));
Total = Total + precio * item.cantidad;
});

// Actualizar el valor del total en el DOM
itemCartTotal.innerHTML = `Total $ ${Total.toFixed(2)}`
}

// Agregar evento para agregar items al carrito al hacer clic en los botones de los productos
Clickbutton.forEach((btn) => {
btn.addEventListener('click', addToCarritoItem);
});

// Agregar evento para vaciar el carrito al hacer clic en el botón de vaciar
const vaciarButton = document.querySelector('.vaciar-carrito');
vaciarButton.addEventListener('click', vaciarCarrito);

// Agregar evento para finalizar la compra y enviar un formulario con la información del carrito al usuario
const finalizarCompraButton = document.querySelector('.finalizar-compra');
finalizarCompraButton.addEventListener('click', () => {
// Crear formulario con la información del carrito
const formulario = document.createElement('form');
formulario.method = 'POST';
formulario.action = 'http://ejemplo.com/compra';

carrito.forEach((item) => {
const input = document.createElement('input');
input.type = 'hidden';
input.name = item.title;
input.value = item.cantidad;
formulario.appendChild(input);
});

// Enviar el formulario
document.body.appendChild(formulario);
formulario.submit();
});