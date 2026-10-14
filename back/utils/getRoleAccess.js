const { query } = require("../conexion");

const getRoleAccess = async (roleId) => {
    const results = await query(`
        SELECT
            m.id AS modulo_id,
            m.nombre AS nombre_modulo,
            m.ruta,
            m.icon,
            m.parent_id,
            m.tipo,
            m.orden,
            rp.rol_id,
            rp.permiso_id,
            p.nombre AS nombre_permiso
        FROM modulos m
        LEFT JOIN rol_permisos rp
            ON rp.modulo_id = m.id AND rp.rol_id = ?
        LEFT JOIN permisos p
            ON rp.permiso_id = p.id
        ORDER BY m.orden ASC
    `, [roleId]);

    const modulesById = {};

    results.forEach((data) => {
        const id = data.modulo_id;

        if (!modulesById[id]) {
            modulesById[id] = {
                modulo_id: data.modulo_id,
                nombre_modulo: data.nombre_modulo,
                ruta: data.ruta,
                icon: data.icon,
                parent_id: data.parent_id,
                tipo: data.tipo,
                orden: data.orden,
                permisos: {},
                hijos: []
            };
        }

        if (data.permiso_id) {
            modulesById[id].permisos[data.nombre_permiso] = true;
        }
    });

    const tree = [];

    Object.values(modulesById).forEach((module) => {
        if (module.parent_id === null) {
            tree.push(module);
        } else if (modulesById[module.parent_id]) {
            modulesById[module.parent_id].hijos.push(module);
        }
    });

    return tree;
};

module.exports = getRoleAccess;
