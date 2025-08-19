import type { Meta, StoryObj } from '@storybook/react';
import { TooltipBox } from '@/components/textfield/TooltipBox.tsx';

const meta: Meta<typeof TooltipBox> = {
    title: 'Shared/TextField/TooltipBox',
    component: TooltipBox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        text: {
            control: 'text',
            description: '텍스트 내용',
        },
        className: {
            control: 'text',
            description: '텍스트 박스 스타일',
        },
    },
};

export default meta;
type Story = StoryObj<typeof TooltipBox>;

export const Default: Story = {
    args: {
        text: '프리셋은 presetId 기준으로 렌더링되며, FFmpeg 명령어 내 {INPUT}, {OUTPUT} 토큰은 실행 시 경로로 치환되고, 유저 그룹 및 회사 기준으로 필터링 가능하며, 삭제 전 종속성 확인이 필요하고, 날짜는 UTC 기준 ISO 8601 포맷을 권장합니다.',
        className: 'line-clamp-2 w-[200px]',
    },
};
