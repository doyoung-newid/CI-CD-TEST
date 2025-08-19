import { Locale } from 'react-day-picker';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import { DEFAULT_BUTTON_TEXT_GROUP } from '@/components/datepicker/DatePicker.types.ts';
import { SingleDatePicker } from '@/components/datepicker/SingleDatePicker.tsx';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/datepicker/DateRangePicker.tsx';
import { DatePicker } from './DatePicker';
import { useDatePickerBox } from '@/components/datepicker/DatePickerBox.hooks.ts';
import { useMemo } from 'react';

interface DateBoxProps<T> {
    width?: number;
    placeholder?: string;
    buttonText?: { delete: string; today: string };
    showTime?: boolean;
    locale?: Locale;
    value?: T;
    onChange?: (value: T | undefined) => void;
}

const formatString = (showTime: boolean) => (showTime ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd');

export const SingleDatePickerBox = ({
    placeholder = '',
    value,
    onChange,
    showTime = true,
    locale = enUS,
    buttonText = DEFAULT_BUTTON_TEXT_GROUP,
    width = 0,
}: DateBoxProps<Date>) => {
    const { pickerRef, triggerRef, isOpen, toggleOpen, close, handleValidationChange } = useDatePickerBox<boolean>({
        validate: (validation) => validation,
        initialValidation: true,
    });

    const handleDateChange = (date: Date | undefined) => onChange?.(date);

    const formatDate = useMemo(() => {
        if (!value) return '';

        return format(value, formatString(showTime));
    }, [showTime, value]);

    const boxClasses = `${isOpen ? 'border-blue-500' : 'border-grey-40'} ${formatDate ? 'text-grey-70' : 'text-grey-40'}`;

    return (
        <div className="relative flex w-fit flex-col">
            <DatePicker.Trigger
                className={`text-r16 ${boxClasses}`}
                width={width}
                placeholder={placeholder}
                value={formatDate}
                onClick={toggleOpen}
                ref={triggerRef}
            />
            {isOpen && (
                <SingleDatePicker
                    showTime={showTime}
                    value={value}
                    onChange={handleDateChange}
                    isOpen={isOpen}
                    buttonText={buttonText}
                    locale={locale}
                    onClose={close}
                    onValidationChange={handleValidationChange}
                    ref={pickerRef}
                />
            )}
        </div>
    );
};

export const DateRangePickerBox = ({
    placeholder = '',
    value,
    onChange,
    showTime = true,
    locale = enUS,
    buttonText = DEFAULT_BUTTON_TEXT_GROUP,
    width = 0,
}: DateBoxProps<DateRange>) => {
    const { pickerRef, triggerRef, isOpen, toggleOpen, close, handleValidationChange } = useDatePickerBox<{
        start: boolean;
        end: boolean;
    }>({
        validate: (validation) => validation.start && validation.end,
        initialValidation: { start: true, end: true },
    });

    const handleRangeChange = (range: DateRange) => onChange?.(range);

    const formatRange = useMemo(() => {
        if (!value?.from || !value?.to) {
            return '';
        }

        return `${format(value.from, formatString(showTime))} → ${format(value.to, formatString(showTime))}`;
    }, [showTime, value]);

    const boxClasses = `${isOpen ? 'border-blue-500' : 'border-grey-40'} ${formatRange ? 'text-grey-70' : 'text-grey-40'}`;

    return (
        <div className="relative flex w-fit flex-col">
            <DatePicker.Trigger
                className={`text-r16 ${boxClasses}`}
                width={width}
                placeholder={placeholder}
                value={formatRange}
                onClick={toggleOpen}
                ref={triggerRef}
            />

            {isOpen && (
                <DateRangePicker
                    startValue={value?.from}
                    endValue={value?.to}
                    showTime={showTime}
                    isOpen={isOpen}
                    buttonText={buttonText}
                    locale={locale}
                    onClose={close}
                    onChange={handleRangeChange}
                    onValidationChange={handleValidationChange}
                    ref={pickerRef}
                />
            )}
        </div>
    );
};
