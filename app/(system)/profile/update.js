'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { UserContext } from "./context";
import { toast } from "react-toastify";
import { HiMail } from "react-icons/hi";
import { Obtain, Update } from "./api";

export default function EditUser({ id }) {
    const [modalOpen, setModalOpen] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);
    

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            nickname: '',
            email: '',
            birthDate: '',
            password: '',
        },
        // resolver: yupResolver(authorSchema),
    });

    const fallbackContext = useContext(UserContext);

    const onSubmit = async (data) => {
        setBusy(true);
        data.id = id;
        data.nickname = "teste";
        const resultado = await Update(data);

        if (resultado.success) {
            closeModal();
            fallbackContext.update(true);

            if (resultado.message !== '')
                toast.success(resultado.message);
        } else {
            if (resultado.message !== '')
                toast.error(resultado.message);
        }

        setBusy(false);
    }

    const closeModal = () => {
        reset({
            name: '',
            nickname: '',
            email: '',
            birthDate: new Date(),
            password: '',
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
                
            let input = result.data.birthDate;
            let dateTime = new Date(input);
            let formattedDate = dateTime.toISOString().split('T')[0];
            console.log(result.data)
            reset({ 
                name: result.data.name, 
                nickname: result.data.nickname, 
                email: result.data.email, 
                birthDate: formattedDate, 
                password: result.data.password, 
                email: result.data.email,
            });
        } else {
            if (result.message !== '')
                toast.error(result.message);
            closeModal();
        }

        setBusy(false);
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
                <Modal.Header>Edição de Dados</Modal.Header>
                <Modal.Body>
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
