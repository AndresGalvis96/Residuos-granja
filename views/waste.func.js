document.addEventListener('DOMContentLoaded', function() {
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
        cerrarFormulario();
    });

    fetch('http://localhost:3200/residuo')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de residuos');
            }
            return response.json();
        })
        .then(data => {
            const residuos = data;
            renderizarResiduos(residuos);
        })
        .catch(error => {
            console.error('Error al obtener la lista de residuos:', error);
        });

    function renderizarResiduos(residuos) {
        const wasteContainer = document.getElementById('residuo-container');
        wasteContainer.innerHTML = '';

        residuos.forEach(residuo => {
            const residuoBox = document.createElement('div');
            residuoBox.classList.add('residuo-box');
            residuoBox.innerHTML = `
                <p>Descripción: ${residuo.descripcion}</p>
                <p>Registrado: ${formatDate(residuo.fecha_generacion)}</p>
                <button class="detalles-btn" data-animal-id="${residuo.id_animal}">Ver detalles</button>`;
            
            residuoBox.querySelector('.detalles-btn').addEventListener('click', function() {
                mostrarDetallesAnimalResiduo(residuo.id_animal);
            });

            wasteContainer.appendChild(residuoBox);
        });
    }

    function mostrarDetallesAnimalResiduo(idAnimal) {
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
            fetch(`http://localhost:3200/residuo?animalId=${idAnimal}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo obtener la lista de residuos');
                    }
                    return response.json();
                })
                .then(residuos => {
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
                        <div class="related-waste">
                            <h3>Residuos Relacionados</h3>
                            <div id="waste-list"></div>
                        </div>
                        <button class="close-details">Cerrar</button>`;
                    document.body.appendChild(detailsContainer);

                    detailsContainer.querySelector('.close-details').addEventListener('click', function() {
                        detailsContainer.remove();
                    });

                    const wasteList = detailsContainer.querySelector('#waste-list');
                    wasteList.innerHTML = '';
                    residuos.forEach(residuo => {
                        const wasteItem = document.createElement('div');
                        wasteItem.classList.add('waste-item');
                        wasteItem.innerHTML = `
                            <h4>Descripción: ${residuo.descripcion}</h4>
                            <p>Registrado: ${formatDate(residuo.fecha_generacion)}</p>`;
                        wasteList.appendChild(wasteItem);
                    });
                })
                .catch(error => {
                    console.error('Error al obtener la lista de residuos:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener los detalles del animal:', error);
        });
    }

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
