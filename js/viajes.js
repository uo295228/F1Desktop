class Viajes {
    constructor() {
        // Obtener la geolocalización del usuario
        this.getGeolocation();
    }

    getGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => this.handleGeolocationSuccess(position),
                (error) => this.handleGeolocationError(error)
            );
        } else {
            alert("Geolocalización no está soportada por este navegador.");
        }
    }

    handleGeolocationSuccess(position) {
        // Obtener la latitud y longitud del usuario
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        // Llamar a la función para mostrar el mapa
     
        this.showDynamicMap();
    }

    handleGeolocationError(error) {
        let errorMessage = "Error desconocido al obtener la ubicación.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "El usuario denegó el acceso a la geolocalización.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "No se pudo obtener la ubicación.";
                break;
            case error.TIMEOUT:
                errorMessage = "La solicitud de geolocalización ha superado el tiempo límite.";
                break;
        }
        alert(errorMessage);
    }

    showStaticMap() {
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=14&size=600x300&markers=${this.latitude},${this.longitude}&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU`;

        // Crear una imagen para el mapa estático
        const mapImage = document.createElement("img");
        mapImage.src = staticMapUrl;
        mapImage.alt = "Mapa estático de tu ubicación";

        // Añadir la imagen del mapa al contenedor
        document.querySelector("body>div").appendChild(mapImage);
    }

    showDynamicMap() {


        // Añadir el contenedor del mapa dinámico al <main>
       const mapContainer =  document.querySelector("section");

        const map = new google.maps.Map(mapContainer, {
            center: { lat: this.latitude, lng: this.longitude },
            zoom: 14
        });

        new google.maps.Marker({
            position: { lat: this.latitude, lng: this.longitude },
            map: map
        });
    }



    



    
}
// Obtener todas las imágenes y los botones



    





// Inicializar la clase al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    new Viajes(); // Usar constructor sin parámetros

 
      

    
        // Actualizar la posición del carrusel
   


    });

    $(document).ready(function(){

        const slides = $("article img");
                
            
        let index = 0;
        
        function mostrarImagen(offset){
            index=(index + offset + slides.length) % slides.length;
            slides.each((i,img) => {
                $(img).css('transform',`translateX(${(i-index)*100}%)`);
              
            });
        
        }
        
        $('article button:first-of-type').click(()=> mostrarImagen(-1));
        $('article button:last-of-type').click(()=> mostrarImagen(1));
        mostrarImagen(0);
        
        });
    
    
    


