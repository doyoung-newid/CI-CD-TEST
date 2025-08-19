import { ReactNode } from 'react';
import IconClear from '@/assets/icDefaultChipClear.svg?react';
import IconClose from '@/assets/icDefaultChipClose.svg?react';

type ChipVariant = 'default' | 'removeOutline' | 'removeSolid' | 'movable';

export interface DefaultChipProps {
    onDelete?: () => void;
    variant?: ChipVariant;
    dragHandle?: ReactNode;
    children?: ReactNode;
}

const PADDING: Record<ChipVariant, string> = {
    default: 'px-2',
    removeOutline: 'ps-2 pe-1',
    removeSolid: 'ps-[9px] pe-[5px]',
    movable: 'ps-1 pe-1',
};

export const TagChip = ({ variant = 'default', children, onDelete, dragHandle }: DefaultChipProps) => {
    const DeleteIcon = variant === 'removeSolid' ? IconClose : IconClear;

    const base = [
        'inline-flex items-center text-grey-90',
        'rounded-full h-6',
        'text-xs font-medium leading-[14px]',
        'bg-grey-10 hover:bg-blue-100 whitespace-nowrap',
        PADDING[variant],
        variant === 'removeSolid' ? 'py-[5px]' : 'py-[4px] border border-grey-25 hover:border-blue-150',
    ].join(' ');

    return (
        <div className={base}>
            {variant === 'movable' && <span className="cursor-move">{dragHandle}</span>}
            {children}
            {variant !== 'default' && (
                <button type="button" onClick={onDelete} className="ml-[3px] focus:outline-none">
                    <DeleteIcon className="object-contain" />
                </button>
            )}
        </div>
    );
};
