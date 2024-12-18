class Circuito {
    constructor(inputSelector, svgInputSelector, kmlInputSelector) {
        this.input = document.querySelector(inputSelector);
        this.svgInput = document.querySelector(svgInputSelector);
        this.kmlInput = document.querySelector(kmlInputSelector);
        this.initEventListeners();
        this.map = null;  // El mapa estará vacío al principio
        this.kmlLayer = null;  // Inicializamos el KML layer como null
    }

    initEventListeners() {
        this.input.addEventListener("change", (event) => this.handleFileChange(event, "xml"));
        this.svgInput.addEventListener("change", (event) => this.handleFileChange(event, "svg"));
        this.kmlInput.addEventListener("change", (event) => this.handleFileChange(event, "kml"));
    }

    handleFileChange(event, fileType) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          
                if (fileType === "xml") {
                    this.processXML(e.target.result);
                } else if (fileType === "svg") {
                    this.displaySVG(e.target.result);
                } else if (fileType === "kml") {
                    this.displayKML(e.target.result);
                }
          
        };
        reader.readAsText(file);
    }

    processXML(xmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
        const errorNode = xmlDoc.querySelector("parsererror");
        if (errorNode) {
            throw new Error("El XML tiene errores.");
        }
        this.createSection("xml", xmlDoc.documentElement);
    }

    displaySVG(svgContent) {
        const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement;
        this.createSection("svg", svgElement);
    }

    displayKML(kmlContent) {
        if (this.map == null) {
            this.initMap(); // Inicializar el mapa si aún no lo está
        }
    
        // Crear un objeto DOM del contenido KML
        const parser = new DOMParser();
        const kmlDocument = parser.parseFromString(kmlContent, 'application/xml');
    
        // Verificar si el KML tiene errores
        const errorNode = kmlDocument.querySelector('parsererror');
        if (errorNode) {
            console.error("Error en el KML:", errorNode.textContent);
            alert("El archivo KML contiene errores.");
            return;
        }
    
        console.log("KML Document:", kmlDocument);
    
        // Buscar todas las LineStrings dentro del KML
        const lineStrings = kmlDocument.querySelectorAll("LineString");
    
        lineStrings.forEach((lineString, index) => {
            const coordinates = lineString.querySelector("coordinates");
            if (coordinates) {
                const coordsText = coordinates.textContent.trim();
                const coordsArray = coordsText.split(" ").map(coord => {
                    const [lng, lat] = coord.split(",");
                    return { lat: parseFloat(lat), lng: parseFloat(lng) };
                });
    
                // Dibujar la línea en el mapa
                const polyline = new google.maps.Polyline({
                    path: coordsArray,
                    geodesic: true, // Hacer la línea geodésica (curvada en la esfera)
                    strokeColor: "#FF0000", // Color de la línea
                    strokeOpacity: 1.0, // Opacidad de la línea
                    strokeWeight: 2, // Grosor de la línea
                });
    
                polyline.setMap(this.map); // Añadir la línea al mapa
            }
        });
    
        // Verificar el estado del KML cuando se cargue
        google.maps.event.addListener(this.kmlLayer, 'status_changed', () => {
            const status = this.kmlLayer.getStatus();
            console.log("KML Layer Status: ", status);
            if (status === google.maps.KmlLayerStatus.OK) {
                console.log("KML cargado correctamente.");
                // Si el KML se carga correctamente, ajustamos la vista
                const bounds = this.kmlLayer.getDefaultViewport();
                if (bounds) {
                    console.log("Ajustando límites del mapa:", bounds);
                    this.map.fitBounds(bounds);  // Ajustar la vista del mapa según el contenido del KML
                } else {
                    console.error('No se encontraron límites en el KML.');
                }
            } else {
                console.error("Error al cargar el KML:", status);
            }
        });
    
        // Verificar las coordenadas del KML (depuración)
        const placemarks = kmlDocument.querySelectorAll("Placemark");
        placemarks.forEach((placemark, index) => {
            console.log("Placemark #" + index);
            const coordinates = placemark.querySelector("coordinates");
            if (coordinates) {
                console.log("Coordenadas:", coordinates.textContent.trim());
            }
        });
    }
    

    createSection(type, content) {
        const section = document.createElement("section");
        if (type === "xml") {
            const ul = this.createTree(content);
            section.appendChild(ul);
        } else if (type === "svg") {
            section.appendChild(content);
        }
        document.querySelector("main").appendChild(section);
    }

    createTree(node) {
        const ul = document.createElement("ul");
        const li = document.createElement("li");
        li.textContent = node.nodeName;
        if (node.textContent.trim() && node.children.length === 0) {
            li.textContent += ": " + node.textContent.trim();
        }
        ul.appendChild(li);
        Array.from(node.children).forEach((child) => {
            const childTree = this.createTree(child);
            ul.appendChild(childTree);
        });
        return ul;
    }

    initMap() {
        // Crear el mapa y centrarlo en Suzuka, Japón (coordenadas aproximadas)
        this.map = new google.maps.Map(document.querySelector("main > div"), {
            zoom: 12,  // Ajustar el zoom inicial
            center: { lat: 34.842892, lng: 136.540706 }, // Coordenadas de Suzuka
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }
}

// Inicializar clase al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    new Circuito(
        'input[type="file"]:not([accept=".svg"]):not([accept=".kml"])', // Selector para el input XML
        'input[type="file"][accept=".svg"]', // Selector para el input SVG
        'input[type="file"][accept=".kml"]'  // Selector para el input KML
    );
});
