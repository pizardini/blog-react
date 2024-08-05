'use client';
import { useEffect, useState } from 'react';
import { CommentsFromNews, AddReaction, ListByNews } from './api';
import { usePathname } from 'next/navigation';
import { Button, Spinner } from 'flowbite-react';
import { Obtain } from '../api';
import { CommentContext } from '../../comment/context';
import { Card } from "flowbite-react";

import Link from 'next/link';
import NewCommentReader from './new';

export default function NewsDetails({ usuario }) {
    const pathname = usePathname();
    const id = pathname.split('/').pop();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(true);
    const [update, setUpdate] = useState(true);
    const [modalOpen, setModalOpen] = useState(true);

    useEffect(() => {
        if (primeiroAcesso) {
            getData();
            setPrimeiroAcesso(false);
        }
    }, [primeiroAcesso]);

    const closeModals = () => {
        setOperation({ id: null, action: null})
    }

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
            {busy ? <Spinner /> : 
            news ? (
                <>
                    <div className="flex justify-center items-center w-screen">
                    <Card className="max-w-sm w-full">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {news.headline}
                        </h2>
                        <h5 className="text-2xl font-normal tracking-tight text-gray-900 dark:text-white">
                        {news.subhead}
                        </h5>
                        <p className="text-gray-900 dark:text-white">{new Date(news.publicationDateTime).toLocaleString('pt-BR')}</p>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                        {news.text}
                        </p>
                        <p className="text-gray-900 dark:text-white">Likes: {likes} Dislikes: {dislikes}</p>
                        <div className="flex gap-2">
                        <Button onClick={() => handleReaction(1)}>Like</Button>
                        <Button onClick={() => handleReaction(2)}>Dislike</Button>
                        </div>
                    </Card>
                    </div>

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

                    <CommentContext.Provider value={{update: setUpdate, close: closeModals, newsId: id, userId: usuario.id }}>
                        <NewCommentReader />
                        {/* {modal} */}
                    </CommentContext.Provider>

                    <Button as={Link} href="/" color="gray">
                        Voltar
                    </Button>
                </>
            ) : <p>Notícia não encontrada</p>}
        </div>
    );
}
