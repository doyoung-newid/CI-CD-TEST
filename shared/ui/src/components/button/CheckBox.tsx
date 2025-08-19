import React, { useRef, useEffect, useState, useId } from 'react';
import CheckmarkIcon from '@/assets/icCheckmark.svg?react';
import IndeterminateIcon from '@/assets/icIndeterminate.svg?react';

interface CheckboxProps {
    className?: string;
    id?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    children?: React.ReactNode;
}

export const Checkbox = ({
    className = '',
    id,
    disabled = false,
    indeterminate = false,
    checked,
    onChange,
    children,
}: CheckboxProps) => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const [uncontrolledChecked, setUncontrolledChecked] = useState(false);
    const isChecked = checked !== undefined ? checked : uncontrolledChecked;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        let value: boolean;

        if (indeterminate) {
            value = true;
        } else {
            value = event.target.checked;
        }

        if (checked === undefined) {
            setUncontrolledChecked(value);
        }

        onChange?.(value);
    };

    const renderIcon = () => {
        const iconColor = disabled ? 'text-grey-10' : 'text-white';

        if (indeterminate) {
            return <IndeterminateIcon className={iconColor} />;
        }

        if (isChecked) {
            return <CheckmarkIcon className={iconColor} />;
        }

        return null;
    };

    const getCustomInputClasses = () => {
        const classes = [
            'appearance-none rounded-[2px] border-2 transition-all duration-200',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 focus:ring-offset-0',
        ];

        if (disabled) {
            classes.push('border-grey-30 bg-grey-10');
            if (isChecked || indeterminate) {
                classes.push('bg-grey-30');
            }
        } else {
            classes.push('hover:ring-4 hover:ring-blue-100');

            if (isChecked || indeterminate) {
                classes.push('border-blue-600 bg-blue-600', 'active:border-blue-700 active:bg-blue-700');
            } else {
                classes.push('border-grey-30 bg-white', 'active:border-grey-40');
            }
        }

        return classes.join(' ');
    };

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <label
            htmlFor={checkboxId}
            className={`inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            <div className="relative flex h-[24px] w-[24px] items-center justify-center">
                <input
                    className={`h-[16px] w-[16px] shrink-0 ${getCustomInputClasses()}`}
                    type="checkbox"
                    id={checkboxId}
                    disabled={disabled}
                    checked={isChecked}
                    onChange={handleChange}
                    ref={checkboxRef}
                />

                <div className="absolute flex h-[16px] w-[16px] items-center justify-center">{renderIcon()}</div>
            </div>

            {children && (
                <div className={`text-r16 pl-[4px] ${disabled ? 'text-grey-40' : 'text-grey-90'}`}>{children}</div>
            )}
        </label>
    );
};
