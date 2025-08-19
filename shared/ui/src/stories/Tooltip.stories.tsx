import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@/components/textfield/Tooltip';
import { InfoIcon } from '@/index';
import { PlacesType } from 'react-tooltip';

const TOOLTIP_PLACES: PlacesType[] = [
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
] as const;

const meta: Meta<typeof Tooltip> = {
    title: 'Shared/TextField/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        children: {
            control: false,
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        show: {
            control: false,
            description: '호버시 툴팁 표시',
            table: {
                type: { summary: 'boolean' },
            },
        },
        className: {
            control: 'text',
            description: '텍스트 박스 스타일',
        },
        maxWidth: {
            control: 'number',
            description: '툴팁 최대 너비(px), 기본 280',
        },
        place: {
            control: { type: 'radio' },
            options: TOOLTIP_PLACES,
            description: '가능한 영역 내의 초기 툴팁 위치',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'bottom' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    render: (args) => {
        const { maxWidth, className, ...props } = args;

        return (
            <Tooltip maxWidth={maxWidth} className={className} {...props}>
                <p className={`flex items-center justify-center`}>Show</p>
            </Tooltip>
        );
    },
    args: {
        text: 'Display row on/off',
        maxWidth: 280,
        place: 'top',
    },
};

export const WithIcon: Story = {
    render: (args) => {
        const { maxWidth, className, ...props } = args;

        return (
            <Tooltip maxWidth={maxWidth} className={className} {...props}>
                <InfoIcon className={'text-red-600'} />
            </Tooltip>
        );
    },
    args: {
        text: 'Display row on/off',
        maxWidth: 280,
        place: 'bottom',
    },
};

export const WithClamped: Story = {
    render: (args) => {
        const { maxWidth, className, text, ...props } = args;

        return (
            <Tooltip text={text} maxWidth={maxWidth} className={className} {...props}>
                <p className={`line-clamp-2 w-[200px] text-center`}>{text}</p>
            </Tooltip>
        );
    },
    args: {
        text: '이 텍스트는 길이가 너무 길어서 미리보기 영역을 벗어나면 말줄임이 되고, hover 시 전체가 보입니다.',
        maxWidth: 280,
        place: 'bottom',
    },
};
