'use client'

import { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { List } from "./news/api";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Home() {
    const route = usePathname();

    const [update, setUpdate] = useState(true);
    const [data, setData] = useState(null);

    const updateList = async () => {
        const result = await List();
    
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
                            <Timeline.Time>{publicationDateTime}</Timeline.Time>
                            <Timeline.Title style={{ color: 'black' }}>{p.headline}</Timeline.Title>
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