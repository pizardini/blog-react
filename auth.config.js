export const authConfig = {
    pages: {
        signIn: '/login',
    }, callbacks: {
        authorized({ auth, request: { nextUrl } }) {

            const isLoggedIn = !!auth?.user;

            //Se não estiver autenticado, vai para a tela de login
            if (!isLoggedIn)
                return false;

            //Se tentar acessar a tela de login, vai pra tela principal
            if (nextUrl.pathname.startsWith('/login'))
                return Response.redirect(new URL('/', nextUrl));

            //Retorna verdadeiro para todos os outros casos
            return true;
        }
    },
    providers: []
}