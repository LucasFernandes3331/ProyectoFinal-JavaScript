// Definir variables importantes.

const sectionShirts = document.querySelector("section.section-remeras");
const totalPrice = document.querySelector('#total');
const listShop = document.querySelector('#lista-compras');
const shop = document.querySelector('.carrito');
const buyButton = document.querySelector('#comprar-button');

// variable para el LocalStorage de la lista del carrito.

let carritoLocalStorage = JSON.parse(localStorage.getItem("listShop")) || [];

// Cargar las remeras desde un json local.

fetch("scripts/shirts.json")
    .then(response => response.json())
    .then(shirts => {

        const theShirts = shirts.map(shirt => `
            <div class="beatles-card" id="${shirt.id}">
                <img src="images/${shirt.id}-remera.png" alt="Remera de ${shirt.name}">
                <h2>${shirt.name}</h2>
                <p>Precio: $${shirt.valor}</p>
                <button class="button-card" data-id="${shirt.id}">Agregar al carrito</button>
            </div>
        `);

        sectionShirts.innerHTML = theShirts.join("");

        // Configuración de los botones de las cards

        const buttons = document.querySelectorAll(".button-card");
        buttons.forEach((button) => {

            button.addEventListener("click", (buscarRemera) => {
                const id = buscarRemera.target.dataset.id;
                const producto = shirts.find((shirt) => shirt.id === id);
                agregarAlCarrito(producto);
            });
        });

        actualizarCarrito();
    })

    // En el caso de que ocurra un error con la carga de shirts.json, mostrar ese mensaje de la libreria sweetalert.

    .catch((error) => {
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar las remeras',
            text: 'Ocurrió un error, vuelve a intentarlo en otro momento.',
        });
    });

// Agregar producto al carrito acompañado de un sweetalert

function agregarAlCarrito(producto) {
    carritoLocalStorage.push(producto);  // Linea 58 consultada con Grok AI
    guardarCarrito();
    actualizarCarrito();

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Agregada con éxito',
        showConfirmButton: false,
        timer: 800
    });
}

// Actualizar lista en una funcion y agregar el boton para eliminar, en el caso que se desee, la remera

function actualizarCarrito() {
    listShop.innerHTML = "";

    carritoLocalStorage.forEach((ropa, borrar) => {
        const li = document.createElement("li");
        li.innerHTML = `
    ${ropa.name} - $${ropa.valor}
    <button class="button-eliminar">
        <img src="./media/papelera.png" class="papelera-img">
    </button>
`;
;

        listShop.appendChild(li);
    });

    // Calcular el total de la compra

    const total = carritoLocalStorage.reduce((suma, item) => suma + item.valor, 0);
    totalPrice.textContent = `TOTAL: $${total}`;

    // Funcionalidad para el boton de eliminar del carrito

    const botonesEliminar = document.querySelectorAll(".button-eliminar");
    botonesEliminar.forEach((buttonDelete) => {

        buttonDelete.addEventListener("click", (funcionBorrar) => {

            const index = funcionBorrar.target.dataset.index;
            carritoLocalStorage.splice(index, 1);
            guardarCarrito();
            actualizarCarrito();
        });
    });
}

// Guardar el carrito en el localstorage

function guardarCarrito() {
    localStorage.setItem("listShop", JSON.stringify(carritoLocalStorage));
}

// Funcion para comprar y sweetalert para confirmar

buyButton.addEventListener("click", () => {
    if (carritoLocalStorage.length === 0) {
        Swal.fire("¡Carrito vacío!", "Debes añadir algún producto para continuar.", "info");
        return;
    }

    Swal.fire({
        title: "¿Deseas confirmar la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            carritoLocalStorage = [];
            guardarCarrito();
            actualizarCarrito();
            Swal.fire("¡Compra realizada!", "Gracias por tu pedido.", "success");
        }
    });
});



