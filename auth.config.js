import { Obter } from "./app/login/api";

const adminPaths = ['/reader', '/news', '/comment'];
const authorPaths = ['/publications'];
export const authConfig = {
    pages: {
        signIn: '/login',
    }, callbacks: {
        authorized({ auth, request: { nextUrl } }) {

            if (nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/list') || nextUrl.pathname === '/author') {
                return true;
            }
            const isLoggedIn = !!auth?.user;

            //Se não estiver autenticado, vai para a tela de login
            if (!isLoggedIn)
                return false;

            //Se tentar acessar a tela de login, vai pra tela principal
            if (nextUrl.pathname.startsWith('/login'))
                return Response.redirect(new URL('/', nextUrl));

            if (nextUrl.pathname.startsWith(adminPaths)) {
                if (auth.user.type == 0)
                    return true;
                else
                    return false;
            }

            if (nextUrl.pathname.startsWith(authorPaths)) {
                if (auth.user.type == 0 || auth.user.type == 1)
                    return true;
                else
                    return false;
            }

            //Retorna verdadeiro para todos os outros casos
            return true;
        },

        async session({ session }) {
            const user = await Obter(session.user);
            session.user.type = user.data.type;
            session.user.active = user.data.active;
            session.user.id = user.data.id;
            session.user.birthdate = user.data.birthDate;
            return session;
        }
    },
    providers: []
}