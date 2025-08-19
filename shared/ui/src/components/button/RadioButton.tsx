import React, { useId, useState } from 'react';

interface RadioButtonProps {
    className?: string;
    id?: string;
    disabled?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    children?: React.ReactNode;
}

export const RadioButton = ({
    className = '',
    id,
    disabled = false,
    checked,
    onChange,
    children,
}: RadioButtonProps) => {
    const generatedId = useId();
    const radioButtonId = id || generatedId;

    const [uncontrolledChecked, setUncontrolledChecked] = useState(false);
    const isChecked = checked !== undefined ? checked : uncontrolledChecked;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        const value: boolean = event.target.checked;

        if (checked === undefined) {
            setUncontrolledChecked(value);
        }

        onChange?.(value);
    };

    const getCustomInputClasses = () => {
        const classes = [
            'appearance-none rounded-full border-2 transition-all duration-200',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 focus:ring-offset-0',
        ];

        if (disabled) {
            classes.push('border-grey-30 bg-grey-10 cursor-not-allowed');
        } else {
            classes.push('hover:ring-4 hover:ring-blue-100 cursor-pointer');

            if (isChecked) {
                classes.push('border-blue-600', 'active:border-blue-700');
            } else {
                classes.push('border-grey-30 active:border-grey-40');
            }
        }

        return classes.join(' ');
    };

    const peerClasses =
        'peer-checked:peer-disabled:bg-grey-30 peer-checked:bg-blue-600 peer-checked:peer-active:bg-blue-700';

    return (
        <label
            htmlFor={radioButtonId}
            className={`inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className} `}
        >
            <div className="relative flex h-[24px] w-[24px] items-center justify-center">
                <input
                    className={`peer h-[16px] w-[16px] shrink-0 ${getCustomInputClasses()}`}
                    type="radio"
                    id={radioButtonId}
                    disabled={disabled}
                    checked={isChecked}
                    onChange={handleChange}
                />
                <div className={`pointer-events-none absolute h-[8px] w-[8px] rounded-full ${peerClasses}`} />
            </div>

            {children && (
                <div className={`text-r16 pl-[4px] ${disabled ? 'text-grey-40' : 'text-grey-90'}`}>{children}</div>
            )}
        </label>
    );
};
