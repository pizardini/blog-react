'use client'
import { useEffect, useState } from 'react';
import { Obtain } from '../api';
import { usePathname } from 'next/navigation';
import { Button } from 'flowbite-react';
import Link from "next/link";

export default function NewsDetails() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    const [news, setNews] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    const getData = async () => {
        setBusy(true);
        const result = await Obtain(id);
        if (result.success) {
            setNews(result.data);
        }
        setBusy(false);
    }

    return (
        <div>
            {busy ? <p>Carregando...</p> : 
            news ? (
                <>
                    <h1>{news.headline}</h1>
                    <p>{news.subhead}</p>
                    <p>{new Date(news.publicationDateTime).toLocaleString('pt-BR')}</p>
                    <p>{news.text}</p>
                    <Button as={Link} href="/" color="gray">
                        Voltar
                    </Button>
                </>
            ) : <p>Notícia não encontrada</p>}
            
        </div>
    );
}
