'use client';
import { useEffect, useState } from 'react';
import { CommentsFromNews, AddReaction } from './api';
import { usePathname } from 'next/navigation';
import { Button } from 'flowbite-react';
import { Obtain } from '../../news/api';
import Link from 'next/link';

export default function NewsDetails({usuario}) {
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [busy, setBusy] = useState(false);
    //próximo passo é passar o id do usuário para este componente
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
            setLikes(result.data.likes);
            setDislikes(result.data.dislikes);
        }
        if (result2.success) {
            setComments(result2.data);
        }
        setBusy(false);
    }

    const handleReaction = async (type) => {
        setBusy(true);
        const result = await AddReaction(id, type, usuario.id);
        console.log(result)
        if (result.success) {
            setLikes(result.data.likes);
            setDislikes(result.data.dislikes);
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

                    {comments.length > 0 ? (
                        <div>
                            <h2>Comentários:</h2>
                            <ul>
                                {comments.map(comment => (
                                    <li key={comment.id}>
                                        <p>
                                            <strong>{comment.readerComment.name}</strong> 
                                            ({new Date(comment.datePublished).toLocaleString('pt-BR')}): 
                                            {comment.content}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Sem comentários.</p>
                    )}

                    <div>
                        <Button onClick={() => handleReaction(1)}>Like</Button>
                        <Button onClick={() => handleReaction(2)}>Dislike</Button>
                    </div>
                    <div>
                        {/* <p>Likes: {likes}</p>
                        <p>Dislikes: {dislikes}</p> */}
                    </div>

                    <Button as={Link} href="/" color="gray">
                        Voltar
                    </Button>
                </>
            ) : <p>Notícia não encontrada</p>}
        </div>
    );
}
