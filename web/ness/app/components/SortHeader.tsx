import { Column } from '@tanstack/react-table';

import { SortingIcon } from '@plitvice/ui';

interface Props<T extends object> {
    title: string;
    column: Column<T, string>;
}
export const SortHeader = <T extends object>({ title, column }: Props<T>) => {
    const sorted = column.getIsSorted();
    const opacity = sorted == false ? 'opacity-0 group-hover:opacity-100' : 'opacity-100';
    const rotate = sorted === 'desc' ? 'rotate-180' : '';

    return (
        <p
            className="non-draggable group flex cursor-pointer items-center gap-[4px]"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {title}
            <SortingIcon className={`text-grey-50 group-hover:text-blue-600 ${opacity} ${rotate}`} />
        </p>
    );
};
