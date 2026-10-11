# Arquitectura del sistema

**Revisión del código fuente:** 2026-10-09
**Estado:** descripción estática del árbol de trabajo observado. No se probó la aplicación ni se consultó la base de datos.

## Resumen

AccuFinance está compuesto por dos aplicaciones independientes:

- **Frontend:** React 18, Create React App y React Router v6 en `front/`.
- **Backend:** Node.js 20.19.0 y Express 4 en `back/`.
- **Base de datos:** MySQL, accedida con el paquete `mysql` mediante SQL escrito en los routers.

No hay un manifiesto de dependencias en la raíz. Cada aplicación tiene su propio `package.json` y lockfile. La API y el cliente están configurados para desarrollo local; sus direcciones no se obtienen de una configuración común por entorno.

## Estructura y responsabilidades

### Frontend (`front/`)

| Ruta | Responsabilidad observada |
|---|---|
| `src/index.js` | Punto de entrada React; importa Bootstrap, Font Awesome y estilos globales. |
| `src/App.js` | Configura `BrowserRouter`, `UserProvider` y las rutas `/` y `/main/*`. |
| `src/contexts/UserContext.jsx` | Conserva datos de usuario, accesos y estado de carga; verifica el token al montar y expone logout. |
| `src/components/pages/login.jsx` | Pantalla combinada de inicio de sesión y registro. |
| `src/components/pages/main.jsx` | Layout autenticado, menú lateral recursivo y rutas internas de módulos. |
| `src/components/pages/dashboard.jsx` | Componente sencillo de encabezado de módulo. |
| `src/components/pages/modules/` | Pantallas de administración y submódulos funcionales. |
| `src/components/pages/modals/` | Formularios en modales agrupados por recurso. |
| `src/components/api/` | Adaptadores `fetch` organizados por recurso/API. |
| `src/components/common/` | Botones compartidos y componentes de búsqueda. |
| `src/components/styles/` | Estilos globales, estilos por vista y CSS Modules. |
| `src/utils/jqueryYselect2.js` | Adaptación de jQuery/Select2 para uso desde componentes React. |
| `public/` | HTML, manifiesto y recursos estáticos. |

Las pantallas se encuentran principalmente en `src/components/pages/modules/subModules/`: categorías, catálogo de servicios, servicios personales, panel de planes, planes y pagos, roles, permisos y usuarios internos. `main.jsx` declara sus rutas explícitamente. El menú, en cambio, se arma con la jerarquía de accesos que devuelve el backend.

**Estado y formularios:** la aplicación utiliza principalmente `useState`, `useEffect` y `UserContext`. Hay formularios controlados y modales de React Bootstrap. `react-paginate` se usa en varias listas; `react-data-table-component` se utiliza en el panel. Aunque `react-hook-form` está en las dependencias, no se encontró uso en el código fuente inspeccionado.

### Backend (`back/`)

| Ruta | Responsabilidad observada |
|---|---|
| `server.js` | Configura Express, CORS y parser JSON; monta los routers y arranca el servidor. |
| `conexion.js` | Crea la conexión MySQL y expone consultas y operaciones de transacción promisificadas. |
| `middlewares/verifyToken.js` | Verifica el JWT del encabezado `Authorization` y asigna los datos decodificados a `req.user`. |
| `router/auth.js` | Registro, login, selección de usuario, armado de permisos y emisión de JWT. |
| `router/main.js` | Endpoint protegido que devuelve información decodificada del token. |
| `router/categories.js` | Consultas y operaciones CRUD de categorías. |
| `router/services.js` | Consultas y operaciones CRUD del catálogo de servicios. |
| `router/myServices.js` | Operaciones sobre servicios asociados a usuarios. |
| `router/myServicesPanle.js` | Planes de pago, meses, ingresos mensuales y servicios de planes. |
| `router/roles.js` | Roles y relaciones rol-permiso. |
| `router/permisos.js` | CRUD del catálogo de permisos. |
| `router/usuariosInternos.js` | CRUD de usuarios internos, consulta de roles disponibles y baja lógica mediante `status = 2`. |
| `router/search.js` | Búsquedas por recurso/módulo. |
| `utils/HttpError.js` | Tipo de error con estado HTTP y marca operacional. |
| `DB_querys/querys.sql` | SQL de creación/alteración de esquema y datos iniciales. |
| `DB_querys/tickets.md` | Pendientes de roles y permisos encontrados durante la revisión. |

