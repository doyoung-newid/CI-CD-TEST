import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/button/Button.tsx';

const sizes = ['large', 'medium', 'small'] as const;
const variants = ['default', 'normal', 'alert'] as const;

const meta: Meta<typeof Button> = {
    title: 'Shared/Button/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'radio' },
            options: sizes,
            description: '버튼 크기',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: sizes[1] },
            },
        },
        variant: {
            control: { type: 'radio' },
            options: variants,
            description: '버튼 스타일',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'variant' },
            },
        },
        fill: {
            control: 'boolean',
            description: '버튼 배경 채우기',
            table: {
                type: { summary: 'boolean' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '버튼 비활성화 여부',
            table: {
                type: { summary: 'boolean' },
            },
        },
        onClick: {
            action: 'clicked',
            description: '클릭 이벤트 핸들러',
            table: {
                type: { summary: '() => void' },
            },
        },
        children: {
            control: 'text',
            description: '버튼 내용',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Button',
    },
};
