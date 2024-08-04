'use server'

import Author from "./page";
import { dados } from "@/app/login/actions";

export default async function Layout({ children }) {

const usuario = await dados()    
    return (
        <Author usuario={{id: usuario.user.id, admin: usuario.user.type === 0 }}>
        <>
            {children}
        </>
        </Author>
    )
}