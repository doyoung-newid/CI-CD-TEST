import React, { useEffect, useMemo, useRef } from 'react';
import { DateRange, DayButtonProps, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useDateRangePicker } from './DateRangePicker.hooks';
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

export const RANGE_VALIDATION_MESSAGES: Record<ValidationErrorMap['range'], string> = {
    invalidRange: 'Invalid range',
    exceedingMaxDays: 'Set up to {maxDays} days.',
    invalidTime: 'Invalid time',
};

export type BoxType = 'start' | 'end';

export interface DateRangePickerProps extends BaseDatePickerProps {
    placeholder?: {
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
    };
    startValue: Date | undefined;
    endValue: Date | undefined;
    maxDays?: number;
    validationMessages?: ValidationMessages<'range'>;
    onChange?: (date: DateRange) => void;
    onValidationChange?: (validation: { start: boolean; end: boolean }) => void;
}

export const DateRangePicker = ({
    className = '',
    showTime = false,
    isOpen = false,
    locale = DEFAULT_LOCALE,
    buttonText = DEFAULT_BUTTON_TEXT_GROUP,
    placeholder = {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
    },
    startValue,
    endValue,
    maxDays,
    validationMessages = RANGE_VALIDATION_MESSAGES,
    disabledCondition = () => false,
    onChange,
    onClose,
    onValidationChange,
    ref,
}: DateRangePickerProps) => {
    const isCustomButtonSelectionRef = useRef(false);

    const {
        range,
        boxState,
        startInput,
        endInput,
        month,
        setMonth,
        initFocusState,
        handleSelectRange,
        handleDeleteDate,
        handleSetToday,
        handleInputFocus,
    } = useDateRangePicker({
        showTime,
        startValue,
        endValue,
        onChange,
        onClose,
        isOpen,
        disabledCondition,
        maxDays,
    });

    const activeBox: BoxType = boxState.start.isActive ? 'start' : 'end';

    const handleDateMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as Element;

        isCustomButtonSelectionRef.current = !!(target.closest('.btn-day') || target.closest('.btn-month'));
    };

    const handleDateMouseUp = () => {
        requestAnimationFrame(initFocusState);
    };

    const handleCustomBlur = (onBlur: (isEditDone: boolean) => void) => {
        if (!isCustomButtonSelectionRef.current) {
            onBlur(false);
        }
        isCustomButtonSelectionRef.current = false;
    };

    const dayPickerProps: Partial<DayPickerProps> = {
        locale,
        mode: 'range' as const,
        month: month,
        onMonthChange: setMonth,
        selected: range,
        onSelect: handleSelectRange,
        components: {
            DayButton: (props: DayButtonProps) => <DayButton {...props} active={activeBox} />,
        },
        disabled: disabledCondition,
        max: maxDays,
        classNames: {
            day: 'w-full aspect-square text-r14 h-[36px]',
        },
    };

    const validationState = useMemo(
        () => ({
            start: isBoxValid(boxState.start),
            end: isBoxValid(boxState.end),
        }),
        [boxState.start, boxState.end],
    );
    useEffect(() => {
        onValidationChange?.(validationState);
    }, [validationState, onValidationChange]);

    return (
        <DatePicker className={className} ref={ref}>
            <div className="flex w-full flex-col gap-[8px] pb-[10px] pt-[9px]">
                <DatePicker.Input
                    className={'pl-[14px] pr-[4px]'}
                    state={boxState.start}
                    showTime={showTime}
                    dateInput={{
                        value: startInput.date.state.currentValue,
                        placeholder: placeholder?.startDate,
                        onChange: startInput.date.onChange,
                        onKeyDown: startInput.date.onKeyDown,
                        onBlur: () => handleCustomBlur(startInput.date.onBlur),
                        ref: startInput.date.ref,
                    }}
                    timeInput={
                        showTime
                            ? {
                                  value: startInput.time.state.currentValue,
                                  placeholder: placeholder?.startTime,
                                  onChange: startInput.time.onChange,
                                  onKeyDown: startInput.time.onKeyDown,
                                  onBlur: () => handleCustomBlur(startInput.time.onBlur),
                                  ref: startInput.time.ref,
                              }
                            : undefined
                    }
                    onBoxFocus={() => handleInputFocus('start')}
                >
                    <Tooltip
                        className={`${boxState.start.isActive && !isBoxValid(boxState.start) ? '' : 'invisible'}`}
                        text={getValidationMessage(boxState.start.validation, maxDays, validationMessages)}
                        place={'right'}
                    >
                        <InfoIcon className={'h-[20px] w-[20px] align-middle text-red-600'} />
                    </Tooltip>
                </DatePicker.Input>
                <DatePicker.Input
                    className={'pl-[14px] pr-[4px]'}
                    state={boxState.end}
                    showTime={showTime}
                    dateInput={{
                        value: endInput.date.state.currentValue,
                        placeholder: placeholder?.endDate,
                        onChange: endInput.date.onChange,
                        onKeyDown: endInput.date.onKeyDown,
                        onBlur: () => handleCustomBlur(endInput.date.onBlur),
                        ref: endInput.date.ref,
                    }}
                    timeInput={
                        showTime
                            ? {
                                  value: endInput.time.state.currentValue,
                                  placeholder: placeholder?.endTime,
                                  onChange: endInput.time.onChange,
                                  onKeyDown: endInput.time.onKeyDown,
                                  onBlur: () => handleCustomBlur(endInput.time.onBlur),
                                  ref: endInput.time.ref,
                              }
                            : undefined
                    }
                    onBoxFocus={() => handleInputFocus('end')}
                >
                    <Tooltip
                        className={`${boxState.end.isActive && !isBoxValid(boxState.end) ? '' : 'invisible'}`}
                        text={getValidationMessage(boxState.end.validation, maxDays, validationMessages)}
                        place={'right'}
                    >
                        <InfoIcon className={'flex h-[20px] w-[20px] align-middle text-red-600'} />
                    </Tooltip>
                </DatePicker.Input>
            </div>
            <div onMouseDown={handleDateMouseDown} onMouseUp={handleDateMouseUp}>
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

function DayButton(props: DayButtonProps & { active: BoxType }) {
    const { modifiers, active, disabled } = props;

    const {
        range_start: isStart,
        range_end: isEnd,
        range_middle: isMiddle,
        today: isToday,
        outside: isOutside,
    } = modifiers;

    const isSameDay = isStart && isEnd;

    const getBgClasses = () => {
        const base = 'before:content-[""] before:absolute before:inset-x-0 before:inset-y-[2px] before:z-0';

        if (isSameDay || disabled) return base;

        const gradientBase = 'before:from-transparent before:from-50% before:to-blue-100 before:to-50%';

        if (isStart) return `${base} before:bg-gradient-to-r ${gradientBase}`;
        if (isEnd) return `${base} before:bg-gradient-to-l ${gradientBase}`;
        if (isMiddle) return `${base} before:bg-blue-100`;

        return base;
    };

    const getButtonClasses = () => {
        let base = 'relative w-full h-full p-[2px] flex items-center justify-center rounded-full border text-r14';

        if (disabled) {
            return `${base} border-transparent text-grey-20 bg-transparent`;
        }

        base += ` hover:border-blue-600`;

        if (isMiddle) {
            return `${base} border-transparent text-grey-90 bg-transparent`;
        }

        if (isStart || isEnd) {
            const isActiveRange = (isStart && active === 'start') || (isEnd && active === 'end');
            return isActiveRange
                ? `${base} text-white border-blue-600 bg-blue-600`
                : `${base} text-grey-90 border-blue-300 bg-blue-300`;
        }

        if (isToday) return `${base} text-blue-600 border-blue-600 hover:bg-blue-100`;
        if (isOutside) return `${base} border-transparent text-grey-50 hover:bg-blue-100`;

        return `${base} border-transparent text-grey-90 hover:bg-blue-100`;
    };

    return <CustomDayButton containerClasses={getBgClasses()} buttonClasses={getButtonClasses()} {...props} />;
}

const getValidationMessage = (
    state: ValidationState<'range'>,
    maxDays?: number,
    customMessages: ValidationMessages<'range'> = {},
): string => {
    if (state.status === 'valid') return '';

    const messages = {
        ...RANGE_VALIDATION_MESSAGES,
        ...customMessages,
    };

    if (state.error === 'exceedingMaxDays') {
        return messages.exceedingMaxDays.replace('{maxDays}', String(maxDays ?? 0));
    }

    return messages[state.error] || '';
};
