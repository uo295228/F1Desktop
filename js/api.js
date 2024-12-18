class Api {
    constructor() {
        // Lista completa de circuitos con sus coordenadas (latitud, longitud)
        this.circuitos = [
            { nombre: "Algarve", lat: 37.436, lon: -8.195 },
            { nombre: "Azerbaijan", lat: 40.395, lon: 49.864 },
            { nombre: "Bahrain", lat: 26.032, lon: 50.510 },
            { nombre: "Baréin", lat: 26.032, lon: 50.510 },
            { nombre: "Belgian", lat: 50.437, lon: 5.991 },
            { nombre: "Brazilian", lat: -23.692, lon: -46.699 },
            { nombre: "British", lat: 51.378, lon: -1.016 },
            { nombre: "Canadian", lat: 45.508, lon: -73.412 },
            { nombre: "Chinese", lat: 31.315, lon: 121.215 },
            { nombre: "Dutch", lat: 52.387, lon: 4.540 },
            { nombre: "Emilia Romagna", lat: 44.528, lon: 11.429 },
            { nombre: "French", lat: 43.743, lon: 4.361 },
            { nombre: "Hungarian", lat: 47.404, lon: 19.250 },
            { nombre: "Italian", lat: 45.440, lon: 9.023 },
            { nombre: "Japanese", lat: 34.843, lon: 136.541 },
            { nombre: "Jeddah", lat: 21.500, lon: 39.150 },
            { nombre: "Miami", lat: 25.774, lon: -80.197 },
            { nombre: "Mexican", lat: 19.426, lon: -99.107 },
            { nombre: "Monaco", lat: 43.733, lon: 7.4167 },
            { nombre: "Spanish", lat: 41.564, lon: 2.258 },
            { nombre: "Singapore", lat: 1.292, lon: 103.858 },
            { nombre: "Saudi Arabia", lat: 21.499, lon: 39.179 },
            { nombre: "Australian", lat: -37.841, lon: 144.968 },
            { nombre: "Austrian", lat: 47.219, lon: 15.919 },
            { nombre: "German", lat: 49.475, lon: 8.748 },
            { nombre: "Russian", lat: 44.592, lon: 39.719 },
            { nombre: "South African", lat: -34.293, lon: 18.811 },
            { nombre: "USA", lat: 30.130, lon: -97.635 },
            { nombre: "Vietnam", lat: 21.033, lon: 105.423 },
            { nombre: "British GP", lat: 51.378, lon: -1.016 },
        ];

        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.setupElements();
        });

        // Leer archivos y procesar datos desde la API File

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json, .txt';
    fileInput.textContent = 'Seleccionar archivo';

    const mainContainer = document.querySelector('main');
    const outputList = document.createElement('ul');

    const instructions = document.createElement('p');
    instructions.textContent = 'Seleccione un archivo JSON con información de los circuitos.';

    mainContainer.appendChild(instructions);
    mainContainer.appendChild(fileInput);
    mainContainer.appendChild(outputList);

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    displayCircuits(data);
                } catch (error) {
                    alert('Error al procesar el archivo. Asegúrese de que sea un archivo JSON válido.');
                }
            };

            reader.readAsText(file);
        }
    });

    function displayCircuits(data) {
        outputList.innerHTML = ''; // Limpiar la lista antes de mostrar

        if (Array.isArray(data)) {
            data.forEach((circuit) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Circuito: ${circuit.nombre || 'Desconocido'}, Ubicación: ${circuit.ubicacion || 'Desconocida'}, Longitud: ${circuit.longitud || 'No especificada'} km`;
                outputList.appendChild(listItem);
            });
        } else {
            alert('El archivo no contiene un formato de lista válido.');
        }
    }
});

    }

    setupElements() {
        // Crear el párrafo para mostrar la ubicación
        const parrafo = document.createElement('p');
        document.querySelector("main > article").appendChild(parrafo);

        const ubicacionBoton = document.querySelector('main > article > button'); // Selección del primer botón
        const ubicacionTexto = document.querySelector('main > article > p'); // Selección del primer <p> para mostrar la ubicación

        // Verificar si los elementos existen antes de añadir el evento
        if (ubicacionBoton && ubicacionTexto) {
            // Añadir el evento de click al botón
            ubicacionBoton.addEventListener('click', () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const latUsuario = position.coords.latitude;
                        const lonUsuario = position.coords.longitude;
                        ubicacionTexto.textContent = `Lat: ${latUsuario}, Lon: ${lonUsuario}`;

                        // Guardar ubicación en localStorage
                        this.guardarUbicacion(latUsuario, lonUsuario);

                        // Calcular el circuito más cercano
                        const circuitoCercano = this.obtenerCircuitoCercano(latUsuario, lonUsuario);
                        this.mostrarCircuitoCercano(circuitoCercano);
                    }, () => {
                        alert("No se pudo obtener la ubicación.");
                    });
                } else {
                    alert("Geolocalización no está soportada por tu navegador.");
                }
            });
        } else {
            console.error("No se encontraron los elementos necesarios.");
        }

        // Mostrar el circuito favorito si existe
        this.mostrarCircuitoFavorito();

        // Recuperar la ubicación desde el almacenamiento local si existe
        this.recuperarUbicacion();
    }

    guardarUbicacion(lat, lon) {
        // Guardar en localStorage
        localStorage.setItem('latitud', lat);
        localStorage.setItem('longitud', lon);
    }

    recuperarUbicacion() {
        const lat = localStorage.getItem('latitud');
        const lon = localStorage.getItem('longitud');

        if (lat && lon) {
            const ubicacionTexto = document.querySelector('main > article > p');
            ubicacionTexto.textContent = `Última ubicación guardada - Lat: ${lat}, Lon: ${lon}`;

            // Calcular el circuito más cercano a la ubicación guardada
            const circuitoCercano = this.obtenerCircuitoCercano(parseFloat(lat), parseFloat(lon));
            this.mostrarCircuitoCercano(circuitoCercano);
        }
    }

    mostrarCircuitoFavorito() {
        const circuitoFavorito = JSON.parse(localStorage.getItem('circuitoFavorito'));

        if (circuitoFavorito) {
            const favoritoTexto = document.createElement('p');
            favoritoTexto.textContent = `Tu circuito favorito es: ${circuitoFavorito.nombre}`;
            document.querySelector("main > article").appendChild(favoritoTexto);
        }
    }

    obtenerCircuitoCercano(latUsuario, lonUsuario) {
        let circuitoCercano = null;
        let distanciaMinima = Infinity;

        // Recorrer todos los circuitos
        for (let i = 0; i < this.circuitos.length; i++) {
            const circuito = this.circuitos[i];
            const distancia = this.calcularDistancia(latUsuario, lonUsuario, circuito.lat, circuito.lon);

            // Si encontramos una distancia más corta, actualizamos el circuito más cercano
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                circuitoCercano = circuito;
            }
        }

        return circuitoCercano;
    }

    calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en kilómetros
    }

    toRad(deg) {
        return deg * (Math.PI / 180);
    }

    mostrarCircuitoCercano(circuito) {
        if (circuito) {
            const ubicacionTexto = document.querySelector('main > article > p');
            ubicacionTexto.textContent += ` - El circuito más cercano es: ${circuito.nombre} (Lat: ${circuito.lat}, Lon: ${circuito.lon})`;

            // Botón para marcar como favorito
            const btnFavorito = document.createElement('button');
            btnFavorito.textContent = "Marcar como favorito";
            document.querySelector("main > article").appendChild(btnFavorito);

            btnFavorito.addEventListener('click', () => {
                // Guardar el circuito como favorito en localStorage
                localStorage.setItem('circuitoFavorito', JSON.stringify(circuito));
                alert(`${circuito.nombre} ha sido guardado como tu circuito favorito.`);
                this.mostrarCircuitoFavorito(); // Actualizar la vista del circuito favorito
            });
        }
    }

    
}

// Instanciar la clase y ejecutar
new Api();
