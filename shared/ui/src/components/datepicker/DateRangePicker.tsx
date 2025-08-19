import React, { useEffect, useMemo, useRef } from 'react';
import { DateRange, DayButtonProps, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useDateRangePicker } from './DateRangePicker.hooks.ts';
import { DatePicker } from '@/components/datepicker/DatePicker.tsx';
import { CustomDayButton } from '@/components/datepicker/DatePicker.custom.tsx';
import {
    CustomDatePickerProps,
    DEFAULT_BUTTON_TEXT_GROUP,
    DEFAULT_LOCALE,
} from '@/components/datepicker/DatePicker.types.ts';

export type BoxType = 'start' | 'end';

export type DateRangePickerProps = CustomDatePickerProps & {
    placeholder?: {
        startDate?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
    };
    startValue: Date | undefined;
    endValue: Date | undefined;
    onChange?: (date: DateRange) => void;
    onValidationChange?: (validation: { start: boolean; end: boolean }) => void;
};

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
        classNames: {
            day: 'w-full aspect-square text-r14 h-[36px]',
        },
    };

    const validationState = useMemo(
        () => ({
            start: boxState.start.isValid,
            end: boxState.end.isValid,
        }),
        [boxState.start.isValid, boxState.end.isValid],
    );
    useEffect(() => {
        onValidationChange?.(validationState);
    }, [validationState, onValidationChange]);

    return (
        <DatePicker className={className} ref={ref}>
            <div className="flex w-full flex-col gap-[8px] pb-[10px] pt-[9px]">
                <DatePicker.Input
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
                />
                <DatePicker.Input
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
                />
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
    const { modifiers, active } = props;

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

        if (isSameDay) return base;

        const gradientBase = 'before:from-transparent before:from-50% before:to-blue-100 before:to-50%';

        if (isStart) return `${base} before:bg-gradient-to-r ${gradientBase}`;
        if (isEnd) return `${base} before:bg-gradient-to-l ${gradientBase}`;
        if (isMiddle) return `${base} before:bg-blue-100`;

        return base;
    };

    const getButtonClasses = () => {
        const base =
            'relative w-full h-full p-[2px] flex items-center justify-center rounded-full border text-r14 hover:border-blue-600';

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
        if (isOutside) return `${base} border-transparent text-grey-20 hover:bg-blue-100`;

        return `${base} border-transparent text-grey-90 hover:bg-blue-100`;
    };

    return <CustomDayButton containerClasses={getBgClasses()} buttonClasses={getButtonClasses()} {...props} />;
}
