import { createContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast.tsx';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    showCloseButton?: boolean;
}

interface ToastContextValue {
    showToast: (
        message: string,
        type: ToastMessage['type'],
        options?: { duration?: number; showCloseButton?: boolean },
    ) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (
            message: string,
            type: ToastMessage['type'],
            options: { duration?: number; showCloseButton?: boolean } = {},
        ) => {
            const { duration = 3000, showCloseButton = false } = options;
            const id = Date.now();
            setToasts((prevToasts) => [...prevToasts, { id, message, type, duration, showCloseButton }]);
        },
        [],
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div className="z-9999 fixed bottom-[80px] left-1/2 flex -translate-x-1/2 flex-col items-center">
                    {toasts.map((toast, index) => (
                        <Toast
                            key={toast.id}
                            toast={toast}
                            onDismiss={removeToast}
                            index={index}
                            totalToasts={toasts.length}
                        />
                    ))}
                </div>,
                document.body,
            )}
        </ToastContext.Provider>
    );
};
export { ToastProvider };
