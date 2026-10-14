# Auditoría de seguridad

**Revisión estática del código:** 2026-10-09
**Estado:** hallazgos abiertos/no verificados. No se modificó código, no se ejecutaron pruebas de explotación, no se consultó la base y no se inspeccionó el contenido de archivos de entorno.
**Alcance:** autenticación, autorización, exposición de datos, consultas y configuración observables en el código fuente inspeccionado.

## Resumen de hallazgos

| ID | Severidad | Estado/evidencia | Hallazgo |
|---|---|---|---|
| SEC-01 | Crítica | Confirmado para `/roles` y `/permisos`; actualización de `/UsuariosInternos` pendiente de prueba integrada | Routers administrativos montados sin autenticación. |
| SEC-02 | Crítica, condicionada | Flujo y seed visibles; aplicación real no verificada | Auto-registro puede recibir el rol privilegiado predeterminado. |
| SEC-03 | Alta | Confirmado en consultas/entradas observadas | Falta aislamiento por propiedad del recurso en servicios y operaciones del panel. |
| SEC-04 | Alta | Hallazgo inicial; consulta actual usa lista explícita sin hash, falta comprobar respuesta integrada | El listado interno podía incluir columnas sensibles. |
| SEC-05 | Alta, condicionada | Seed confirmado; vigencia de credencial no verificada | Credencial de administrador sembrada en SQL. |
| SEC-06 | Alta | Brecha de diseño confirmada en middleware/rutas revisados | Permisos comprobados en menú, sin control común de autorización por acción en API. |
| SEC-07 | Mitigación implementada; validación de despliegue pendiente | El JWT ya no se guarda en `localStorage`; atributos finales de cookie y orígenes productivos aún requieren confirmación. |

## SEC-01 — Routers administrativos sin autenticación

- **Severidad:** Crítica.
- **Estado:** confirmado por configuración de rutas; no se probó en servidor activo.
- **Descripción/evidencia:** en el árbol actual, `back/server.js` monta `/UsuariosInternos` con `verifyToken`; `/roles` y `/permisos` siguen montados sin ese middleware. No se probaron las rutas contra un servidor activo.
- **Archivos afectados:** `back/server.js`, `back/router/roles.js`, `back/router/permisos.js`; `back/router/usuariosInternos.js` para confirmar la protección integrada del CRUD.
- **Impacto:** las operaciones de roles y permisos siguen expuestas a invocación no autenticada si la API es accesible. La protección del CRUD de usuarios internos depende de que el middleware funcione correctamente en ejecución.
- **Corrección recomendada:** requerir autenticación en servidor en todas las operaciones administrativas y autorización específica por rol/acción. No tratar CORS ni ocultar opciones en React como control de acceso.
- **Riesgo de corrección:** consumidores actuales sin token pueden dejar de funcionar; coordinar middleware backend y adaptadores frontend.
- **Momento recomendado:** antes de desarrollar módulos administrativos nuevos.
- **Verificación pendiente:** probar `/UsuariosInternos`, `/roles` y `/permisos` sin token, con token inválido y con token válido; comprobar estado HTTP, ausencia de efectos laterales y continuidad de contratos autorizados. El CRUD solo exige JWT según el alcance acordado; no se agregó autorización por rol.

## SEC-02 — Rol privilegiado por defecto en auto-registro

