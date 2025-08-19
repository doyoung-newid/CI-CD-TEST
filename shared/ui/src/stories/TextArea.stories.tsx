import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from '@/components/textfield/TextArea';

const meta: Meta<typeof TextArea> = {
    title: 'Shared/TextField/TextArea',
    component: TextArea,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        width: {
            control: { type: 'number' },
            description: '박스 가로 픽셀',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '100%' },
            },
        },
        height: {
            control: { type: 'number' },
            description: '박스 세로 픽셀',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '100%' },
            },
        },
        placeholder: {
            control: 'text',
            description: '공백 표시자',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
            },
        },
        readOnly: {
            control: 'boolean',
            description: '인풋 수정 제어',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 여부',
            table: {
                type: { summary: 'boolean' },
            },
        },
        value: {
            control: 'text',
            description: '초기 세팅 값',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
            },
        },
        onChange: {
            action: 'onChange',
            description: '값 변경 핸들러',
            table: {
                type: { summary: '(value: string) => void' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
    args: {
        width: 465,
        height: 210,
        readOnly: false,
        disabled: false,
        value:
            '1.1 Eligibility. You must be at least thirteen (13) years of age or older (the “Minimum Age”) to use our Services. If you are under the Minimum Age, you may use our Services if and only if you have the permission to use our Services from your parent or legal guardian, your use of our Services is subject to your parent or legal guardian’s supervision and control, and your parent or legal guardian reads these Terms of Use with you. Certain areas of our Services require you to be a certain age to access. When you use or attempt to use such areas of our Services, you certify that you are at least the required age and satisfy all other eligibility requirements of such Services and agree to all of the terms and conditions described in these Terms of Use. If you are not yet the required age for such areas, you do not satisfy any of other eligibility requirements, or you do not agree with all of the terms and conditions in these Terms of Use for any reason, please discontinue using the areas and/or Services (as applicable) immediately. If you are a parent or legal guardian of a child under the Minimum Age, you are subject to these Terms of Use when you allow your child to use our Services. You are also responsible for your child’s activity on our Services. You acknowledge that you may be exposed to certain content that you may find objectionable while using our Services, and you are responsible for determining whether the content on our Services is suitable for you or, if applicable, any child using our Services under your supervision and control. Some content on our Services may not be suitable for individuals under the Minimum Age.\n' +
            '1.2 Compatibility. By using our Services, you agree that we do not take responsibility or otherwise warrant the performance of your device for our Services, including the continued compatibility with our Service.',
    },
};
