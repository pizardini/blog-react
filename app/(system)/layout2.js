'use server'

import LayoutClient from "./layoutclient";
import { dados } from "../login/actions";

export default async function Layout2({ children }) {

    

    return (
        // <LayoutClient usuario={{nome: usuario.user.name, email: usuario.user.email, admin: usuario.user.tipo === 1 }}>
        <>
            {children}
        </>
        // </LayoutClient>
    )
}