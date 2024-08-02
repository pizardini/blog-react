'use client';
import { useEffect, useState } from 'react';
import { Obtain } from '../api';
import { usePathname } from 'next/navigation';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { CommentsFromNews } from './api';

export default function NewsDetails() {
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    const getData = async () => {
        setBusy(true);
        const result = await Obtain(id);
        const result2 = await CommentsFromNews(id);
        if (result.success) {
            setNews(result.data);
        }
        if (result2.success) {
            setComments(result2.data);
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
                    <br></br>
                    {comments.length > 0 ? (
                        <div>
                            <h2>Comentários:</h2>
                            <ul>
                                {comments.map(comment => (
                                    <li key={comment.id}>
                                        <p><strong>{comment.readerComment.name}</strong> ({new Date(comment.datePublished).toLocaleString('pt-BR')}): {comment.content}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Sem comentários.</p>
                    )}

                    <Button as={Link} href="/" color="gray">
                        Voltar
                    </Button>
                </>
            ) : <p>Notícia não encontrada</p>}
        </div>
    );
}
