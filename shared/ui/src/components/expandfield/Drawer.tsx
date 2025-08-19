import { ReactNode } from 'react';

interface DrawerProps {
    width?: number;
    open: boolean;
    onClose: () => void;
    onTransitionEnd?: () => void;
    children: ReactNode;
    className?: string;
}

export const Drawer = ({ width = 0, open, onClose, onTransitionEnd, children, className = '' }: DrawerProps) => {
    const widthStyle = { width: width > 0 ? `${width}px` : 'fit-content' };
    const transformStyle = { transform: open ? 'translateX(0)' : 'translateX(100%)' };

    const shadowClass = open ? 'shadow-[0px_0px_30px_5px_rgba(0,0,0,0.25)]' : '';

    return (
        <>
            {open && <div className="z-800 fixed inset-0 bg-white/70 transition-opacity" onClick={onClose} />}
            <div
                className={`z-900 bg-grey-5 fixed right-0 top-0 h-full transform transition-transform duration-300 ${shadowClass} ${className}`}
                style={{ ...widthStyle, ...transformStyle }}
                onTransitionEnd={() => !open && onTransitionEnd?.()}
            >
                {children}
            </div>
        </>
    );
};