- **Severidad:** Crítica, **condicionada al esquema y seeds aplicados**.
- **Estado:** confirmado en los archivos fuente; configuración real de la base no verificada.
- **Descripción/evidencia:** `back/router/auth.js` crea registros en `users` sin indicar rol. `back/DB_querys/querys.sql` define el rol por defecto como `1`, identifica el rol con ID `1` como administrador y le asigna permisos a módulos. Si el esquema y seeds del archivo corresponden a la base activa, el usuario creado por el registro público podría recibir privilegios administrativos.
- **Archivos afectados:** `back/router/auth.js`, `back/DB_querys/querys.sql`.
- **Impacto:** un usuario público podría obtener capacidad administrativa si se cumple la condición indicada.
- **Corrección recomendada:** asignar de forma explícita un rol de menor privilegio para auto-registro y separar la creación de administradores de la ruta pública. Inspeccionar rol/constraints en un entorno autorizado antes de cualquier cambio.
- **Riesgo de corrección:** asignar un rol que no exista o modificar permisos de cuentas actuales; cambios directos en producción pueden bloquear acceso o cambiar privilegios.
- **Momento recomendado:** antes de añadir módulos y antes de exponer el registro a usuarios.
- **Verificación:** crear una cuenta en base aislada y comprobar rol efectivo y accesos; confirmar que cuenta administrativa existente mantiene sus permisos y que el alta pública no acepta rol privilegiado desde el cliente.

## SEC-03 — Autorización de propiedad de datos incompleta

- **Severidad:** Alta.
- **Estado:** confirmado en consultas y campos usados; el alcance de todas las operaciones requiere revisión por endpoint.
- **Descripción/evidencia:** `back/router/myServices.js` contiene un listado que no filtra por usuario. El router `back/router/myServicesPanle.js` recibe IDs de usuario/plan de query o body en varias operaciones. `verifyToken` coloca el JWT decodificado en `req.user`, pero las rutas observadas no siempre derivan la identidad/propiedad desde ese dato.
- **Archivos afectados:** `back/middlewares/verifyToken.js`, `back/router/myServices.js`, `back/router/myServicesPanle.js`; adaptadores consumidores en `front/src/components/api/myservices.jsx` y `front/src/components/api/newSystemCpanle.jsx`.
- **Impacto:** un usuario autenticado podría acceder a datos ajenos o realizar operaciones sobre recursos pertenecientes a otro usuario.
- **Corrección recomendada:** derivar identidad de `req.user`, filtrar cada consulta por propietario y verificar pertenencia en lecturas, actualizaciones y eliminaciones. Validar todas las rutas por objeto, no solo las ya identificadas.
- **Riesgo de corrección:** supuestos erróneos sobre relaciones o cuentas administrativas pueden ocultar datos válidos; comprobar el modelo real y los contratos.
- **Momento recomendado:** antes de módulos nuevos que accedan a datos personales/financieros.
- **Verificación:** usar al menos dos cuentas de prueba; probar cada método sobre recurso propio, ajeno e inexistente; confirmar que el acceso ajeno no revela existencia ni modifica datos.

## SEC-04 — Posible exposición de hashes de contraseñas

- **Severidad:** Alta.
- **Estado:** hallazgo confirmado en el árbol inicial; la consulta actual proyecta una lista explícita de campos sin contraseña/hash y el montaje requiere `verifyToken`. La respuesta real no se inspeccionó.
- **Descripción/evidencia:** el router actual declara `USER_COLUMNS` sin la columna de contraseña y lo usa para las consultas de listado/detalle; `back/server.js` protege `/UsuariosInternos` con JWT. No se consultó MySQL ni se comprobó la respuesta de una petición ejecutada.
- **Archivos afectados:** `back/router/usuariosInternos.js`, `back/server.js`.
- **Impacto si el problema persiste:** respuestas con hashes permitirían ataques offline; la probabilidad está reducida por la proyección explícita y el middleware observados, pendiente verificación integrada.
- **Corrección/estado:** la selección explícita y protección JWT están implementadas en el árbol actual; no marcar como cerrado hasta comprobar que ninguna respuesta contiene contraseña/hash y que solicitudes no autenticadas son rechazadas.
- **Riesgo de corrección:** el frontend puede consumir campos que no deberían exponerse; revisar su contrato para conservar solo datos legítimos.
- **Momento recomendado:** antes de habilitar o extender administración de usuarios.
- **Verificación pendiente:** inspeccionar respuesta JSON del endpoint autorizado y confirmar ausencia de contraseña/hash; comprobar denegación no autenticada y funcionamiento del listado.

