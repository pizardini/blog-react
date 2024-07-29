import * as yup from "yup";

export const reactionSchema = yup.object({
    authorId: yup.number()
        .typeError('O autor é obrigatório')
        .required('O autor é obrigatório'),
    newsId: yup.number()
        .typeError('A notícia é obrigatório')
        .required('A notícia é obrigatório'),
    type: yup.number()
        .typeError('O tipo é obrigatório')
        .required('O tipo é obrigatório'),
    
}).required();