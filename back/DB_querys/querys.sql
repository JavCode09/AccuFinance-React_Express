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


-- Tabla servicios
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


-- Tabla mis servicios
CREATE TABLE my_services (
  id_myservices INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  id_services INT NOT NULL,
  id_user INT NOT NULL,
  descripcion VARCHAR(45) NULL,
  monto VARCHAR(45) NOT NULL,
  dia_pago int(11) NOT NULL,
  general_status ENUM('Active', 'Inactive', 'Deleted') DEFAULT 'Active',
  fecha_fin_pago date NOT NULL,
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  created_at timestamp NOT NULL DEFAULT current_timestamp()
  FOREIGN KEY (`id_services`) REFERENCES services(`id`) ON DELETE RESTRICT 
); --aqui

-- Tabla plan de pagos --
CREATE TABLE planes (
    id_plan INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plan VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    año INT NOT NULL,
    meses VARCHAR(100) NOT NULL,
    servicios VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Restricción UNIQUE para combinar nombre_plan y user_id
    CONSTRAINT unique_nombre_plan_per_user UNIQUE (nombre_plan, user_id)
);

-- Tabla Planes de pago --
CREATE TABLE planes_de_pago (
    id_payment INT PRIMARY KEY AUTO_INCREMENT,
    id_plan INT NOT NULL,
    user_id INT NOT NULL,
    año YEAR NOT NULL,
    mes TINYINT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    my_service INT NOT NULL,
    service_status ENUM('Pending','Paid','Overdue') DEFAULT 'Pending',
    due_date DATE NOT NULL,  -- Fecha vencimiento
    paid_at DATETIME NULL, -- Fecha de Pago realizado --
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- le agregamos cascade a id_plan com oforenkey
-- Esto es para eliminacion en cascada
ALTER TABLE planes_de_pago
ADD CONSTRAINT fk_planes_pago
FOREIGN KEY (id_plan)
REFERENCES planes(id_plan)
ON DELETE CASCADE;
