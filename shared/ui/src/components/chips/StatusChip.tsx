import { ReactNode } from 'react';

const COLOR_STYLES = {
    red: 'bg-[#FFDBDB] border-[#FFC3BD] text-[#F46263]',
    orange: 'bg-[#FFEACC] border-[#FFD6A8] text-[#F68855]',
    yellow: 'bg-[#FEF7B9] border-[#FFEA70] text-[#DBA00A]',
    lime: 'bg-[#E9FBC0] border-[#D2EF9A] text-[#66B200]',
    green: 'bg-[#BAF8D7] border-[#91E8BA] text-[#15A271]',
    cyan: 'bg-[#C8F9FE] border-[#84EAF5] text-[#20A4BC]',
    blue: 'bg-[#D8E9FD] border-[#B2D4FF] text-[#4897F9]',
    violet: 'bg-[#E7E2FE] border-[#D5CCFF] text-[#A86EF7]',
    fuchsia: 'bg-[#F8E0FF] border-[#F4C7FF] text-[#CD68E3]',
    pink: 'bg-[#FCE4F1] border-[#FCCEE8] text-[#F967B2]',
    gray: 'bg-[#F2F2F2] border-[#D8DBD9] text-[#8E8E90]',
} as const;

export type StatusColor = keyof typeof COLOR_STYLES;
// eslint-disable-next-line react-refresh/only-export-components
export const statusColors: StatusColor[] = Object.keys(COLOR_STYLES) as StatusColor[];

export interface StatusChipProps {
    color: StatusColor;
    children?: ReactNode;
}

export const StatusChip = ({ color, children }: StatusChipProps) => {
    const baseClasses = [
        'inline-flex items-center justify-center',
        'rounded-full border px-2 py-1 h-6',
        'text-xs font-medium leading-[14px]',
        'whitespace-nowrap',
    ].join(' ');

    const colorClasses = COLOR_STYLES[color];

    return <span className={`${baseClasses} ${colorClasses}`}>{children}</span>;
};
