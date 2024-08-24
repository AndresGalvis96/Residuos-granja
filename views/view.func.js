document.addEventListener('DOMContentLoaded', function() {
    var formulariop = document.getElementById('formularioProducto');

    var btnMostrarFormulario = document.getElementById('btnMostrarFormulario');
    if (btnMostrarFormulario) {
        btnMostrarFormulario.addEventListener('click', function() {
            mostrarFormulario();
        });
    }

    var btnCerrarFormulario = document.getElementById('cerrar-formulario');
    if (btnCerrarFormulario) {
        btnCerrarFormulario.addEventListener('click', function() {
            cerrarFormulario();
        });
    }

    function mostrarFormulario() {
        var formularioContainer = document.getElementById('formulario-container');
        formularioContainer.style.display = 'block';
    }

    function cerrarFormulario() {
        var formularioContainer = document.getElementById('formulario-container');
        formularioContainer.style.display = 'none';
    }

    function eliminarProducto(productId) {
        fetch(`http://localhost:3200/producto/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar el producto');
            }
            return response.json();
        })
        .then(data => {
            alert('Producto eliminado exitosamente');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
    }

    function obtenerDetallesAnimal(idAnimal) {
        return fetch(`http://localhost:3200/animal/get/${idAnimal}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los detalles del animal');
                }
                return response.json();
            });
    }

    fetch('http://localhost:3200/producto')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de productos');
            }
            return response.json();
        })
        .then(data => {
            const productos = data.productos;
            renderizarProductos(productos);
        })
        .catch(error => {
            console.error('Error al obtener la lista de productos:', error);
        });
        function renderizarProductos(productos) {
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = '';

            productos.forEach(producto => {
                const productBox = document.createElement('div');
                productBox.classList.add('product-box');
                productBox.innerHTML = `
                    <h3>${producto.nombre}</h3>
                    <p>Categoría: ${producto.tipo}</p>
                    <p>Stock: ${producto.cantidad} KG</p>
                    <p>Registrado: ${formatDate(producto.fecha_registro)}</p>
                    <button class="editar-btn" id="editar-btn" data-product-id="${producto.id_producto}">Editar</button>
                    <button class="eliminar-btn" data-product-id="${producto.id_producto}">Eliminar</button>`;

                productBox.addEventListener('click', function() {
                    mostrarDetallesProducto(producto);
                });
        
                productContainer.appendChild(productBox);
            });
        } 

        function mostrarDetallesProducto(producto) {
            console.log("dsfdfsd",producto.id_animal);
            const popup = document.createElement('div');
            popup.classList.add('popup');

            popup.innerHTML = `
                <h3>Información del producto </h3>
                <h2>${producto.nombre}</h2>
                <p>Categoría: ${producto.tipo}</p>
                <p>Stock: ${producto.cantidad} KG</p>
                <p>ss: ${producto.id_animal}</p>
                <p>Registrado: ${formatDate(producto.fecha_registro)}</p>`;

            if (producto.id_animal) {
                obtenerDetallesAnimal(producto.id_animal, popup);
            } else {

                popup.innerHTML += `<p>No hay un animal relacionado a este producto.</p>`;
                mostrarPopup(popup);
            }
        }


function obtenerDetallesAnimal(idAnimal, popup) {
    fetch(`http://localhost:3200/animal/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_animal: idAnimal })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener los detalles del animal');
        }
        return response.json();
    })
    .then(animal => {
        console.log(animal);
        if (Array.isArray(animal) && animal.length > 0) {
            const animalData = animal[0];
            popup.innerHTML += `
                <h3>Animal de origen:</h3>
                <p>ID: ${animalData.id_animal}</p>
                <p>Nombre: ${animalData.nombre}</p>
                <p>Tipo: ${animalData.tipo}</p>
                <p>Fecha de Ingreso: ${formatDate(animalData.fecha_ingreso)}</p>
                <p>Fecha de Sacrificio: ${formatDate(animalData.fecha_sacrificio)}</p>`;
            mostrarPopup(popup);
        } else {
            console.error('No se encontraron datos del animal');
        }
    })
    .catch(error => {
        console.error('Error al obtener los detalles del animal:', error);
    });
}

function mostrarPopup(popup) {

    popup.classList.add('popup-visible');

    document.body.appendChild(popup);

    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const topPosition = (screenHeight - popupHeight) / 2;
    const leftPosition = (screenWidth - popupWidth) / 2;

    popup.style.position = 'fixed';
    popup.style.top = topPosition + 'px';
    popup.style.left = leftPosition + 'px';

    popup.addEventListener('mouseleave', function(event) {
        popup.remove();
    });
}   
    function mostrarFormularioActualizar(producto) {
        const popup = document.getElementById('update-popup');
        const detalles = document.getElementById('producto-detalles');

        detalles.innerHTML = `
            <h3>Detalles del Producto</h3>
            <p>Nombre: ${producto.nombre}</p>
            <p>Categoría: ${producto.tipo}</p>
            <p>Stock: ${producto.cantidad} KG</p>
            <p>Registrado: ${formatDate(producto.fecha_registro)}</p>`;

        document.getElementById('nombre-actualizar').value = producto.nombre;
        document.getElementById('tipo-actualizar').value = producto.tipo;
        document.getElementById('cantidad-actualizar').value = producto.cantidad;
        document.getElementById('fecha_registro-actualizar').value = producto.fecha_registro;

        popup.classList.add('popup-visible');
    }


    document.getElementById('editar-btn').addEventListener('click', function(event) {
        event.preventDefault();

        const productoId = this.getAttribute('data-product-id');

        const nombre = document.getElementById('nombre-actualizar').value;
        const tipo = document.getElementById('tipo-actualizar').value;
        const cantidad = document.getElementById('cantidad-actualizar').value;
        const fecha_registro = document.getElementById('fecha_registro-actualizar').value;

        fetch(`http://localhost:3200/producto/${productoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                tipo,
                cantidad,
                fecha_registro
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo actualizar el producto');
            }
            return response.json();
        })
        .then(data => {
            alert('Producto actualizado exitosamente');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error al actualizar el producto:', error);
        });
    });



    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return `${formattedDay}/${formattedMonth}/${year}`;
    }
});
