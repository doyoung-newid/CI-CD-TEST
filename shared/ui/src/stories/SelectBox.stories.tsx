import type { Meta, StoryObj } from '@storybook/react';
import { SelectOption } from '@/components/selectbox/DropdownList';
import { SelectBox, SelectBoxProps } from '@/components/selectbox/SelectBox';

const sizes = ['small', 'medium'] as const;

const meta: Meta<SelectBoxProps> = {
    title: 'Shared/SelectBox/SelectBox',
    component: SelectBox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        size: {
            control: { type: 'radio' },
            options: sizes,
            description: '박스 및 폰트 사이즈',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: sizes[0] },
            },
        },
        width: {
            control: { type: 'number' },
            description: '박스 가로 픽셀',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '240' },
            },
        },
        label: {
            control: 'text',
            description: '박스 제목',
            table: {
                type: { summary: 'string' },
            },
        },
        labelColor: {
            control: 'color',
            description: '박스 제목 색깔',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '#515152' },
            },
        },
        supportingText: {
            control: 'text',
            description: '박스 추가 정보',
            table: {
                type: { summary: 'string' },
            },
        },
        supportingTextColor: {
            control: 'color',
            description: '박스 추가 정보 색깔',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '#515152' },
            },
        },
        value: {
            control: 'object',
            description: '초기 세팅 값',
            table: {
                type: { summary: 'SelectOption' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '비활성화',
            table: {
                type: { summary: 'boolean' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<SelectBoxProps>;

const defaultComboBoxOptions: SelectOption[] = [
    { value: 'item01', label: 'Item01' },
    { value: 'item02', label: 'Item02' },
    { value: 'item03', label: 'Item03' },
];

export const Default: Story = {
    render: (args) => {
        const { optionList = defaultComboBoxOptions, ...props } = args;

        return <SelectBox optionList={optionList} {...props} />;
    },
    args: {
        size: 'small',
        value: defaultComboBoxOptions[0].value,
        optionList: defaultComboBoxOptions,
    },
};
