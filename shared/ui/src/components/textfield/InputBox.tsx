import React, { ReactNode } from 'react';

interface InputBoxProps {
    className?: string;
    children: React.ReactNode;
    width?: number;
    height?: number;
}

const Root = ({ className, width = 0, height = 0, children }: InputBoxProps) => {
    const heightValue = height > 0 ? `${height}px` : '100%';
    return (
        <div
            className={`relative flex items-center rounded border ${className}`}
            style={{ width: width > 0 ? `${width}px` : '100%', height: heightValue, minHeight: heightValue }}
        >
            {children}
        </div>
    );
};

interface InputFieldProps extends React.ComponentProps<'input'> {
    className?: string;
    ref?: React.Ref<HTMLInputElement>;
}

const Field = ({ className, ref, ...props }: InputFieldProps) => {
    return <input className={`w-full flex-1 outline-none ${className}`} {...props} ref={ref} />;
};

interface InputAddonProps {
    className?: string;
    children: ReactNode;
}

const Prefix = ({ className = '', children }: InputAddonProps) => {
    return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
};

const Suffix = ({ className = '', children }: InputAddonProps) => {
    return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
};

const InputBox = {
    Root,
    Field,
    Prefix,
    Suffix,
};

export default InputBox;
