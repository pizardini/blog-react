'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, TextInput, Textarea, Radio  } from "flowbite-react"
import { HiPlus } from "react-icons/hi";
import { newsSchema } from "./schema";
import { NewsContext } from "./context";
import { toast } from "react-toastify";
import { Insert } from "./api";
import { List } from "../author/api";

export default function NewNews() {
    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            headline: '',
            subhead: '',
            text: '',
            publicationDateTime: '',
            lastUpdate: '',
            authorId: '',
            published: false,
        },
        resolver: yupResolver(newsSchema),
    });

    const fallbackContext = useContext(NewsContext);

    const [newsList, setNewsList] = useState(null);

    const updateListAuthors = async () => {
        const result = await List();
        if (result.success && result.data !== null && result.data.length > 0) {
            let grid = result.data.map((p) =>
                <option key={p.id} value={p.id}>{p.name}</option>
            )

            grid.unshift(<option key={0} value=''>[Escolha]</option>)
            setNewsList(grid);
        }
    }

    useEffect(() => {
        if (modalOpen) {
            updateListAuthors();
        }
    }, [modalOpen])

    const onSubmit = async (data) => {
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
                <span>Novo</span>
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
                        <div className="mb-2">
                            <Label htmlFor="author">Autor</Label>
                            <Select id="author" {...register("authorId")}>
                                {newsList}
                            </Select>
                            <span className="text-sm text-red-600">{errors?.authorId?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="publicationDateTime">Data de Publicação</Label>
                            <TextInput id="publicationDateTime" type="date" {...register("publicationDateTime")}/>
                            <span className="text-sm text-red-600">{errors?.publicationDateTime?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="lastUpdate">Última alteração</Label>
                            <TextInput id="lastUpdate" type="datetime-local" {...register("lastUpdate")}/>
                            <span className="text-sm text-red-600">{errors?.lastUpdate?.message}</span>
                        </div>
                        <fieldset className="flex max-w-md flex-col gap-4">
                            <Label htmlFor="published">Status</Label>
                            <div className="flex items-center gap-2">
                                <Radio id="active" {...register("published")} type="radio" value="true" />
                                <Label htmlFor="active">Publicado</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="inactive" {...register("published")} type="radio" value="false" />
                                <Label htmlFor="inactive">Não Publicado</Label>
                            </div>
                            <span className="text-sm text-red-600">{errors?.active?.message}</span>
                        </fieldset>
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