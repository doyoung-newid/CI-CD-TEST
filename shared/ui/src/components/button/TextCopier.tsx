import CopierIcon from '@/assets/icCopier.svg?react';

interface Props {
    value: string;
    onSuccess?: () => void;
    className?: string;
}

function TextCopier({ value, onSuccess, className = '' }: Props) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            onSuccess?.();
        } catch (e) {
            console.error('Copy failed', e);
        }
    };

    return (
        <div className={`flex items-start justify-center gap-[4px]`}>
            <p className={`text-r16 ${className}`}>{value}</p>
            <button onClick={handleCopy} className={`text-grey-50 hover:text-blue-600`}>
                <CopierIcon />
            </button>
        </div>
    );
}
export { TextCopier };
