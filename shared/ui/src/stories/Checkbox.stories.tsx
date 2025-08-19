import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '@/components/button/CheckBox';

const meta: Meta<typeof Checkbox> = {
    title: 'Shared/Button/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        id: {
            control: false,
            description: '체크박스 아이디',
        },
        checked: {
            control: 'boolean',
            description: '체크 상태',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화',
        },
        indeterminate: {
            control: 'boolean',
            description: '중간 상태',
        },
        onChange: {
            action: 'onChange',
            description: '체크 상태 변경 핸들러',
        },
        children: {
            control: 'text',
            description: '체크박스 내용',
        },
        className: {
            control: 'text',
            description: '컨테이너 스타일',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        disabled: false,
        indeterminate: false,
    },
};

export const StateAll: Story = {
    render: () => <AllStatesComponent />,
};

export const SelectAll: Story = {
    render: () => <SelectAllComponent />,
};

const SelectAllComponent = () => {
    const [items, setItems] = useState([
        { id: 'item1', name: 'item 1', checked: false },
        { id: 'item2', name: 'item 2', checked: true },
        { id: 'item3', name: 'item 3', checked: false },
    ]);

    const checkedCount = items.filter((item) => item.checked).length;
    const isAllChecked = checkedCount === items.length;
    const isIndeterminate = checkedCount > 0 && checkedCount < items.length;

    const handleSelectAll = (checked: boolean) => {
        setItems((prev) => prev.map((item) => ({ ...item, checked })));
    };

    const handleItemCheck = (id: string, checked: boolean) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked } : item)));
    };

    return (
        <div className="flex flex-col rounded bg-gray-50 p-2">
            <Checkbox checked={isAllChecked} indeterminate={isIndeterminate} onChange={handleSelectAll}>
                Select All
            </Checkbox>
            <div className="flex flex-col pl-2">
                {items.map((item) => (
                    <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onChange={(checked: boolean) => handleItemCheck(item.id, checked)}
                    >
                        {item.name}
                    </Checkbox>
                ))}
            </div>
        </div>
    );
};

const AllStatesComponent = () => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <div className="flex gap-1">
                    <Checkbox checked={false} />
                    <Checkbox checked={true} />
                    <Checkbox indeterminate={true} />
                    <Checkbox disabled={true} />
                    <Checkbox disabled={true} checked={true} />
                    <Checkbox disabled={true} indeterminate={true} />
                </div>
            </div>
            <div>
                <div className="flex gap-1">
                    <Checkbox checked={isChecked} onChange={setIsChecked}>
                        {isChecked ? <span className="text-red-500">checked</span> : 'unchecked'}
                    </Checkbox>
                </div>
            </div>
        </div>
    );
};
