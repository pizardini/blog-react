'use client'

import { useEffect, useState } from "react"
import { Pesquisar } from "../../author/api";
import { ListNewsAuthor } from "../../news/api";
import { Spinner } from "flowbite-react";

export default function ListClient({ nickname }) {

    const [busy, setBusy] = useState(false);
    const [dado, setDado] = useState(null);
    const [lista, setLista] = useState(null);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    console.log(nickname);

    const obterDados = async () => {
        setBusy(true);
        const resultado = await Pesquisar({ Nickname: nickname });
        console.log(resultado);
        if (resultado.success && resultado.data.length == 1) {
            setDado(resultado.data[0].nickname);

            const lista = await ListNewsAuthor(resultado.data[0].id);
            if (lista.success) {
                let grid = lista.data.map((p) =>
                    <p key={p.id}>{p.nickname}</p>
                );

                setLista(grid);
            }
        }
        else {
            setDado("Tipo de curso não encontrado");
        }
        setBusy(p => false);
    }

    useEffect(() => {
        if (primeiroAcesso === null)
            setPrimeiroAcesso(true);

        if (primeiroAcesso) {
            setPrimeiroAcesso(false);
            obterDados();
        }
    }, [primeiroAcesso]);

    return (
        <>
            {busy && <Spinner />}
            <div className="mt-2">
                Nome: {dado}
            </div>
            <div>
                Cursos: {lista}
            </div>
        </>
    )
}