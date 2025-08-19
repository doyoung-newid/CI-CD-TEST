import type { Meta, StoryObj } from '@storybook/react';
import { COLOR_STYLES, SIZE_STYLES, ActionChip } from '@/components/chips/ActionChip';
import IconSearch from '@/assets/icSearch.svg?react';

const SIZES = Object.keys(SIZE_STYLES);
const COLORS = Object.keys(COLOR_STYLES);

const meta: Meta<typeof ActionChip> = {
    title: 'Shared/Chips/ActionChip',
    component: ActionChip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: {
                type: 'radio',
                labels: {
                    extraSmall: 'XS',
                    medium: 'M',
                },
            },
            options: SIZES,
            description: '칩 크기',
            table: {
                type: { summary: SIZES.map((size) => size).join(' | ') },
            },
        },
        color: {
            control: false,
            description: '칩 색상',
            table: {
                type: { summary: COLORS.map((size) => size).join(' | ') },
            },
        },
        selected: {
            control: 'boolean',
            description: '선택 상태',
            table: {
                type: { summary: 'boolean' },
            },
        },
        icon: {
            control: false,
            description: '칩 앞에 표시할 아이콘',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        children: {
            control: 'text',
            description: '칩 텍스트',
            table: {
                type: { summary: 'ReactNode' },
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
    render: (args) => {
        const validatedArgs = { ...args };

        if (args.size === 'extraSmall') {
            validatedArgs.color = 'gray';
        } else {
            validatedArgs.color = 'primary';
        }

        return <ActionChip {...validatedArgs} />;
    },
    args: {
        children: 'ActionChip',
        size: 'extraSmall',
        color: 'gray',
        selected: false,
        icon: undefined,
        onClick: () => {},
    },
};

export const WithIcon: Story = {
    args: {
        children: 'ActionChip',
        size: 'medium',
        color: 'primary',
        selected: false,
        icon: <IconSearch />,
        onClick: () => {},
    },
};
