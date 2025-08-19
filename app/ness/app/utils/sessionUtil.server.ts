import { LoaderFunctionArgs, SessionData } from 'react-router';

import { COOKIE, ENCRYPT_KEY } from '@/types/enum';

import { commitSession, getSession } from '@/session.server';

export const getSessionData = async ({ request }: LoaderFunctionArgs): Promise<SessionData> => {
    const url = new URL(request.url);
    const session = await getSession(request.headers.get(COOKIE));
    const urlEncryptKey = url.searchParams.get(ENCRYPT_KEY);

    if (urlEncryptKey) {
        session.set(ENCRYPT_KEY, urlEncryptKey);
        const cookie = await commitSession(session);
        return { userEncryptKey: urlEncryptKey, cookie };
    }

    return { userEncryptKey: session.get(ENCRYPT_KEY) as string, cookie: null };
};
