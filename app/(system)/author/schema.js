import * as yup from "yup";
import YupPassword from "yup-password";

export const authorSchema = yup.object({
    name: yup.string()
        .min(3, 'o nome deve possuir no mínimo 3 caracteres')
        .max(100, 'O nome deve possuir no máximo 100 caracteres')
        .required('O nome é obrigatório'),
    nickname: yup.string()
        .min(3, 'o apelido deve possuir no mínimo 3 caracteres'),
    email: yup.string()
        .email()
        .required('O email é obrigatório'),
    birthdate: yup.date().required('Data de Nascimento é obrigatória').nullable(),
    password: yup.string(),
        // .password()
        // .required(),
    token: yup.string(),
        // .token()
    active: yup.bool(),
}).required();