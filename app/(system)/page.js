'use client'

import { useEffect, useState } from "react";
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Feed } from "./news/api";
import Link from "next/link";

export default function Home() {

    const [update, setUpdate] = useState(true);
    const [data, setData] = useState(null);

    const updateList = async () => {
        const result = await Feed();
        const adjustToGMT3 = (dateString) => {
            const date = new Date(dateString);
            const offset = -3; // GMT-3
            date.setHours(date.getHours() + offset);
            return date.toLocaleString('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
    };

        if (result.success && result.data !== null) {
            let grid = result.data.map((p) => {
                const publicationDateTime = adjustToGMT3(p.publicationDateTime);
                return (
                    <Timeline.Item key={p.id}>
                        <Timeline.Point />
                        <Timeline.Content>
                            <div><Timeline.Time>{publicationDateTime}</Timeline.Time></div>
                            <Timeline.Title as={Link} href={`/news/${p.id}`} color="gray" id={p.id} style={{ color: 'black' }}>{p.headline}</Timeline.Title>
                            <Timeline.Body>
                                {p.subhead}
                            </Timeline.Body>
                            {/* <Button as={Link} href={`/news/${p.id}`} color="gray"> */}
                            {/* <Button as={Link} href={`/news/${p.id}`} active={route === `/news/${p.id}`} color="gray" id={p.id}> */}
                            <Button as={Link} href={`/news/${p.id}`} color="gray" id={p.id}>
                            Detalhes
                            <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        </Timeline.Content>
                    </Timeline.Item>
                );
            });
            setData(grid);
        }
    }

    useEffect(() => {
        if (update === null) 
            setUpdate(true);
        else if (update) {
            updateList();
            setUpdate(p => false);
        }
    }, [update])
    

    return (
        <Timeline>
            {data}
        </Timeline>
    )
}