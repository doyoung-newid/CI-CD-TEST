import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'src/locales';
import '@/styles/global.css';
import '@plitvice/ui/styles/global.css';
import AppRouter from '@/app/router.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
            </QueryClientProvider>
        </I18nextProvider>
    </StrictMode>,
);
