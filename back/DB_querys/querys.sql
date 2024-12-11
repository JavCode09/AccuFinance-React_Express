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


CREATE TABLE services (
    id int PRIMARY KEY AUTO_INCREMENT,
    categoria int not null,
    nombre VARCHAR(100) not null UNIQUE,
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Alguna consultas para servicos
INSERT INTO services (categoria, nombre, descripcion) VALUES
-- Categoría: Entretenimiento y Medios
(1, 'Netflix', 'Streaming de series y películas.'),
(1, 'Spotify', 'Plataforma de streaming de música.'),
(1, 'Amazon Prime Video', 'Servicio de películas y series por suscripción.'),
(1, 'Disney+', 'Plataforma de streaming de Disney, Pixar y Marvel.'),
-- Categoría: Servicios Públicos
(2, 'CFE', 'Servicio de energía eléctrica en México.'),
(2, 'Telmex', 'Proveedores de internet y telefonía.'),
(2, 'Gas Natural', 'Distribución de gas natural a hogares.'),
(2, 'AquaCity', 'Proveedores de agua potable.'),
-- Categoría: Compras Online
(3, 'Amazon', 'Plataforma de compras en línea.'),
(3, 'Mercado Libre', 'Marketplace para productos nuevos y usados.'),
(3, 'Etsy', 'Compra y venta de artículos hechos a mano.'),
(3, 'Shein', 'Tienda en línea de ropa y accesorios.'),
-- Categoría: Servicios Financieros
(4, 'BBVA', 'Servicios bancarios y financieros.'),
(4, 'PayPal', 'Plataforma para pagos y transferencias en línea.'),
(4, 'Seguros GNP', 'Cobertura de seguros de vida, auto y salud.'),
(4, 'Klar', 'Fintech de crédito y servicios financieros.'),
-- Categoría: Suscripciones y Membresías
(5, 'Gym Pro', 'Membresías para acceso a gimnasios premium.'),
(5, 'Adobe Creative Cloud', 'Suite de software de diseño y edición.'),
(5, 'LinkedIn Premium', 'Acceso a funciones exclusivas para profesionales.'),
(5, 'Canva Pro', 'Herramientas avanzadas para diseño gráfico.');
