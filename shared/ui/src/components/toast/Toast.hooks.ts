import { useContext } from 'react';
import { ToastContext } from '@/components/toast/Toast.context.tsx';

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast는 ToastProvider 내부에서 사용해야 합니다.');
    }
    return context;
};
export { useToast };
