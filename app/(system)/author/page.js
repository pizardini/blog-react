'use client'

import NewAuthor from "./new";
import { AuthorContext } from "./context";
import { useEffect, useState } from "react";
import { Button, Spinner, Table } from "flowbite-react";
import { List } from "./api";
import { toast } from "react-toastify";

export default function Author() {

    const updateList = async () => {
        const result = await List();

    if (result.success && result.data !== null) {
        let grid = result.data.map((p) =>
            <Table.Row key={p.id}>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>
                    <Button size="sm">Editar</Button>
                </Table.Cell>
                <Table.Cell>
                    <Button size="sm" color="failure">Remover</Button>
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
    }

    const [update, setUpdate] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (update) {
            updateList();
            setUpdate(p => false);
        }
    }, [update])

    return(
        <>
            <p className="text-2xl">Autores</p>
            <p className="text-sm">Aqui serão listados os autores cadastrados no sistema</p>
            <AuthorContext.Provider value={{update: setUpdate}}>
            <NewAuthor />
            </AuthorContext.Provider>

            <div className="mt-2">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Nome</Table.HeadCell>
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
        </>
    )
}