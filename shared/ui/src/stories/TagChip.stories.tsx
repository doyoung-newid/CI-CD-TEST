import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TagChip, DefaultChipProps } from '@/components/chips/TagChip.tsx';
import IconDragHandle from '@/assets/icDragHandle.svg?react';

const variants = ['default', 'removeOutline', 'removeSolid', 'movable'] as const;

type StoryArgProps = DefaultChipProps & { children: React.ReactNode };

const DEFAULT_ARGS: StoryArgProps = {
    variant: 'default',
    children: 'Tag',
};

const meta: Meta<typeof TagChip> = {
    title: 'Shared/Chips/TagChip',
    component: TagChip,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'radio' },
            options: variants,
            description: '태그 스타일 변형',
            table: {
                type: { summary: variants.join(' | ') },
                defaultValue: { summary: 'default' },
            },
        },
        onDelete: {
            action: 'delete clicked',
            description: '삭제 버튼 클릭 시 호출',
            table: { type: { summary: '() => void' } },
        },
        dragHandle: {
            control: false,
            description: 'movable variant에서 사용할 드래그 핸들 노드',
            table: { type: { summary: 'ReactNode' } },
        },
        children: {
            control: 'text',
            description: '태그 내용',
            table: { type: { summary: 'ReactNode' } },
        },
    },
};

export default meta;
type Story = StoryObj<StoryArgProps>;

export const Default: Story = {
    args: {
        ...DEFAULT_ARGS,
        variant: 'default',
        onDelete: () => {},
        dragHandle: <IconDragHandle />,
        children: 'Tag',
    },
    render: ({ ...args }) => <TagChip {...args} />,
};

export const WithIcon: Story = {
    args: {
        ...DEFAULT_ARGS,
        variant: 'movable',
        onDelete: () => {},
        dragHandle: <IconDragHandle />,
        children: 'Movable Tag',
    },
    render: ({ ...args }) => <TagChip {...args} />,
};
