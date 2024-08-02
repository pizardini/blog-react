import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { Autenticar } from './app/login/api';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({

            async authorize(credentials) {
                const resultado = await Autenticar(credentials);
                if(resultado.success) {
                    return resultado.data;
                }
                else {
                    return null;
                }
            },
            
        })
    ],
});