## SEC-05 — Credencial privilegiada en SQL de inicialización

- **Severidad:** Alta, **condicionada a vigencia/reutilización de la credencial**.
- **Estado:** seed sensible presente en el SQL; no se consultó el historial del repositorio ni se verificó que la cuenta funcione. No se reproducen valores.
- **Descripción/evidencia:** `back/DB_querys/querys.sql` contiene una inserción de usuario privilegiado, hash de contraseña y comentario con credencial inicial.
- **Archivos afectados:** `back/DB_querys/querys.sql`.
- **Impacto:** si la credencial inicial sigue siendo válida o se reutilizó en otros entornos, personas con acceso al repositorio podrían intentar autenticación privilegiada.
- **Corrección recomendada:** confirmar con el responsable del entorno si está activa y rotarla si procede; reemplazar credenciales estáticas por un procedimiento seguro de aprovisionamiento. La rotación es necesaria aunque se retire el valor del archivo o del historial.
- **Riesgo de corrección:** pérdida de acceso si se rota sin actualizar el proceso operativo; cambios en SQL podrían recrear credenciales inseguras en una nueva instalación.
- **Momento recomendado:** antes de despliegue y antes de compartir/publicar el repositorio; no alterar producción sin aprobación y plan de acceso.
- **Verificación:** validar nueva cuenta por canal seguro en entorno controlado y confirmar que credencial anterior no autentica; comprobar que una inicialización nueva no siembra el valor anterior.

## SEC-06 — Permisos de interfaz no equivalen a autorización API

- **Severidad:** Alta.
- **Estado:** confirmado en el diseño inspeccionado; no se hizo prueba de bypass en servidor.
- **Descripción/evidencia:** `front/src/components/pages/main.jsx` usa `modulo.permisos?.ver` para mostrar opciones del menú. En `back/server.js`, los routers protegidos aplican `verifyToken`; ese middleware solo valida JWT, no evalúa permiso por recurso/acción. Para los routers públicos, el problema adicional está en SEC-01.
- **Archivos afectados:** `front/src/components/pages/main.jsx`, `back/server.js`, `back/middlewares/verifyToken.js`, routers que aceptan operaciones de escritura.
- **Impacto:** ocultar un botón o ruta visual no impide invocar directamente endpoints. Un token válido puede ser suficiente para operaciones para las que el usuario no tiene permiso funcional.
- **Corrección recomendada:** añadir autorización server-side por módulo y acción; identificar el rol desde claims confiables y definir cómo se actualizan/revocan permisos durante la vida del token.
- **Riesgo de corrección:** discrepancias entre permisos almacenados al login y permisos actualizados después; bloqueo accidental de operaciones legítimas.
- **Momento recomendado:** antes de añadir nuevos módulos con permisos diferenciados.
- **Verificación:** probar endpoints directamente con usuarios de distintos roles para operaciones de ver, crear, editar y eliminar; comprobar denegación en servidor aunque se invoque manualmente.

## SEC-07 — Protección y transporte de la sesión JWT

