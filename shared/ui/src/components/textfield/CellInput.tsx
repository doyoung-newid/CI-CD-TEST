import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
import { BoxComponentStyles, Size } from '@/types/common.ts';
import InputBox from './InputBox.tsx';
import IconReset from '@/assets/icReset.svg?react';
import useCellInput from '@/components/textfield/cellInput.hooks.ts';

export interface CellInputRef {
    reset: () => void;
}

export interface CellInputProps {
    size?: Size;
    width?: number;
    placeholder?: string;
    value?: string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
    onEnter?: () => void;
    id?: string;
    className?: string;
}

const CellInput = forwardRef<CellInputRef, CellInputProps>(
    (
        {
            size = 'medium',
            width = 0,
            placeholder = 'Cell Field',
            value: initialValue = '',
            readOnly = false,
            onChange = () => {},
            onDone = () => {},
            onEnter = () => {},
            id = '',
            className = '',
        },
        ref,
    ) => {
        const { inputRef, isFocused, value, isModified, handleChange, handleReset } = useCellInput({
            initialValue,
            onChange,
            onDone,
            onEnter,
        });

        useImperativeHandle(
            ref,
            () => ({
                reset: () => handleReset(),
            }),
            [handleReset],
        );

        const { height, textSizeClass } = BoxComponentStyles[size];
        let stateClass = isFocused ? 'border-blue-500 bg-white' : 'border-transparent hover:border-grey-40';
        if (readOnly) {
            stateClass = 'border-transparent';
        }

        const handleClearMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
        }, []);

        return (
            <InputBox.Root
                className={`items-center justify-start gap-[8px] px-[11px] ${stateClass} ${className}`}
                width={width}
                height={height}
            >
                <InputBox.Field
                    ref={inputRef}
                    id={id}
                    className={`text-grey-90 ${textSizeClass}`}
                    placeholder={placeholder}
                    value={value}
                    readOnly={readOnly}
                    onChange={handleChange}
                />
                {isFocused && isModified && (
                    <InputBox.Suffix className={`size-[20px]`}>
                        <button onMouseDown={handleClearMouseDown} onClick={handleReset}>
                            <IconReset />
                        </button>
                    </InputBox.Suffix>
                )}
            </InputBox.Root>
        );
    },
);

export { CellInput };
CellInput.displayName = 'CellInput';