No se encontró una capa uniforme de controladores, servicios o repositorios. Varios routers combinan validación, SQL, transacción y respuesta HTTP. `myServicesPanle.js` concentra una cantidad considerable de operaciones del dominio.

## Rutas de API montadas

Según `back/server.js`, las rutas base observadas son:

| Base | Middleware global al montar |
|---|---|
| `/auth` | Ninguno; permite login y registro. |
| `/api` | `verifyToken`. |
| `/categories` | `verifyToken`. |
| `/services` | `verifyToken`. |
| `/myServices` | `verifyToken`. |
| `/myServicesPanle` | `verifyToken`. |
| `/UsuariosInternos` | `verifyToken`. |
| `/roles` | Ninguno. |
| `/permisos` | Ninguno. |
| `/search` | `verifyToken`. |

La protección observada confirma autenticación JWT para las bases marcadas, pero no permite concluir que las operaciones tengan autorización detallada por acción o recurso; esa distinción se documenta en `SECURITY_AUDIT.md`.

## Flujo de comunicación

1. El usuario inicia sesión o se registra desde `login.jsx`; el adaptador de `components/api/registro_login.jsx` llama a `/auth/login` o `/auth/registro`.
2. El login responde con token, usuario y accesos. El cliente guarda esos datos en `localStorage` y navega a `/main`.
3. `UserProvider` llama al endpoint `/api` para verificar el token. `Main` obtiene los accesos almacenados, filtra los elementos del menú y renderiza las rutas declaradas.
4. Las páginas llaman a los adaptadores de `components/api/`, que construyen las solicitudes `fetch` hacia el backend y, en rutas protegidas, envían el token en `Authorization`.
5. Express ejecuta el middleware configurado para la ruta; el router realiza consultas parametrizadas a MySQL mediante `conexion.js` y responde JSON.
6. Durante el login, el backend consulta la cuenta y los permisos relacionados con el rol, agrupa los permisos por módulo y arma una jerarquía padre/hijo que el cliente usa para el menú.

### Usuarios internos

El adaptador `front/src/components/api/usuariosInternos.jsx` envía el JWT en `Authorization` y centraliza las solicitudes JSON del módulo. La pantalla `front/src/components/pages/modules/subModules/usuarios_internos.jsx` presenta el listado y conecta los modales de alta, edición y desactivación.

El router expone `GET /UsuariosInternos`, `GET /UsuariosInternos/rolesAll`, `POST /UsuariosInternos`, `PUT /UsuariosInternos/:id` y `DELETE /UsuariosInternos/:id`. El listado devuelve campos explícitos sin la columna de contraseña; el alta genera el hash con bcrypt; la edición actualiza datos, rol y estado sin cambiar contraseña. La operación DELETE es lógica: actualiza `status` a `2` y no borra físicamente la fila. Los roles 1 y 2 no se ofrecen para nuevas asignaciones y el servidor impide cambiar el rol o estado de sus cuentas.

El buscador de esta pantalla conserva su integración heredada con `search/Permisos`; no forma parte del CRUD actualizado.

La verificación del JWT entrega los claims contenidos en el token; no vuelve a consultar la base para comprobar en cada petición que el usuario sigue activo o que sus permisos no han cambiado.

## Persistencia y esquema

`conexion.js` lee la configuración MySQL del entorno y crea una única conexión compartida usando `mysql.createConnection`. Las funciones `query`, `beginTransaction`, `commit` y `rollback` se envuelven en promesas y se exportan para los routers.

