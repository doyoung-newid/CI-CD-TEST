import React, { useId } from 'react';
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip';

export interface TooltipProps {
    children: React.ReactNode;
    text: string;
    show?: boolean;
    place?: PlacesType;
    maxWidth?: number;
    className?: string;
}

function Tooltip({ children, text, show = true, place = 'bottom', maxWidth = 280, className }: TooltipProps) {
    const tooltipId = useId();

    const wrapperClassNames = `relative inline-block ${className || ''}`;

    if (!show) {
        return <div className={wrapperClassNames}>{children}</div>;
    }

    return (
        <div className={wrapperClassNames}>
            <div data-tooltip-id={tooltipId} data-tooltip-content={text}>
                {children}
            </div>
            <ReactTooltip
                id={tooltipId}
                place={place}
                offset={6}
                style={{
                    backgroundColor: 'var(--color-grey-90)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'normal',
                    lineHeight: '18px',
                    wordBreak: 'break-all',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    zIndex: 10001,
                    width: 'max-content',
                    ...(maxWidth !== undefined && { maxWidth: `${maxWidth}px` }),
                }}
                arrowColor="var(--color-grey-90)"
            />
        </div>
    );
}

export { Tooltip };
