'use client'
import { Button, Card } from "flowbite-react"

export default function Profile(usuario) {
        return (
            <Card href="#" className="max-w-sm text-center flex flex-col items-center">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {usuario.usuario.nome}
                </h5>
                { usuario.usuario.admin ? null : <p className="font-normal text-gray-700 dark:text-gray-400">
                    {usuario.usuario.birthdate}
                </p> }
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {usuario.usuario.email}
                </p>
                { usuario.usuario.admin ? null : <Button>Alterar Dados</Button>}
            </Card>
        )
    }