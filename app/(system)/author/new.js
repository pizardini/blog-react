'use client'

import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, TextInput, Textarea, Radio, Datepicker } from "flowbite-react";
import DatePicker from "react-datepicker";
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
        setPassword(newPass);
        setValue("password", newPass);
      }

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            nickname: '',
            email: '',
            birthDate: '',
            password: '',
            // token: '',
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

        console.log(data)
    }

    const closeModal = () => {
        reset({
            name: '',
            nickname: '',
            email: '',
            birthDate: new Date(),
            password: '',
            // token: '',
            active: 'true'
        })
        setModalOpen(false);
    }

    const handleChange = (dateChange) => {
        setValue("dateOfBirth", dateChange, {
          shouldDirty: true
        });
        setDate(dateChange);
      };

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
                                {/* <Radio id="active" {...register("active", { required: true })} value="true" /> */}
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