'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, TextInput, Textarea, Radio } from "flowbite-react"
import { authorSchema } from "./schema";
import { AuthorContext } from "./context";
import { toast } from "react-toastify";
import { HiMail } from "react-icons/hi";
import { Obtain } from "./api";

export default function EditAuthor({ id }) {
    const [modalOpen, setModalOpen] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            nickname: '',
            email: '',
            birthdate: null,
            password: '',
            token: '',
            active: 'true'
        },
        resolver: yupResolver(authorSchema),
    });

    const fallbackContext = useContext(AuthorContext);

    const onSubmit = async (data) => {
        setBusy(busy => true);

        const result = { success: false, message: '' };
        console.log('chamar a função de atualização');

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
            birthdate: null,
            password: '',
            token: '',
            active: ''
        })
        setModalOpen(false);
    }

    const getData = async () => {
        setBusy(true);

        const result = await Obtain(id);

        if (result.success) {
            if (result.message !== '')
                toast.success(result.message);

            reset({ 
                name: result.data.name, 
                nickname: result.data.nickname, 
                email: result.data.email, 
                birthdate: result.data.birthdate, 
                password: result.data.password, 
                email: result.data.email,
                active: result.data.active
            });
            console.log(result.data.birthdate)
            console.log(result.data.active)
        }
        else {
            if (result.message !== '')
                toast.error(result.message);
            closeModal();
        }

        setBusy(p => false);
    }

    useEffect(() => {
            getData();
    }, []);

    // useEffect(() => {
    //     if (primeiroAcesso === null)
    //         setPrimeiroAcesso(true);
    
    //     if (primeiroAcesso) {
    //         setPrimeiroAcesso(false);
    //         getData();
    //     }
    // }, [primeiroAcesso]);

    return (
        <Modal show={modalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>Edição de autor</Modal.Header>
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
                        <TextInput id="descricao" icon={HiMail} placeholder="Informe o e-mail" {...register("email")} required/>
                        <span className="text-sm text-red-600">{errors?.email?.message}</span>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="birthdate">Data de Nascimento</Label>
                        <TextInput id="birthdate" {...register("birthdate")} />
                        <span className="text-sm text-red-600">{errors?.birthdate?.message}</span>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="password">Password</Label>
                        <TextInput id="password" type="password" {...register("password")}/>
                        {/* <TextInput id="password" {...register("password")} value={password} onChange={(e) => setPassword(e.target.value)}/> */}
                        {/* <Button type="button" className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md" onClick={randomPass}>Gerar</Button> */}
                        <span className="text-sm text-red-600">{errors?.password?.message}</span>
                    </div>
                    <fieldset className="flex max-w-md flex-col gap-4">
                        <Label htmlFor="active">Status</Label>
                        <div className="flex items-center gap-2">
                            <Radio id="active" {...register("active", { required: true })} value="true" />
                            <Label htmlFor="active">Ativo</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio id="inactive" {...register("active", { required: true })} value="false" />
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
    )
}