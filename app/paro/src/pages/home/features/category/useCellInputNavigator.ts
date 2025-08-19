import { useEffect, useRef } from 'react';

type CellKey = string;
type CellIndex = [number, number];
type CellInfo = {
    element: HTMLInputElement | null;
    position: CellIndex;
};

type State = {
    selectedIndex: CellIndex;
    cellMap: Map<CellKey, CellInfo>;
};

export function useCellInputNavigator(keyTable: CellKey[][]) {
    const state = useRef<State>({
        selectedIndex: [0, 0],
        cellMap: new Map<CellKey, CellInfo>(),
    });

    useEffect(() => {
        keyTable.forEach((row, rowIndex) => {
            row.forEach((key, colIndex) => {
                const existing = state.current.cellMap.get(key);
                const element = existing?.element || null;

                state.current.cellMap.set(key, {
                    element,
                    position: [rowIndex, colIndex],
                });
            });
        });
    }, [keyTable]);

    const registerRef = (key: CellKey, element: HTMLInputElement | null) => {
        let position: CellIndex = [0, 0];

        for (let rowIndex = 0; rowIndex < keyTable.length; rowIndex++) {
            const colIndex = keyTable[rowIndex].indexOf(key);
            if (colIndex !== -1) {
                position = [rowIndex, colIndex];
                break;
            }
        }

        state.current.cellMap.set(key, {
            element,
            position,
        });
    };

    const selectKey = (key: CellKey) => {
        const info = state.current.cellMap.get(key);
        if (info) {
            state.current.selectedIndex = info.position;
        }
    };

    const focusNextRow = () => {
        const [row, col] = state.current.selectedIndex;

        const targetRowIndex = clamp(row + 1, 0, keyTable.length - 1);
        const targetColIndex = clamp(col, 0, keyTable[targetRowIndex]?.length - 1);
        state.current.selectedIndex = [targetRowIndex, targetColIndex];

        const targetKey = keyTable[targetRowIndex]?.[targetColIndex];
        if (targetKey) {
            const info = state.current.cellMap.get(targetKey);
            if (info?.element) {
                info.element.focus();
            }
        }
    };

    return {
        registerRef,
        selectKey,
        focusNextRow,
    };
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
