'use server'

import LayoutClient from "./layoutclient";
import { dados } from "../login/actions";

export default async function Layout({ children }) {

const usuario = await dados()    

    return (
        <LayoutClient usuario={{nome: usuario.user.name, email: usuario.user.email, admin: usuario.user.type === 0, role: usuario.user.type }}>
        <>
            {children}
        </>
        </LayoutClient>
    )
}