import { useState, useRef, useLayoutEffect } from 'react';

interface Props {
    text: string;
    className?: string;
}

function TooltipBox({ text, className }: Props) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(true);
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            const element = textRef.current;
            if (element) {
                setIsOverflowing(element.scrollHeight > element.clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    const handleMouseEnter = () => {
        if (isOverflowing) {
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <p ref={textRef} className={`${className}`}>
                {text}
            </p>
            {showTooltip && (
                <div
                    className="bg-grey-90 text-r14 absolute left-0 top-full z-10 mt-[12px] max-w-[280px] rounded-[6px] px-[12px] py-[10px] text-white shadow-lg"
                    role="tooltip"
                >
                    {text}
                    <div className="border-b-grey-90 text-r14 absolute bottom-full left-[12px] h-0 w-0 border-x-[6px] border-b-[6px] border-x-transparent"></div>
                </div>
            )}
        </div>
    );
}
export { TooltipBox };
