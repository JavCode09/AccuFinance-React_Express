Consultas de BD

-------- Tabla users --------

CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    grupo INT NOT NULL,
      registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
