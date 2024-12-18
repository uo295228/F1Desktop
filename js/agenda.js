class Agenda {
    constructor() {
        this.apiUrl = "https://api.jolpi.ca/ergast/f1/2024.json";
    }

    cargarCarreras() {
        $.ajax({
            url: this.apiUrl,
            method: "GET",
            dataType: "json",
            success: (data) => {
                if (data && data.MRData && data.MRData.RaceTable && data.MRData.RaceTable.Races) {
                    console.log("Datos recibidos correctamente:", data);
                    this.mostrarCarreras(data.MRData.RaceTable.Races);
                } else {
                    console.error("La estructura de datos no es la esperada:", data);
                }
            },
            error: (error) => {
                console.error("Error al cargar las carreras:", error);
            }
        });
    }

    mostrarCarreras(carreras) {
        const contenedor = $("main");
        contenedor.empty();

        carreras.forEach((carrera) => {
            const carreraElement = $(`
                <article>
                    <h3>${carrera.raceName}</h3>
                    <p><strong>Circuito:</strong> ${carrera.Circuit.circuitName}</p>
                    <p><strong>Coordenadas:</strong> ${carrera.Circuit.Location.lat}, ${carrera.Circuit.Location.long}</p>
                    <p><strong>Fecha y Hora:</strong> ${carrera.date} ${carrera.time}</p>
                </article>
            `);
            contenedor.append(carreraElement);
        });
    }
}


    const agenda = new Agenda();


