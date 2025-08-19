import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@/components/expandfield/Drawer';
import { Button } from '@/components/button/Button';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
    title: 'Shared/ExpandField/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        open: {
            control: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
            },
        },
        onClose: {
            control: false,
            table: {
                type: { summary: '() => void' },
            },
        },
        children: {
            control: false,
            table: {
                type: { summary: 'ReactNode' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
    render: () => (
        <Drawer open={true} onClose={() => {}}>
            <div className="p-4">
                <h2 className="text-lg font-bold">Hello from Drawer!</h2>
                <p className="mt-2 text-sm text-gray-600">This drawer is always open in this story.</p>
            </div>
        </Drawer>
    ),
};

const Example = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative grid h-screen w-full place-items-center">
            <Button variant={'normal'} onClick={handleOpen}>
                OPEN
            </Button>
            <Drawer className={'absolute right-0 top-0'} open={isOpen} onClose={handleClose}>
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Hello from Drawer!</h2>
                        <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700">
                            X
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Click the X button to close this drawer.</p>
                </div>
            </Drawer>
        </div>
    );
};

export const WithToggle: Story = {
    render: () => <Example />,
};
