-- Consultas de BD nombre de la bd: accufinance

-------- Tabla users --------

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'UNIQUE',
    password VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed password',
    rol INT NOT NULL DEFAULT 1 COMMENT '1:Usuario',
    status INT(3) NOT NULL DEFAULT 1 COMMENT '1:Activo, 2:Inactivo',
    registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

------- Tabla de person -------
CREATE TABLE user_access_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'UNIQUE',
    password VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed password',
    rol INT NOT NULL DEFAULT 1 COMMENT '1:Usuario',
    status INT(3) NOT NULL DEFAULT 1 COMMENT '1:Activo, 2:Inactivo',
    registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

------- INSERCION DE SUPER ADMINISTRADOR PRINCIPAL , PASS = Acmilanjavi09 -------
INSERT INTO `user_access_log` (`id`, `nombre`, `apellido_paterno`, `apellido_materno`, `email`, `password`, `rol`, `status`, `registro`) 
VALUES (NULL, 'Javier', 'Piña', 'Lopez', 'javier.pilprofesional09@gmail.com', '$2b$10$UVEUfMww0vioWKauulEvI.thZ/5Ci20JXiiLKoKwqtob8Yyn3H/kK', '1', '1', current_timestamp());


-- Tabla relacionales a roles, permisos --------
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insercion de super admionistrador --
INSERT INTO `roles` (`id`, `nombre`) VALUES ('1', 'Super Administradore');

CREATE TABLE modulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ruta VARCHAR(255),
    icon VARCHAR(100),
    parent_id INT NULL COMMENT 'ID del módulo padre (NULL = bloque principal, permite jerarquía de módulos/submódulos)',
    tipo ENUM('bloque', 'modulo') DEFAULT 'modulo' COMMENT 'bloque = contenedor, modulo = elemento navegable',
    orden INT DEFAULT 0 COMMENT 'Orden de visualización en el menú (menor número = se muestra primero)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Si borras al bloque --- se borran los hijos 
    FOREIGN KEY (parent_id) REFERENCES modulos(id) ON DELETE CASCADE
);

CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO `permisos` (`id`, `nombre`) VALUES (NULL, 'ver');
INSERT INTO `permisos` (`id`, `nombre`) VALUES (NULL, 'crear');
INSERT INTO `permisos` (`id`, `nombre`) VALUES (NULL, 'editar');
INSERT INTO `permisos` (`id`, `nombre`) VALUES (NULL, 'eliminar');
INSERT INTO `permisos` (`id`, `nombre`) VALUES (NULL, 'Sin permisos');

CREATE TABLE rol_permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    modulo_id INT NOT NULL,
    permiso_id INT NOT NULL,

    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE,

    UNIQUE (rol_id, modulo_id, permiso_id)
);

-- Default cero para iniciar permisos de nuevos roles agregados
ALTER TABLE `rol_permisos` CHANGE `permiso_id` `permiso_id` INT(11) NOT NULL DEFAULT '5';

-- Insercion de modulos, roles y permisos ----
INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Inicio', '/main', 'fa-th-large', NULL, 'modulo', '1', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Panel de Control', '/main/AdminServices', 'fa-home', NULL, 'modulo', '2', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Gestión de Servicios', null, 'fa-server', NULL, 'bloque', '3', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Categorías', '/main/categories', 'fa-handshake-o', '3', 'modulo', '1', current_timestamp());
INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Nuevo Servicio', '/main/new_Services', 'fa-plus', '3', 'modulo', '2', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES
(NULL, 'Mis Servicios', '/main/my_Services', 'fa-plus-square', NULL, 'modulo', '4', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Administración de Usuarios', NULL, 'fa-users', NULL, 'bloque', '5', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Usuarios', '/main/users', 'fa-user', '7', 'modulo', '1', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Usuarios Internos', '/main/roll_users', 'fa-user-secret', '7', 'modulo', '2', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Permisos', '/main/roll_permissions', 'fa-lock', '7', 'modulo', '3', current_timestamp());

INSERT INTO `modulos` (`id`, `nombre`, `ruta`, `icon`, `parent_id`, `tipo`, `orden`, `created_at`) VALUES 
(NULL, 'Roles', 'rolls', 'fa-address-card', '7', 'modulo', '4', current_timestamp());

-- insersion de todos los permisos por modulo de Super Administrador
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '1', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '2', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '3', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '4', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '5', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '6', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '7', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '8', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '9', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '10', '1');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '11', '1');

INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '1', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '2', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '3', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '4', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '5', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '6', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '7', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '8', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '9', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '10', '2');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '11', '2');

INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '1', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '2', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '3', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '4', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '5', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '6', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '7', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '8', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '9', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '10', '3');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '11', '3');

INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '1', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '2', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '3', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '4', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '5', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '6', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '7', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '8', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '9', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '10', '4');
INSERT INTO `rol_permisos` (`id`, `rol_id`, `modulo_id`, `permiso_id`) VALUES (NULL, '1', '11', '4');

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
  fecha_fin_pago VARCHAR(10) NOT NULL DEFAULT 'General',
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
    -- Restricción UNIQUE para combinar nombre_plan y user_id (Ayuda a que no se repitan estos campos iguales sino diferentes )
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
    paid_at DATE NULL, -- Fecha de Pago realizado --
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

-- Actualizamos el cmapo de paid 
ALTER TABLE `planes_de_pago` CHANGE `due_date` `due_date` DATETIME NULL DEFAULT NULL COMMENT 'Fecha limite para realizar el pago';
ALTER TABLE `planes_de_pago` CHANGE `paid_at` `paid_at` DATETIME NULL DEFAULT NULL COMMENT 'Fecha en la que se realizó el pago';

-- Le agregamos comentarios a dos campos due_date y paid_at para saber cual es cual
Alter table planes_de_pago
MODIFY due_date DATE COMMENT 'Fecha limite para realizar el pago',
MODIFY paid_at DATETIME COMMENT 'Fecha en la que se realizó el pago';

-- Tabla de estaus de estados de meses de servicios (catalogo de estaus)
CREATE TABLE plan_month_status (
    id INT PRIMARY kEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT 'Nombre corto del estado',
    description VARCHAR(100) NOT NULL COMMENT 'Descripcion mas detallada del estado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)COMMENT 'Catálogo de estados posibles para los meses de planes' ;

INSERT INTO plan_month_status (name, description) VALUES
('Pendiente', 'Mes aún no iniciado'),
('En proceso', 'Mes actual en curso'),
('Finalizado', 'Mes cerrado correctamente con todos los servicios completados'),
('Atrasado', 'Mes terminado con servicios o pagos pendientes');

-- Tabla meses para registro de ingresos mensuales y editables
CREATE TABLE plan_monthly_income (
    id INT  PRIMARY KEY AUTO_INCREMENT,
    id_plan INT NOT NULL COMMENT 'ID relacionado en tabla planes',
    monthly_income DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Ingreso mensual asignado al plan',
    month TINYINT NOT NULL  COMMENT 'Número de mes (1 a 12)',
    status_mes INT NOT NULL  DEFAULT '1' COMMENT '(Atrasado, Finalizado, En proceso, Pendiente)',
    due_date DATE COMMENT 'Fecha límite para el mes',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- FOREN kEY de id_plan relacionada a la tabla planes el campo unico id_plan
    FOREIGN KEY (id_plan) REFERENCES planes(id_plan) ON DELETE CASCADE,

    -- FOREIGN KEY de status_mes relacionada a la tabla catalogos el campo es id
    FOREIGN KEY (status_mes) REFERENCES plan_month_status(id)
)COMMENT='Historial mensual de ingresos por plan y meses';