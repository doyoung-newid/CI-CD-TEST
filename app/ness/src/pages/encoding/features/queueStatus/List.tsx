import {
    Column,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QueueFileItem } from '@/api/models/queueList.ts';
import { StatusChip, Tooltip } from '@plitvice/ui';
import { StatusColor } from '@plitvice/ui/components/chips/StatusChip.tsx';
import { QueueStatusType } from '@/types/enum.ts';
import SortHeader from '@/components/SortHeader.tsx';
import CommonChips from '@/components/CommonChips.tsx';

interface Props {
    data: QueueFileItem[];
    onItemClick: (item: QueueFileItem) => void;
}
const columnHelper = createColumnHelper<QueueFileItem>();

function QueueStatusList({ data, onItemClick }: Props) {
    const { t } = useTranslation();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'status', desc: false }]);

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '-';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const pad2 = (num: number) => String(num).padStart(2, '0');

        return `${hours}:${pad2(minutes)}:${pad2(secs)}`;
    };

    const formatProcTime = (seconds: number | null) => {
        if (!seconds) return '-';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m ${secs}s`;
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('type', {
                header: ({ column }) => <SortHeader title={t('queueStatus.tableCol0')} column={column} />,
                cell: (info) => <CommonChips value={info.getValue()} />,
                enableSorting: true,
            }),
            columnHelper.accessor('status', {
                header: ({ column }) => <SortHeader title={t('queueStatus.tableCol1')} column={column} />,
                cell: (info) => {
                    let chipColor: StatusColor = 'green';
                    switch (info.getValue()) {
                        case QueueStatusType[1]:
                            chipColor = 'yellow';
                            break;
                        case QueueStatusType[2]:
                            chipColor = 'cyan';
                            break;
                        case QueueStatusType[3]:
                            chipColor = 'red';
                            break;
                    }
                    return (
                        <StatusChip color={chipColor}>
                            ● {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1) || '-'}
                        </StatusChip>
                    );
                },
                enableSorting: true,
                sortingFn: (rowA, rowB) => {
                    const indexA = QueueStatusType.indexOf(rowA.original.status);
                    const indexB = QueueStatusType.indexOf(rowB.original.status);
                    return indexA - indexB;
                },
            }),
            columnHelper.accessor('totalTimeSpent', {
                header: () => (
                    <Tooltip text={'Encoding Process Time'}>
                        <p>{t('queueStatus.tableCol2')}</p>
                    </Tooltip>
                ),
                cell: (info) => <p className={`text-center`}>{formatProcTime(info.getValue())}</p>,
                enableSorting: true,
                meta: { thStyle: 'text-center' },
            }),
            columnHelper.accessor('programTitle', {
                header: ({ column }) => (
                    <SortHeader title={t('queueStatus.tableCol3')} column={column as Column<QueueFileItem, string>} />
                ),
                cell: (info) => (
                    <div className={`flex items-center`}>
                        <Tooltip text={info.getValue() || '-'}>
                            {info.getValue() ? (
                                <p
                                    onClick={() => onItemClick(info.row.original)}
                                    className={
                                        'line-clamp-2 cursor-pointer break-all hover:text-blue-600 hover:underline'
                                    }
                                >
                                    {info.getValue()}
                                </p>
                            ) : (
                                '-'
                            )}
                        </Tooltip>
                    </div>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('programId', {
                header: ({ column }) => <SortHeader title={t('queueStatus.tableCol4')} column={column} />,
                cell: (info) => (
                    <a
                        className={`line-clamp-1 break-all hover:text-blue-600 hover:underline`}
                        target={'_blank'}
                        href={`https://partner.its-newid.net/?cmd=edit&id=${info.getValue()}`}
                    >
                        {info.getValue()}
                    </a>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('duration', {
                header: () => t('queueStatus.tableCol5'),
                cell: (info) => <p className={`text-center`}>{formatDuration(info.getValue()) || '-'}</p>,
                enableSorting: true,
                meta: { thStyle: 'text-center' },
            }),
            columnHelper.accessor('createdAt', {
                header: ({ column }) => <SortHeader title={t('queueStatus.tableCol7')} column={column} />,
                cell: (info) => <p>{info.getValue() || '-'}</p>,
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
                <col width="118px" />
                <col width="136px" />
                <col width="120px" />
                <col width="100%" />
                <col width="80%" />
                <col width="112px" />
                <col width="156px" />
            </colgroup>
            <thead className={'text-b16 text-grey-70 sticky top-0 z-20'}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className={`border-grey-10 border-b`}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className={`border-grey-20 border-b-[2px] bg-white px-[22px] ${header.column.columnDef.meta?.thStyle}`}
                            >
                                <h3 className={`py-[14px]`}>
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
                            return (
                                <td
                                    key={cell.id}
                                    className={`border-grey-20 text-r16 text-grey-90 h-[70px] border-b px-[22px] py-[14px]`}
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
}
export default QueueStatusList;
