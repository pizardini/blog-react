'use server'

import Author from "./page";
import { dados } from "@/app/login/actions";

export default async function Layout({ children }) {

    const usuario = await dados();

    const getUsuarioProps = (usuario) => {
        if (!usuario) return null;
        return {
            id: usuario.user.id,
            admin: usuario.user.type === 0
        };
    };

    return (
        <Author usuario={getUsuarioProps(usuario)}>
            {children}
        </Author>
    );
}
