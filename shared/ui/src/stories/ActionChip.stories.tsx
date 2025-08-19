import type { Meta, StoryObj } from '@storybook/react';
import { ActionChip } from '@/components/chips/ActionChip.tsx';
import IconSearch from '@/assets/icSearch.svg?react';

const sizes = ['extraSmall', 'medium'] as const;

const meta: Meta<typeof ActionChip> = {
    title: 'Shared/Chips/ActionChip',
    component: ActionChip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'radio' },
            options: sizes,
            description: '칩 크기',
            table: {
                type: { summary: 'extraSmall | medium' },
                defaultValue: { summary: 'medium' },
            },
        },
        selected: {
            control: 'boolean',
            description: '선택 상태',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        icon: {
            control: false,
            description: '칩 앞에 표시할 아이콘 (ReactNode)',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        children: {
            control: 'text',
            description: '칩 텍스트',
            table: {
                type: { summary: 'ReactNode' },
                defaultValue: { summary: 'ActionChip' },
            },
        },
        onClick: {
            action: 'clicked',
            description: '클릭 이벤트 핸들러',
            table: {
                type: { summary: '() => void' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ActionChip>;

export const Default: Story = {
    args: {
        children: 'ActionChip',
        size: 'medium',
        selected: false,
    },
};

export const WithIcon: Story = {
    args: {
        ...Default.args,
        icon: <IconSearch />,
    },
};
