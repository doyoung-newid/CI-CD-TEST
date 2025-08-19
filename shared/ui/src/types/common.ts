import React, { JSX } from 'react';

export type CustomComponentProps<T extends keyof JSX.IntrinsicElements> = Omit<React.ComponentProps<T>, 'className'>;

export type Size = 'small' | 'medium' | 'large';
export type LabelPosition = 'inner' | 'outer';

export const BoxComponentStyles: Record<
    Size,
    {
        height: number;
        heightClass: string;
        textSizeClass: string;
        labelSizeClass: string;
        iconSizeClass: string;
    }
> = {
    small: {
        height: 32,
        heightClass: 'h-[32px]',
        textSizeClass: 'text-r14',
        labelSizeClass: 'text-m14',
        iconSizeClass: 'size-[18px]',
    },
    medium: {
        height: 40,
        heightClass: 'h-[40px]',
        textSizeClass: 'text-r16',
        labelSizeClass: 'text-m16',
        iconSizeClass: 'size-[24px]',
    },
    large: {
        height: 54,
        heightClass: 'h-[54px]',
        textSizeClass: 'text-r18',
        labelSizeClass: 'text-m18',
        iconSizeClass: 'size-[24px]',
    },
};
