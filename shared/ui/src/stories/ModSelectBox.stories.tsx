import type { Meta, StoryObj } from '@storybook/react';
import { SelectOption } from '@/components/selectbox/DropdownList.tsx';
import { ModSelectBox, ModSelectBoxProps } from '@/components/selectbox/ModSelectBox.tsx';

const sizes = ['small', 'medium'] as const;

const meta: Meta<ModSelectBoxProps> = {
    title: 'Shared/SelectBox/ModSelectBox',
    component: ModSelectBox,
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
type Story = StoryObj<ModSelectBoxProps>;

const defaultComboBoxOptions: SelectOption[] = [
    { value: 'item01', label: 'Item01' },
    { value: 'item02', label: 'Item02' },
    { value: 'item03', label: 'Item03' },
];

export const Default: Story = {
    render: (args) => {
        const { optionList = defaultComboBoxOptions, ...props } = args;

        return <ModSelectBox optionList={optionList} {...props} />;
    },
    args: {
        size: 'medium',
        value: defaultComboBoxOptions[0],
        optionList: defaultComboBoxOptions,
    },
};
