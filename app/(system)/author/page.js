'use client'

import NewAuthor from "./new";
import { AuthorContext } from "./context";
import { useEffect, useState } from "react";
import { Button, Spinner, Table } from "flowbite-react";
import { ListQt } from "./api";
import { toast } from "react-toastify";
import RemoveAuthor from "./remove";
import EditAuthor from "./update";
import Link from "next/link";

export default function Author (usuario) {

    const [update, setUpdate] = useState(true);
    const [data, setData] = useState(null);
    const [busy, setBusy] = useState(true);
    const [operation, setOperation] = useState({ id: null, action: null });

    const updateList = async () => {
        setBusy(p => true);
        const result = await ListQt();
    if (result.success && result.data !== null) {
        let grid = result.data.map((p) =>
            <Table.Row key={p.id}>
                <Table.Cell>{p.name}</Table.Cell>    
                <Table.Cell>{p.newscount}</Table.Cell>
                <Table.Cell>
                    <Button as={Link} href={`/list/${p.nickname}`}>Notícias</Button>
                </Table.Cell>
                {usuario?.admin && (
                <Table.Cell>
                    <Button size="sm" onClick={() => { setOperation({ id: p.id, action: 'edit' }) }}>Editar</Button>
                </Table.Cell>
                )}
                {usuario?.admin && (
                <Table.Cell>
                    <Button size="sm" color="failure" onClick={() => { setOperation({ id: p.id, action: 'delete' }) }}>Remover</Button>
                </Table.Cell>
                )}
            </Table.Row>
        );
        setData(grid);

        if (result.message !== '')
            toast.success(result.message);
    }
    else {
        setData(null);
        if (result.message !== '')
            toast.error(result.message);
        }
        setBusy(p => false);
    }

    let modal = null;

    if (operation.action === "edit") {
        modal = <EditAuthor id={operation.id}/>
    }
    else if (operation.action === "delete") {
        modal = <RemoveAuthor id={operation.id}/>
    }

    const closeModals = () => {
        setOperation({ id: null, action: null})
    }

    useEffect(() => {
        if (update === null) 
            setUpdate(true);
        else if (update) {
            updateList();
            setUpdate(p => false);
        }
    }, [update])

    return(
        <>
            <p className="text-2xl">Autores</p>
            {usuario?.admin && (
            <AuthorContext.Provider value={{update: setUpdate, close: closeModals}}>
                <NewAuthor />
                {modal}
            </AuthorContext.Provider>
            )}
            {busy && <Spinner />}
            {busy || <div className="mt-2">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Nome</Table.HeadCell>
                        <Table.HeadCell>
                            Qtd. Notícias
                        </Table.HeadCell>
                        <Table.HeadCell>
                            <span>&nbsp;</span>
                        </Table.HeadCell>
                        <Table.HeadCell>
                            <span>&nbsp;</span>
                        </Table.HeadCell>
                        <Table.HeadCell>
                            <span>&nbsp;</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {data}
                    </Table.Body>
                </Table>
            </div>
            }
        </>
    )
}