# Deuda técnica y defectos

**Revisión del código fuente:** 2026-10-09
**Estado general:** los hallazgos registrados siguen abiertos/no verificados hasta completar la verificación indicada. En una actualización posterior se implementó el CRUD de usuarios internos; el build y la sintaxis se comprobaron, pero la integración con servidor/MySQL no se ejecutó.

Este documento recoge errores funcionales, confiabilidad, operación, datos, pruebas y mantenibilidad. Las vulnerabilidades de seguridad se registran en [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md); los riesgos transversales relacionados se referencian aquí cuando afectan el trabajo técnico.

## Criterio de gravedad

- **Alta:** puede causar inconsistencia de datos, fallos centrales o bloquear operaciones relevantes.
- **Media:** defecto funcional limitado, riesgo operativo, de rendimiento o de verificación.
- **Baja:** deuda de mantenibilidad que no demuestra por sí misma un fallo de seguridad o funcionamiento inmediato.

## Hallazgos

### TD-01 — Errores en validación y manejo de excepciones del registro

- **Gravedad:** Media.
- **Tipo/estado:** defecto confirmado en el código; no validado en ejecución.
- **Evidencia:** `back/router/auth.js` comprueba si existe una cuenta con una condición que no detecta correctamente el resultado de una consulta que devuelve un arreglo. Varias validaciones invocan `HttpError` sin `new`, aunque `HttpError` es una clase. La transacción se inicia antes del `try`.
- **Archivos afectados:** `back/router/auth.js`, `back/utils/HttpError.js`.
- **Impacto:** entradas inválidas o correo duplicado pueden terminar en respuestas 500/inconsistentes; un error al iniciar la transacción queda fuera del bloque de manejo previsto.
- **Recomendación:** corregir la condición de existencia, instanciar la clase de error correctamente y situar el ciclo transaccional dentro del manejo de errores.
- **Riesgo de corrección:** puede variar el estado HTTP o el mensaje que consume `front/src/components/api/registro_login.jsx`.
- **Momento:** antes de extender registro/autenticación.
- **Verificación de regresión:** pruebas de registro correcto, correo duplicado, campos vacíos, validaciones, fallo de conexión y rollback; verificar estado HTTP y contrato JSON.

### TD-02 — Alta de usuario interno no transmite el cuerpo esperado

- **Gravedad:** Alta para el flujo de usuarios internos.
- **Tipo/estado:** defecto encontrado en la revisión inicial; corrección implementada en el árbol actual, pendiente de verificación integrada.
- **Evidencia:** el adaptador actual envía `JSON.stringify(formData)` como `body` y el modal consume la respuesta `data`. El router valida los campos y registra el usuario.
- **Archivos afectados:** `front/src/components/api/usuariosInternos.jsx`, `front/src/components/pages/modals/usuariosInternos/add_UsuariosInternos.jsx`, `back/router/usuariosInternos.js`.
- **Impacto si la corrección no funciona:** el alta puede fallar o la lista no reflejar el registro creado.
- **Recomendación/estado:** mantener el cuerpo JSON y el manejo de errores actuales; no marcar cerrado hasta ejecutar el flujo contra una base aislada.
- **Riesgo de corrección:** cambios futuros pueden afectar el contrato entre formulario, adaptador y router.
- **Momento:** verificar antes de desplegar el CRUD.
- **Verificación pendiente:** cargar roles; probar alta correcta, duplicada e inválida; confirmar inserción única, hash no expuesto y actualización de la lista.

### TD-03 — Lectura de roles internos usa una opción mal nombrada

- **Gravedad:** Media para el flujo de alta interna.
- **Tipo/estado:** defecto encontrado en la revisión inicial; corrección implementada en el árbol actual, pendiente de verificación integrada.
- **Evidencia:** `getRoles` usa ahora el helper de solicitudes JSON que agrega `Authorization`; `/UsuariosInternos` se monta con `verifyToken`.
- **Archivos afectados:** `front/src/components/api/usuariosInternos.jsx`, `front/src/components/pages/modals/usuariosInternos/add_UsuariosInternos.jsx`.
- **Impacto si la corrección no funciona:** no se cargarán roles y los formularios no podrán asignarlos.
- **Recomendación/estado:** la protección JWT está añadida en el montaje y el cliente envía token; validar con servidor activo antes de cerrar.
- **Riesgo de corrección:** tokens expirados o ausentes deben dar un error claro sin habilitar el envío del formulario.
- **Momento:** antes de desplegar el CRUD.
- **Verificación pendiente:** probar sin token, con token inválido y con token válido; confirmar rechazo/éxito y roles visibles.

### TD-04 — Manejador de logging no definido en router interno