`back/DB_querys/querys.sql` describe, entre otras, tablas de usuarios, roles, módulos, permisos, relaciones rol-permiso, categorías, servicios, servicios de usuario, planes, pagos, estados mensuales e ingresos mensuales. El archivo combina DDL, `ALTER TABLE` y seeds. No se encontró una herramienta ni historial de migraciones versionadas.

No se consultó el esquema real de ninguna base y no se ejecutó el SQL; por tanto, la coincidencia entre el script y una base desplegada no está verificada.

## Autenticación y permisos

- Las contraseñas se procesan con `bcrypt`.
- El backend emite JWT con una expiración configurada de dos horas.
- El token se transporta en el encabezado `Authorization`.
- El cliente guarda token, datos del usuario y accesos en `localStorage`.
- Los permisos se cargan durante login y `main.jsx` los usa para decidir qué elementos del menú renderizar.
- El middleware `verifyToken` verifica el JWT, pero no se identificó un middleware común de autorización por permiso, acción o pertenencia del recurso.

Los riesgos concretos están detallados en `SECURITY_AUDIT.md`.

## Dependencias, configuración y comandos

Los archivos `.nvmrc` de `front/` y `back/` indican Node.js 20.19.0.

**Frontend (`front/package.json`):**

- Scripts: `npm start`, `npm test`, `npm run build`, `npm run eject`.
- Dependencias relevantes: React 18, React Router 6, React Bootstrap/Bootstrap, `react-hook-form`, `react-paginate`, `react-data-table-component`, jQuery y Select2.
- La URL base de API está fijada en `src/components/api/config.jsx`.

**Backend (`back/package.json`):**

- Scripts: `npm start` y `npm run server` (Nodemon).
- El script `npm test` está definido como salida de “no test specified” y falla intencionalmente.
- Dependencias relevantes: Express 4, `mysql`, `bcrypt`, `jsonwebtoken`, `cors` y `dotenv`.
- Variables leídas por el código: `PORT`, `HOST`, `USER`, `PASS`, `DB` y `SECRET_KEY`. No se inspeccionó ni se reproduce el contenido del archivo `.env`.

El servidor configura CORS para un origen local fijo; la URL del API del cliente también apunta a un host local fijo. Sus consecuencias operativas y recomendaciones constan en `TECHNICAL_DEBT.md`.

## Convenciones observadas y extensión de módulos

- Módulos frontend organizados por recurso bajo `pages/modules/subModules/`; modales de ese recurso bajo `pages/modals/`; adaptadores API bajo `components/api/`.
- Routers backend montados desde `server.js`, con SQL parametrizado en la mayoría de las consultas inspeccionadas.
- Formularios y respuestas siguen convenciones ya existentes, aunque no hay un formato API uniforme para errores y listas.
- Los nombres e identificadores mezclan español e inglés. Hay nombres heredados y errores tipográficos en rutas/nombres; antes de renombrarlos hay que revisar todos sus consumidores.

Para integrar un módulo siguiendo la organización actual normalmente se incorporaría: pantalla, ruta en `main.jsx`, adaptador API, formulario/modal cuando aplique, router backend y montaje protegido en `server.js`. Si el módulo necesita datos persistidos, también requiere revisar el esquema real y definir cómo se versionará el cambio. La autorización debe implementarse en el servidor, no solo en el menú del cliente.

## Límites de esta revisión

- Se ejecutaron `node --check` sobre el router y servidor, y `npm run build` del frontend; el build terminó con advertencias preexistentes de lint/dependencias. No se ejecutó el servidor ni pruebas API.
- No se leyó `.env`, no se inspeccionaron secretos ni se consultó la base de datos.
- No se comprobó el despliegue, los orígenes reales, los datos, las versiones efectivas de MySQL ni la validez completa del SQL.
- La verificación del CRUD es estática y de compilación; la tabla real, sus restricciones y el comportamiento integrado con MySQL siguen sin verificarse.
