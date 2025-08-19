import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@/components/expandfield/Dialog.tsx';
import { Button } from '@/components/button/Button.tsx';
import { useState } from 'react';

const meta: Meta<typeof Dialog> = {
    title: 'Shared/ExpandField/Dialog',
    component: Dialog,
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
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
    render: () => (
        <Dialog open={true} onClose={() => {}}>
            <div className="p-4">
                <h2 className="text-lg font-bold">Hello from Dialog!</h2>
                <p className="mt-2 text-sm text-gray-600">This Dialog is always open in this story.</p>
            </div>
        </Dialog>
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
            <Dialog open={isOpen} onClose={handleClose}>
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Hello from Dialog!</h2>
                        <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700">
                            X
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Click the X button to close this Dialog.</p>
                </div>
            </Dialog>
        </div>
    );
};

export const WithToggle: Story = {
    render: () => <Example />,
};
