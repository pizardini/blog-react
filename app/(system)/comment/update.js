'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, TextInput, Textarea, Radio  } from "flowbite-react"
import { commentSchema } from "./schema";
import { CommentContext } from "./context";
import { toast } from "react-toastify";
import { Obtain, Update } from "./api";
import { ListReaders } from "../reader/api";
import { List } from "../news/api";

export default function EditComment({ id }) {
    const [modalOpen, setModalOpen] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            readerId: '',
            newsId: '',
            content: '',
            datePublished: '',
        },
        // resolver: yupResolver(commentSchema),
    });

    const fallbackContext = useContext(CommentContext);

    const [readersList, setReadersList] = useState(null);
    const [newsList, setNewsList] = useState(null);
    
    const updateListReaders = async () => {
        const result = await ListReaders();
        if (result.success && result.data !== null && result.data.length > 0) {
            let grid = result.data.map((p) =>
                <option key={p.id} value={p.id}>{p.name}</option>
            )

            grid.unshift(<option key={0} value=''>[Escolha]</option>)
            setReadersList(grid);
        }
    }

    const updateListNews = async () => {
        const result = await List();
        if (result.success && result.data !== null && result.data.length > 0) {
            let grid = result.data.map((p) =>
                <option key={p.id} value={p.id}>{p.headline}</option>
            )

            grid.unshift(<option key={0} value=''>[Escolha]</option>)
            setNewsList(grid);
        }
    }

    useEffect(() => {
        if (modalOpen) {
            updateListReaders();
            updateListNews();
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
            readerId: '',
            newsId: '',
            content: '',
            datePublished: new Date(),
        })
        setModalOpen(false);
    }

    const getData = async () => {
        setBusy(true);

        const result = await Obtain(id);

        if (result.success) {
            if (result.message !== '')
                toast.success(result.message);
                
            let input = result.data.datePublished;
            let dateTime = new Date(input);
            let formattedDate = dateTime.toISOString().split('T')[0];
            reset({ 
                readerId: result.data.readerId,
                newsId: result.data.newsId,
                content: result.data.content,
                datePublished: formattedDate,
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
                    <Modal.Header>Novo Comentário</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <Label htmlFor="reader">Leitor</Label>
                            <Select id="reader" {...register("readerId")}>
                                {readersList}
                            </Select>
                            <span className="text-sm text-red-600">{errors?.readerId?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="news">Notícia</Label>
                            <Select id="news" {...register("newsId")}>
                                {newsList}
                            </Select>
                            <span className="text-sm text-red-600">{errors?.newsId?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="content">Comentário</Label>
                            <Textarea id="content" placeholder="Informe o conteúdo do comentário" {...register("content")} />
                            <span className="text-sm text-red-600">{errors?.content?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="datePublished">Última alteração</Label>
                            <TextInput id="datePublished" type="date" {...register("datePublished")}/>
                            <span className="text-sm text-red-600">{errors?.datePublished?.message}</span>
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
    )
}