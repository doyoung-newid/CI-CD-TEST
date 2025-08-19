import React, { useCallback } from 'react';
import { BoxComponentStyles, Size } from '@/types/common.ts';
import InputBox from './InputBox.tsx';
import useModInput from '@/components/textfield/modInput.hooks.ts';
import IconReset from '@/assets/icReset.svg?react';

export interface ModifiedInputProps {
    size?: Size;
    width?: number;
    placeholder?: string;
    value?: string;
    readOnly?: boolean;
    onChange?: (value: string, isModified: boolean) => void;
    onBlur?: (value: string, isModified: boolean) => void;
    onEnter?: (value: string, isModified: boolean) => void;
    onEscape?: () => void;
    className?: string;
}

const ModInput = ({
    size = 'medium',
    width = 0,
    placeholder = 'Modified Field',
    value: initialValue = '',
    readOnly = false,
    onChange = () => {},
    onBlur = () => {},
    onEnter = () => {},
    onEscape = () => {},
    className = '',
}: ModifiedInputProps) => {
    const { inputRef, isFocused, value, isModified, handleChange, resetToOrigin } = useModInput({
        initialValue,
        onChange,
        onBlur,
        onEnter,
        onEscape,
    });

    const { height, textSizeClass } = BoxComponentStyles[size];
    let stateClass = isFocused
        ? 'border-blue-500 bg-white'
        : isModified
          ? 'border-transparent bg-blue-150 hover:border-grey-40'
          : 'border-transparent hover:border-grey-40';
    let inputTextClass = isModified && !isFocused ? 'text-blue-600 font-[700]' : `text-grey-90 ${textSizeClass}`;
    if (readOnly) {
        stateClass = 'border-transparent';
        inputTextClass = '';
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
                className={`${inputTextClass} ${textSizeClass}`}
                placeholder={placeholder}
                value={value}
                readOnly={readOnly}
                onChange={handleChange}
            />
            <InputBox.Suffix className={`size-[20px] ${isModified && !isFocused ? '' : 'hidden'}`}>
                <button onMouseDown={handleClearMouseDown} onClick={resetToOrigin}>
                    <IconReset />
                </button>
            </InputBox.Suffix>
        </InputBox.Root>
    );
};
export { ModInput };
