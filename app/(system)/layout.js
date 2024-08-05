'use server'

import LayoutClient from "./layoutclient";
import { dados } from "../login/actions";

export default async function Layout({ children }) {

const usuario = await dados()
const getRole = (type) => {
    switch(type) {
        case 0:
            return "Administrador";
        case 1:
            return "Autor";
        case 2:
            return "Leitor";
    }
};

    return (
        <LayoutClient usuario={{nome: usuario.user.name, 
        email: usuario.user.email, 
        admin: usuario.user.type === 0,
        birthDate: usuario.user.birthDate,
        nickname: usuario.user.nickname,
        id: usuario.user.id,
        role: getRole(usuario.user.type) }}>
        <>
            {children}
        </>
        </LayoutClient>
    )
}