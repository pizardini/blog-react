'use server'

import Profile from "./page";
import { dados } from "@/app/login/actions";

export default async function Layout({ children }) {

const adjustToGMT3 = (dateString) => {
    const date = new Date(dateString);
    const offset = -3; // GMT-3
    date.setHours(date.getHours() + offset);
    return date.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};
const usuario = await dados()

const data = adjustToGMT3(usuario.user.birthdate)
    return (
        <Profile usuario={{nome: usuario.user.name, 
        email: usuario.user.email, 
        admin: usuario.user.type === 0,
        birthdate: data}}>
        <>
            {children}
        </>
        </Profile>
    )
}