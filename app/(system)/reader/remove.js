'use client'

import { Button, Modal } from "flowbite-react";
import { useContext, useState } from "react"
import { ReaderContext } from "./context";
import { Remove } from "./api";
import { toast } from "react-toastify"

export default function RemoveReader({ id }) {

    const [modalOpen, setModalOpen] = useState(true);
    const [busy, setBusy] = useState(false);

    const readerContext = useContext(ReaderContext);

    const handleClose = () => {
        setModalOpen(false);
        readerContext.close();
    }

    const handleDelete = async () => {
        setBusy(true);

        const result = await Remove(id);
        
        if (result.success) {
            handleClose();
            readerContext.update(true);
            if (result.message !== '')
                toast.success(result.message);
        }
        else {
            
            handleClose();
            if (result.message !== '')
                toast.error(result.message);
        }

        setBusy(p => false);
    }

    return (
        <Modal show={modalOpen} onClose={handleClose}>
            <Modal.Header>Remover leitor</Modal.Header>
            <Modal.Body>
                Deseja realmente remover este leitor?
            </Modal.Body>
            <Modal.Footer className="justify-end">
                <Button size="sm" type="button" isProcessing={busy} disabled={busy} onClick={handleDelete}>
                    Remover
                </Button>
                <Button size="sm" color="gray" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}