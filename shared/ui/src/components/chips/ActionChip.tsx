import React, { ReactNode } from 'react';

export const SIZE_STYLES = {
    extraSmall: 'px-2 py-1 text-m12 h-6',
    medium: {
        default: 'px-[17px] py-[10px] text-m16 h-10',
        withIcon: 'ps-[13px] pe-[17px] py-[10px] text-m16 h-10',
    },
} as const;

export const COLOR_STYLES = {
    primary: {
        default: 'border-blue-600 bg-white text-blue-600 hover:bg-blue-150',
        selected: 'border-blue-600 bg-blue-250 text-blue-600 hover:bg-blue-250',
    },
    gray: {
        default: 'border-grey-70 bg-white text-grey-90 hover:bg-grey-20',
        selected: 'border-grey-70 bg-grey-30 text-grey-90 hover:bg-grey-30',
    },
} as const;

const VARIANTS = {
    extraSmall: ['gray'] as const,
    medium: ['primary'] as const,
} as const;

type ActionChipSize = keyof typeof VARIANTS;
type ColorForSize<T extends ActionChipSize> = (typeof VARIANTS)[T][number];

type ActionChipProps<T extends ActionChipSize = ActionChipSize> = {
    size: T;
    color?: ColorForSize<T>;
    icon?: T extends 'medium' ? React.ReactNode : never;
    selected?: boolean;
    onClick: () => void;
    children: ReactNode;
};

export const ActionChip = <T extends ActionChipSize>({
    size,
    color,
    children,
    onClick,
    icon,
    selected = false,
}: ActionChipProps<T>) => {
    const hasIcon = Boolean(size === 'medium' && icon);

    const baseClasses = `inline-flex items-center justify-center rounded-full border whitespace-nowrap transition-colors duration-100`;

    const sizeStyle = SIZE_STYLES[size];
    const sizeClasses = typeof sizeStyle === 'string' ? sizeStyle : hasIcon ? sizeStyle.withIcon : sizeStyle.default;

    const defaultColor = VARIANTS[size][0];
    const colorStyle = COLOR_STYLES[color ?? defaultColor];
    const colorClasses = selected ? colorStyle.selected : colorStyle.default;

    return (
        <button type="button" onClick={onClick} className={[baseClasses, sizeClasses, colorClasses].join(' ')}>
            {hasIcon && <span className="mr-[6px]">{icon}</span>}
            {children}
        </button>
    );
};
