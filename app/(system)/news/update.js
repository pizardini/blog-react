'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, TextInput, Textarea, Radio  } from "flowbite-react"
import { HiPlus } from "react-icons/hi";
import { newsSchema } from "./schema";
import { NewsContext } from "./context";
import { toast } from "react-toastify";
import { Obtain, Update } from "./api";
import { List } from "../author/api";

export default function EditNews({ id }) {
    const [modalOpen, setModalOpen] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            headline: '',
            subhead: '',
            text: '',
            publicationDateTime: '',
            lastUpdate: '',
            authorId: '',
            published: '',
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
        data.id = id;
        const result = await Update(data);

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
        fallbackContext.close();
    }

    const getData = async () => {
        setBusy(true);

        const result = await Obtain(id);

        if (result.success) {
            if (result.message !== '')
                toast.success(result.message);
                
            let input = result.data.publicationDateTime;
            let dateTime = new Date(input);
            let formattedDate = dateTime.toISOString().split('T')[0];
            reset({ 
                headline: result.data.headline,
                subhead: result.data.subhead,
                text: result.data.text,
                publicationDateTime: formattedDate,
                lastUpdate: result.data.lastUpdate,
                authorId: result.data.authorId,
                published: result.data.published,
            });
        }
        else {
            if (result.message !== '')
                toast.error(result.message);
            closeModal();
        }

        setBusy(p => false);
    }

    useEffect(() => {
        if (primeiroAcesso === null)
            setPrimeiroAcesso(true);

        if (primeiroAcesso) {
            setPrimeiroAcesso(false);
            getData();
        }
    }, [primeiroAcesso]);

    return (
            <Modal show={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>Edição de Notícia</Modal.Header>
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
    )
}