- **Gravedad:** Media.
- **Tipo/estado:** defecto encontrado en la revisión inicial; el árbol actual usa `console.error`, pero los caminos de error siguen sin prueba de ejecución.
- **Evidencia:** los `catch` del router actual registran con `console.error` sin depender de un `logger` no definido.
- **Archivos afectados:** `back/router/usuariosInternos.js`.
- **Impacto si reaparece:** un error de logging podría ocultar la respuesta prevista.
- **Recomendación/estado:** mantener logging sin datos sensibles y verificar errores de consulta/transacción en entorno aislado.
- **Riesgo de corrección:** bajo; evitar registrar datos personales o credenciales.
- **Momento:** antes de dar por estable el módulo de usuarios internos.
- **Verificación pendiente:** provocar fallos controlados y confirmar respuesta HTTP útil, log sin secretos y ausencia de una excepción secundaria.

### TD-05 — Definición SQL posiblemente inválida y esquema sin migraciones

- **Gravedad:** Alta para instalaciones reproducibles; impacto en datos depende del esquema desplegado.
- **Tipo/estado:** indicio estático confirmado; validez del script y esquema efectivo no verificados.
- **Evidencia:** solo se encontró `back/DB_querys/querys.sql` para creación/alteración de esquema y seeds. En la definición de `my_services`, la separación entre `created_at` y la clave foránea parece carecer de coma. El archivo combina sentencias de diferentes etapas.
- **Archivos afectados:** `back/DB_querys/querys.sql`.
- **Impacto:** una instalación desde cero puede fallar o no reproducir el esquema esperado; los cambios de esquema actuales no tienen historial/versionado encontrado.
- **Recomendación:** validar contra una base vacía de prueba y definir un mecanismo de migraciones incrementales, revisables y respaldables antes de cambiar estructuras.
- **Riesgo de corrección:** alto si se aplica directamente a datos existentes; no modificar esquema real sin inventario, respaldo y plan de reversión.
- **Momento:** antes de añadir cambios de esquema o preparar instalación/despliegue reproducible.
- **Verificación de regresión:** aplicar el proceso en base aislada y verificar tablas, columnas, claves, índices y flujos de lectura/escritura existentes.

### TD-06 — Conexión única compartida para peticiones y transacciones

- **Gravedad:** Media.
- **Tipo/estado:** arquitectura confirmada; impacto de concurrencia no medido.
- **Evidencia:** `back/conexion.js` crea una conexión MySQL única y exporta transacciones compartidas; los routers la reutilizan.
- **Archivos afectados:** `back/conexion.js` y routers que utilizan `beginTransaction`, `commit` y `rollback`, especialmente `back/router/myServicesPanle.js`, `back/router/roles.js` y `back/router/usuariosInternos.js`.
- **Impacto:** transacciones concurrentes pueden intercalarse sobre la misma conexión; la capacidad puede limitarse bajo carga.
- **Recomendación:** evaluar pool y hacer que cada transacción adquiera, use y libere una conexión de forma aislada.
- **Riesgo de corrección:** fugas de conexiones o transacciones en conexiones distintas si se migra incompletamente.
- **Momento:** antes de carga concurrente significativa o si un módulo añade operaciones multi-escritura.
- **Verificación de regresión:** pruebas de concurrencia con commits y fallos intermedios; comprobar aislamiento, rollback y liberación de conexiones.

### TD-07 — Listas sin paginación en backend

- **Gravedad:** Media; aumenta según tamaño de tablas.
- **Tipo/estado:** confirmado en varias consultas; volumen real no verificado.
- **Evidencia:** listados en `back/router/categories.js`, `back/router/services.js`, `back/router/myServices.js` y `back/router/usuariosInternos.js` no establecen límites/paginación en consultas inspeccionadas.
- **Archivos afectados:** routers indicados y páginas que consumen los listados.
- **Impacto:** respuestas grandes elevan latencia y consumo de memoria; la paginación client-side no reduce la lectura desde la API.
- **Recomendación:** incorporar paginación de servidor donde el volumen lo requiera, conservando contratos de respuesta explícitos.
- **Riesgo de corrección:** cambios de contrato y datos omitidos si la interfaz no implementa navegación de páginas correctamente.
- **Momento:** durante el desarrollo de listas nuevas o antes de que las actuales alcancen volumen significativo.
- **Verificación de regresión:** dataset mayor que el tamaño de página; recorrer páginas, aplicar búsqueda y comprobar que no hay duplicados ni omisiones.

### TD-08 — Sin pruebas backend ni documentación de contrato API

