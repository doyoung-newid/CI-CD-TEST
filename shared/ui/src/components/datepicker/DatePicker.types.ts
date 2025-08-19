import { Locale } from 'react-day-picker';
import { enUS } from 'date-fns/locale';
import React from 'react';

export interface ParsedValue<T> {
    parsedValue?: T;
    currentValue: string;
}

export type ParsedDate = ParsedValue<Date>;

export type ParsedTime = ParsedValue<{
    hours: number;
    minutes: number;
}>;

export interface BoxState {
    isValid: boolean;
    isFocused: boolean;
    isActive: boolean;
}

export interface BoxConfig {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    ref?: React.Ref<HTMLInputElement>;
}

export interface CustomDatePickerProps {
    className?: string;
    locale?: Locale;
    buttonText?: {
        delete: string;
        today: string;
    };
    showTime?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    ref?: React.Ref<HTMLDivElement>;
}

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
