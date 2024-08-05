'use client'
import { Button, Card } from "flowbite-react"
import { useState } from "react";
import EditUser from "./update"
import { UserContext } from "./context";

export default function Profile({ usuario }) {  // Alterado para desestruturar o props

    const [operation, setOperation] = useState({ id: null, action: null });
    const [update, setUpdate] = useState(true);
    const id = usuario.id
    const closeModals = () => {
        setOperation({ id: null, action: null})
    }

    let modal = null;

    if (operation.action === "edit") {
        modal = <EditUser id={operation.id} />
    }

    return (
        <>
            <Card className="max-w-sm text-center flex flex-col items-center">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {usuario.nome}
                </h5>
                {usuario.admin ? null : (
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {usuario.birthdate}
                    </p>
                )}
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {usuario.email}
                </p>
                <UserContext.Provider value={{update: setUpdate, close: closeModals, id}}>
                {usuario.admin ? null : (
                    <Button size="sm" onClick={() => setOperation({ id: usuario.id, action: 'edit' })}>
                        Alterar Dados
                    </Button>
                    
                )}{modal}
                </UserContext.Provider>

            </Card>
            
        </>
    )
}
