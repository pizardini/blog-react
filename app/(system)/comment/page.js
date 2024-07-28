'use client'

import { useEffect, useState } from "react";
import { CommentContext } from "./context";
import NewComment from "./new";
import { Button, Spinner, Table } from "flowbite-react";
import { List } from "./api";
import RemoveComment from "./remove";
import EditComment from "./update";


export default function Comment() {

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
                <Table.Cell>{p.content}</Table.Cell>
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
        modal = <EditComment id={operation.id}/>
    }
    else if (operation.action === "delete") {
        modal = <RemoveComment id={operation.id}/>
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
            <p className="text-2xl">Comentários</p>
            <CommentContext.Provider value={{update: setUpdate, close: closeModals}}>
                <NewComment />
                {modal}
            </CommentContext.Provider>

            {busy && <Spinner />}
            {busy || <div className="mt-2">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Comentário</Table.HeadCell>
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