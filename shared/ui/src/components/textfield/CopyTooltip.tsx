import { useLayoutEffect, useRef, useState } from 'react';
import { Tooltip, TooltipProps } from '@/components/textfield/Tooltip';
import { copyToClipboard } from '@plitvice/util';

type Props = Pick<TooltipProps, 'className' | 'text' | 'place' | 'maxWidth'>;

function CopyTooltip({
    text,
    place = 'bottom',
    maxWidth = 280,
    className = 'line-clamp-2 w-[200px]',
    onCopySuccess,
}: Props & {
    onCopySuccess?: () => void;
}) {
    const [isOverflowing, setIsOverflowing] = useState(true);
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            const element = textRef.current;
            if (element) {
                setIsOverflowing(element.scrollHeight - 1 > element.clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    const handleClick = async () => {
        if (!isOverflowing) return;

        const success = await copyToClipboard(text);
        if (success) {
            onCopySuccess?.();
        }
    };

    return (
        <Tooltip text={text} place={place} maxWidth={maxWidth} show={isOverflowing}>
            <p className={`${className} ${isOverflowing && 'cursor-copy'}`} ref={textRef} onClick={handleClick}>
                {text}
            </p>
        </Tooltip>
    );
}

export { CopyTooltip };
