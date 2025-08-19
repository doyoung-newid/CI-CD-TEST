import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import {
    BaseDatePickerProps,
    DEFAULT_BUTTON_TEXT_GROUP,
    ValidationMessages,
} from '@/components/datepicker/DatePicker.types';
import {
    SINGLE_VALIDATION_MESSAGES,
    SingleDatePicker,
    SingleDatePickerProps,
} from '@/components/datepicker/SingleDatePicker';
import { DateRange } from 'react-day-picker';
import {
    DateRangePicker,
    DateRangePickerProps,
    RANGE_VALIDATION_MESSAGES,
} from '@/components/datepicker/DateRangePicker';
import { DatePicker } from './DatePicker';
import { useDatePickerBox } from '@/components/datepicker/DatePickerBox.hooks';
import { useMemo } from 'react';

type DateBoxProps<T extends BaseDatePickerProps> = Pick<
    T,
    'showTime' | 'disabledCondition' | 'locale' | 'buttonText'
> & {
    width?: number;
    placeholder?: string;
};

export interface SingleDateBoxProps extends DateBoxProps<SingleDatePickerProps> {
    value?: Date;
    onChange?: (value: Date | undefined) => void;
    validationMessages?: ValidationMessages<'single'>;
}

export const SingleDatePickerBox = ({
    placeholder = '',
    value,
    onChange,
    showTime = true,
    disabledCondition = () => false,
    locale = enUS,
    buttonText = DEFAULT_BUTTON_TEXT_GROUP,
    validationMessages = SINGLE_VALIDATION_MESSAGES,
    width = 0,
}: SingleDateBoxProps) => {
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
        <div className="flex-col-50 relative flex w-fit">
            <DatePicker.Trigger
                className={`text-r16 bg-white ${boxClasses}`}
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
                    disabledCondition={disabledCondition}
                    validationMessages={validationMessages}
                    onValidationChange={handleValidationChange}
                    onClose={close}
                    ref={pickerRef}
                />
            )}
        </div>
    );
};

export interface DateRangeBoxProps extends DateBoxProps<DateRangePickerProps> {
    value?: DateRange;
    onChange?: (value: DateRange | undefined) => void;
    maxDays?: number;
    validationMessages?: ValidationMessages<'range'>;
}

export const DateRangePickerBox = ({
    placeholder = '',
    value,
    onChange,
    maxDays,
    showTime = true,
    disabledCondition = () => false,
    locale = enUS,
    buttonText = DEFAULT_BUTTON_TEXT_GROUP,
    validationMessages = RANGE_VALIDATION_MESSAGES,
    width = 0,
}: DateRangeBoxProps) => {
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
                className={`text-r16 bg-white ${boxClasses}`}
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
                    disabledCondition={disabledCondition}
                    maxDays={maxDays}
                    validationMessages={validationMessages}
                    onValidationChange={handleValidationChange}
                    onChange={handleRangeChange}
                    onClose={close}
                    ref={pickerRef}
                />
            )}
        </div>
    );
};

const formatString = (showTime: boolean) => (showTime ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd');
