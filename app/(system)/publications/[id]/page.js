import Publications from "./client"

export default function Page({ params }) {
    return (
        <>
            <p className="text-2xl">Minhas Notícias</p>

            <Publications id={params.id} />
        </>
    )
}