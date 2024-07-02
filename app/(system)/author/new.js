'use client'

import { useContext, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, TextInput, Textarea } from "flowbite-react"
import { HiPlus } from "react-icons/hi";
import { authorSchema } from "./schema";
import { AuthorContext } from "./context";
import { toast } from "react-toastify";
import { Insert } from "./api";

export default function NewAuthor() {
    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [password, setPassword] = useState('');
    const {setValue} = useForm();

    const randomPass = () => {
        const newPass = Math.random().toString(36).slice(-8); // Gera uma senha aleatória de 8 caracteres
        setPassword(newPass);
        setValue("password", newPass);
      }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            nickname: '',
            email: '',
            birthdate: '',
            password: '',
            token: '',
            active: 'true'
        },
        resolver: yupResolver(authorSchema),
    });

    const fallbackContext = useContext(AuthorContext);

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
            name: '',
            nickname: '',
            email: '',
            birthdate: '',
            password: '',
            token: '',
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
                            <TextInput id="descricao" placeholder="Informe o apelido" {...register("nickname")} />
                            <span className="text-sm text-red-600">{errors?.nickname?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="email">E-mail</Label>
                            <TextInput id="descricao" placeholder="Informe o e-mail" {...register("email")} />
                            <span className="text-sm text-red-600">{errors?.email?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="birthdate">Data de Nascimento</Label>
                            <TextInput id="birthdate" {...register("birthdate")} />
                            <span className="text-sm text-red-600">{errors?.birthdate?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="password">Password</Label>
                            <TextInput id="password" {...register("password")}/>
                            {/* <TextInput id="password" {...register("password")} value={password} onChange={(e) => setPassword(e.target.value)}/> */}
                            {/* <Button type="button" className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md" onClick={randomPass}>Gerar</Button> */}
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