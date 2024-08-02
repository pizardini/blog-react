'use client'

import { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { List } from "./news/api";

export default function Home() {

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
                            <Timeline.Title>{p.headline}</Timeline.Title>
                            <Timeline.Body>
                                {p.text}
                            </Timeline.Body>
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