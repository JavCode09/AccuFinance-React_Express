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


-- Tabla de Categorias --

CREATE TABLE categories (
    id int PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) not null UNIQUE,
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de categorías con descripción
INSERT INTO categories (nombre, descripcion) VALUES
('Entretenimiento y Medios', 'Servicios de streaming de contenido multimedia como películas, series y música.'),
('Servicios Públicos', 'Servicios esenciales como electricidad, agua, gas, y telecomunicaciones.'),
('Compras Online', 'Plataformas de compras en línea para productos de diversas categorías.'),
('Servicios Financieros', 'Servicios bancarios, seguros, préstamos, y pagos en línea.'),
('Suscripciones y Membresías', 'Membresías para acceder a servicios recurrentes como gimnasios, software o contenido exclusivo.'),
('Comidas y Bebidas', 'Plataformas para pedidos de comida a domicilio, supermercados y bebidas online.'),
('Transporte y Movilidad', 'Servicios de transporte de personas y pagos asociados.');
