import { useEffect, useState } from 'react';
import type { ToastMessage, ToastType } from './Toast.context.tsx';

const TYPE_STYLES: { [key in ToastType]: { bg: string } } = {
    success: {
        bg: 'bg-green-500',
    },
    error: {
        bg: 'bg-red-500',
    },
    info: {
        bg: 'bg-grey-90',
    },
    warning: {
        bg: 'bg-yellow-500',
    },
};
const MAX_VISIBLE_TOASTS = 3;

interface Props {
    toast: ToastMessage;
    onDismiss: (id: number) => void;
    index: number;
    totalToasts: number;
}

const Toast = ({ toast, onDismiss, index, totalToasts }: Props) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const stackIndex = totalToasts - 1 - index;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(toast.id), 300); // 애니메이션 시간과 동일하게
        }, toast.duration);

        return () => clearTimeout(exitTimer);
    }, [toast, onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    const scale = Math.max(0, 1 - stackIndex * 0.05);
    const yOffset = -stackIndex * 12;
    const zIndex = totalToasts - stackIndex;

    let opacity = 0;
    let transform = `scale(${scale}) translateY(calc(${yOffset}px + 50%))`;

    if (isVisible && !isExiting && stackIndex < MAX_VISIBLE_TOASTS) {
        opacity = 1;
        transform = `scale(${scale}) translateY(${yOffset}px)`;
    }
    if (isExiting) {
        opacity = 0;
        transform = `scale(${scale * 0.95}) translateY(${yOffset}px)`;
    }

    const dynamicStyles = {
        transform,
        opacity,
        zIndex,
    };

    const { bg } = TYPE_STYLES[toast.type];

    return (
        <div
            className={`duration-250 absolute flex items-center rounded-[4px] px-[16px] py-[13px] text-white shadow-lg transition-all ease-in-out ${bg}`}
            style={dynamicStyles}
            role="alert"
        >
            <p className="text-r16 flex-1 whitespace-nowrap">{toast.message}</p>
            {toast.showCloseButton && (
                <button
                    onClick={handleDismiss}
                    className="cursor-pointer border-none bg-transparent p-0 text-current opacity-80 hover:opacity-100"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
export default Toast;
