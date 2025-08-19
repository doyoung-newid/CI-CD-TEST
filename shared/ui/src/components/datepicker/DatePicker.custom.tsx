import { DayButtonProps, DayPickerProps, NavProps } from 'react-day-picker';
import ChevronIcon from '@/assets/icChevron.svg?react';
import React from 'react';

export const defaultDayPickerProps: Partial<DayPickerProps> = {
    showOutsideDays: true,
    components: {
        Nav: (navProps) => <CustomMonthsNav {...navProps} />,
    },
    classNames: {
        root: 'w-fit px-[11px]',
        months: 'relative w-fit',
        month: 'w-fit',
        month_caption: 'flex items-center justify-between w-full relative px-[6px] py-[8px]',
        caption_label: 'text-m16 text-grey-90',
        month_grid: 'w-fit mt-[16px]',
        weekdays: 'flex w-fit',
        weekday: 'w-[36px] py-[11px] text-center text-r12 text-grey-50',
        week: 'flex py-[2px]',
        day: 'w-full aspect-square text-r14 h-[36px]',
    },
};

interface DatePickerNavProps extends NavProps {
    className?: string;
}

export const CustomMonthsNav: React.FC<DatePickerNavProps> = ({
    onPreviousClick,
    onNextClick,
    previousMonth,
    nextMonth,
    className = '',
}) => {
    return (
        <div className={`z-2 absolute right-0 flex items-center gap-[16px] py-[8px] ${className}`}>
            <button
                type="button"
                className="btn-month flex items-center justify-center"
                onClick={onPreviousClick}
                disabled={!previousMonth}
            >
                <ChevronIcon className="size-[20px]" />
            </button>
            <button
                type="button"
                className="btn-month flex items-center justify-center"
                onClick={onNextClick}
                disabled={!nextMonth}
            >
                <ChevronIcon className="size-[20px] rotate-180" />
            </button>
        </div>
    );
};

export function CustomDayButton({
    containerClasses,
    buttonClasses,
    ...dayButtonProps
}: DayButtonProps & { containerClasses?: string; buttonClasses?: string }) {
    const { day, ...rest } = dayButtonProps;

    return (
        <div className={`relative h-full w-full p-[2px] ${containerClasses}`}>
            <button {...rest} className={`btn-day ${buttonClasses}`}>
                {day.date.getDate()}
            </button>
        </div>
    );
}
