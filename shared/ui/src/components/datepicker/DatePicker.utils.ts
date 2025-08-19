import { differenceInDays, format, getHours, getMinutes, isValid, parse } from 'date-fns';
import { DEFAULT_TIME_STATE, ParsedDate, ParsedTime, ParsedValue } from '@/components/datepicker/DatePicker.types';

export const isInvalidValue = <T>(value: ParsedValue<T> | undefined): boolean => {
    return !value?.parsedValue || (!!value.currentValue.trim() && !value.parsedValue);
};

export const isEmptyValue = <T>(value: ParsedValue<T>) => !value.parsedValue && !value.currentValue.trim();

export const isWithinDays = (startDate: Date, endDate: Date, maxDays: number): boolean => {
    const daysBetween = differenceInDays(endDate, startDate) + 1;
    return daysBetween <= maxDays;
};

export const combineDateTime = (date: Date, hours: number, minutes: number): Date => {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

export const formatDate = (date?: Date): string => {
    if (!date) return '';
    return format(date, 'yyyy/MM/dd');
};

export const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;

    const check = /^\d{4}[-./]?\d{1,2}[-./]?\d{1,2}$/.test(dateStr);
    if (!check) return undefined;

    const formats = ['yyyy/MM/dd', 'yyyy/M/d', 'yyyy-MM-dd', 'yyyy-M-d', 'yyyy.MM.dd', 'yyyy.M.d'];

    for (const formatStr of formats) {
        try {
            const parsedDate = parse(dateStr, formatStr, new Date());
            if (isValid(parsedDate)) {
                return parsedDate;
            }
        } catch (error) {
            console.error('parsing error:', error);
        }
    }

    return undefined;
};

export const validateDate = (dateStr: string): ParsedDate => {
    if (!dateStr || dateStr.trim() === '') {
        return {
            currentValue: dateStr,
            parsedValue: undefined,
        };
    }

    const parsedDate = parseDate(dateStr);

    if (parsedDate) {
        return {
            currentValue: formatDate(parsedDate),
            parsedValue: parsedDate,
        };
    } else {
        return {
            currentValue: dateStr,
            parsedValue: undefined,
        };
    }
};

export const formatTime = (value: Date | { hours: number; minutes: number } | undefined): string => {
    if (!value) return '';

    if (value instanceof Date) {
        return `${getHours(value).toString().padStart(2, '0')}:${getMinutes(value).toString().padStart(2, '0')}`;
    } else {
        return `${value.hours.toString().padStart(2, '0')}:${value.minutes.toString().padStart(2, '0')}`;
    }
};

export const parseTime = (timeStr: string): { hours: number; minutes: number } | undefined => {
    if (!timeStr) return undefined;

    const timeRegex = /^(\d{1,2}):?(\d{0,2})$/;
    const match = timeStr.match(timeRegex);

    if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) : 0;

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            return { hours, minutes };
        }
    }

    try {
        const parsedTime = parse(timeStr, 'HH:mm', new Date());
        if (isValid(parsedTime)) {
            return {
                hours: getHours(parsedTime),
                minutes: getMinutes(parsedTime),
            };
        }
    } catch (error) {
        console.error('parsing error:', error);
    }
    return undefined;
};

export const validateTime = (timeStr: string): ParsedTime => {
    if (!timeStr?.trim()) {
        return DEFAULT_TIME_STATE;
    }

    const parsedTime = parseTime(timeStr);

    if (parsedTime) {
        return {
            parsedValue: parsedTime,
            currentValue: formatTime(parsedTime),
        };
    } else {
        return {
            parsedValue: undefined,
            currentValue: timeStr,
        };
    }
};
