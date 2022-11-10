//Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBTN = document.querySelector("#vaciar-carrito");
let productos = [];
let categoria = [];
let articulosCarrito = [];

const contenidoCategoria = document.querySelector("#category");
const contenidoProducto = document.querySelector("#productos .contenido .row");
const listaProducto = document.querySelector("#productos");

const datosBusqueda = {
  idCategoria: "",
};
//eventos Listener
cargarEventListener();
function cargarEventListener() {
  document.addEventListener("DOMContentLoaded", () => {
    obtenerProductos();
    obtenerCategoria();
  });
  contenidoCategoria.addEventListener("change", (e) => {
    datosBusqueda.idCategoria = e.target.value;
    filtrarProducto();
  });
  listaProducto.addEventListener("click", agregarProductoCarro);
  carrito.addEventListener("click", eliminarProductoCarrito);
  vaciarCarritoBTN.addEventListener("click", () => {
    articulosCarrito = [];
    limpiarCarrito();
  });
}
//funciones
const obtenerProductos = () => {
  const url = `https://backend-bsale-roberto.herokuapp.com/api/product/`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      mostrarProductos(resultado["products"]), (productos = resultado);
    })
    .catch((error) => console.log(error));
};

const obtenerCategoria = () => {
  const id = document.querySelector("#searchCategory").value;

  const url = `https://backend-bsale-roberto.herokuapp.com/api/category/`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      mostrarCategorias(resultado), (categoria = resultado["category"]);
    })
    .catch((error) => console.log(error));
};

const mostrarCategorias = (categoria) => {
  categoria["category"].forEach((categoria) => {
    const option = document.createElement("option");

    option.value = categoria.id;
    option.textContent = categoria.name;

    contenidoCategoria.appendChild(option);
  });
};

function mostrarProductos(productos) {
  limpiarHTML(); // Elimina el HTML previo
  productos.forEach((producto, key) => {
    const columns = document.createElement("DIV");
    columns.classList.add("four");

    const card = document.createElement("DIV");
    card.classList.add("card");
    card.setAttribute("id", "mostrarProducto");

    const imagen = document.createElement("img");
    imagen.classList.add("rounded");
    imagen.setAttribute("src", producto.url_image ? producto.url_image : "");

    const infoCard = document.createElement("DIV");
    infoCard.classList.add("info-card");

    const nombre = document.createElement("h4");
    nombre.textContent = producto.name;

    const precio = document.createElement("p");
    precio.classList.add("col-md-3");
    precio.textContent = `$${producto.price}`;

    const agregarCarritoBTN = document.createElement("button");
    agregarCarritoBTN.classList.add("button");
    agregarCarritoBTN.setAttribute("id", "btnAgregar");
    agregarCarritoBTN.setAttribute("data-id", key);
    agregarCarritoBTN.setAttribute("href", "#");
    agregarCarritoBTN.textContent = "Agregar al Carrito";

    card.appendChild(imagen);
    card.appendChild(infoCard);
    columns.appendChild(card);
    infoCard.appendChild(nombre);
    infoCard.appendChild(precio);
    infoCard.appendChild(agregarCarritoBTN);
    contenidoProducto.appendChild(columns);
  });
}
function limpiarHTML() {
  while (contenidoProducto.firstChild) {
    contenidoProducto.removeChild(contenidoProducto.firstChild);
  }
}

function filtrarProducto() {
  const resultado = productos["products"].filter(filtrarCategoria);

  mostrarProductos(resultado);
}
function filtrarCategoria(productos) {
  const { idCategoria } = datosBusqueda;
  if (idCategoria >= 1) {
    return productos.category == idCategoria;
  }
  return productos;
}

const buscarPorCategoria = document.querySelector("#searchCategory");
buscarPorCategoria.addEventListener("change", (e) => {
  categoria.map((categoria) => {
    if (e.target.value == categoria.name) {
      datosBusqueda.idCategoria = categoria.id;
    }
  });
  filtrarProducto();
});

function agregarProductoCarro(e) {
  e.preventDefault();

  if (e.target.classList.contains("button")) {
    const productoSeleccionado = e.target.parentElement.parentElement;
    window.alert("Producto Agregado Correctamente al Carro");
    leerDatosProducto(productoSeleccionado);
  }
}

function leerDatosProducto(producto) {
  const infoProducto = {
    imagen: producto.querySelector("img").src,
    nombre: producto.querySelector("h4").textContent,
    precio: producto.querySelector("p").textContent,
    id: producto.querySelector("button").getAttribute("data-id"),
    cantidad: 1,
  };
  //revisar si existe
  const existe = articulosCarrito.some(
    (producto) => producto.id === infoProducto.id
  );

  if (existe) {
    const producto = articulosCarrito.map((producto) => {
      if (producto.id === infoProducto.id) {
        producto.cantidad += 1;
        return producto;
      } else {
        return producto;
      }
    });
    articulosCarrito = [...producto];
  } else {
    articulosCarrito = [...articulosCarrito, infoProducto];
  }
  carritoHTML();
}

function carritoHTML() {
  //lipiarHTML
  limpiarCarrito();
  //generar HTML
  articulosCarrito.forEach((producto) => {
    const { imagen, nombre, precio, cantidad, id } = producto;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img height='40px' width='40px' src=${imagen}>
            </td> 
            <td>
                ${nombre}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href= '#' class='borrar-producto' data-id= '${id}'> X </a>
            </td>

        `;
    //agrega HTML
    contenedorCarrito.appendChild(row);
  });
}

function limpiarCarrito() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

function eliminarProductoCarrito(e) {
  if (e.target.classList.contains("borrar-producto")) {
    const productoID = e.target.getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter(
      (producto) => producto.id !== productoID
    );
    carritoHTML();
  }
}
