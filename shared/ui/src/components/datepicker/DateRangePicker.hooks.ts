import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
    differenceInDays,
    getHours,
    getMinutes,
    isAfter,
    isBefore,
    isSameDay,
    isSameMonth,
    startOfDay,
} from 'date-fns';
import { BoxType, DateRangePickerProps } from '@/components/datepicker/DateRangePicker';
import {
    combineDateTime,
    formatDate,
    formatTime,
    isEmptyValue,
    isInvalidValue,
    isWithinDays,
    validateDate,
    validateTime,
} from '@/components/datepicker/DatePicker.utils';
import {
    ParsedDate,
    ParsedTime,
    BoxState,
    DEFAULT_BOX_STATE,
    DEFAULT_DATE_STATE,
    DEFAULT_TIME_STATE,
    INVALID_TIME_STATE,
    isBoxValid,
    VALID_STATE,
    ValidationState,
} from '@/components/datepicker/DatePicker.types';

type Props = Pick<
    DateRangePickerProps,
    'showTime' | 'isOpen' | 'startValue' | 'endValue' | 'onChange' | 'onClose' | 'disabledCondition' | 'maxDays'
>;

export const INVALID_RANGE_STATE = {
    status: 'invalid',
    error: 'invalidRange',
} as const;

export const INVALID_MAX_DAYS_STATE = {
    status: 'invalid',
    error: 'exceedingMaxDays',
} as const;

const DEFAULT_RANGE_BOX_STATE = {
    start: DEFAULT_BOX_STATE,
    end: { ...DEFAULT_BOX_STATE, isActive: false },
};

