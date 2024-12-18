<?php
class Record {
    private $server = "localhost";
    private $user = "DBUSER2024";
    private $pass = "DBPSWD2024";
    private $dbname = "records";

    private $conn;

    public function __construct() {
        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
        $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        if ($stmt === false) {
            die('Error en la preparación de la consulta: ' . $this->conn->error);
        }
    
        $stmt->bind_param("sssd", $nombre, $apellidos, $nivel, $tiempo); // Cambié los parámetros de la consulta
    
        if ($stmt->execute()) {
            echo "Récord guardado exitosamente!";
        } else {
            echo "Error al guardar el récord: " . $stmt->error;
        }
    
        $stmt->close();
    }
    
    public function getTopRecords($nivel) {
        // Obtén los 10 mejores récords ordenados por tiempo ascendente
        $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
        $stmt->bind_param("s", $nivel);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $records = [];
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
        
        $stmt->close();
        
        return $records;
    }

    public function generateTopRecordsList($nivel) {
        // Obtener los 10 mejores récords
        $topRecords = $this->getTopRecords($nivel);
        
        // Comienza la lista HTML
        $html = "<h2>Top 10 Mejores Récords (Nivel: " . htmlspecialchars($nivel) . ")</h2>";
        $html .= "<ul>"; // Comienza la lista desordenada
        
        if (count($topRecords) > 0) {
            foreach ($topRecords as $record) {
                $html .= "<li>";
                $html .= "<strong>Nombre:</strong> " . htmlspecialchars($record['nombre']) . " ";
                $html .= "<strong>Apellidos:</strong> " . htmlspecialchars($record['apellidos']) . " ";
                $html .= "<strong>Tiempo de Reacción:</strong> " . number_format($record['tiempo'], 3) . " ms";
                $html .= "</li>";
            }
        } else {
            $html .= "<li>No hay récords disponibles.</li>";
        }
        
        $html .= "</ul>"; // Cierra la lista
    
        return $html;
    }
    
}

$record = new Record();

// Solo guardar el récord si los datos están disponibles
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!empty($_POST['nombre']) && !empty($_POST['apellidos']) && !empty($_POST['nivel']) && !empty($_POST['tiempo'])) {
        $nombre = $_POST['nombre'];
        $apellidos = $_POST['apellidos'];
        $nivel = $_POST['nivel'];
        $tiempo = $_POST['tiempo'];

        // Guardar el récord en la base de datos
        $record->saveRecord($nombre, $apellidos, $nivel, $tiempo);

        // Redirigir después de guardar para evitar duplicaciones
        
        
    }
}

?>





<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1 - Juegos</title>
    <link rel="stylesheet" href="semaforo_grid.css">
    <link rel="stylesheet" href="estilo.css">
    <link rel="icon" href="Multimedia/icono.ico" sizes="16x16" type="image/png">
    <meta name="author" content="Lucas Ley" />
    <script src="js/semaforo.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <meta name="description" content="Juego de memoria de F1" />
    <meta name="keywords" content="F1, juego, memoria, cartas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

</head>

<body>
    <header>

    
      
        <h1><a href="index.html" title="F1 Desktop">F1 Desktop</a></h1>
      <nav>
         <a href="index.html" title="Inicio">Indice</a> 
          <a href="piloto.html" title="Piloto" class="active">Piloto</a> 
          <a href="noticias.html" title="Noticias">Noticias</a> 
          <a href="meteorologia.html" title="Meteorlogía">Meteorologia</a> 
          <a href="circuito.html" title="Circuito">Circuito</a>
          <a href="viajes.html" title="Viajes">Viajes</a>
          <a href="juegos.html" title="Juegos">Juegos</a>
          <a href="calendario.html" title="Calendario">Calendario</a>
      </nav>
     </header>
    <h1>Juego de Semaforo </h1>
      



            <main>
              
            
          
         
            <script>

                const semaforo = new Semaforo();
            
            </script>

                  </main>

    
                  <?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['nombre'], $_POST['apellidos'], $_POST['nivel'], $_POST['tiempo'])) {
    if (!empty($_POST['nombre']) && !empty($_POST['apellidos']) && !empty($_POST['nivel']) && !empty($_POST['tiempo'])) {
    // Imprimir el HTML generado por la función
    $nivelActual = $_POST['nivel'];  // El nivel que recibes del formulario
    echo $record->generateTopRecordsList($nivelActual);
}
}
        ?>
    
                  

                 
    
</body>
</html>
