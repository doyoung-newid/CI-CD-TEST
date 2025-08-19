import React from 'react';

export interface SideNavBarItemProps {
    path: string;
    label: string;
    onClick?: (path: string) => void;
    children?: React.ReactNode;
}

export interface SideNavBarSubItemProps {
    path: string;
    label: string;
    parentPath?: string;
    onClick?: (path: string) => void;
}

export interface SideNavSection {
    title: string;
    child?: SideNavMap[];
}

interface SideNavMap {
    path: string;
    label: string;
    child?: SideNavMap[];
}
export type { SideNavMap };
