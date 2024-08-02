'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, TextInput, Textarea, Radio  } from "flowbite-react"
import { HiPlus } from "react-icons/hi";
import { commentSchema } from "./schema";
import { CommentContext } from "./context";
import { toast } from "react-toastify";
import { Insert } from "./api";
import { ListReaders } from "../reader/api";
import { List } from "../news/api";

export default function NewComment() {
    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            readerId: '',
            newsId: '',
            content: '',
            datePublished: new Date(),
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