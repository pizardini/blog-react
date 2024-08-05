'use client'
import { Button, Card } from "flowbite-react"
import { useState } from "react";
import EditUser from "./update"  // Importação padrão corrigida

export default function Profile({ usuario }) {  // Alterado para desestruturar o props

    const [operation, setOperation] = useState({ id: null, action: null });

    let modal = null;

    if (operation.action === "edit") {
        modal = <EditUser id={operation.id} />
    }

    return (
        <>
            <Card href="#" className="max-w-sm text-center flex flex-col items-center">
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
                {usuario.admin ? null : (
                    <Button size="sm" onClick={() => setOperation({ id: usuario.id, action: 'edit' })}>
                        Alterar Dados
                    </Button>
                )}
            </Card>
            {modal}
        </>
    )
}
