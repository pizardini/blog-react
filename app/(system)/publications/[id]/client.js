'use client'

import { useEffect, useState } from "react"
import { ListNewsAuthor, Obtain, Update } from "../../news/api";
import { Spinner, Table, Button } from "flowbite-react";
import { NewsContext } from "../../news/context";
import NewPublication from "./new";

export default function Publications({ id }) {

    const [busy, setBusy] = useState(false);
    const [lista, setLista] = useState(null);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);
    const [update, setUpdate] = useState(true);

    let modal = null;

    const closeModals = () => {
        setOperation({ id: null, action: null})
    }

    const obterDados = async () => {
        setBusy(true);
        const lista = await ListNewsAuthor(id);
        if (lista.success) {
            let grid = lista.data.map((p) =>
                <Table.Row key={p.id}>
                    <Table.Cell>{p.headline}</Table.Cell>
                    <Table.Cell>{p.subhead}</Table.Cell>
                    <Table.Cell>{p.published ? "Publicado em:" : "Não Publicado"}</Table.Cell>
                    <Table.Cell>{p.published ? new Date(p.publicationDateTime).toLocaleString() : <Button onClick={() => publishNews(p.id)}>Publicar</Button>}</Table.Cell>
                </Table.Row>
            );
            setLista(grid);
        }
        setBusy(p => false);
    }

    const publishNews = async (newsId) => {
        setBusy(true);
        const result = await Obtain(newsId);
        result.data.published = true;
        result.data.publicationDateTime = new Date();
        result.data.id = newsId;
        console.log(result.data.id);
        const response = await Update(result.data);
        if (response.success) {
            obterDados(); // Re-obter os dados para atualizar a lista
        } else {
            // Lidar com erro, exibir mensagem, etc.
            console.error("Erro ao atualizar a publicação");
        }
        setBusy(false);
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
            <NewsContext.Provider value={{update: setUpdate, close: closeModals, id}}>
                <NewPublication />
                {modal}
            </NewsContext.Provider>
            {busy && <Spinner />}
            {busy || <div className="mt-2">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Título</Table.HeadCell>
                        <Table.HeadCell>Subtítulo</Table.HeadCell>
                        <Table.HeadCell>Publicada</Table.HeadCell>
                        <Table.HeadCell><span>&nbsp;</span></Table.HeadCell>
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