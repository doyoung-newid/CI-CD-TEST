import { LabelPosition, Size } from '@/types/common';
import useTextField from '@/components/textfield/textInput.hooks';
import { LabeledInput } from '@/components/textfield/LabeledInput';

type TextInputSize = Extract<Size, 'medium' | 'large'>;

export interface TextInputProps {
    size?: TextInputSize;
    width?: number;
    label?: string;
    labelColor?: string;
    labelPosition?: LabelPosition;
    supportingText?: string;
    supportingTextColor?: string;
    value?: string;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
    className?: string;
}

const TextInput = ({
    size = 'medium',
    width = 0,
    placeholder = 'Placeholder',
    value: initialValue = '',
    label = '',
    labelColor = '',
    labelPosition = 'none',
    supportingText = '',
    supportingTextColor = '',
    disabled = false,
    readOnly = false,
    onChange = () => {},
    onDone = () => {},
    className = '',
}: TextInputProps) => {
    const { inputRef, isFocused, value, handleChange } = useTextField(initialValue, onChange, onDone);

    const bgClass = disabled ? 'bg-grey-20' : 'bg-white';
    const borderClass = isFocused ? 'border-blue-500' : 'border-grey-40';

    return (
        <LabeledInput.Root className={className} size={size} width={width}>
            {labelPosition === 'outer' ? (
                <LabeledInput.OuterLabel color={labelColor}>{label}</LabeledInput.OuterLabel>
            ) : null}
            <LabeledInput.Content className={`px-[11px] ${bgClass} border ${borderClass}`}>
                {labelPosition === 'inner' ? (
                    <LabeledInput.InnerLabel color={labelColor}>{label}</LabeledInput.InnerLabel>
                ) : null}
                <LabeledInput.Input
                    className={'placeholder:text-grey-40'}
                    placeholder={placeholder}
                    value={value}
                    readOnly={readOnly}
                    disabled={disabled}
                    onChange={handleChange}
                    ref={inputRef}
                />
            </LabeledInput.Content>
            {supportingText !== '' ? (
                <LabeledInput.SupportingText color={supportingTextColor}>{supportingText}</LabeledInput.SupportingText>
            ) : null}
        </LabeledInput.Root>
    );
};

export { TextInput };
