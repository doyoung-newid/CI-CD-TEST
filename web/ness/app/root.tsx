import { ReactNode, useMemo } from 'react';

import { I18nextProvider, useTranslation } from 'react-i18next';
import {
    data,
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useLocation,
    useNavigate,
} from 'react-router';

import { TFunction } from 'i18next';

import { ToastProvider } from '@plitvice/ui';
import { SideNavBar } from '@plitvice/ui/components/navigation/SideNavBar.tsx';
import { SideNavSection } from '@plitvice/ui/components/navigation/sideNavBar.types.ts';

import '@plitvice/ui/styles/global.css';

import FileUploadPage from '@/routes/fileUpload';

import { GlobalLoading } from '@/components';

import i18n from '@/locales';

import { commonLoader } from './middleware/auth.server.ts';

import type { Route } from './+types/root';

export const ROOT_ROUTE_ID = 'root';

export const loader = commonLoader(async ({ userEncryptKey }: { userEncryptKey: string }) => {
    return data({ userEncryptKey });
});

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <title>Ness</title>
                <meta charSet="utf-8" />
                <link rel="icon" type="image/svg+xml" href="/ness/favicon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <div className={`bg-blue-600 px-[24px] py-[16px]`}>
                    <a href={`./`}>
                        <img src={`/ness/logo.png`} width={110} height={28} alt={'logo'} />
                    </a>
                </div>
                <div className={'relative grid h-full w-full grid-cols-[240px_1fr] justify-start overflow-hidden'}>
                    {children}
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
};

const App = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userEncryptKey } = useLoaderData();
    const navMapList = useMemo(() => getNavMap(t), [t]);
    const location = useLocation();

    return (
        <I18nextProvider i18n={i18n}>
            <ToastProvider>
                {userEncryptKey !== 'cp' ? (
                    <>
                        <nav className={`h-full overflow-y-auto pb-[48px] pt-[24px]`}>
                            <SideNavBar
                                width={0}
                                sectionList={navMapList}
                                onNavigate={navigate}
                                defaultSelected={location.pathname.slice(1)}
                            />
                        </nav>
                        <main className={'bg-grey-5 border-grey-20 relative h-full w-full overflow-auto border-l'}>
                            <Outlet />
                            <GlobalLoading />
                        </main>{' '}
                    </>
                ) : (
                    <>
                        <main className={`col-span-2 h-full w-full overflow-hidden`}>
                            <FileUploadPage />
                        </main>
                        <GlobalLoading />
                    </>
                )}
            </ToastProvider>
        </I18nextProvider>
    );
};
export default App;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
    const { t } = useTranslation();
    const navMap = useMemo(() => getNavMap(t), [t]);
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <>
            <nav className={`h-full overflow-y-auto pb-[48px] pt-[24px]`}>
                <SideNavBar width={0} sectionList={navMap} onNavigate={(path) => (document.location.href = path)} />
            </nav>
            <main className={'bg-grey-5 border-grey-20 relative h-full w-full border-l'}>
                <h1>{message}</h1>
                <p>{details}</p>
                {stack && (
                    <pre className="w-full p-4">
                        <code>{stack}</code>
                    </pre>
                )}
            </main>
        </>
    );
};

const getNavMap = (t: TFunction): SideNavSection[] => {
    return [
        {
            title: t('nav.home.encoding.title'),
            child: [
                { path: 'file-upload', label: t('nav.home.encoding.fileUpload') },
                { path: 'queue-status', label: t('nav.home.encoding.queueStatus') },
            ],
        },
        {
            title: t('nav.home.operations.title'),
            child: [
                { path: 'server-status', label: t('nav.home.operations.serverStatus') },
                { path: 'preset-list', label: t('nav.home.operations.presetList') },
            ],
        },
    ];
};
