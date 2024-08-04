import ListClient from "./client"

export default function Page({ params }) {
    return (
        <>
            <p className="text-2xl">Notícias de {params.nickname}</p>

            <ListClient nickname={params?.nickname} />
        </>
    )
}