import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from '@/components/textfield/SearchInput';

const sizes = ['medium', 'large'] as const;

const meta: Meta<typeof SearchInput> = {
    title: 'Shared/TextField/SearchInput',
    component: SearchInput,
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
        placeholder: {
            control: 'text',
            description: '공백 표시자',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Search' },
            },
        },
        value: {
            control: 'text',
            description: '초기 세팅 값',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
            },
        },
        onChange: {
            action: 'onChange',
            description: '필드 값 변경 핸들러',
            table: {
                type: { summary: '(value: string) => void' },
            },
        },
        onDone: {
            action: 'onDone',
            description: '필드 Enter 키 조작 핸들러',
            table: {
                type: { summary: '(value: string) => void' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
    args: {
        size: 'medium',
    },
};
