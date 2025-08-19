import React, { ReactNode } from 'react';
import { CustomComponentProps, Size } from '@/types/common';

export interface CellButtonProps extends CustomComponentProps<'button'> {
    size?: Extract<Size, 'small' | 'medium' | 'large'>;
    children?: ReactNode;
    ref?: React.Ref<HTMLButtonElement>;
}

const SizeStyles = {
    small: {
        textSizeClass: 'text-m14',
    },
    medium: {
        textSizeClass: 'text-m16',
    },
    large: {
        textSizeClass: 'text-m18',
    },
};

const StateStyles = {
    enabled: {
        background: 'bg-transparent',
        border: 'border-grey-70',
        text: 'text-grey-70',
        behavior: 'hover:bg-grey-20 active:bg-grey-30',
    },
    disabled: {
        background: 'bg-grey-20',
        border: 'border-grey-40',
        text: 'text-grey-40',
        behavior: '',
    },
};

export const CellButton = ({ size = 'medium', children, ref, ...props }: CellButtonProps) => {
    const { textSizeClass } = SizeStyles[size];

    const baseClasses = `h-fit p-[8px] flex items-center ${textSizeClass} rounded-[4px] border border-solid transition-colors duration-100`;

    const stateStyle = props.disabled ? StateStyles.disabled : StateStyles.enabled;
    const stateClasses = `${stateStyle.background} ${stateStyle.border} ${stateStyle.text} ${stateStyle.behavior}`;

    const buttonClasses = `${baseClasses} ${stateClasses}`;

    return (
        <button role="button" ref={ref} className={buttonClasses} {...props}>
            {children}
        </button>
    );
};