export const useDateRangePicker = ({
    showTime = false,
    isOpen = false,
    startValue,
    endValue,
    disabledCondition,
    onChange,
    onClose,
    maxDays,
}: Props) => {
    // input refs
    const startDateInputRef = useRef<HTMLInputElement>(null);
    const startTimeInputRef = useRef<HTMLInputElement>(null);
    const endDateInputRef = useRef<HTMLInputElement>(null);
    const endTimeInputRef = useRef<HTMLInputElement>(null);

    const [boxState, setBoxState] = useState<Record<BoxType, BoxState<'range'>>>(DEFAULT_RANGE_BOX_STATE);

    // input values
    const [startDate, setStartDate] = useState<ParsedDate>({
        parsedValue: startValue,
        currentValue: formatDate(startValue),
    });

    const [startTime, setStartTime] = useState<ParsedTime>({
        parsedValue: startValue
            ? {
                  hours: getHours(startValue),
                  minutes: getMinutes(startValue),
              }
            : undefined,
        currentValue: startValue ? formatTime(startValue) : '',
    });

    const [endDate, setEndDate] = useState<ParsedDate>({
        parsedValue: endValue,
        currentValue: formatDate(endValue),
    });

    const [endTime, setEndTime] = useState<ParsedTime>({
        parsedValue: endValue
            ? {
                  hours: getHours(endValue),
                  minutes: getMinutes(endValue),
              }
            : undefined,
        currentValue: endValue ? formatTime(endValue) : '',
    });

    // picker states
    const [month, setMonth] = useState(() => {
        if (startValue) return startOfDay(startValue);
        if (endValue) return startOfDay(endValue);
        return startOfDay(new Date());
    });

    const [range, setRange] = useState<DateRange>({
        from: startValue,
        to: endValue,
    });

    const isDisabled = useCallback((date: Date) => !!disabledCondition?.(date), [disabledCondition]);

    const updateDateWithTime = useCallback(
        (date?: Date, time?: { hours: number; minutes: number }): Date | undefined => {
            if (!date) return undefined;
            if (!showTime) return date;

            return combineDateTime(date, time?.hours || 0, time?.minutes || 0);
        },
        [showTime],
    );

    const validate = useCallback(
        (
            startDateState?: ParsedDate,
            startTimeState?: ParsedTime,
            endDateState?: ParsedDate,
            endTimeState?: ParsedTime,
        ): ValidationState<'range'> => {
            const currentStartDate = startDateState || startDate;
            const currentStartTime = startTimeState || startTime;
            const currentEndDate = endDateState || endDate;
            const currentEndTime = endTimeState || endTime;

            const isDatesEmpty = isEmptyValue(currentStartDate) && isEmptyValue(currentEndDate);
            const isTimesEmpty = isEmptyValue(currentStartTime) && isEmptyValue(currentEndTime);

            // 빈 값인 경우 유효함
            if (isDatesEmpty && (!showTime || isTimesEmpty)) {
                return VALID_STATE;
            }

            // 날짜 파싱 실패한 경우
            if (isInvalidValue(currentStartDate) || isInvalidValue(currentEndDate)) {
                return INVALID_RANGE_STATE;
            }

            const parsedStartDate = currentStartDate.parsedValue!;
            const parsedEndDate = currentEndDate.parsedValue!;

            // 시작일이 종료일보다 늦은 경우
            if (isAfter(startOfDay(parsedStartDate), startOfDay(parsedEndDate))) {
                return INVALID_RANGE_STATE;
            }

            // 비활성화된 날짜인 경우
            if (isDisabled(startOfDay(parsedStartDate)) || isDisabled(startOfDay(parsedEndDate))) {
                return INVALID_RANGE_STATE;
            }

            // 최대 선택 일자 제한된 경우
            if (maxDays && !isWithinDays(parsedStartDate, parsedEndDate, maxDays)) {
                return INVALID_MAX_DAYS_STATE;
            }

            if (showTime) {
                if (isInvalidValue(currentStartTime) || isInvalidValue(currentEndTime)) {
                    return INVALID_TIME_STATE;
                }

                const parsedStartTime = currentStartTime.parsedValue!;
                const parsedEndTime = currentEndTime.parsedValue!;

                if (isSameDay(parsedStartDate, parsedEndDate)) {
                    const startDateTime = combineDateTime(
                        parsedStartDate,
                        parsedStartTime.hours,
                        parsedStartTime.minutes,
                    );
                    const endDateTime = combineDateTime(parsedEndDate, parsedEndTime.hours, parsedEndTime.minutes);

                    if (isAfter(startDateTime, endDateTime)) {
                        return INVALID_TIME_STATE;
                    }
                }
            }

            return VALID_STATE;
        },
        [endDate, endTime, showTime, startDate, startTime, isDisabled, maxDays],
    );

    const initFocusState = () => {
        setBoxState((prev) => ({
            start: {
                ...prev.start,
                isFocused: false,
            },
            end: {
                ...prev.end,
                isFocused: false,
            },
        }));
    };

    const handleInputFocus = useCallback(
        (type: BoxType) => {
            const isStart = type === 'start';

            setBoxState((prev) => ({
                start: {
                    ...prev.start,
                    isActive: isStart,
                    isFocused: isStart,
                },
                end: {
                    ...prev.end,
                    isActive: !isStart,
                    isFocused: !isStart,
                },
            }));

            const targetDate = isStart ? startDate.parsedValue : endDate.parsedValue;
            const isValidBox = isStart ? isBoxValid(boxState.start) : isBoxValid(boxState.end);

            if (targetDate && isValidBox) {
                if (!isSameMonth(targetDate, month)) {
                    setMonth(targetDate);
                }
            }
        },
        [boxState, startDate, endDate, month],
    );

    const handleSelectStartDate = useCallback(
        (selectedDate: Date) => {
            const timeToUse = startTime.parsedValue || DEFAULT_TIME_STATE.parsedValue;

            const newStartDate = {
                parsedValue: selectedDate,
                currentValue: formatDate(selectedDate),
            };
            const newStartTime = !showTime
                ? startTime
                : {
                      parsedValue: timeToUse,
                      currentValue: formatTime(timeToUse),
                  };

            let newEndDate = endDate;
            let newEndTime = endTime;

            // 시작일이 종료일보다 뒤에 오는 경우
            const isStartAfterEnd = endDate.parsedValue
                ? isBefore(startOfDay(endDate.parsedValue), startOfDay(selectedDate))
                : Boolean(endDate.currentValue?.trim());

            // 최대 지정 가능 기간 확인
            const isExceedingMaxDays =
                endDate.parsedValue && maxDays
                    ? differenceInDays(endDate.parsedValue, selectedDate) + 1 > maxDays
                    : false;

            const shouldUpdateEndDate = isStartAfterEnd || isExceedingMaxDays;

            // 종료일을 시작일과 같게 변경
            if (shouldUpdateEndDate) {
                newEndDate = {
                    parsedValue: selectedDate,
                    currentValue: formatDate(selectedDate),
                };
                if (showTime) {
                    newEndTime = {
                        parsedValue: timeToUse,
                        currentValue: formatTime(timeToUse),
                    };
                }
            }

            setStartDate(newStartDate);
            setEndDate(newEndDate);
            if (showTime) {
                setStartTime(newStartTime);
                setEndTime(newEndTime);
            }

            const validation = validate(newStartDate, newStartTime, newEndDate, newEndTime);
            const isValid = validation.status === 'valid';

            setBoxState((prev) => ({
                start: {
                    validation,
                    isActive: !isValid,
                    isFocused: false,
                },
                end: {
                    ...prev.end,
                    validation,
                    isActive: isValid,
                },
            }));

            if (!isValid) return;

            const targetDate = newEndDate.parsedValue;
            if (targetDate && !isSameMonth(targetDate, month)) {
                setMonth(targetDate);
            }

            const newRange: DateRange = {
                from: updateDateWithTime(newStartDate.parsedValue, newStartTime.parsedValue),
                to: updateDateWithTime(newEndDate.parsedValue, newEndTime.parsedValue),
            };
            setRange(newRange);
            onChange?.(newRange);
        },
        [startTime, showTime, endDate, endTime, maxDays, validate, month, updateDateWithTime, onChange],
    );

    const handleSelectEndDate = useCallback(
        (selectedDate: Date) => {
            const timeToUse = endTime.parsedValue || DEFAULT_TIME_STATE.parsedValue;

            const newEndDate = {
                parsedValue: selectedDate,
                currentValue: formatDate(selectedDate),
            };
            const newEndTime = !showTime
                ? endTime
                : {
                      parsedValue: timeToUse,
                      currentValue: formatTime(timeToUse),
                  };

            let newStartDate = startDate;
            let newStartTime = startTime;

            // 종료일이 시작일보다 앞에 오는 경우
            const isEndBeforeStart = startDate.parsedValue
                ? isAfter(startOfDay(startDate.parsedValue), startOfDay(selectedDate))
                : Boolean(startDate.currentValue?.trim());

            // 최대 지정 가능 기간 확인
            const isExceedingMaxDays =
                startDate.parsedValue && maxDays
                    ? differenceInDays(selectedDate, startDate.parsedValue) + 1 > maxDays
                    : false;

            const shouldUpdateEndDate = isEndBeforeStart || isExceedingMaxDays;

            // 시작일을 종료일과 같게 변경
            if (shouldUpdateEndDate) {
                newStartDate = {
                    parsedValue: selectedDate,
                    currentValue: formatDate(selectedDate),
                };

                if (showTime) {
                    newStartTime = {
                        parsedValue: timeToUse,
                        currentValue: formatTime(timeToUse),
                    };
                }
            }

            setStartDate(newStartDate);
            setEndDate(newEndDate);
            if (showTime) {
                setStartTime(newStartTime);
                setEndTime(newEndTime);
            }

            const validation = validate(newStartDate, newStartTime, newEndDate, newEndTime);
            const isValid = validation.status === 'valid';

            setBoxState((prev) => ({
                start: {
                    ...prev.start,
                    validation,
                },
                end: {
                    ...prev.end,
                    validation,
                    isFocused: false,
                },
            }));

            if (!isValid) return;

            const targetDate = newEndDate.parsedValue;
            if (targetDate && !isSameMonth(targetDate, month)) {
                setMonth(targetDate);
            }

            const newRange: DateRange = {
                from: updateDateWithTime(newStartDate.parsedValue, newStartTime.parsedValue),
                to: updateDateWithTime(newEndDate.parsedValue, newEndTime.parsedValue),
            };
            setRange(newRange);
            onChange?.(newRange);
        },
        [endTime, showTime, startDate, startTime, maxDays, validate, month, updateDateWithTime, onChange],
    );

    const handleSelectRange = useCallback(
        (selectedRange: DateRange | undefined) => {
            initFocusState();

            const isStartActive = boxState.start.isActive;
            const handler = isStartActive ? handleSelectStartDate : handleSelectEndDate;

            // undefined(선택 해제) 허용안하므로, 기존 값 다시 반환
            if (!selectedRange || (!selectedRange.from && !selectedRange.to)) {
                const fallbackDate = isStartActive ? range.from : range.to;
                if (fallbackDate) {
                    handler(fallbackDate);
                }
                return;
            }

            let selectedDate: Date | undefined;

            if (selectedRange.from && (!range.from || !isSameDay(selectedRange.from, range.from))) {
                selectedDate = selectedRange.from;
            } else if (selectedRange.to && (!range.to || !isSameDay(selectedRange.to, range.to))) {
                selectedDate = selectedRange.to;
            } else {
                return;
            }

            if (selectedDate) {
                handler(selectedDate);
            }
        },
        [boxState, handleSelectStartDate, handleSelectEndDate, initFocusState, range],
    );

    const handleDateChange = (type: BoxType, value: string) => {
        if (type === 'start') {
            setStartDate((prev) => ({ ...prev, currentValue: value }));
        } else {
            setEndDate((prev) => ({ ...prev, currentValue: value }));
        }
    };

    const handleDateKeyDown = (type: BoxType) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            handleDateBlur(type, true);
        }
    };

    const handleDateBlur = (type: BoxType, isEditDone: boolean) => {
        const isStart = type === 'start';
        const value = isStart ? startDate.currentValue : endDate.currentValue;

        let newStartDate = startDate;
        let newEndDate = endDate;

        if (!value?.trim()) {
            const originalValue = isStart ? startValue : endValue;
            const currentParsedValue = isStart ? startDate.parsedValue : endDate.parsedValue;
            const lastValidValue = isStart ? range.from : range.to;

            const candidates = [lastValidValue, originalValue, currentParsedValue, startOfDay(new Date())].filter(
                Boolean,
            );

            let fallbackDate: Date;
            if (isStart) {
                // 종료일보다 이전 값 선택
                const endDateValue = endDate.parsedValue;
                fallbackDate =
                    candidates.find((date) => !endDateValue || !isAfter(date!, endDateValue)) ||
                    endDateValue ||
                    startOfDay(new Date());
            } else {
                // 시작일보다 이후 값 선택
                const startDateValue = startDate.parsedValue;
                fallbackDate =
                    candidates.find((date) => !startDateValue || !isBefore(date!, startDateValue)) ||
                    startDateValue ||
                    startOfDay(new Date());
            }

            const fallbackState = {
                parsedValue: fallbackDate,
                currentValue: formatDate(fallbackDate),
            };

            if (isStart) {
                newStartDate = fallbackState;
            } else {
                newEndDate = fallbackState;
            }
        } else {
            const validation = validateDate(value);
            if (isStart) {
                newStartDate = validation;
            } else {
                newEndDate = validation;
            }
        }

        const validation = validate(newStartDate, startTime, newEndDate, endTime);
        const isValid = validation.status === 'valid';

        if (isStart) {
            setStartDate(newStartDate);
            setBoxState({
                start: {
                    validation,
                    isFocused: isEditDone ? !isValid : false,
                    isActive: isEditDone ? !isValid : true,
                },
                end: {
                    validation,
                    isFocused: isEditDone ? isValid : false,
                    isActive: isEditDone ? isValid : false,
                },
            });
        } else {
            setEndDate(newEndDate);
            setBoxState((prev) => ({
                start: {
                    ...prev.start,
                    validation,
                },
                end: {
                    ...prev.end,
                    validation,
                    isFocused: isEditDone ? !isValid : false,
                },
            }));
        }

        if (!isValid) return;

        if (isStart) {
            startDateInputRef.current?.blur();
            if (isEditDone) {
                endDateInputRef.current?.focus();
            }
        } else {
            endDateInputRef.current?.blur();
        }

        const targetDate = newEndDate.parsedValue;
        if (targetDate && !isSameMonth(targetDate, month)) {
            setMonth(targetDate);
        }

        const newRange: DateRange = {
            from: updateDateWithTime(newStartDate.parsedValue, startTime.parsedValue),
            to: updateDateWithTime(newEndDate.parsedValue, endTime.parsedValue),
        };
        setRange(newRange);
        onChange?.(newRange);
    };

    const handleTimeChange = (type: BoxType, value: string) => {
        if (type === 'start') {
            setStartTime((prev) => ({ ...prev, currentValue: value }));
        } else {
            setEndTime((prev) => ({ ...prev, currentValue: value }));
        }
    };

    const handleTimeKeyDown = (type: BoxType) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            handleTimeBlur(type, true);
        }
    };

    const handleTimeBlur = (type: BoxType, isEditDone: boolean) => {
        if (!showTime) return;

        const isStart = type === 'start';
        const currentValue = isStart ? startTime.currentValue : endTime.currentValue;

        let newStartTime = startTime;
        let newEndTime = endTime;

        if (!currentValue?.trim()) {
            const originalValue = isStart ? startValue : endValue;

            if (originalValue) {
                const parsedTime = {
                    hours: getHours(originalValue),
                    minutes: getMinutes(originalValue),
                };

                const timeState = {
                    parsedValue: parsedTime,
                    currentValue: formatTime(parsedTime),
                };

                if (isStart) {
                    newStartTime = timeState;
                } else {
                    newEndTime = timeState;
                }
            } else {
                if (isStart) {
                    newStartTime = DEFAULT_TIME_STATE;
                } else {
                    newEndTime = DEFAULT_TIME_STATE;
                }
            }
        } else {
            const validation = validateTime(currentValue);
            if (isStart) {
                newStartTime = validation;
            } else {
                newEndTime = validation;
            }
        }

        const validation = validate(startDate, newStartTime, endDate, newEndTime);
        const isValid = validation.status === 'valid';

        if (isStart) {
            setStartTime(newStartTime);
            setBoxState({
                start: {
                    validation,
                    isFocused: isEditDone ? !isValid : false,
                    isActive: isEditDone ? !isValid : true,
                },
                end: {
                    validation,
                    isFocused: isEditDone ? isValid : false,
                    isActive: isEditDone ? isValid : false,
                },
            });
        } else {
            setEndTime(newEndTime);
            setBoxState((prev) => ({
                start: {
                    ...prev.start,
                    validation,
                },
                end: {
                    ...prev.end,
                    validation,
                    isFocused: isEditDone ? !isValid : false,
                },
            }));
        }

        if (!isValid) return;

        if (isStart) {
            startTimeInputRef.current?.blur();
            if (isEditDone) {
                endTimeInputRef.current?.focus();
            }
        } else {
            endTimeInputRef.current?.blur();
        }

        const targetDate = endDate.parsedValue;
        if (targetDate && !isSameMonth(targetDate, month)) {
            setMonth(targetDate);
        }

        const newRange: DateRange = {
            from: updateDateWithTime(startDate.parsedValue, newStartTime.parsedValue),
            to: updateDateWithTime(endDate.parsedValue, newEndTime.parsedValue),
        };
        setRange(newRange);
        onChange?.(newRange);
    };

    const handleDeleteDate = useCallback(() => {
        setBoxState(DEFAULT_RANGE_BOX_STATE);

        setStartDate(DEFAULT_DATE_STATE);
        setEndDate(DEFAULT_DATE_STATE);

        setStartTime({
            parsedValue: undefined,
            currentValue: '',
        });
        setEndTime({
            parsedValue: undefined,
            currentValue: '',
        });

        setRange({
            from: undefined,
            to: undefined,
        });
        onChange?.({
            from: undefined,
            to: undefined,
        });

        onClose?.();
    }, [onChange, onClose]);

    const handleSetToday = useCallback(() => {
        const today = startOfDay(new Date());

        if (boxState.start.isActive) {
            handleSelectStartDate(today);
        } else if (boxState.end.isActive) {
            handleSelectEndDate(today);
        }
    }, [boxState, handleSelectStartDate, handleSelectEndDate]);

    // 초기 값이 없는 경우 오늘 날짜로 설정
    useEffect(() => {
        if (!isOpen || startValue || endValue) return;

        const isAllEmpty =
            isEmptyValue(startDate) &&
            isEmptyValue(endDate) &&
            (!showTime || (isEmptyValue(startTime) && isEmptyValue(endTime)));
        if (!isAllEmpty) return;

        const today = startOfDay(new Date());

        const defaultDate: ParsedDate = {
            parsedValue: today,
            currentValue: formatDate(today),
        };
        setStartDate(defaultDate);
        setEndDate(defaultDate);

        if (showTime) {
            setStartTime(DEFAULT_TIME_STATE);
            setEndTime(DEFAULT_TIME_STATE);
        }

        setRange({
            from: today,
            to: today,
        });
    }, [isOpen, startValue, endValue, showTime]);

    // props로 받은 값이 변경시 내부 상태 싱크
    useEffect(() => {
        if (startValue) {
            setStartDate({
                parsedValue: startValue,
                currentValue: formatDate(startValue),
            });

            if (showTime) {
                setStartTime({
                    parsedValue: {
                        hours: getHours(startValue),
                        minutes: getMinutes(startValue),
                    },
                    currentValue: formatTime(startValue),
                });
            }
        }
    }, [startValue, showTime]);

    useEffect(() => {
        if (endValue) {
            setEndDate({
                parsedValue: endValue,
                currentValue: formatDate(endValue),
            });

            if (showTime) {
                setEndTime({
                    parsedValue: {
                        hours: getHours(endValue),
                        minutes: getMinutes(endValue),
                    },
                    currentValue: formatTime(endValue),
                });
            }
        }
    }, [endValue, showTime]);

    return {
        boxState,
        handleInputFocus,
        initFocusState,
        range,
        month,
        setMonth,
        handleSelectRange,
        handleDeleteDate,
        handleSetToday,
        startInput: {
            date: {
                state: startDate,
                onChange: (value: string) => handleDateChange('start', value),
                onBlur: (isEditDone: boolean) => handleDateBlur('start', isEditDone),
                onKeyDown: handleDateKeyDown('start'),
                ref: startDateInputRef,
            },
            time: {
                state: startTime,
                onChange: (value: string) => handleTimeChange('start', value),
                onBlur: (isEditDone: boolean) => handleTimeBlur('start', isEditDone),
                onKeyDown: handleTimeKeyDown('start'),
                ref: startTimeInputRef,
            },
        },

        endInput: {
            date: {
                state: endDate,
                onChange: (value: string) => handleDateChange('end', value),
                onBlur: (isEditDone: boolean) => handleDateBlur('end', isEditDone),
                onKeyDown: handleDateKeyDown('end'),
                ref: endDateInputRef,
            },
            time: {
                state: endTime,
                onChange: (value: string) => handleTimeChange('end', value),
                onBlur: (isEditDone: boolean) => handleTimeBlur('end', isEditDone),
                onKeyDown: handleTimeKeyDown('end'),
                ref: endTimeInputRef,
            },
        },
    };
};