- **Severidad:** Mitigación defensiva; el riesgo de robo del token dependía de ejecución de JavaScript no confiable en el origen. No se confirmó XSS.
- **Estado:** cambio implementado en el árbol de trabajo; build y pruebas de integración aún pendientes.
- **Descripción/evidencia:** el JWT se establece como cookie `HttpOnly`, `SameSite=Lax`, `Path=/` y `Secure` cuando `NODE_ENV=production`. `verifyToken` lo lee exclusivamente de esa cookie. El frontend incluye credenciales mediante `apiFetch`, conserva usuario/accesos solo en `UserContext` y deja de leer o escribir el JWT en `localStorage`. `/api` vuelve a consultar cuenta y permisos al restaurar sesión; `/auth/logout` limpia la cookie. Las peticiones mutables requieren que `Origin` coincida exactamente con el origen configurado, mientras CORS permite credenciales solo para ese origen.
- **Archivos afectados:** `back/router/auth.js`, `back/router/main.js`, `back/server.js`, `back/middlewares/verifyToken.js`, `back/middlewares/verifyOrigin.js`, `back/utils/sessionCookie.js`, `back/utils/getRoleAccess.js`, `front/src/components/api/apiFetch.js`, `front/src/components/api/registro_login.jsx`, adaptadores de `front/src/components/api/`, `front/src/contexts/UserContext.jsx`, `front/src/components/pages/login.jsx` y `front/src/components/pages/main.jsx`.
- **Impacto de no completar la configuración:** el JWT dejaría de estar expuesto a lectura directa por JavaScript, pero una política incorrecta de cookie/origen puede impedir iniciar sesión o dejar controles CSRF incompatibles con la topología productiva.
- **Riesgo de corrección:** las sesiones antiguas sin el claim `source` ya no son válidas y requieren iniciar sesión nuevamente. Los clientes que no envíen cookies o no presenten un `Origin` permitido recibirán rechazo. El cierre local sigue limpiando el estado incluso si no se alcanza el servidor; en ese caso no se pudo confirmar que la cookie fue invalidada en el navegador.
- **Momento recomendado:** antes del despliegue y validación integral de la nueva sesión.
- **Configuración pendiente de validar antes de desplegar:**
  - **`SameSite`:** verificar si frontend y API son same-site en sus dominios/esquemas reales. `Lax` es el valor provisional para el esquema local actual; un despliegue cross-site puede requerir `None`, que exige HTTPS y `Secure`, además de controles CSRF probados.
  - **`Secure`:** confirmar que producción establece `NODE_ENV=production`, que el sitio se sirve por HTTPS y que no existe una topología proxy que altere este supuesto.
  - **CORS:** definir `FRONTEND_ORIGIN` con el origen exacto del frontend productivo; no usar `*` con credenciales. Verificar preflight y cookies desde navegador.
  - **CSRF:** confirmar que cada cliente legítimo envía `Origin` exactamente igual a `FRONTEND_ORIGIN`, y probar rechazo de origen ajeno y ausente en métodos mutables. CORS por sí solo no es el control CSRF.
- **Verificación requerida:** confirmar que el JWT no aparece en `localStorage`, que la cookie tiene atributos correctos, que el login/restauración/logout y expiración de dos horas funcionan, que las rutas protegidas rechazan cookies ausentes/incorrectas y que los métodos mutables rechazan origen no permitido.

## Recomendaciones de seguridad transversales

- Mantener consultas SQL parametrizadas; validar y normalizar entrada del lado servidor.
- No confiar en IDs de usuario, rol o recurso enviados por React para autorización.
- Limitar campos devueltos por consultas y evitar incluir hashes, secretos o datos personales innecesarios.
- Configurar `FRONTEND_ORIGIN` por entorno; CORS no sustituye autenticación, autorización ni el control de origen/CSRF.
- Añadir pruebas negativas para usuario no autenticado, sin privilegios, recurso ajeno, recurso inexistente y fallos de transacción.
- No registrar contraseñas, tokens, hashes ni contenido de `.env`.

## Límites y estado

- Esta es una revisión estática, no una prueba de penetración.
- No se ejecutó el backend, no se enviaron peticiones, no se consultó MySQL ni se inspeccionó `.env`.
- No está verificado que el SQL de esquema/seed corresponda a una base desplegada ni que la cuenta sembrada siga activa.
- La migración del JWT a cookie está implementada pero no se ha validado contra un navegador, servidor activo ni MySQL; la configuración productiva de `SameSite`, `Secure`, CORS y CSRF sigue pendiente.
- No se marcan hallazgos como resueltos: SEC-01 permanece abierto para `/roles` y `/permisos`; SEC-04 requiere comprobación de respuesta integrada.
