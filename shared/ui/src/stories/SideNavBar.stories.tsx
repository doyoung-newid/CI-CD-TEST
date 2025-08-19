import type { Meta, StoryObj } from '@storybook/react';
import { SideNavBar } from '@/components/navigation/SideNavBar.tsx';
import { SideNavSection } from '@/components/navigation/sideNavBar.types.ts';

const meta: Meta<typeof SideNavBar> = {
    title: 'Shared/SideNavBar',
    component: SideNavBar,
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
                defaultValue: { summary: '240' },
            },
        },
        defaultSelected: {
            control: 'text',
            description: '초기 메뉴 값',
            table: {
                type: { summary: 'string' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof SideNavBar>;

export const Default: Story = {
    render: () => {
        return <SideNavBar sectionList={nav} />;
    },
    args: {
        defaultSelected: 'aaa',
    },
};

const nav: SideNavSection[] = [
    {
        title: 'Feed Builder',
        child: [
            {
                path: '111',
                label: 'Pages',
                child: [
                    {
                        path: 'aaa',
                        label: 'Home',
                    },
                    {
                        path: 'bbb',
                        label: 'Channels',
                    },
                    {
                        path: 'ccc',
                        label: 'On Demand',
                    },
                ],
            },
            {
                path: 'test',
                label: 'Row Options',
            },
        ],
    },
    {
        title: 'Content Setup',
        child: [
            {
                path: '222',
                label: 'Library',
                child: [
                    {
                        path: 'ddd',
                        label: 'Channel',
                    },
                    {
                        path: 'eee',
                        label: 'Series',
                    },
                    {
                        path: 'fff',
                        label: 'Program',
                    },
                ],
            },
            {
                path: '333',
                label: 'Content Metadata',
                child: [
                    {
                        path: 'ggg',
                        label: 'Categories',
                    },
                    {
                        path: 'hhh',
                        label: 'Relevance',
                    },
                ],
            },
        ],
    },
    {
        title: 'Section 2',
        child: [],
    },
];
