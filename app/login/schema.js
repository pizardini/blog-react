import * as yup from "yup"

export const loginSchema = yup.object({
    email: yup.string()
        .email('Informe um e-mail válido')
        .required('O e-mail é obrigatório'),
    senha: yup.string()
        .required('A senha é obrigatória')
}).required();

export const newUserSchema = yup.object({
    email: yup.string()
        .email('Informe um e-mail válido')
        .required('O e-mail é obrigatório'),
    senha: yup.string()
        .required('A senha é obrigatória'),
    name: yup.string()
        .required('O nome é obrigatório'),
    tipo: yup.number()
        .typeError('O tipo de usuário é obrigatório')
        .required('O tipo de usuário é obrigatório')
}).required();