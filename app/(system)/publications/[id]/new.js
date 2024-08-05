'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, TextInput, Textarea  } from "flowbite-react"
import { HiPlus } from "react-icons/hi";
import { newsSchema } from "../../news/schema";
import { NewsContext } from "../../news/context";
import { toast } from "react-toastify";
import { Insert } from "../../news/api";

export default function NewPublication() {

    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            headline: '',
            subhead: '',
            text: '',
            publicationDateTime: new Date(),
            lastUpdate: new Date(),
            authorId: '',
            published: false,
        },
        // resolver: yupResolver(newsSchema),
    });

    const fallbackContext = useContext(NewsContext);

    const onSubmit = async (data) => {
        data.authorId = fallbackContext.id;
        setBusy(busy => true);
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
            headline: '',
            subhead: '',
            text: '',
            publicationDateTime: new Date(),
            lastUpdate: new Date(),
            authorId: '',
            published: null,
        })
        setModalOpen(false);
    }

    return (
        <>
            <Button onClick={() => { setModalOpen(true) }}>
                <HiPlus className="mr-1 h-5 w-5" />
                <span>Publicar</span>
            </Button>
            <Modal show={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>Nova Notícia</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <Label htmlFor="headline">Título</Label>
                            <TextInput id="headline" placeholder="Informe o título" {...register("headline")} />
                            <span className="text-sm text-red-600">{errors?.headline?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="subhead">Subtítulo</Label>
                            <TextInput id="subhead" placeholder="Informe o subtítulo" {...register("subhead")} />
                            <span className="text-sm text-red-600">{errors?.subhead?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="text">Corpo da notícia</Label>
                            <Textarea id="text" placeholder="Informe o corpo da notícia" {...register("text")} />
                            <span className="text-sm text-red-600">{errors?.text?.message}</span>
                        </div>
                        {/* <div className="mb-2">
                            <Label htmlFor="author">Autor</Label>
                            <Select id="author" {...register("authorId")}>
                                {newsList}
                            </Select>
                            <span className="text-sm text-red-600">{errors?.authorId?.message}</span>
                        </div> */}
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