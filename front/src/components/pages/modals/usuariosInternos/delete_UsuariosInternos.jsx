import React, { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { deleteUsuarioInterno } from "../../../api/usuariosInternos";

const DeleteUsuariosInternos = ({
    showModalDelete,
    clseModalDelete,
    category,
    getDataDelete
}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const handleDelete = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSaving(true);

        try {
            const result = await deleteUsuarioInterno(category.id);
            getDataDelete(result.data);
            clseModalDelete();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || error.message
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Desactivar usuario interno</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleDelete}>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <p>
                        ¿Deseas desactivar a{" "}
                        <strong>{category?.nombre} {category?.apellido_paterno}</strong>?
                    </p>
                    <p>El registro se conservará y el usuario no podrá iniciar sesión.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={clseModalDelete} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button variant="danger" type="submit" disabled={saving}>
                        {saving ? "Desactivando..." : "Desactivar"}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default DeleteUsuariosInternos;