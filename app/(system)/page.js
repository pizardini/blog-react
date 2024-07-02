'use client'

import { toast } from "react-toastify"

export default function Home() {
    return (
        <>
            <p>Página Padrão</p>

            <button onClick={() => {
                toast.success("Mensagem de Sucesso");
            }}>Exemplo de Sucesso</button>

            <button onClick={() => {
                toast.error("Mensagem de Erro");
            }}>Exemplo de Erro</button>
        </>
    )
}