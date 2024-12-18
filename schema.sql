CREATE TABLE IF NOT EXISTS Pilotos (
    id_piloto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    nacionalidad VARCHAR(255),
    fecha_nacimiento DATE,
    equipo_actual VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    sede VARCHAR(255),
    director VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Circuitos (
    id_circuito INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    localizacion VARCHAR(255),
    longitud FLOAT,
    vueltas INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Carreras (
    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
    id_circuito INT,
    fecha DATE,
    nombre_gran_premio VARCHAR(255),
    FOREIGN KEY (id_circuito) REFERENCES Circuitos(id_circuito)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Resultados (
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_piloto INT,
    id_carrera INT,
    posicion INT,
    tiempo_total TIME,
    FOREIGN KEY (id_piloto) REFERENCES Pilotos(id_piloto),
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera)
) ENGINE=InnoDB;
