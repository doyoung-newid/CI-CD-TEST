import type { Meta, StoryObj } from '@storybook/react';
import { PlacesType } from 'react-tooltip';
import { CopyTooltip } from '@/components/textfield/CopyTooltip';

const TOOLTIP_PLACES: PlacesType[] = [
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
] as const;

const meta: Meta<typeof CopyTooltip> = {
    title: 'Shared/TextField/CopyTooltip',
    component: CopyTooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        text: {
            control: 'text',
            description: '화면에 표시할 텍스트 (길면 말줄임)',
        },
        className: {
            control: 'text',
            description: '텍스트 박스 스타일',
        },
        maxWidth: {
            control: 'number',
            description: '툴팁 최대 너비(px), 기본 280',
        },
        place: {
            control: { type: 'radio' },
            options: TOOLTIP_PLACES,
            description: '가능한 영역 내의 초기 툴팁 위치',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'bottom' },
            },
        },
        onCopySuccess: {
            action: 'onCopySuccess',
            description: '복사 성공 시 실행될 콜백',
            table: {
                type: { summary: '() => void' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof CopyTooltip>;

export const Default: Story = {
    args: {
        text: '이 텍스트는 길이가 너무 길어서 미리보기 영역을 벗어나면 말줄임이 되고, hover 시 전체가 보이며 클릭 시 복사 및 토스트메시지가 표시됩니다.',
        className: 'line-clamp-2 w-[200px]',
        maxWidth: 280,
        place: 'bottom',
    },
};
