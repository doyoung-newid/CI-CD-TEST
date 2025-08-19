import { createCookieSessionStorage } from 'react-router';

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: '_t',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: [import.meta.env.VITE_SESSION_SECRETS],
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production',
    },
});
