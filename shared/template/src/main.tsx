import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locale';
import App from './App.tsx';
import '@plitvice/ui/styles/global.css';
import { ToastProvider } from '@plitvice/ui';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <ToastProvider>
                <App />
            </ToastProvider>
        </I18nextProvider>
    </StrictMode>,
);
