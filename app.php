<?php
class App {
    private $server = "localhost";
    private $user = "DBUSER2024";
    private $pass = "DBPSWD2024";
    private $dbname = "app";

    private $conn;

    public function __construct() {
        // Conexión inicial sin especificar base de datos
        $this->conn = new mysqli($this->server, $this->user, $this->pass);
    
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    
        // Crear base de datos si no existe
        $sqlCreateDB = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;
        if (!$this->conn->query($sqlCreateDB)) {
            die("Error al crear la base de datos: " . $this->conn->error);
        }
    
        // Seleccionar la base de datos
        $this->conn->select_db($this->dbname);
    
        if ($this->conn->connect_error) {
            die("Error al seleccionar la base de datos: " . $this->conn->connect_error);
        }
    }
    

    public function crearBaseDatos() {
        // Leer y ejecutar archivo SQL para crear tablas
        $sql = file_get_contents('schema.sql');
        if ($this->conn->multi_query($sql)) {
            do {
                if ($result = $this->conn->store_result()) {
                    $result->free();
                }
            } while ($this->conn->next_result());
            echo "Base de datos creada exitosamente.";
        } else {
            echo "Error al crear la base de datos: " . $this->conn->error;
        }
    }

    public function importarCSV($tabla) {
        $archivo = fopen("$tabla.csv", 'r');
        if ($archivo !== false) {
            fgetcsv($archivo); // Omitir encabezados
            
            // Configurar la consulta de inserción según la tabla
            $columnas = $this->obtenerColumnasTabla($tabla);
            
            // Excluir 'id_piloto' si es AUTO_INCREMENT
            $columnas = array_filter($columnas, function($columna) {
                return !preg_match('/^id_/', $columna); // Excluir cualquier columna que empiece con 'id_'
            });
         
    
            // Ahora creamos los placeholders para las columnas
            $placeholders = implode(',', array_fill(0, count($columnas), '?'));
            $consulta = "INSERT INTO $tabla (" . implode(',', $columnas) . ") VALUES ($placeholders)";
            
            $stmt = $this->conn->prepare($consulta);
    
            // Generar una cadena de tipos dinámica según el número de columnas
            $tipos = str_repeat('s', count($columnas)); // Asumimos que todas las columnas son de tipo 'string'
            
            // Mostrar la consulta para depuración
            echo "Consulta SQL: $consulta\n"; // Para ver la consulta
    
            while (($datos = fgetcsv($archivo, 1000, ",")) !== false) {
                // Verificar si los datos coinciden con las columnas
                if (count($datos) == count($columnas)) {
                    // Mostrar los datos que se van a insertar para depuración
                    echo "Datos a insertar: " . implode(", ", $datos) . "\n";
                    
                    // Vincular los parámetros correctamente
                    $stmt->bind_param($tipos, ...$datos);
                    
                    // Ejecutar la consulta y verificar si es exitosa
                    if (!$stmt->execute()) {
                        echo "Error en la inserción: " . $stmt->error . "\n"; // Mostrar cualquier error en la ejecución
                    } else {
                        echo "Fila insertada exitosamente.\n";
                    }
                } else {
                    echo "Error: El número de datos no coincide con el número de columnas para la fila: " . implode(',', $datos) . "\n";
                }
            }
    
            fclose($archivo);
            echo "Importación completada.\n";
        } else {
            echo "Error al abrir el archivo CSV.\n";
        }
    }
    
    
    

    public function exportarCSV($tabla) {
        $archivo = fopen("export_$tabla.csv", 'w');

        $columnas = $this->obtenerColumnasTabla($tabla);
        fputcsv($archivo, $columnas);

        $result = $this->conn->query("SELECT * FROM $tabla");
        while ($row = $result->fetch_assoc()) {
            fputcsv($archivo, $row);
        }

        fclose($archivo);
        echo "Datos exportados correctamente de la tabla $tabla.";
    }

    private function obtenerColumnasTabla($tabla) {
        $result = $this->conn->query("SHOW COLUMNS FROM $tabla");
        $columnas = [];
        while ($row = $result->fetch_assoc()) {
            if ($row['Field'] !== 'id_' . strtolower($tabla)) {
                $columnas[] = $row['Field'];
            }
        }
        return $columnas;
    }

    public function procesarAccion($accion, $tabla = null) {
        switch ($accion) {
            case 'crearBD':
                $this->crearBaseDatos();
                break;
            case 'importarCSV':
                if ($tabla) {
                    $this->importarCSV($tabla);
                } else {
                    echo "Tabla no especificada.";
                }
                break;
            case 'exportarCSV':
                if ($tabla) {
                    $this->exportarCSV($tabla);
                } else {
                    echo "Tabla no especificada.";
                }
                break;
            default:
                echo "Acción no válida.";
        }
    }

    public function __destruct() {
        $this->conn->close();
    }
}

if (isset($_GET['accion'])) {
    $app = new App();
    $accion = $_GET['accion'];
    $tabla = isset($_GET['tabla']) ? $_GET['tabla'] : null;

    $app->procesarAccion($accion, $tabla);
}

?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1Desktop</title>
    <link rel="stylesheet" type="text/css" href="estilo.css" />
    <link rel="icon" href="Multimedia/icono.ico" sizes="16x16" type="image/png">
    <meta name="author" content="Lucas Ley" />
    <meta name="description" content="indice de la pagina" />
    <meta name="keywords" content="indice" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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
            <a href="viajes.php" title="Viajes">Viajes</a>
            <a href="juegos.html" title="Juegos">Juegos</a>
            <a href="calendario.html" title="Calendario">Calendario</a>
        </nav>
    </header>
    <section>
        <article>
            <a href="?accion=crearBD"><button>Crear Base de Datos</button></a>
            <form method="get" action="">
                <input type="hidden" name="accion" value="importarCSV">
                <label for="tabla-importar">Seleccionar tabla para importar:</label>
                <select id="tabla-importar" name="tabla">
                    <option value="Pilotos">Pilotos</option>
                    <option value="Equipos">Equipos</option>
                    <option value="Circuitos">Circuitos</option>
                    <option value="Carreras">Carreras</option>
                    <option value="Resultados">Resultados</option>
                </select>
                <button type="submit">Importar CSV</button>
            </form>
            <form method="get" action="">
                <input type="hidden" name="accion" value="exportarCSV">
                <label for="tabla-exportar">Seleccionar tabla para exportar:</label>
                <select id="tabla-exportar" name="tabla">
                    <option value="Pilotos">Pilotos</option>
                    <option value="Equipos">Equipos</option>
                    <option value="Circuitos">Circuitos</option>
                    <option value="Carreras">Carreras</option>
                    <option value="Resultados">Resultados</option>
                </select>
                <button type="submit">Exportar CSV</button>
            </form>
        </article>
    </section>
</body>
</html>