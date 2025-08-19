import React, { Children, createContext, useContext, useEffect } from 'react';
import { useSideBar } from '@/components/navigation/sideNavBar.hooks';
import { SideNavBarSubItemProps, SideNavBarItemProps, SideNavSection } from '@/components/navigation/sideNavBar.types';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

interface SideNavBarContextType {
    expandedItems: Record<string, boolean>;
    selectedItem: string;
    toggleDropdown: (id: string) => void;
    handleItemClick: (id: string) => void;
    registerNavItem: (id: string, hasChildren: boolean, parentId?: string) => void;
    isExpandable: (id: string) => boolean;
    isParentOfSelected: (id: string) => boolean;
    getSelectedItemParent: () => string | undefined;
}

const SideNavBarContext = createContext<SideNavBarContextType | undefined>(undefined);
const useSideNavBarContext = () => {
    const context = useContext(SideNavBarContext);
    if (!context) {
        throw new Error('SideNavBar components must be used within a SideNavBarProvider');
    }
    return context;
};

interface Props {
    width?: number;
    sectionList: SideNavSection[];
    defaultSelected?: string;
    onChange?: (value: string) => void;
    onNavigate?: (path: string) => void;
}

const SideNavBar = ({
    width = 240,
    sectionList = [],
    defaultSelected = '',
    onChange = () => {},
    onNavigate = () => {},
}: Props) => {
    const state = useSideBar(defaultSelected, onChange);
    const widthStyle = { width: width > 0 ? `${width}px` : '100%' };

    useEffect(() => {
        const registerItems = (sectionList: SideNavSection[], parentPath?: string) => {
            sectionList.forEach((section) => {
                section.child?.forEach((item) => {
                    const hasChildren = Boolean(item.child && item.child.length > 0);
                    state.registerNavItem(item.path, hasChildren, parentPath);

                    if (hasChildren && item.child) {
                        item.child.forEach((child) => {
                            state.registerNavItem(child.path, false, item.path);
                        });
                    }
                });
            });
        };

        if (sectionList.length > 0) {
            registerItems(sectionList);
        }
    }, [sectionList]);

    return (
        <SideNavBarContext.Provider value={state}>
            <nav className={`non-draggable flex flex-col px-[16px]`} style={widthStyle}>
                {sectionList.map((section, sectionIndex) => {
                    const topBorder = sectionIndex !== 0 ? `pt-[16px] border-t` : '';
                    return (
                        <div className={`border-grey-20 pb-[6px] ${topBorder}`} key={`side-nav-${sectionIndex}`}>
                            <p className={`text-m12 text-grey-60 px-[12px] leading-[22px]`}>{section.title}</p>
                            {section.child?.map((navMap, parentIndex) => (
                                <Item
                                    path={navMap.path}
                                    label={navMap.label}
                                    onClick={onNavigate}
                                    key={`side-nav-${sectionIndex}-${parentIndex}`}
                                >
                                    {navMap.child?.map((child, childIndex) => (
                                        <SubItem
                                            path={child.path}
                                            label={child.label}
                                            parentPath={navMap.path}
                                            onClick={onNavigate}
                                            key={`side-nav-${sectionIndex}-${parentIndex}-${childIndex}`}
                                        />
                                    ))}
                                </Item>
                            ))}
                        </div>
                    );
                })}
            </nav>
        </SideNavBarContext.Provider>
    );
};
export { SideNavBar };

const Item = ({ path, label, onClick, children }: SideNavBarItemProps) => {
    const {
        expandedItems,
        selectedItem,
        toggleDropdown,
        handleItemClick,
        registerNavItem,
        isExpandable,
        isParentOfSelected,
    } = useSideNavBarContext();
    const hasChildren = Children.count(children) > 0;
    const expandable = isExpandable(path);
    const isExpanded = expandable && expandedItems[path];
    const isSelected = selectedItem === path && !expandable;
    const isActiveParent = isParentOfSelected(path);
    const childrenWithProps = Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { parentPath: path } as never);
        }
        return child;
    });

    const fontColorClass = isSelected || isActiveParent ? 'text-blue-700' : 'text-gray-800';
    const bgColorClass = isSelected ? 'bg-blue-100' : '';
    const hoverClass = isSelected ? 'hover:bg-blue-100' : 'hover:bg-gray-100';

    useEffect(() => {
        registerNavItem(path, hasChildren);
    }, [path, hasChildren]);

    return (
        <>
            <div
                className={`text-m16 flex cursor-pointer items-center justify-between rounded p-[10px] pl-[12px] transition-all duration-100 ${fontColorClass} ${bgColorClass} ${hoverClass}`}
                onClick={() => {
                    if (expandable) {
                        toggleDropdown(path);
                    } else {
                        handleItemClick(path);
                        onClick?.(path);
                    }
                }}
            >
                {label}
                {expandable && (
                    <DropdownIcon
                        className={`transition-transform duration-100 ${fontColorClass} ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                    />
                )}
            </div>

            {expandable && children && <div className={isExpanded ? 'block' : 'hidden'}>{childrenWithProps}</div>}
        </>
    );
};

const SubItem = ({ path, label, parentPath, onClick }: SideNavBarSubItemProps) => {
    const { selectedItem, handleItemClick, registerNavItem } = useSideNavBarContext();
    const isSelected = selectedItem === path;

    const fontColorClass = isSelected ? 'text-blue-700' : 'text-gray-800';
    const bgColorClass = isSelected ? 'bg-blue-100' : '';
    const hoverClass = isSelected ? 'hover:bg-blue-100' : 'hover:bg-gray-100';

    useEffect(() => {
        if (parentPath) {
            registerNavItem(path, false, parentPath);
        }
    }, [path, parentPath]);

    return (
        <div
            className={`text-r14 cursor-pointer rounded p-[10px] pl-[24px] ${fontColorClass} ${bgColorClass} ${hoverClass}`}
            onClick={() => {
                handleItemClick(path);
                onClick?.(path);
            }}
        >
            {label}
        </div>
    );
};
