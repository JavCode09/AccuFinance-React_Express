# AccuFinance

AccuFinance es una aplicación web para administrar categorías y servicios, registrar servicios personales y organizar planes de pago. Incluye inicio de sesión, registro y pantallas de administración de roles, permisos y usuarios internos.

## Arquitectura

El repositorio contiene dos aplicaciones:

- `front/`: cliente React 18 creado con Create React App y React Router.
- `back/`: API Node.js 20 y Express 4, conectada a MySQL.

La documentación técnica y los hallazgos pendientes están en [`docs_auditoria/`](./docs_auditoria/):

- [Arquitectura](./docs_auditoria/ARCHITECTURE.md)
- [Deuda técnica](./docs_auditoria/TECHNICAL_DEBT.md)
- [Auditoría de seguridad](./docs_auditoria/SECURITY_AUDIT.md)

## Requisitos

- Node.js 20.19.0, indicado por los archivos `.nvmrc` de `front/` y `back/`.
- MySQL con un esquema compatible con las consultas de `back/DB_querys/querys.sql`.
- Variables de entorno del backend para el puerto, la conexión a MySQL y la clave JWT. No se incluyen valores de ejemplo porque el repositorio no contiene una plantilla de entorno segura.

## Instalación

Instala las dependencias por separado en cada aplicación:

```sh
cd back
npm install
```

```sh
cd front
npm install
```

Configura las variables requeridas para el backend en el entorno local antes de iniciarlo. El código espera `PORT`, `HOST`, `USER`, `PASS`, `DB` y `SECRET_KEY`. No uses credenciales de producción en desarrollo.

## Ejecución en desarrollo

Inicia el backend desde `back/`:

```sh
npm start
```

También está disponible `npm run server`, que ejecuta Nodemon.

En otra terminal, inicia el frontend desde `front/`:

```sh
npm start
```

El frontend usa Create React App y su servidor de desarrollo predeterminado. La URL de API está configurada actualmente en `front/src/components/api/config.jsx`; revisa esa configuración junto con el origen CORS del backend si el entorno local difiere.

## Pruebas y compilación

Desde `front/`, están configurados:

```sh
npm test
npm run build
```

El backend no cuenta actualmente con una suite de pruebas: su script `npm test` termina indicando que no hay pruebas configuradas.
