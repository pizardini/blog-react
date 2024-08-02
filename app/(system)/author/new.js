'use client'

import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, TextInput, Textarea, Radio, Datepicker } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import { authorSchema } from "./schema";
import { AuthorContext } from "./context";
import { toast } from "react-toastify";
import { Insert } from "./api";
import { HiMail } from "react-icons/hi";

export default function NewAuthor() {
    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [password, setPassword] = useState('');
    const {setValue} = useForm();

    const randomPass = () => {
        const newPass = Math.random().toString(36).slice(-8); // Gera uma senha aleatória
        return newPass
      }

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            nickname: '',
            email: '',
            birthDate: '',
            password: '',
            active: 'true'
        },
        resolver: yupResolver(authorSchema),
    });

    const fallbackContext = useContext(AuthorContext);

    const onSubmit = async (data) => {
        setBusy(busy => true);
        data.password = randomPass();
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
            name: '',
            nickname: '',
            email: '',
            birthDate: new Date(),
            password: '',
            active: 'true'
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
                    <Modal.Header>Novo Autor</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <Label htmlFor="name">Nome</Label>
                            <TextInput id="name" placeholder="Informe o nome do autor" {...register("name")} />
                            <span className="text-sm text-red-600">{errors?.name?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="nickname">Apelido</Label>
                            <TextInput id="nickname" placeholder="Informe o apelido" {...register("nickname")} />
                            <span className="text-sm text-red-600">{errors?.nickname?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="email">E-mail</Label>
                            <TextInput id="email" icon={HiMail} placeholder="Informe o e-mail" {...register("email")} required/>
                            <span className="text-sm text-red-600">{errors?.email?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <TextInput id="birthDate" type="date" {...register("birthDate")}/>
                            <span className="text-sm text-red-600">{errors?.birthDate?.message}</span>
                        </div>
                        <fieldset className="flex max-w-md flex-col gap-4">
                            <Label htmlFor="active">Status</Label>
                            <div className="flex items-center gap-2">
                                <Radio id="active" {...register("active")} type="radio" value="true" />
                                <Label htmlFor="active">Ativo</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio id="inactive" {...register("active")} type="radio" value="false" />
                                <Label htmlFor="inactive">Inativo</Label>
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