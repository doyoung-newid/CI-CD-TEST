import type { Meta, StoryObj } from '@storybook/react';
import { CellButton, CellButtonProps } from '@/components/button/CellButton.tsx';

const sizes = ['large', 'medium', 'small'] as const;

type ContainerProps = {
    containerHeight?: number;
    containerPadding?: number;
};

type StoryArgProps = CellButtonProps & ContainerProps;

const DEFAULT_ARGS: StoryArgProps = {
    size: 'medium',
    children: 'Button',
    containerHeight: 48,
    containerPadding: 6,
};

const meta = {
    title: 'Shared/Button/CellButton',
    component: CellButton,
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
                type: { summary: sizes.join(' | ') },
                defaultValue: { summary: 'medium' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '버튼 비활성화 여부',
            table: { type: { summary: 'boolean' } },
        },
        onClick: {
            action: 'clicked',
            description: '클릭 이벤트 핸들러',
            table: { type: { summary: '() => void' } },
        },
        children: {
            control: 'text',
            description: '버튼 내용',
            table: { type: { summary: 'ReactNode' } },
        },
        containerHeight: {
            control: { type: 'number' },
            description: '버튼 외부 컨테이너 높이 (px)',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 48 },
            },
        },
        containerPadding: {
            control: { type: 'number' },
            description: '버튼 외부 컨테이너 패딩 (px)',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 6 },
            },
        },
    },
} as Meta<typeof CellButton>;

export default meta;

type Story = StoryObj<StoryArgProps>;

export const Default: Story = {
    args: DEFAULT_ARGS,
    render: ({ containerHeight = 48, containerPadding = 6, ...buttonProps }) => (
        <div style={{ height: `${containerHeight}px`, padding: `${containerPadding}px` }}>
            <CellButton {...buttonProps} />
        </div>
    ),
};
