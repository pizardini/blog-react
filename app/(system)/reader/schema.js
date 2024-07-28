import * as yup from "yup";

export const readerSchema = yup.object({
    name: yup.string()
        .min(3, 'o nome deve possuir no mínimo 3 caracteres')
        .max(100, 'O nome deve possuir no máximo 100 caracteres')
        .required('O nome é obrigatório'),
    email: yup.string()
        .email()
        .required('O email é obrigatório'),
    active: yup.bool(),
}).required();