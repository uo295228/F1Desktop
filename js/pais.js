class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.circuito = "";
        this.gobierno = "";
        this.coordenadas = "";
        this.religion = "";
    }

    inicializarAtributos(circuito, gobierno, coordenadas, religion) {
        this.circuito = circuito;
        this.gobierno = gobierno;
        this.coordenadas = coordenadas;
        this.religion = religion;
    }

    obtenerNombre() {
        return this.nombre;
    }

    obtenerCapital() {
        return this.capital;
    }

    obtenerInformacionSecundaria() {
        return `
            <ul>
                <li>Nombre del circuito: ${this.circuito}</li>
                <li>Población: ${this.poblacion}</li>
                <li>Forma de gobierno: ${this.gobierno}</li>
                <li>Religión mayoritaria: ${this.religion}</li>
            </ul>
        `;
    }

    mostrarCoordenadas() {
        document.write(`<p>Coordenadas de la línea de meta: ${this.coordenadas}</p>`);
    }

    mostrarInformacion() {
        document.write(`<h3>${this.obtenerNombre()}</h3>`);
        document.write(`<p>Capital: ${this.obtenerCapital()}</p>`);
        document.write(this.obtenerInformacionSecundaria());
        this.mostrarCoordenadas();
    }

    obtenerPronostico() {
        const [latitud, longitud] = this.coordenadas.split(",");
        const apiKey = 'f1b1569fa7d6664b9c2e002e55adb525';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&appid=${apiKey}&mode=xml&lang=es&units=metric`;
    
        const horaFija = "21:00:00"; // Hora específica para el pronóstico
        let fechasMostradas = [];
    
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'xml',
            success: (response) => {
                $(response).find('time').each((index, timeElement) => {
                    if (fechasMostradas.length < 5) { 
                        const fechaHora = $(timeElement).attr('from'); 
                        const [dia, hora] = fechaHora.split("T");
    
                        if (hora.startsWith(horaFija) && !fechasMostradas.includes(dia)) { 
                            fechasMostradas.push(dia);
    
                            
                            const tempMax = $(timeElement).find('temperature').attr('max');
                            const tempMin = $(timeElement).find('temperature').attr('min');
                            const humedad = $(timeElement).find('humidity').attr('value');
                            const lluvia = $(timeElement).find('precipitation').attr('value') || 0;
                            const icono = $(timeElement).find('symbol').attr('var');
    
                            
                            this.mostrarPronostico(dia, tempMax, tempMin, humedad, lluvia, icono);
                        }
                    }
                });
            },
            error: () => {
                alert("Error al obtener el pronóstico del tiempo.");
            }
        });
    }
    
    
    mostrarPronostico(dia, tempMax, tempMin, humedad, lluvia, icono) {
        const pronosticoHTML = `
            <article>
                <h3>Pronóstico para el ${dia}</h3>
                <p>Temperatura Máxima: ${tempMax}°C</p>
                <p>Temperatura Mínima: ${tempMin}°C</p>
                <p>Humedad: ${humedad}%</p>
                <p>Cantidad de lluvia: ${lluvia} mm</p>
                <img src="https://openweathermap.org/img/wn/${icono}.png" alt="Icono del tiempo">
            </article>
        `;
    
        $('main').append(pronosticoHTML);  // Inserta el pronóstico en el elemento <main>
    }
}