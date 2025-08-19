export interface StatusBoxProps {
    title?: string;
    titleSlice: string;
    color: string;
    type?: string;
    count?: number;
    selected?: boolean;
    onClick?: () => void;
}

export const StatusBox = ({ title, titleSlice, color, count, selected, onClick }: StatusBoxProps) => {
    return (
        <button
            className={`hover:bg-grey-10 grid flex-1 grid-cols-[40px_1fr] items-center rounded-[4px] border bg-white p-[17px] ${selected ? 'border-grey-50' : 'border-grey-20'}`}
            onClick={onClick}
        >
            <p className={`text-b24 row-span-2 size-[40px] rounded-[4px] border text-center leading-[40px] ${color}`}>
                {titleSlice}
            </p>
            <p className={`text-b12 text-grey-50 pl-[20px] text-left`}>{title}</p>
            <p className={`text-b24 pl-[20px] text-left`}>{count}</p>
        </button>
    );
};
