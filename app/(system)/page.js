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

        if (result.success && result.data !== null) {
            let grid = result.data.map((p) =>
                <Timeline.Item key={p.id}>
                    <Timeline.Point />
                    <Timeline.Content>
                        <Timeline.Time>{p.publicationDateTime}</Timeline.Time>
                        <Timeline.Title>{p.headline}</Timeline.Title>
                        <Timeline.Body>
                            {p.text}
                        </Timeline.Body>
                    </Timeline.Content>
                </Timeline.Item>
            );
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