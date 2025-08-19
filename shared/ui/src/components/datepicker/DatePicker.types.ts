import { Locale } from 'react-day-picker';
import { enUS } from 'date-fns/locale';
import React from 'react';

export type PickerType = 'single' | 'range';

export type ValidationErrorMap = {
    single: 'invalidDate' | 'invalidTime';
    range: 'invalidRange' | 'exceedingMaxDays' | 'invalidTime';
};

export type ValidationState<T extends PickerType> =
    | { status: 'valid' }
    | { status: 'invalid'; error: ValidationErrorMap[T] };

export type ValidationMessages<T extends PickerType> = {
    [K in ValidationErrorMap[T]]?: string;
};

export const VALID_STATE = {
    status: 'valid',
} as const;

export const INVALID_TIME_STATE = {
    status: 'invalid',
    error: 'invalidTime',
} as const;

export interface BoxState<T extends PickerType> {
    validation: ValidationState<T>;
    isFocused: boolean;
    isActive: boolean;
}

export const DEFAULT_BOX_STATE = {
    validation: VALID_STATE,
    isFocused: false,
    isActive: true,
} as const;

export const isBoxValid = <T extends PickerType>(boxState: BoxState<T>): boolean => {
    return boxState.validation.status === 'valid';
};

export interface BoxConfig {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    ref?: React.Ref<HTMLInputElement>;
}

export interface BaseDatePickerProps {
    className?: string;
    locale?: Locale;
    buttonText?: {
        delete: string;
        today: string;
    };
    showTime?: boolean;
    isOpen?: boolean;
    disabledCondition?: (date: Date) => boolean;
    onClose?: () => void;
    ref?: React.Ref<HTMLDivElement>;
}

export interface ParsedValue<T> {
    parsedValue?: T;
    currentValue: string;
}

export type ParsedDate = ParsedValue<Date>;

export type ParsedTime = ParsedValue<{
    hours: number;
    minutes: number;
}>;

export const DEFAULT_TIME_STATE: ParsedTime = {
    parsedValue: { hours: 0, minutes: 0 },
    currentValue: '00:00',
};

export const DEFAULT_DATE_STATE: ParsedDate = {
    parsedValue: undefined,
    currentValue: '',
};

export const DEFAULT_LOCALE = enUS;

export const DEFAULT_BUTTON_TEXT_GROUP = {
    delete: 'Delete',
    today: 'Today',
};