- **Gravedad:** Media.
- **Tipo/estado:** ausencia confirmada en el repositorio inspeccionado.
- **Evidencia:** no se encontraron archivos de tests backend; el script `test` de `back/package.json` termina con “Error: no test specified”. El `README.md` previo era la plantilla genérica de Create React App y no documentaba API.
- **Archivos afectados:** `back/package.json`, routers del backend, documentación del proyecto.
- **Impacto:** cambios de autorización, transacciones, validación y respuestas pueden introducir regresiones sin detección automatizada.
- **Recomendación:** agregar pruebas aisladas sobre los contratos y errores de cada módulo, comenzando por seguridad y transacciones; documentar rutas y esquemas de respuesta.
- **Riesgo de corrección:** pruebas acopladas a base compartida o datos reales; mantenerlas aisladas y sin credenciales reales.
- **Momento:** en paralelo a cada corrección de defectos críticos y al integrar módulos.
- **Verificación de regresión:** ejecutar suite en entorno de prueba reproducible; cubrir éxito, validación, no autenticado, sin permiso, recurso ajeno/no existente y error de dependencia.

### TD-09 — Configuración local fija de API y CORS

- **Gravedad:** Media para despliegue.
- **Tipo/estado:** configuración fija confirmada; entornos de despliegue no inspeccionados.
- **Evidencia:** `front/src/components/api/config.jsx` configura URL local de API y `back/server.js` permite un origen de desarrollo local fijo.
- **Archivos afectados:** `front/src/components/api/config.jsx`, `back/server.js`.
- **Impacto:** fuera de la configuración local esperada, el frontend puede llamar al servidor incorrecto o el navegador puede bloquear la API.
- **Recomendación:** configurar explícitamente URL y orígenes permitidos por entorno sin abrir CORS de forma indiscriminada.
- **Riesgo de corrección:** valores incorrectos pueden apuntar a otro entorno o permitir orígenes no deseados.
- **Momento:** antes de desplegar o probar frontend desde un origen distinto al local.
- **Verificación de regresión:** probar todos los entornos/orígenes autorizados y confirmar rechazo CORS desde un origen no permitido.

### TD-10 — Organización y duplicación entre routers y adaptadores API

- **Gravedad:** Baja.
- **Tipo/estado:** patrón arquitectónico observado; no es un fallo funcional por sí mismo.
- **Evidencia:** routers realizan SQL, validación y respuesta en el mismo archivo; los adaptadores frontend repiten construcción de `fetch`, encabezados y parseo de errores. `myServicesPanle.js` contiene un conjunto amplio de operaciones.
- **Archivos afectados:** múltiples archivos de `back/router/`, `front/src/components/api/` y `front/src/components/pages/`.
- **Impacto:** reglas y contratos pueden divergir; cambios transversales son más difíciles de probar.
- **Recomendación:** refactorizar gradualmente solo al tocar una funcionalidad, preservando contratos y evitando capas nuevas sin necesidad concreta.
- **Riesgo de corrección:** alto si se hace una reescritura amplia sin pruebas de compatibilidad.
- **Momento:** incrementalmente durante el desarrollo de módulos.
- **Verificación de regresión:** probar respuestas de rutas y flujos de UI antes/después de cada cambio acotado.

### TD-11 — Inconsistencia de nomenclatura heredada

- **Gravedad:** Baja.
- **Tipo/estado:** observación confirmada.
- **Evidencia:** mezcla de español e inglés y nombres con errores tipográficos como `myServicesPanle` y `newSystemCpanle`.
- **Archivos afectados:** nombres de routers, adaptadores, imports y rutas consumidoras correspondientes.
- **Impacto:** reduce descubribilidad, pero un renombrado puede romper imports y URL públicas.
- **Recomendación:** no renombrar en masa; usar nombres claros en módulos nuevos y migrar nombres heredados solo con búsqueda de consumidores y plan de compatibilidad.
- **Riesgo de corrección:** enlaces/imports y clientes existentes pueden dejar de funcionar.
- **Momento:** al crear código nuevo; limpieza heredada solo si está justificada y probada.
- **Verificación de regresión:** buscar todos los consumidores y ejecutar pruebas/build frontend y pruebas API.

## Límites de verificación

- Se ejecutó el build del frontend (éxito con advertencias existentes) y `node --check` del router/servidor; no se ejecutaron pruebas API ni se inició el servidor.
- No se ejecutaron consultas SQL ni se inspeccionó la base real.
- No se midió volumen de tablas ni rendimiento concurrente.
- No se comprobó el CRUD contra MySQL; TD-02/03/04 siguen abiertos hasta ejecutar las verificaciones indicadas.
- Ningún elemento se considera solucionado solo por estar implementado o documentado.
