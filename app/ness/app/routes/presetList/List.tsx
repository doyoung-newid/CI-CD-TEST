import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { Tooltip } from '@plitvice/ui';

import { PresetItem } from '@/api/models/preset.ts';

import { CommonChips, SortHeader } from '@/components';

interface Props {
    data?: PresetItem[];
    onItemClick: (item: PresetItem) => void;
}
const columnHelper = createColumnHelper<PresetItem>();

export const EncodingPresetList = ({ data, onItemClick }: Props) => {
    const { t } = useTranslation();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);

    const columns = useMemo(
        () => [
            columnHelper.accessor('type', {
                header: ({ column }) => <SortHeader title={t('presetList.tableCol0')} column={column} />,
                cell: (info) => <TypeChips type={info.getValue()} />,
                enableSorting: true,
            }),
            columnHelper.accessor('name', {
                header: ({ column }) => <SortHeader title={t('presetList.tableCol1')} column={column} />,
                cell: (info) => (
                    <p
                        onClick={() => onItemClick(info.row.original)}
                        className={`cursor-pointer hover:text-blue-600 hover:underline`}
                    >
                        {info.getValue()}
                    </p>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('userGroup', {
                header: ({ column }) => <SortHeader title={t('presetList.tableCol2')} column={column} />,
                cell: (info) => <CommonChips value={info.getValue()} />,
                enableSorting: true,
            }),
            columnHelper.accessor('companyName', {
                header: ({ column }) => <SortHeader title={t('presetList.tableCol3')} column={column} />,
                cell: (info) => <p>{info.getValue()}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('notes', {
                header: t('presetList.tableCol4'),
                cell: (info) => (
                    <Tooltip text={info.getValue()}>
                        <p className={`line-clamp-2`}>{info.getValue()}</p>
                    </Tooltip>
                ),
            }),
            columnHelper.accessor('createdAt', {
                header: ({ column }) => <SortHeader title={t('presetList.tableCol5')} column={column} />,
                cell: (info) => <p>{info.getValue()}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('updatedAt', {
                header: ({ column }) => <SortHeader title={t('presetList.tableCol6')} column={column} />,
                cell: (info) => <p>{info.getValue()}</p>,
                enableSorting: true,
            }),
        ],
        [t],
    );
    const table = useReactTable({
        data: data || [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <table className={'absolute left-0 top-0 w-full table-fixed border-separate border-spacing-0 text-left'}>
            <colgroup>
                <col width="106px" />
                <col width="168px" />
                <col width="160px" />
                <col width="188px" />
                <col width="100%" />
                <col width="156px" />
                <col width="156px" />
            </colgroup>
            <thead className={'text-b16 text-grey-70 sticky top-0 z-20'}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className={`border-grey-20 border-b-[2px] bg-white px-[22px] ${header.column.columnDef.meta?.widthStyle}`}
                            >
                                <h3 className={'leading-[50px]'}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </h3>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-grey-20 hover:bg-grey-10 border-b">
                        {row.getVisibleCells().map((cell) => {
                            const meta = cell.column.columnDef.meta;
                            return (
                                <td
                                    key={cell.id}
                                    className={`border-grey-20 text-r16 text-grey-90 border-b px-[22px] py-[14px] ${meta?.widthStyle} ${meta?.tdStyle}`}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const TypeChips = ({ type }: { type: string }) => {
    let bgColor = 'bg-grey-100';
    switch (type) {
        case 'mp4':
            bgColor = 'bg-blue-600';
            break;
        case 'hls':
            bgColor = 'bg-blue-500';
            break;
        case 'subtitle':
            bgColor = 'bg-[#20C997]';
            break;
    }
    return (
        <p className={`text-b12 w-fit rounded-[4px] px-[4px] py-[2px] leading-[16px] text-white ${bgColor}`}>
            {type.slice(0, 3).toUpperCase()}
        </p>
    );
};
