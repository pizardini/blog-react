'use client'

import NewAuthor from "./new"
import { AuthorContext } from "./context"
import { useEffect, useState } from "react"

export default function Author() {

    const updateList = async () => {
        console.log('Lista atualizada')
    }

    const [update, setUpdate] = useState(true);

    useEffect(() => {
        if (update) {
            updateList();
            setUpdate(p => false);
        }
    }, [update])

    return(
        <>
            <p className="text-2xl">Autores</p>
            <p className="text-sm">Aqui serão listados os autores cadastrados no sistema</p>
            <AuthorContext.Provider value={{update: setUpdate}}>
            <NewAuthor />
            </AuthorContext.Provider>
        </>
    )
}