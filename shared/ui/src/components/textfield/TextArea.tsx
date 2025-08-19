import { useInput } from '@/hooks/useInput';
import React from 'react';
import { BoxComponentStyles, Size } from '@/types/common';

type TextAreaSize = Extract<Size, 'medium' | 'large'>;

interface TextAreaProps {
    size?: TextAreaSize;
    width?: number;
    height?: number;
    label?: string;
    labelColor?: string;
    value?: string;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
    ref?: React.Ref<HTMLTextAreaElement>;
}

const TextArea = ({
    size = 'medium',
    width = undefined,
    height = undefined,
    label = '',
    labelColor = '',
    value: initialValue,
    readOnly = false,
    disabled = false,
    placeholder = '',
    onChange = () => {},
    className = '',
    ...props
}: TextAreaProps) => {
    const { value, handleChange } = useInput<HTMLTextAreaElement>({
        initialValue,
        onChange,
    });

    const isInactive = readOnly || disabled;
    const containerClass = `flex h-fit flex-col items-start gap-[4px] ${className}`;
    const textareaClass = `px-[11px] py-[9px] border border-grey-40 ${isInactive ? 'bg-grey-20' : ' bg-white focus-within:border-blue-600'} rounded-[4px] bg-inherit w-full overflow-auto scrollbar text-grey-90 placeholder-grey-40 whitespace-pre-wrap break-words resize-none outline-none`;
    const labelTextStyle = { color: labelColor || 'var(--color-grey-70)' };
    const { labelSizeClass, textSizeClass } = BoxComponentStyles[size];

    return (
        <div style={{ width: width ? `${width}px` : '100%' }} className={containerClass}>
            {label !== '' ? (
                <label className={`pl-[4px] ${labelSizeClass} non-draggable`} style={labelTextStyle}>
                    {label}
                </label>
            ) : null}
            <textarea
                style={{ height: height ? `${height}px` : '100%' }}
                className={`${textareaClass} ${textSizeClass}`}
                value={value}
                readOnly={readOnly}
                disabled={disabled}
                placeholder={placeholder}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
};
export { TextArea };
