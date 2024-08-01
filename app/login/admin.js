'use client'

import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { novoAdminSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Modal, Select, TextInput, Textarea } from "flowbite-react"
import { toast } from "react-toastify";
import { Inserir, InserirAdmin } from "./api";
import { existsAdm } from "./actions";


const crypto = require('crypto');

function createSHA256Hash(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

export default function NewAdmin() {

    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
        resolver: yupResolver(newUserSchema),
    });

    const atualizarLista = async () => {
        const resultado = await existsAdm();
        console.log(resultado);
        if (resultado.success && resultado.data !== null) {
            console.log(resultado.data.existe);
            if (resultado.data.existe === false) {
                console.log('redirecionando');
                
                 setModalOpen(true);
            }
        } else {
            toast.error(resultado.message);
        }
        

    }
    
    
    useEffect(() => {
        if (primeiroAcesso === null)
            setPrimeiroAcesso(true);

        if (primeiroAcesso) {
            setPrimeiroAcesso(false);
            atualizarLista();
            

        }
    }, [primeiroAcesso]);

    const onSubmit = async (data) => {
        setBusy(busy => true);
        
        data.senha = createSHA256Hash(data.senha + 'khadfhyf388');
        
        const resultado = await InserirAdmin(data);

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

            <Modal show={modalOpen} >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>Bem vindo! É preciso cadastrar um administrador para utilizar o sistema.</Modal.Header>
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
                            <TextInput id="senha" type="password" placeholder="Informe a senha do usuário" {...register("senha")} />
                            <span className="text-sm text-red-600">{errors?.senha?.message}</span>
                        </div>
                        
                    </Modal.Body>
                    <Modal.Footer className="justify-end">
                        <Button size="sm" type="submit" isProcessing={busy} disabled={busy}>
                            Salvar
                        </Button>
              
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
} 