'use client'

import { useEffect, useState } from "react";
import { NewsContext } from "./context";
import NewNews from "./new";
import { Button, Spinner, Table } from "flowbite-react";
import { List } from "./api";
import RemoveNews from "./remove";
import EditNews from "./update";


export default function News() {

    const [update, setUpdate] = useState(true);
    const [data, setData] = useState(null);
    const [busy, setBusy] = useState(true);
    const [operation, setOperation] = useState({ id: null, action: null });

    const updateList = async () => {

        setBusy(p => true);
        const result = await List();

    if (result.success && result.data !== null) {
        let grid = result.data.map((p) =>
            <Table.Row key={p.id}>
                <Table.Cell>{p.headline}</Table.Cell>
                <Table.Cell>
                <Button size="sm" onClick={() => { setOperation({ id: p.id, action: 'edit' }) }}>Editar</Button>
                </Table.Cell>
                <Table.Cell>
                <Button size="sm" color="failure" onClick={() => { setOperation({ id: p.id, action: 'delete' }) }}>Remover</Button>
                </Table.Cell>
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
        modal = <EditNews id={operation.id}/>
    }
    else if (operation.action === "delete") {
        modal = <RemoveNews id={operation.id}/>
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
            <p className="text-2xl">Notícias</p>
            <NewsContext.Provider value={{update: setUpdate, close: closeModals}}>
                <NewNews />
                {modal}
            </NewsContext.Provider>

            {busy && <Spinner />}
            {busy || <div className="mt-2">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Título</Table.HeadCell>
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