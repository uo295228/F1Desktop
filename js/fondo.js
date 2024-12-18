class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
        this.obtenerImagen();
    }

    obtenerImagen() {
        const apiKey = '65a59844c231edc0781b0cf29336e1b5'; // Obtén tu API Key de Flickr
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${this.circuito}&format=json&nojsoncallback=1`;

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json', // Asegura que la respuesta se maneje como JSON
            success: (data) => {
                // Aquí procesamos la respuesta JSON
                if (data.photos.photo.length > 0) {
                    const photo = data.photos.photo[0]; // Obtiene la primera imagen
                    const photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;

                    // Llamada al método para establecer la imagen de fondo
                    this.establecerFondo(photoUrl);
                } else {
                    console.error('No se encontraron imágenes para este circuito.');
                }
            },
            error: (error) => {
                console.error('Error al obtener la imagen: ', error);
            }
        });
    }

    establecerFondo(urlImagen) {
        $('body').css('background-image', `url(${urlImagen})`);
        $('body').css('background-size', 'cover');
        $('body').css('background-position', 'center');
    }

}


