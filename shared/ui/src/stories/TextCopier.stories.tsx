import type { Meta, StoryObj } from '@storybook/react';
import { TextCopier } from '@/components/button/TextCopier.tsx';

const meta: Meta<typeof TextCopier> = {
    title: 'Shared/Button/TextCopier',
    component: TextCopier,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof TextCopier>;

export const Default: Story = {
    args: {
        value: '클릭해서 복사할 텍스트',
    },
};
