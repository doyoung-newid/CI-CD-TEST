import React, { createContext, forwardRef, ReactNode, useContext } from 'react';
import { BoxComponentStyles, Size } from '@/types/common.ts';

interface LabeledInputContextType {
    size: Extract<Size, 'small' | 'medium' | 'large'>;
}

const LabeledInputContext = createContext<LabeledInputContextType | undefined>(undefined);

const useLabeledInputContext = () => {
    const context = useContext(LabeledInputContext);
    if (!context) {
        throw new Error('LabeledInput components must be used within a LabeledInput.Root');
    }
    return context;
};

interface RootProps {
    size?: Extract<Size, 'small' | 'medium' | 'large'>;
    width?: number;
    className?: string;
    children: ReactNode;
    ref?: React.RefObject<HTMLDivElement | null>;
}

const Root = ({ size = 'medium', width = 0, className = '', children, ref }: RootProps) => {
    const widthStyle = { width: width > 0 ? `${width}px` : '100%' };

    const contextValue = {
        size,
    };

    return (
        <LabeledInputContext.Provider value={contextValue}>
            <div
                className={`relative flex h-fit flex-col items-start gap-[4px] ${className}`}
                style={widthStyle}
                ref={ref}
            >
                {children}
            </div>
        </LabeledInputContext.Provider>
    );
};

interface ContentProps {
    children: ReactNode;
    className?: string;
}

const Content = ({ children, className = '' }: ContentProps) => {
    const { size } = useLabeledInputContext();
    const { heightClass } = BoxComponentStyles[size];

    return <div className={`flex w-full flex-col justify-center rounded ${heightClass} ${className}`}>{children}</div>;
};

interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
    className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
    const { size } = useLabeledInputContext();
    const { textSizeClass } = BoxComponentStyles[size];

    return <input ref={ref} className={`w-full ${textSizeClass} ${className}`} {...props} />;
});

Input.displayName = 'Input';

interface LabelProps {
    children: ReactNode;
    color?: string;
    className?: string;
}

const OuterLabel = ({ children, color, className = '' }: LabelProps) => {
    const { size } = useLabeledInputContext();
    const { labelSizeClass } = BoxComponentStyles[size];

    const colorStyle = {
        color: color || 'var(--color-grey-70)',
    };

    return (
        <label className={`pl-[4px] ${labelSizeClass} non-draggable ${className}`} style={colorStyle}>
            {children}
        </label>
    );
};

const InnerLabel = ({ children, color, className = '' }: LabelProps) => {
    const { size } = useLabeledInputContext();

    if (size !== 'large') return null;

    const colorStyle = {
        color: color || 'var(--color-grey-50)',
    };

    return (
        <label className={`non-draggable text-m12 p-0 ${className}`} style={colorStyle}>
            {children}
        </label>
    );
};

const SupportingText = ({ children, color, className = '' }: LabelProps) => {
    const { size } = useLabeledInputContext();

    if (size === 'small') return null;

    const colorStyle = {
        color: color || 'var(--color-grey-50)',
    };

    return (
        <p className={`text-r14 pl-[11px] ${className}`} style={colorStyle}>
            {children}
        </p>
    );
};

export const LabeledInput = {
    Root,
    OuterLabel,
    Content,
    Input,
    InnerLabel,
    SupportingText,
};
