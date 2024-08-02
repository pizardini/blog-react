'use server';

import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { noAdmin } from './api';

export async function login(data) {
    try {
        await signIn('credentials', data);
        
    }
    catch(error) {
        // console.log("data: " + JSON.stringify(data, null, 2));
    if(isRedirectError(error))
            throw error;

        return 'E-mail e/ou senha inválido(s)';
    }
}

export async function logout() {
    await signOut();
}

export async function dados() {
    const session = await auth();
    return session;
}

export async function existsAdm() {
    const result = noAdmin();
    return result;
}