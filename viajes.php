
<?php
// Declaración de la clase Carrusel
class Carrusel {
    private $imagenes = [];

    public function __construct($capital, $pais) {
        $this->obtenerFotos($pais);
    }

    public function obtenerFotos($pais) {
        $apiKey = '65a59844c231edc0781b0cf29336e1b5';
        $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=$apiKey&tags=" . urlencode($pais) . "&format=json&nojsoncallback=1&per_page=10";

        $respuesta = file_get_contents($url);
        $datos = json_decode($respuesta, true);

        if (isset($datos['photos']['photo'])) {
            foreach ($datos['photos']['photo'] as $foto) {
                $this->imagenes[] = "https://farm{$foto['farm']}.staticflickr.com/{$foto['server']}/{$foto['id']}_{$foto['secret']}_m.jpg";
            }
        }
    }

    public function mostrarCarrusel() {
        echo '<article>';
        foreach ($this->imagenes as $imagen) {
            echo '<img src="' . htmlspecialchars($imagen) . '" alt="Imagen del carrusel" />';
        }
        echo '<button>&lt;</button>';
        echo '<button>&gt;</button>';
        echo '</article>';
        
    }
}


class Moneda {
    private $monedaLocal;
    private $monedaComparar;
    private $apiKey = "26b3fa1626cd0275afae021e"; // Coloca tu clave de API aquí

    public function __construct($monedaLocal, $monedaComparar = "EUR") {
        $this->monedaLocal = $monedaLocal;
        $this->monedaComparar = $monedaComparar;
    }

    public function obtenerCambio() {
        $url = "https://v6.exchangerate-api.com/v6/{$this->apiKey}/latest/{$this->monedaComparar}";
        $respuesta = file_get_contents($url);
        $datos = json_decode($respuesta, true);

        if (isset($datos['conversion_rates'][$this->monedaLocal])) {
            $nombreMonedaLocal = $this->monedaLocal; // Asumimos que la API no provee nombre completo
            $tipoCambio = $datos['conversion_rates'][$this->monedaLocal];
            return "1 {$this->monedaComparar} equivale a $tipoCambio $nombreMonedaLocal";
        } else {
            return "No se pudo obtener el cambio de moneda para {$this->monedaLocal}.";
        }
    }
}

// Crear instancia de Carrusel
$carrusel = new Carrusel("Suzuka", "Japón");
$moneda = new Moneda("JPY", "EUR"); // Cambia "JPY" a la moneda correspondiente si es necesario
$cambio = $moneda->obtenerCambio();
?>      
       




<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop - Viajes</title>
    <link rel="stylesheet" type="text/css" href="estilo.css" />
    <link rel="icon" href="Multimedia/icono.ico" sizes="16x16" type="image/png">
    <meta name="author" content="Lucas Ley" />
    <meta name="description" content="Viajes" />
    <meta name="keywords" content="F1, viajes, geolocalización" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU"></script>
    <script src="js/viajes.js"></script>

</head>

<body>
    <header>
        <h1><a href="index.html" title="F1 Desktop">F1 Desktop</a></h1>
        <nav>
            <a href="index.html" title="Inicio">Indice</a>
            <a href="piloto.html" title="Piloto">Piloto</a>
            <a href="noticias.html" title="Noticias">Noticias</a>
            <a href="meteorologia.html" title="Meteorología">Meteorología</a>
            <a href="circuito.html" title="Circuito">Circuito</a>
            <a href="viajes.html" title="Viajes" class="active">Viajes</a>
            <a href="juegos.html" title="Juegos">Juegos</a>
            <a href="calendario.html" title="Calendario">Calendario</a>
        </nav>
    </header>

    <main>
    
        <?php
        if ($cambio) {
            echo "<p>$cambio </p>";
        } else {
            echo "<p>No se pudo obtener el cambio de moneda para .</p>";
        }
        ?>
    </main>
    <h3>Carrusel de Imágenes</h3>

    <?php
    // Mostrar las imágenes del carrusel
    $carrusel->mostrarCarrusel();
    ?>
         <h2>Ubicación del usuario</h2>
         <p>Se mostrará el mapa estático y dinámico de tu ubicación actual.</p>
         
    <section></section>


<!-- Botones para cambiar de imagen -->

</body>
</html>
