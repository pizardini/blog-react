'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, Textarea, Radio  } from "flowbite-react"
import { HiPlus } from "react-icons/hi";
import { commentSchema } from "../../comment/schema";
import { CommentContext } from "../../comment/context";
import { toast } from "react-toastify";
import { Insert } from "../../comment/api";
// import { ListReaders } from "../reader/api";
// import { List } from "../news/api";

export default function NewCommentReader(usuario) {
    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const fallbackContext = useContext(CommentContext);
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            readerId: '',
            newsId: '',
            content: '',
            datePublished: new Date(),
        },
        // resolver: yupResolver(commentSchema),
    });

    const onSubmit = async (data) => {
        setBusy(busy => true);
        data.readerId = fallbackContext.userId;
        data.newsId = fallbackContext.newsId;
        const result = await Insert(data);
        if (result.success) {
            closeModal();
            fallbackContext.update(true);

            if (result.message !== '')
                toast.success(result.message);
        }
        else {
            if (result.message !== '')
                toast.error(result.message);
        }

        setBusy(busy => false);
    }

    const closeModal = () => {
        reset({
            readerId: '',
            newsId: '',
            content: '',
            datePublished: new Date(),
        })
        setModalOpen(false);
    }

    return (
        <>
            <Button onClick={() => { setModalOpen(true) }}>
                <HiPlus className="mr-1 h-5 w-5" />
                <span>Novo</span>
            </Button>

            <Modal show={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>Novo Comentário</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <Label htmlFor="content">Comentário</Label>
                            <Textarea id="content" placeholder="Informe o conteúdo do comentário" {...register("content")} />
                            <span className="text-sm text-red-600">{errors?.content?.message}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-end">
                        <Button size="sm" type="submit" isProcessing={busy} disabled={busy}>
                            Salvar
                        </Button>
                        <Button size="sm" color="gray" onClick={closeModal}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}