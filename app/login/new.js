'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { newUserSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Modal, Select, TextInput, Textarea } from "flowbite-react"
import { toast } from "react-toastify";
import { Insert } from "../(system)/reader/api";

const crypto = require('crypto');

function createSHA256Hash(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

export default function NewUser() {

    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
        // resolver: yupResolver(newUserSchema),
    });

    const onSubmit = async (data) => {
        setBusy(busy => true);

        data.password = createSHA256Hash(data.password + 'khadfhyf388');
        const resultado = await Insert(data);
        if (resultado.success) {
            closeModal();

            if (resultado.message !== '')
                toast.success(resultado.message);
        }
        else {
            if (resultado.message !== '')
                toast.error(resultado.message);
        }

        setBusy(busy => false);
    }

    const closeModal = () => {
        reset({
            name: '',
            email: '',
            password: ''
        })
        setModalOpen(false);
    }

    return (
        <>
            <span className="text-gray-800 dark:text-gray-400 text-sm cursor-pointer" onClick={() => { setModalOpen(true) }}>Clique aqui para registrar um novo usuário</span>

            <Modal show={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>Novo Usuário</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <Label htmlFor="name">Nome</Label>
                            <TextInput id="name" placeholder="Informe o nome do usuário" {...register("name")} />
                            <span className="text-sm text-red-600">{errors?.name?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="email">E-mail</Label>
                            <TextInput id="email" placeholder="Informe o e-mail do usuário" {...register("email")} />
                            <span className="text-sm text-red-600">{errors?.email?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="senha">Senha</Label>
                            <TextInput id="senha" type="password" placeholder="Informe a senha do usuário" {...register("password")} />
                            <span className="text-sm text-red-600">{errors?.password?.message}</span>
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