'use client'

import { Button, Label, TextInput } from "flowbite-react";
import { loginSchema } from "./schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import NewUser from "./new";
import { login } from "./actions";
import NewAdmin from "./admin";

const crypto = require('crypto');

function createSHA256Hash(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

export default function Login() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        // resolver: yupResolver(loginSchema),
    });

    const router = useRouter();
    
    const onSubmit = async (data) => {
        data.password = createSHA256Hash(data.password + 'khadfhyf388');
        //requisição à API
        const resultado = await login(data);
        if(resultado && resultado !== ''){
            toast.error(resultado);
        }
        else
        {
            router.push("/");
        }
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} className="text-sm" theme="colored" />
            <div className="flex items-center justify-center h-screen bg-neutral-100 dark:bg-neutral-900">
                <div>
                    <span className="text-black dark:text-white">Bem-vindo ao sistema!</span>
                    <div className="mt-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                            <div className="mb-2">
                                    <Label htmlFor="email" className="text-sm">E-mail</Label>
                                    <TextInput id="email" placeholder="usuario@usuario.com" {...register("email")} />
                                    <span className="text-sm text-red-600">{errors?.email?.message}</span>
                                </div>
                                <div className="mb-2">
                                    <Label htmlFor="senha" className="text-sm">Senha</Label>
                                    <TextInput id="senha" type="password" placeholder="******" {...register("password")} />
                                    <span className="text-sm text-red-600">{errors?.password?.message}</span>
                                </div>
                                <div className="flex justify-center">
                                    <Button type="submit">Entrar</Button>
                                </div>
                                <div className="mt-4">
                                    <NewUser />
                                    <NewAdmin />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}