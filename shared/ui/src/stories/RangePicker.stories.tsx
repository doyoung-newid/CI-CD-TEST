import { Meta, StoryObj } from '@storybook/react';
import { addDays, startOfDay } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { DateRange, DateRangePickerBox } from '@/index.ts';
import React, { useState } from 'react';
import { DEFAULT_BUTTON_TEXT_GROUP } from '@/components/datepicker/DatePicker.types.ts';

const LOCALES = {
    ko,
    enUS,
};

const meta: Meta<typeof DateRangePickerBox> = {
    title: 'Shared/DatePicker/Range',
    component: DateRangePickerBox,
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
                defaultValue: { summary: '400' },
            },
        },
        buttonText: {
            table: {
                disable: true,
            },
        },
        value: {
            table: {
                disable: true, // 초기값을 유효하지 않은 범위로 지정할 수 있어 제외
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
    },
};

export default meta;

type Story = StoryObj<typeof DateRangePickerBox>;

const Example = (args: Omit<React.ComponentProps<typeof DateRangePickerBox>, 'onChange'>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { buttonText, value, ...rest } = args;

    const buttonTextGroup =
        args.locale === LOCALES.ko
            ? {
                  delete: '삭제',
                  today: '오늘',
              }
            : DEFAULT_BUTTON_TEXT_GROUP;

    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(value);

    return (
        <DateRangePickerBox value={selectedRange} onChange={setSelectedRange} buttonText={buttonTextGroup} {...rest} />
    );
};

export const Default: Story = {
    render: (args) => <Example {...args} />,
    args: {
        showTime: true,
        locale: enUS,
        value: {
            from: startOfDay(new Date()),
            to: startOfDay(addDays(startOfDay(new Date()), 7)),
        },
        placeholder: '',
        width: 400,
    },
};
