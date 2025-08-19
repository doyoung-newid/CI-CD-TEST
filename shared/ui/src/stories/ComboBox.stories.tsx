import type { Meta, StoryObj } from '@storybook/react';
import { SelectOption } from '@/components/selectbox/DropdownList';
import { ComboBox, ComboBoxProps } from '@/components/selectbox/ComboBox';

const sizes = ['medium', 'large'] as const;

const meta: Meta<ComboBoxProps> = {
    title: 'Shared/SelectBox/ComboBox',
    component: ComboBox,
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
        labelPosition: {
            control: { type: 'radio' },
            options: ['outer', 'inner'],
            description: '박스 제목 위치',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'outer' },
            },
        },
        value: {
            control: 'object',
            description: '초기 세팅 값',
            table: {
                type: { summary: 'SelectOption' },
            },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder',
            table: {
                type: { summary: 'string' },
            },
        },
        noResultMessage: {
            control: 'text',
            description: '검색 결과 없을때 카피',
            table: {
                type: { summary: 'string' },
            },
        },
        allowCustomValue: {
            control: 'boolean',
            description: '인풋 포커스 아웃 시 옵션 외 값 입력 허용',
            table: {
                type: { summary: 'boolean' },
            },
        },
        showAllOptionsOnFocus: {
            control: 'boolean',
            description: '인풋 입력값과 관계없이 모든 리스트 출력',
            table: {
                type: { summary: 'boolean' },
            },
        },
        readOnly: {
            control: 'boolean',
            description: '인풋 수정 제어',
            table: {
                type: { summary: 'boolean' },
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
type Story = StoryObj<ComboBoxProps>;

const defaultComboBoxOptions: SelectOption[] = [
    { value: 'item01', label: 'Item01' },
    { value: 'item02', label: 'Item02' },
    { value: 'item03', label: 'Item03' },
];

export const Default: Story = {
    render: (args) => {
        const { optionList = defaultComboBoxOptions, ...props } = args;

        return <ComboBox value={optionList[0].value} optionList={optionList} {...props} />;
    },
    args: {
        size: 'medium',
        optionList: defaultComboBoxOptions,
        allowCustomValue: true,
        showAllOptionsOnFocus: true,
        labelPosition: 'outer',
    },
};
