class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("El navegador soporta la API File");
        } else {
            console.error("Este navegador no soporta la API File.");
        }
    }
    
    readInputFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const contenido = e.target.result;
            this.procesarContenido(contenido);
        };
        reader.readAsText(file);
    }

    procesarContenido(contenido) {
        const lineas = contenido.split('\n');
        lineas.forEach(linea => {
            const [titular, entradilla, autor] = linea.split('_');
            this.agregarNoticia(titular, entradilla, autor);
        });
    }

    agregarNoticia(titular, entradilla, autor) {
        const noticiaHTML = `
            <article>
                <h2>${titular}</h2>
                <p>${entradilla}</p>
                <p><strong>Autor:</strong> ${autor}</p>
            </article>`;
        $("main").append(noticiaHTML);
    }

    agregarNoticiaManual() {
        const inputs = document.querySelectorAll('input[type="text"]');
        const titular = inputs[0].value;
        const entradilla = inputs[1].value;
        const autor = inputs[2].value;
        this.agregarNoticia(titular, entradilla, autor);
    }

   
}
const noticias= new Noticias();
