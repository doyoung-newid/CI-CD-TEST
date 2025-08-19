import { Meta, StoryObj } from '@storybook/react';
import { startOfDay } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { SingleDatePickerBox } from '@/index';
import React, { useEffect, useState } from 'react';
import { DEFAULT_BUTTON_TEXT_GROUP } from '@/components/datepicker/DatePicker.types';
import { SINGLE_VALIDATION_MESSAGES } from '@/components/datepicker/SingleDatePicker';

const LOCALES = {
    ko,
    enUS,
};

const meta: Meta<typeof SingleDatePickerBox> = {
    title: 'Shared/DatePicker/Single',
    component: SingleDatePickerBox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        width: {
            control: { type: 'number' },
            description: '박스 가로 픽셀',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '200' },
            },
        },
        buttonText: {
            table: {
                disable: true,
            },
        },
        onChange: {
            table: {
                disable: true,
            },
        },
        placeholder: {
            control: 'text',
            description: '박스 placeholder',
            table: {
                type: {
                    summary: 'text',
                },
            },
        },
        locale: {
            options: Object.keys(LOCALES),
            mapping: LOCALES,
            control: {
                type: 'select',
            },
            description: '달력 언어 설정',
            table: {
                type: {
                    summary: 'date-fns/locale',
                },
                defaultValue: {
                    summary: 'enUS',
                },
            },
        },
        showTime: {
            control: 'boolean',
            description: '시간 필드 표시 여부',
            table: {
                type: { summary: 'boolean' },
            },
        },
        value: {
            control: 'date',
            description: '초기값',
            table: {
                type: { summary: 'Date' },
            },
        },
        disabledCondition: {
            description: '선택할 수 없는 날짜 조건',
            table: {
                type: {
                    summary: '(date: Date) => boolean',
                },
            },
        },
        validationMessages: {
            table: {
                disable: true,
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof SingleDatePickerBox>;

const Example = (args: Omit<React.ComponentProps<typeof SingleDatePickerBox>, 'onChange'>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { buttonText, value, validationMessages, ...rest } = args;

    const buttonTextGroup =
        args.locale === LOCALES.ko
            ? {
                  delete: '삭제',
                  today: '오늘',
              }
            : DEFAULT_BUTTON_TEXT_GROUP;

    const validationMessagesGroup =
        args.locale === LOCALES.ko
            ? {
                  invalidDate: '유효하지 않은 날짜',
                  invalidTime: '유효하지 않은 시간',
              }
            : SINGLE_VALIDATION_MESSAGES;

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

    useEffect(() => {
        // storybook에서 timestamp로 넘어와 변환 필요
        const safeValue = typeof args.value === 'number' ? new Date(args.value) : args.value;

        setSelectedDate(safeValue);
    }, [args.value]);

    return (
        <SingleDatePickerBox
            value={selectedDate}
            onChange={setSelectedDate}
            buttonText={buttonTextGroup}
            validationMessages={validationMessagesGroup}
            {...rest}
        />
    );
};

export const Default: Story = {
    render: (args) => <Example {...args} />,
    args: {
        showTime: false,
        locale: ko,
        value: startOfDay(new Date()),
        placeholder: '',
        width: 200,
        disabledCondition: () => false,
    },
};

export const WithDisabledDates: Story = {
    render: (args) => <Example {...args} />,
    args: {
        showTime: true,
        locale: ko,
        value: startOfDay(new Date()),
        placeholder: '날짜를 선택하세요',
        width: 200,
        disabledCondition: (date: Date) => {
            const today = startOfDay(new Date());
            return date < today;
        },
    },
};
