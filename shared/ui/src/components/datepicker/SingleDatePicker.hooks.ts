import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getHours, getMinutes, isSameMonth, startOfDay } from 'date-fns';
import {
    combineDateTime,
    formatDate,
    formatTime,
    isEmptyValue,
    isInvalidValue,
    validateDate,
    validateTime,
} from '@/components/datepicker/DatePicker.utils';
import { SingleDatePickerProps } from '@/components/datepicker/SingleDatePicker';
import {
    BoxState,
    DEFAULT_BOX_STATE,
    DEFAULT_DATE_STATE,
    DEFAULT_TIME_STATE,
    INVALID_TIME_STATE,
    isBoxValid,
    ParsedDate,
    ParsedTime,
    VALID_STATE,
    ValidationState,
} from '@/components/datepicker/DatePicker.types';

type Props = Pick<
    SingleDatePickerProps,
    'showTime' | 'isOpen' | 'value' | 'onChange' | 'onClose' | 'disabledCondition'
>;

export const INVALID_DATE_STATE = {
    status: 'invalid',
    error: 'invalidDate',
} as const;

export const useSingleDatePicker = ({
    showTime = false,
    isOpen = false,
    value,
    disabledCondition,
    onChange,
    onClose,
}: Props) => {
    // input refs
    const dateInputRef = useRef<HTMLInputElement>(null);
    const timeInputRef = useRef<HTMLInputElement>(null);

    const [boxState, setBoxState] = useState<BoxState<'single'>>(DEFAULT_BOX_STATE);

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

    const isDisabled = useCallback((date: Date) => !!disabledCondition?.(date), [disabledCondition]);

    const updateDateWithTime = (date?: Date, time?: { hours: number; minutes: number }): Date | undefined => {
        if (!date) return undefined;
        if (!showTime) return date;

        return combineDateTime(date, time?.hours || 0, time?.minutes || 0);
    };

    const validate = useCallback(
        (inputDateState?: ParsedDate, inputTimeState?: ParsedTime): ValidationState<'single'> => {
            const currentDateState = inputDateState || dateState;
            const currentTimeState = inputTimeState || timeState;

            if (!currentDateState || !currentTimeState) {
                return INVALID_DATE_STATE;
            }

            // 빈 값인 경우 유효함
            if (isEmptyValue(currentDateState) && (!showTime || isEmptyValue(currentTimeState))) {
                return VALID_STATE;
            }

            // 날짜 파싱 실패한 경우
            if (isInvalidValue(currentDateState)) {
                return INVALID_DATE_STATE;
            }

            // 비활성화된 날짜인 경우
            if (isDisabled(startOfDay(currentDateState.parsedValue!))) {
                return INVALID_DATE_STATE;
            }

            if (showTime && isInvalidValue(currentTimeState)) {
                return INVALID_TIME_STATE;
            }

            return VALID_STATE;
        },
        [dateState, timeState, isDisabled, showTime],
    );

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
        if (isBoxValid(boxState) && dateState.parsedValue) {
            if (!isSameMonth(dateState.parsedValue, month)) {
                setMonth(dateState.parsedValue);
            }
        }
    };

    const handleSelectDate = useCallback(
        (selectedValue: Date | undefined) => {
            initFocusState();

            const dateToUse = selectedValue || dateState.parsedValue;
            if (!dateToUse || isDisabled(startOfDay(dateToUse))) return;

            if (selectedValue) {
                setSelectedDate(selectedValue);
                setDateState({
                    parsedValue: selectedValue,
                    currentValue: formatDate(selectedValue),
                });
            }

            setMonth(dateToUse);

            const validation = validate(
                selectedValue ? { parsedValue: selectedValue, currentValue: formatDate(selectedValue) } : dateState,
                timeState,
            );
            const isValid = validation.status === 'valid';

            setBoxState((prev) => ({
                ...prev,
                validation,
            }));

            if (isValid) {
                onChange?.(updateDateWithTime(dateToUse, timeState.parsedValue));
            }
        },
        [dateState, isDisabled, onChange, timeState, updateDateWithTime, validate],
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

            const validation = validate(newDateState, timeState);
            const isValid = validation.status === 'valid';

            setDateState(newDateState);
            setBoxState((prev) => ({
                ...prev,
                validation,
                isFocused: isEditDone ? !isValid : false,
            }));

            if (!isValid) return;

            dateInputRef.current?.blur();

            if (parsedDate) {
                setSelectedDate(parsedDate);
                setMonth(parsedDate);

                if (showTime && parsedTime) {
                    onChange?.(updateDateWithTime(parsedDate, parsedTime));
                } else {
                    onChange?.(parsedDate);
                }
            }
        },
        [dateState, timeState, validate, value, showTime, onChange, updateDateWithTime],
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
                const validationTime = validateTime(timeState.currentValue);
                newTimeState = validationTime.parsedValue
                    ? {
                          ...validationTime,
                          currentValue: formatTime(validationTime.parsedValue),
                      }
                    : validationTime;
            }

            const { parsedValue: parsedTime } = newTimeState;
            const { parsedValue: parsedDate } = dateState;

            const validationState = validate(dateState, newTimeState);
            const isValid = validationState.status === 'valid';

            setTimeState(newTimeState);
            setBoxState((prev) => ({
                ...prev,
                validation: validationState,
                isFocused: isEditDone ? !isValid : false,
            }));

            if (!isValid) return;

            timeInputRef.current?.blur();

            if (parsedDate) {
                onChange?.(updateDateWithTime(parsedDate, parsedTime));
            }
        },
        [showTime, timeState, dateState, validate, value, onChange, updateDateWithTime],
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
