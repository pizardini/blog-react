import * as yup from "yup";

export const commentSchema = yup.object({
    headline: yup.string()
        .min(3, 'o título deve possuir no mínimo 3 caracteres')
        .max(100, 'O título deve possuir no máximo 100 caracteres')
        .required('O título é obrigatório'),
    subhead: yup.string()
        .min(3, 'o subtítulo deve possuir no mínimo 3 caracteres'),
    text: yup.string()
        .required('O corpo é obrigatório'),
    publicationDateTime: yup.date()
        .nullable(),
    lastUpdate: yup.date()
        .nullable(),
    authorId: yup.number()
        .typeError('O autor é obrigatório')
        .required('O autor é obrigatório'),
    published: yup.bool(),
    
}).required();