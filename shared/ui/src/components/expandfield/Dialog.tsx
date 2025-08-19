import { ReactNode, useEffect } from 'react';

interface Props {
    width?: number;
    height?: number;
    open: boolean;
    onClose: () => void;
    onTransitionEnd?: () => void;
    children: ReactNode;
    className?: string;
}

export const Dialog = ({
    width = 400,
    height = 400,
    open,
    onClose,
    onTransitionEnd,
    children,
    className = '',
}: Props) => {
    const sizeStyle = {
        width: width > 0 ? `${width}px` : 'fit-content',
        height: height > 0 ? `${height}px` : 'fit-content',
    };

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (open) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [open, onClose]);

    return (
        <div
            className={`fixed inset-0 z-[910] flex items-center justify-center transition-opacity duration-300 ease-in-out ${open ? 'pointer-events-auto bg-[rgba(0,0,0,0.5)] opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={onClose}
        >
            <div
                className={`bg-grey-5 transform rounded-[4px] shadow-xl transition-all duration-300 ease-in-out ${className} ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                style={{ ...sizeStyle }}
                onClick={(e) => e.stopPropagation()}
                onTransitionEnd={() => {
                    if (!open && onTransitionEnd) {
                        onTransitionEnd();
                    }
                }}
            >
                {children}
            </div>
        </div>
    );
};
