import { useEffect, useState } from 'react';

export const useSideBar = (defaultSelected: string, onChange: (value: string) => void) => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [selectedItem, setSelectedItem] = useState(defaultSelected);
    const [parentChildMap, setParentChildMap] = useState<Record<string, string>>({});
    const [pathToPathMap, setPathToPathMap] = useState<Record<string, string>>({});

    const selectItemByUrl = () => {
        const currentPath = window.location.pathname;
        let bestMatch = '';
        let bestMatchPath = '';

        Object.entries(pathToPathMap).forEach(([path, mappedPath]) => {
            if (
                currentPath === path ||
                currentPath.startsWith(path + '/') ||
                (path !== '/' && currentPath.startsWith(path))
            ) {
                if (path.length > bestMatch.length) {
                    bestMatch = path;
                    bestMatchPath = mappedPath;
                }
            }
        });

        if (bestMatchPath) {
            setSelectedItem(bestMatchPath);
            expandParentCategories(bestMatchPath);
        }
    };

    const expandParentCategories = (itemPath: string) => {
        const expandedCategories: Record<string, boolean> = {};
        let currentParent = parentChildMap[itemPath];

        while (currentParent) {
            expandedCategories[currentParent] = true;
            currentParent = parentChildMap[currentParent];
        }

        setExpandedItems((prev) => ({
            ...prev,
            ...expandedCategories,
        }));
    };

    const toggleDropdown = (path: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const handleItemClick = (path: string) => {
        setSelectedItem(path);
    };

    const registerNavItem = (path: string, hasChildren: boolean, parentPath?: string) => {
        if (path) {
            setPathToPathMap((prev) => ({
                ...prev,
                [path]: path,
            }));
        }

        if (hasChildren) {
            setExpandedItems((prev) => {
                if (path in prev) return prev;
                return { ...prev, [path]: false };
            });
        }

        if (parentPath && path !== parentPath) {
            setParentChildMap((prev) => ({
                ...prev,
                [path]: parentPath,
            }));
        }
    };

    const isExpandable = (path: string) => {
        return path in expandedItems;
    };

    const getSelectedItemParent = () => {
        return parentChildMap[selectedItem];
    };

    const isParentOfSelected = (path: string) => {
        return parentChildMap[selectedItem] === path;
    };

    useEffect(() => {
        if (Object.keys(pathToPathMap).length > 0) {
            selectItemByUrl();
        } else if (defaultSelected) {
            expandParentCategories(defaultSelected);
        }
    }, [defaultSelected, parentChildMap, pathToPathMap]);

    useEffect(() => {
        const handleUrlChange = () => {
            selectItemByUrl();
        };

        window.addEventListener('popstate', handleUrlChange);

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, [pathToPathMap]);

    useEffect(() => onChange(selectedItem), [onChange, selectedItem]);

    return {
        expandedItems,
        selectedItem,
        toggleDropdown,
        handleItemClick,
        registerNavItem,
        isExpandable,
        isParentOfSelected,
        getSelectedItemParent,
    };
};
