import ListClient from "./client"

export default function Page({ params }) {
    return (
        <>
            <p className="text-2xl">Cursos por tipo de curso</p>
            <p className="text-sm">Aqui serão listados todos os cursos do tipo de curso selecionado</p>

            <ListClient nickname={params?.nickname} />
        </>
    )
}