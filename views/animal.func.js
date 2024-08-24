// Archivo: animal.func.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado y parseado');

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

    document.getElementById('formulario').addEventListener('submit', function(event) {
        event.preventDefault();
        registrarAnimal();
        cerrarFormulario();
    });

    // Fetch inicial para obtener la lista de animales
    fetch('http://localhost:3200/animal')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de animales');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de animales obtenidos:');
            const animales = data;
            renderizarAnimales(animales);
        })
        .catch(error => {
            console.error('Error al obtener la lista de animales:', error);
        });

    function registrarAnimal() {
        const nombre = document.getElementById('nombre').value;
        const tipo = document.getElementById('tipo').value;
        const fecha_ingreso = document.getElementById('fecha_ingreso').value;
        const fecha_sacrificio = document.getElementById('fecha_sacrificio').value;
        console.log(nombre, tipo, fecha_ingreso, fecha_sacrificio);

        const nuevoAnimal = {
            nombre: nombre,
            tipo: tipo,
            fecha_ingreso: fecha_ingreso,
            fecha_sacrificio: fecha_sacrificio || null
        };
        console.log(nuevoAnimal);
        if (nuevoAnimal.nombre && nuevoAnimal.tipo && nuevoAnimal.fecha_ingreso) {
            fetch('http://localhost:3200/animal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(nuevoAnimal)
            })
            .then(response => {
                console.log(response);
              if (!response.ok) {
                throw new Error('No se pudo registrar el animal');
              }
              return response.json();
            })
            .then(data => console.log('Animal registrado:', data))
            .catch(error => console.error('Error al registrar el animal:', error));
          } else {
            console.error('Datos inválidos:', nuevoAnimal);
          }
    }

    function renderizarAnimales(animales) {
        const animalContainer = document.getElementById('animal-container');
        animalContainer.innerHTML = '';

        animales.forEach(animal => {
            const animalBox = document.createElement('div');
            animalBox.classList.add('animal-box');
            animalBox.innerHTML = `
                <p>Especie: ${animal.nombre}</p>
                <p>Registrado: ${formatDate(animal.fecha_ingreso)}</p>
                <p>Procesado: ${animal.fecha_sacrificio ? formatDate(animal.fecha_sacrificio) : 'N/A'}</p>
                <button class="detalles-btn" data-animal-id="${animal.id_animal}">Ver detalles</button>
                <button class="procesar-btn" data-animal-id="${animal.id_animal}">Procesar</button>
            `;

            animalBox.querySelector('.detalles-btn').addEventListener('click', function() {
                mostrarDetallesAnimal(animal);
            });

            animalBox.querySelector('.procesar-btn').addEventListener('click', function() {
                procesarAnimal(animal);
            });

            animalContainer.appendChild(animalBox);
        });
    }

    // Resto del código...
    
    function mostrarDetallesAnimal(animal) {
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container');
        detailsContainer.innerHTML = `
            <div class="animal-details">
                <h3>Detalles del Animal</h3>
                <p>ID: ${animal.id_animal}</p>
                <p>Nombre: ${animal.nombre}</p>
                <p>Tipo: ${animal.tipo}</p>
                <p>Fecha de Ingreso: ${formatDate(animal.fecha_ingreso)}</p>
                <p>Fecha de Sacrificio: ${animal.fecha_sacrificio ? formatDate(animal.fecha_sacrificio) : 'Activo'}</p>
            </div>
            <div class="related-products">
                <h3>Productos Relacionados</h3>
                <div id="product-list"></div>
            </div>
            <div class="pdf-button-container">
                <button id="generate-pdf-btn" class="generate-pdf-btn">Generar Reporte</button>
            </div>
            <button class="close-details">Cerrar</button>
            <br>
        `;
    
        document.body.appendChild(detailsContainer);
    
        detailsContainer.querySelector('.close-details').addEventListener('click', function() {
            detailsContainer.remove();
        });
    
        fetch(`http://localhost:3200/producto?animalId=${animal.id_animal}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la lista de productos');
                }
                return response.json();
            })
            .then(data => {
                const productos = data.productos;
                renderizarProductosRelacionados(productos, animal.id_animal);
            })
            .catch(error => {
                console.error('Error al obtener la lista de productos:', error);
            });
        detailsContainer.querySelector('#generate-pdf-btn').addEventListener('click', function() {
            generarPDF(animal);
        });
    }

    function renderizarProductosRelacionados(productos, idAnimalConsultado) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
    
        productos.forEach(producto => {
            if (producto.id_animal === idAnimalConsultado) {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <h4>${producto.nombre}</h4>
                    <p>Categoría: ${producto.categoria}</p>
                    <p>Fecha de Producción: ${formatDate(producto.fecha_produccion)}</p>
                `;
                productList.appendChild(productItem);
            }
        });
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }
    
    function generarPDF(animal) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(`ID del Animal: ${animal.id_animal}`, 10, 10);
        doc.text(`Nombre: ${animal.nombre}`, 10, 20);
        doc.text(`Tipo: ${animal.tipo}`, 10, 30);
        doc.text(`Fecha de Ingreso: ${animal.fecha_ingreso}`, 10, 40);
        if (animal.fecha_sacrificio) {
            doc.text(`Fecha de Sacrificio: ${animal.fecha_sacrificio}`, 10, 50);
        } else {
            doc.text('Fecha de Sacrificio: N/A', 10, 50);
        }
        doc.save('reporte_animal.pdf');
    }

    function procesarAnimal(animal) {
        if (confirm('¿Estás seguro de que deseas procesar este animal?')) {
            fetch(`http://localhost:3200/animal/procesar/${animal.id_animal}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo procesar el animal');
                }
                return response.json();
            })
            .then(data => {
                alert('Animal procesado exitosamente');
                renderizarAnimales([data]);
            })
            .catch(error => {
                console.error('Error al procesar el animal:', error);
            });
        }
    }
});

