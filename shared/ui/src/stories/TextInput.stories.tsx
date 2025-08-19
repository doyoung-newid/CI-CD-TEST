import type { Meta, StoryObj } from '@storybook/react';
import { TextInput, TextInputProps } from '@/components/textfield/TextInput.tsx';

const sizes = ['medium', 'large'] as const;

const meta: Meta<TextInputProps> = {
    title: 'Shared/TextField/TextInput',
    component: TextInput,
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
        placeholder: {
            control: 'text',
            description: 'Placeholder',
            table: {
                type: { summary: 'string' },
            },
        },
        value: {
            control: 'text',
            description: '초기 세팅 값',
            table: {
                type: { summary: 'string' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '활성화 제어',
            table: {
                type: { summary: 'boolean' },
            },
        },
        readOnly: {
            control: 'boolean',
            description: '필드 수정 제어',
            table: {
                type: { summary: 'boolean' },
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
type Story = StoryObj<TextInputProps>;

export const Default: Story = {
    args: {
        size: 'medium',
    },
};
