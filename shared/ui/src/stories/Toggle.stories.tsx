import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/components/button/Toggle.tsx';

const meta: Meta<typeof Toggle> = {
    title: 'Shared/Button/Toggle',
    component: Toggle,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onChange: {
            action: 'clicked',
            description: '클릭 이벤트 핸들러',
            table: {
                type: { summary: '() => void' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};
