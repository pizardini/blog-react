'use server'

import NewsDetails from "./page";
import { dados } from "@/app/login/actions";

export default async function Layout({ children }) {

const usuario = await dados()    

    return (
        <NewsDetails usuario={{id: usuario.user.id }}>
        <>
            {children}
        </>
        </NewsDetails>
    )
}