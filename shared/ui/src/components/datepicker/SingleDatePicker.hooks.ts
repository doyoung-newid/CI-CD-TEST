import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getHours, getMinutes, isSameMonth, startOfDay } from 'date-fns';
import {
    combineDateTime,
    formatDate,
    formatTime,
    isEmptyValue,
    validateDate,
    validateTime,
} from '@/components/datepicker/DatePicker.utils.ts';
import { SingleDatePickerProps } from '@/components/datepicker/SingleDatePicker.tsx';
import {
    BoxState,
    DEFAULT_DATE_STATE,
    DEFAULT_TIME_STATE,
    ParsedDate,
    ParsedTime,
} from '@/components/datepicker/DatePicker.types.ts';

type Props = Pick<SingleDatePickerProps, 'showTime' | 'isOpen' | 'value' | 'onChange' | 'onClose'>;

const DEFAULT_BOX_STATE = {
    isValid: true,
    isFocused: false,
    isActive: true,
};

export const useSingleDatePicker = ({ showTime = false, isOpen = false, value, onChange, onClose }: Props) => {
    // input refs
    const dateInputRef = useRef<HTMLInputElement>(null);
    const timeInputRef = useRef<HTMLInputElement>(null);

    const [boxState, setBoxState] = useState<BoxState>(DEFAULT_BOX_STATE);

    // input values
    const [dateState, setDateState] = useState<ParsedDate>({
        parsedValue: value,
        currentValue: value ? formatDate(value) : '',
    });

    const [timeState, setTimeState] = useState<ParsedTime>({
        parsedValue: value
            ? {
                  hours: getHours(value),
                  minutes: getMinutes(value),
              }
            : undefined,
        currentValue: value ? formatTime(value) : '',
    });

    // picker states
    const [month, setMonth] = useState(() => {
        if (value) return startOfDay(value);
        return startOfDay(new Date());
    });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

    const updateDateWithTime = (date?: Date, time?: { hours: number; minutes: number }): Date | undefined => {
        if (!date) return undefined;
        if (!showTime) return date;

        return combineDateTime(date, time?.hours || 0, time?.minutes || 0);
    };

    const initFocusState = () => {
        setBoxState((prev) => ({
            ...prev,
            isFocused: false,
        }));
    };

    const handleInputFocus = () => {
        setBoxState((prev) => ({
            ...prev,
            isFocused: true,
        }));

        // 유효한 날짜가 있으면 해당 월로 이동
        if (boxState.isValid && dateState.parsedValue) {
            if (!isSameMonth(dateState.parsedValue, month)) {
                setMonth(dateState.parsedValue);
            }
        }
    };

    const handleSelectDate = useCallback(
        (selectedValue: Date | undefined) => {
            initFocusState();

            const dateToUse = selectedValue || dateState.parsedValue;
            if (!dateToUse) return;

            if (selectedValue) {
                setSelectedDate(selectedValue);
                setDateState({
                    parsedValue: selectedValue,
                    currentValue: formatDate(selectedValue),
                });
            }

            setMonth(dateToUse);
            setBoxState((prev) => ({
                ...prev,
                isValid: true,
            }));

            onChange?.(updateDateWithTime(dateToUse, timeState.parsedValue));
        },
        [dateState.parsedValue, onChange, timeState.parsedValue, updateDateWithTime],
    );

    const handleDateChange = useCallback((value: string) => {
        setDateState((prev) => ({ ...prev, currentValue: value }));
    }, []);

    const handleDateBlur = useCallback(
        (isEditDone: boolean) => {
            let newDateState: ParsedDate;

            if (dateState.currentValue?.trim()) {
                newDateState = validateDate(dateState.currentValue);
            } else {
                const fallbackDate = dateState.parsedValue || value || startOfDay(new Date());
                newDateState = {
                    parsedValue: fallbackDate,
                    currentValue: formatDate(fallbackDate),
                };
            }

            const { parsedValue: parsedDate } = newDateState;
            const { parsedValue: parsedTime } = timeState;
            const isValid = !!parsedDate;

            setDateState(newDateState);
            setBoxState((prev) => ({
                ...prev,
                isValid,
                isFocused: isEditDone ? !isValid : false,
            }));

            if (!isValid) return;

            dateInputRef.current?.blur();

            setSelectedDate(parsedDate);
            setMonth(parsedDate);

            if (showTime && parsedTime) {
                onChange?.(updateDateWithTime(parsedDate, parsedTime));
            } else {
                onChange?.(parsedDate);
            }
        },
        [dateState, value, showTime, timeState, updateDateWithTime, onChange],
    );

    const handleDateKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleDateBlur(true);
            }
        },
        [handleDateBlur],
    );

    const handleTimeChange = useCallback((value: string) => {
        setTimeState((prev) => ({ ...prev, currentValue: value }));
    }, []);

    const handleTimeBlur = useCallback(
        (isEditDone: boolean) => {
            if (!showTime) return;

            let newTimeState = DEFAULT_TIME_STATE;

            if (isEmptyValue(timeState)) {
                if (value) {
                    const hours = getHours(value);
                    const minutes = getMinutes(value);
                    newTimeState = {
                        parsedValue: {
                            hours,
                            minutes,
                        },
                        currentValue: formatTime({ hours, minutes }),
                    };
                }
            } else {
                const validation = validateTime(timeState.currentValue);
                newTimeState = validation.parsedValue
                    ? {
                          ...validation,
                          currentValue: formatTime(validation.parsedValue),
                      }
                    : validation;
            }

            const { parsedValue: parsedTime } = newTimeState;
            const { parsedValue: parsedDate } = dateState;
            const isValid = !!parsedTime;

            setTimeState(newTimeState);
            setBoxState((prev) => ({
                ...prev,
                isValid,
                isFocused: isEditDone ? !isValid : false,
            }));

            if (!isValid) return;

            timeInputRef.current?.blur();

            if (parsedDate) {
                onChange?.(updateDateWithTime(parsedDate, parsedTime));
            }
        },
        [showTime, timeState, dateState, value, onChange, updateDateWithTime],
    );

    const handleTimeKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleTimeBlur(true);
            }
        },
        [handleTimeBlur],
    );

    const handleDeleteDate = useCallback(() => {
        setBoxState(DEFAULT_BOX_STATE);
        setDateState(DEFAULT_DATE_STATE);
        setTimeState({
            parsedValue: undefined,
            currentValue: '',
        });
        setSelectedDate(undefined);
        onChange?.(undefined);
        onClose?.();
    }, [onChange, onClose]);

    const handleSetToday = useCallback(() => {
        handleSelectDate(startOfDay(new Date()));
    }, [handleSelectDate]);

    // 초기 값이 없는 경우 오늘 날짜로 설정
    useEffect(() => {
        if (!isOpen || value) return;

        const isAllEmpty = isEmptyValue(dateState) && (!showTime || isEmptyValue(timeState));
        if (!isAllEmpty) return;

        const today = startOfDay(new Date());

        setDateState({
            parsedValue: today,
            currentValue: formatDate(today),
        });

        if (showTime) {
            setTimeState(DEFAULT_TIME_STATE);
        }

        setSelectedDate(today);
    }, [isOpen, value, showTime]);

    // props로 변경시 내부 상태 동기화
    useEffect(() => {
        if (!value) return;

        setSelectedDate(value);
        setDateState({
            parsedValue: value,
            currentValue: formatDate(value),
        });

        if (showTime) {
            setTimeState({
                parsedValue: {
                    hours: getHours(value),
                    minutes: getMinutes(value),
                },
                currentValue: formatTime(value),
            });
        }
    }, [value, showTime]);

    return {
        selectedDate,
        dateState,
        timeState,
        boxState,
        dateInput: {
            state: dateState,
            onChange: handleDateChange,
            onBlur: handleDateBlur,
            onKeyDown: handleDateKeyDown,
            ref: dateInputRef,
        },
        timeInput: {
            state: timeState,
            onChange: handleTimeChange,
            onBlur: handleTimeBlur,
            onKeyDown: handleTimeKeyDown,
            ref: timeInputRef,
        },
        month,
        setMonth,
        handleInputFocus,
        initFocusState,
        handleSelectDate,
        handleDeleteDate,
        handleSetToday,
    };
};
