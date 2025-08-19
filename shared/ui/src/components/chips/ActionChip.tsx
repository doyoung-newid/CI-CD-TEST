import React, { ReactNode } from 'react';

type ChipSize = 'extraSmall' | 'medium';

export interface ChipProps {
    onClick: () => void;
    icon?: React.ReactNode;
    size?: ChipSize;
    selected?: boolean;
    children?: ReactNode;
}

const sizeClasses: Record<ChipSize, string> = {
    extraSmall: 'px-2 py-1 text-xs h-6',
    medium: 'px-[17px] py-[10px] text-base h-10',
};

export const ActionChip = ({ size = 'medium', children, onClick, icon, selected = false }: ChipProps) => {
    const isMedium = size === 'medium';

    const classList = [
        'inline-flex items-center border rounded-full font-medium focus:outline-none transition',
        sizeClasses[size],
        'border-blue-500 leading-[14px] whitespace-nowrap',
        selected ? 'bg-blue-300 text-blue-600' : 'text-blue-600 bg-transparent hover:bg-blue-200',
        isMedium && icon ? 'ps-[13px] pe-[17px]' : '',
    ].join(' ');

    return (
        <button type="button" onClick={onClick} className={classList}>
            {isMedium && icon && <span className={'mr-[6px]'}>{icon}</span>}
            {children}
        </button>
    );
};
