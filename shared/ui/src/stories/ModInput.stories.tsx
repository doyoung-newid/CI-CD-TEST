import type { Meta, StoryObj } from '@storybook/react';
import { ModInput } from '@/components/textfield/ModInput.tsx';

const meta: Meta<typeof ModInput> = {
    title: 'Shared/TextField/ModInput',
    component: ModInput,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof ModInput>;

export const Default: Story = {
    args: {
        width: 400,
        value: 'origin text',
    },
};
