'use client';
import { useEffect, useState } from 'react';
import { CommentsFromNews, AddReaction, ListByNews } from './api';
import { usePathname } from 'next/navigation';
import { Button } from 'flowbite-react';
import { Obtain } from '../../news/api';
import Link from 'next/link';

export default function NewsDetails({ usuario }) {
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(true);

    useEffect(() => {
        if (primeiroAcesso) {
            getData();
            setPrimeiroAcesso(false);
        }
    }, [primeiroAcesso]);

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    useEffect(() => {
        if (news) {
            getReactions();
        }
    }, [news]);

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
    };

    const getReactions = async () => {
        setLikes(0);
        setDislikes(0);
        const result3 = await ListByNews(id);
        if (result3.success) {
            let likesCount = 0;
            let dislikesCount = 0;
            result3.data.forEach(reaction => {
                if (reaction.type === 1) {
                    likesCount++;
                } else if (reaction.type === 2) {
                    dislikesCount++;
                }
            });
            setLikes(likesCount);
            setDislikes(dislikesCount);
        }
    };

    const handleReaction = async (type) => {
        setBusy(true);
        const result = await AddReaction(id, type, usuario.id);
        if (result.success) {
            getReactions();
        }
        setBusy(false);
        getReactions();
    };

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
                    </div>
                    <div>
                        <Button onClick={() => handleReaction(2)}>Dislike</Button>
                    </div>

                    <p>Likes: {likes}</p>
                    <p>Dislikes: {dislikes}</p>

                    <Button as={Link} href="/" color="gray">
                        Voltar
                    </Button>
                </>
            ) : <p>Notícia não encontrada</p>}
        </div>
    );
}
