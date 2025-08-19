import React, { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';
import { DayPicker, DayPickerProps } from 'react-day-picker';
import { defaultDayPickerProps } from '@/components/datepicker/DatePicker.custom.tsx';
import { BoxConfig, BoxState } from '@/components/datepicker/DatePicker.types.ts';
import { CalenderIcon } from '@/index.ts';

export interface DatePickerContainerProps {
    className?: string;
    children?: ReactNode;
    ref?: React.Ref<HTMLDivElement>;
}

const DatePickerBase = ({ className = '', children, ref }: DatePickerContainerProps) => {
    return (
        <div
            className={`z-100 border-grey-20 absolute right-0 top-full mt-1 flex h-fit w-fit flex-col rounded-[4px] border-[1px] bg-white shadow-md transition-all duration-200 ${className}`}
            ref={ref}
        >
            {children}
        </div>
    );
};
DatePickerBase.displayName = 'DatePicker';

export type DateTimeBoxProps = {
    className?: string;
    showTime?: boolean;
    dateInput: BoxConfig;
    timeInput?: BoxConfig;
    state: BoxState;
    onBoxFocus?: () => void;
};

const DateTimeBox = ({
    className = '',
    showTime = false,
    dateInput,
    timeInput,
    state = { isValid: true, isFocused: false, isActive: true },
    onBoxFocus,
}: DateTimeBoxProps) => {
    if (process.env.NODE_ENV === 'development' && showTime && !timeInput) {
        console.warn('timeInput is required when showTime is true');
    }

    const containerStyles = {
        base: 'mx-[11px] w-[252px] px-[14px] flex-1 rounded-md focus:outline-none focus:ring-2 text-grey-90 border',
        states: {
            'valid-focused': 'bg-blue-150 ring-blue-500 border-blue-600',
            'valid-active': 'bg-blue-100 border-grey-20',
            'valid-inactive': 'bg-grey-5 border-grey-20',
            'invalid-focused': 'bg-red-150 border-red-600',
            'invalid-active': 'bg-red-150 border-grey-20',
            'invalid-inactive': 'bg-red-100 border-grey-20',
        },
    };

    const getStateClassName = () => {
        const { isValid, isFocused, isActive } = state;
        const prefix = isValid ? 'valid' : 'invalid';
        const suffix = isFocused ? 'focused' : isActive ? 'active' : 'inactive';
        return `${prefix}-${suffix}` as keyof typeof containerStyles.states;
    };

    const containerClasses = `${containerStyles.base} ${containerStyles.states[getStateClassName()]}`;
    const inputClasses = 'text-r16 bg-inherit focus:outline-none';

    return (
        <div className={`${containerClasses} ${className}`}>
            <div className="flex h-[30px] items-center py-[4px]">
                <input
                    className={`${inputClasses} ${showTime ? 'w-1/2' : 'w-full'} px-[8px]`}
                    type="text"
                    placeholder={dateInput.placeholder}
                    value={dateInput.value}
                    onChange={(e) => dateInput.onChange(e.target.value)}
                    onKeyDown={(e) => dateInput.onKeyDown?.(e)}
                    onFocus={() => onBoxFocus?.()}
                    onBlur={() => dateInput.onBlur?.()}
                    ref={dateInput.ref}
                />
                {showTime && timeInput && (
                    <>
                        <div className="bg-grey-20 mx-[4px] h-[14px] w-px" />
                        <input
                            className={`${inputClasses} w-1/2 px-[20px]`}
                            type="text"
                            placeholder={timeInput.placeholder}
                            value={timeInput.value}
                            onChange={(e) => timeInput.onChange?.(e.target.value)}
                            onKeyDown={(e) => timeInput.onKeyDown?.(e)}
                            onFocus={() => onBoxFocus?.()}
                            onBlur={() => timeInput.onBlur?.()}
                            ref={timeInput.ref}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export interface DatePickerContentProps {
    dayPickerProps: Partial<DayPickerProps>;
}

const DatePickerContent = ({ dayPickerProps }: DatePickerContentProps) => {
    const mergedProps = {
        ...defaultDayPickerProps,
        ...dayPickerProps,
        classNames: {
            ...defaultDayPickerProps.classNames,
            ...(dayPickerProps.classNames || {}),
        },
        components: {
            ...defaultDayPickerProps.components,
            ...(dayPickerProps.components || {}),
        },
    };

    return <DayPicker {...(mergedProps as DayPickerProps)} />;
};

export interface DatePickerToolsProps {
    className?: string;
    deleteButton?: {
        text?: string;
        onClick?: () => void;
    };
    todayButton?: {
        text?: string;
        onClick?: () => void;
    };
}

const DatePickerTools: React.FC<DatePickerToolsProps> = ({
    className = '',
    deleteButton = {
        text: 'Delete',
        onClick: () => {},
    },
    todayButton = {
        text: 'Today',
        onClick: () => {},
    },
}) => {
    return (
        <div className={`${className} h-fit`}>
            <div className="bg-grey-20 h-[1px] w-full" />
            <div className="flex justify-between px-[11px] py-[9px]">
                <button
                    onClick={() => deleteButton.onClick?.()}
                    className="text-m14 rounded-[4px] px-[13px] py-[6px] text-red-600 hover:bg-red-200"
                >
                    {deleteButton.text}
                </button>
                <button
                    onClick={() => todayButton.onClick?.()}
                    className="text-m14 rounded-[4px] px-[13px] py-[6px] text-blue-600 hover:bg-blue-200"
                >
                    {todayButton.text}
                </button>
            </div>
        </div>
    );
};

interface DatePickerTriggerProps {
    className?: string;
    width?: number;
    placeholder: string;
    value: string;
    onClick: () => void;
    ref?: React.RefObject<HTMLDivElement | null>;
}

const DatePickerTrigger: React.FC<DatePickerTriggerProps> = ({
    className,
    width = 0,
    placeholder,
    value,
    onClick,
    ref,
}) => (
    <div
        className={`flex cursor-pointer items-center justify-between gap-[4px] rounded-[4px] border-[1px] py-[7px] pl-[11px] pr-[7px] ${className}`}
        style={{ width: width > 0 ? `${width}px` : 'fit-content' }}
        onClick={onClick}
        ref={ref}
    >
        <span>{value || placeholder}</span>
        <CalenderIcon />
    </div>
);

type DatePickerType = ForwardRefExoticComponent<DatePickerContainerProps & RefAttributes<HTMLDivElement>> & {
    Input: React.FC<DateTimeBoxProps>;
    Content: React.FC<DatePickerContentProps>;
    Tools: React.FC<DatePickerToolsProps>;
    Trigger: React.FC<DatePickerTriggerProps>;
};

export const DatePicker = DatePickerBase as DatePickerType;
DatePicker.Input = DateTimeBox;
DatePicker.Content = DatePickerContent;
DatePicker.Tools = DatePickerTools;
DatePicker.Trigger = DatePickerTrigger;
