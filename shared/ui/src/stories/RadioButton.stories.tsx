import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioButton } from '@/components/button/RadioButton';

const meta: Meta<typeof RadioButton> = {
    title: 'Shared/Button/RadioButton',
    component: RadioButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        id: {
            control: false,
            description: '라디오 버튼 아이디',
        },
        checked: {
            control: 'boolean',
            description: '체크 상태',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화',
        },
        onChange: {
            action: 'onChange',
            description: '체크 상태 변경 핸들러',
        },
        children: {
            control: 'text',
            description: '라디오 버튼 내용',
        },
        className: {
            control: 'text',
            description: '컨테이너 스타일',
        },
    },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
    args: {
        disabled: false,
    },
};

export const States: Story = {
    render: () => (
        <div className="space-y-6">
            <div>
                <div className="flex gap-1">
                    <RadioButton checked={false} />
                    <RadioButton checked={true} />
                    <RadioButton disabled={true} />
                    <RadioButton disabled={true} checked={true} />
                </div>
            </div>
        </div>
    ),
};

export const Options: Story = {
    render: () => <RadioGroup />,
};

const RadioGroup = () => {
    const options = [
        { id: 'option1', name: 'option 1', disabled: false },
        { id: 'option2', name: 'option 2', disabled: false },
        { id: 'option3', name: 'option 3', disabled: true },
    ];

    const [selectedOption, setSelectedOption] = useState('option1');

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
    };

    return (
        <div className="flex flex-col rounded bg-gray-50 p-2">
            {options.map((option, index) => (
                <RadioButton
                    key={option.id}
                    checked={selectedOption === option.id}
                    disabled={option.disabled}
                    onChange={() => handleOptionChange(option.id)}
                >
                    {options[index].id === selectedOption ? (
                        <span className={'font-medium'}>{option.name}</span>
                    ) : (
                        option.name
                    )}
                </RadioButton>
            ))}
        </div>
    );
};
