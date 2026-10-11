import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { getRoles, updateUsuarioInterno } from "../../../api/usuariosInternos";

const UpdateUsuariosInternos = ({
    showModal_Update,
    closeModal_update,
    category,
    updateInfo,
}) => {
    const [data, setData] = useState(null);
    const [dataRoles, setDataRoles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const protectedRole = Number(category?.rol) === 1 || Number(category?.rol) === 2;

    useEffect(() => {
        if (!showModal_Update || !category) return;

        setData({
            nombre: category.nombre,
            apellido_paterno: category.apellido_paterno,
            apellido_materno: category.apellido_materno,
            email: category.email,
            rol: String(category.rol),
            status: String(category.status)
        });
        setErrorMessage("");

        getRoles()
            .then((result) => {
                const roles = result.data.filter(
                    (rol) => Number(rol.id) !== 1 && Number(rol.id) !== 2
                );
                const currentRole = Number(category.rol);
                if (!roles.some((rol) => Number(rol.id) === currentRole)) {
                    roles.push({
                        id: currentRole,
                        nombre: category.rol_nombre || "Rol actual"
                    });
                }
                setDataRoles(roles);
            })
            .catch((error) => {
                setErrorMessage(
                    error.response?.data?.message || error.message
                );
            });
    }, [showModal_Update, category]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSaving(true);

        try {
            const result = await updateUsuarioInterno(category.id, data);
            updateInfo(result.data);
            closeModal_update();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || error.message
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar usuario interno</Modal.Title>
            </Modal.Header>
            {data && (
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label label">Nombre</label>
                            <input
                                className="form-control input"
                                id="nombre"
                                name="nombre"
                                value={data.nombre}
                                onChange={handleChange}
                                required
                                maxLength={100}
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <div className="col me-3">
                                <label htmlFor="apellido_paterno" className="form-label label">
                                    Apellido paterno
                                </label>
                                <input
                                    className="form-control input"
                                    id="apellido_paterno"
                                    name="apellido_paterno"
                                    value={data.apellido_paterno}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <div className="col me-3">
                                <label htmlFor="apellido_materno" className="form-label label">
                                    Apellido materno
                                </label>
                                <input
                                    className="form-control input"
                                    id="apellido_materno"
                                    name="apellido_materno"
                                    value={data.apellido_materno}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label label">Email</label>
                            <input
                                className="form-control input"
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                required
                                maxLength={100}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rol" className="form-label label">Rol</label>
                            <select
                                className="form-select mb-3"
                                id="rol"
                                name="rol"
                                value={data.rol}
                                onChange={handleChange}
                                disabled={protectedRole}
                                required
                            >
                                {dataRoles.map((rol) => (
                                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label label">Estado</label>
                            <select
                                className="form-select mb-3"
                                id="status"
                                name="status"
                                value={data.status}
                                onChange={handleChange}
                                disabled={protectedRole}
                                required
                            >
                                <option value="1">Activo</option>
                                <option value="2">Inactivo</option>
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal_update} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? "Guardando..." : "Actualizar"}
                        </Button>
                    </Modal.Footer>
                </form>
            )}
        </Modal>
    );
};

export default UpdateUsuariosInternos;