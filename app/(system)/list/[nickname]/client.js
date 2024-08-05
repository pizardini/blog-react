'use client'

import { useEffect, useState } from "react"
import { Pesquisar } from "../../author/api";
import { ListNewsAuthor } from "../../news/api";
import { Spinner, Table } from "flowbite-react";

export default function ListClient({ nickname }) {

    const [busy, setBusy] = useState(false);
    const [dado, setDado] = useState(null);
    const [lista, setLista] = useState(null);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);

    const obterDados = async () => {
        setBusy(true);
        const result = await Pesquisar({ Nickname: nickname });
        if (result.success && result.data.length == 1) {
            setDado(result.data[0].nickname);

            const lista = await ListNewsAuthor(result.data[0].id);
            if (lista.success) {
                let grid = lista.data.map((p) =>
                    <Table.Row key={p.id}>
                        <Table.Cell>{p.headline}</Table.Cell>
                        <Table.Cell>{p.subhead}</Table.Cell>
                    </Table.Row>
                );
                setLista(grid);
            }
        }
        else {
            setDado("Autor não encontrado");
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
            {busy || <div className="mt-2">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Título</Table.HeadCell>
                        <Table.HeadCell>Subtítulo</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {lista}
                    </Table.Body>
                </Table>
                </div>
            }
        </>
    )
}