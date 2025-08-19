import React, { useEffect, useRef } from 'react';
import { DayButtonProps, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useSingleDatePicker } from '@/components/datepicker/SingleDatePicker.hooks';
import { DatePicker } from '@/components/datepicker/DatePicker';
import { CustomDayButton } from '@/components/datepicker/DatePicker.custom';
import {
    BaseDatePickerProps,
    DEFAULT_BUTTON_TEXT_GROUP,
    DEFAULT_LOCALE,
    isBoxValid,
    ValidationErrorMap,
    ValidationMessages,
    ValidationState,
} from '@/components/datepicker/DatePicker.types';
import { InfoIcon, Tooltip } from '@/index';

export const SINGLE_VALIDATION_MESSAGES: Record<ValidationErrorMap['single'], string> = {
    invalidDate: 'Invalid date',
    invalidTime: 'Invalid time',
};

export interface SingleDatePickerProps extends BaseDatePickerProps {
    placeholder?: {
        date: string;
        time: string;
    };
    value: Date | undefined;
    validationMessages?: ValidationMessages<'single'>;
    onChange?: (date: Date | undefined) => void;
    onValidationChange?: (isValid: boolean) => void;
}

export const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
    className = '',
    showTime = false,
    isOpen = false,
    locale = DEFAULT_LOCALE,
    buttonText = DEFAULT_BUTTON_TEXT_GROUP,
    placeholder = {
        date: '',
        time: '',
    },
    value,
    validationMessages = SINGLE_VALIDATION_MESSAGES,
    disabledCondition = () => false,
    onChange,
    onClose,
    onValidationChange,
    ref,
}) => {
    const isCustomButtonSelectionRef = useRef(false);

    const {
        selectedDate,
        dateState,
        timeState,
        month,
        setMonth,
        handleSelectDate,
        handleDeleteDate,
        handleSetToday,
        boxState,
        initFocusState,
        handleInputFocus,
        dateInput,
        timeInput,
    } = useSingleDatePicker({
        value,
        onChange,
        showTime,
        onClose,
        isOpen,
        disabledCondition,
    });

    const handleContentMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as Element;

        isCustomButtonSelectionRef.current = !!(target.closest('.btn-day') || target.closest('.btn-month'));
    };

    const handleContentMouseUp = () =>
        requestAnimationFrame(() => {
            initFocusState();
        });

    const handleFilteredDateBlur = () => {
        if (!isCustomButtonSelectionRef.current) {
            dateInput.onBlur(false);
        }

        isCustomButtonSelectionRef.current = false;
    };

    const handleFilteredTimeBlur = () => {
        if (!isCustomButtonSelectionRef.current) {
            timeInput.onBlur(false);
        }

        isCustomButtonSelectionRef.current = false;
    };

    const dayPickerProps: Partial<DayPickerProps> = {
        locale,
        mode: 'single' as const,
        month: month,
        onMonthChange: setMonth,
        selected: selectedDate,
        onSelect: handleSelectDate,
        components: {
            DayButton: (props: DayButtonProps) => <DayButton {...props} />,
        },
        disabled: disabledCondition,
    };

    const prevValidationRef = useRef(isBoxValid(boxState));
    useEffect(() => {
        const currentValid = isBoxValid(boxState);

        if (prevValidationRef.current !== currentValid) {
            prevValidationRef.current = currentValid;
            onValidationChange?.(currentValid);
        }
    }, [boxState, onValidationChange]);

    return (
        <DatePicker className={className} ref={ref}>
            <DatePicker.Input
                className="mb-[10px] mt-[9px] px-[14px]"
                showTime={showTime}
                state={boxState}
                dateInput={{
                    value: dateState.currentValue,
                    placeholder: placeholder?.date,
                    onChange: dateInput.onChange,
                    onKeyDown: dateInput.onKeyDown,
                    onBlur: handleFilteredDateBlur,
                    ref: dateInput.ref,
                }}
                timeInput={
                    showTime
                        ? {
                              value: timeState.currentValue,
                              placeholder: placeholder?.time,
                              onChange: timeInput.onChange,
                              onKeyDown: timeInput.onKeyDown,
                              onBlur: handleFilteredTimeBlur,
                              ref: timeInput.ref,
                          }
                        : undefined
                }
                onBoxFocus={handleInputFocus}
            >
                <Tooltip
                    className={`${!isBoxValid(boxState) ? '' : 'invisible'}`}
                    text={getValidationMessage(boxState.validation, validationMessages)}
                    place={'right'}
                >
                    <InfoIcon className={'h-[20px] w-[20px] align-middle text-red-600'} />
                </Tooltip>
            </DatePicker.Input>
            <div onMouseDown={handleContentMouseDown} onMouseUp={handleContentMouseUp}>
                <DatePicker.Content dayPickerProps={dayPickerProps} />
            </div>
            <DatePicker.Tools
                deleteButton={{
                    text: buttonText.delete,
                    onClick: handleDeleteDate,
                }}
                todayButton={{
                    text: buttonText.today,
                    onClick: handleSetToday,
                }}
            />
        </DatePicker>
    );
};

function DayButton(props: DayButtonProps) {
    const { modifiers, disabled } = props;

    const { selected: isSelected, today: isToday, outside: isOutside } = modifiers;

    const getButtonClasses = () => {
        const base = 'w-full h-full flex items-center justify-center rounded-full border text-r14 relative';
        const hover = 'hover:bg-blue-100 hover:border-blue-600';

        if (disabled) {
            return `${base} border-transparent text-grey-20 bg-transparent`;
        }

        if (isSelected) {
            return `${base} text-white border-blue-600 bg-blue-600`;
        }

        if (isToday) {
            return `${base} text-blue-600 border-blue-600 ${hover}`;
        }

        if (isOutside) {
            return `${base} border-transparent text-grey-50 ${hover}`;
        }

        return `${base} border-transparent text-grey-90 ${hover}`;
    };

    return <CustomDayButton buttonClasses={getButtonClasses()} {...props} />;
}

const getValidationMessage = (
    state: ValidationState<'single'>,
    customMessages: ValidationMessages<'single'> = {},
): string => {
    if (state.status === 'valid') return '';

    const messages = {
        ...SINGLE_VALIDATION_MESSAGES,
        ...customMessages,
    };

    return messages[state.error] || '';
};
