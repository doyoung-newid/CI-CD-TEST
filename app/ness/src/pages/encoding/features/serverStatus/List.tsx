import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { ServerInstance } from '@/api/models/serverStatus.ts';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusChip, Button, useToast } from '@plitvice/ui';
import { ServerStatusType } from '@/types/enum.ts';
import { firstUpperCase } from '@/utils';
import SortHeader from '@/components/SortHeader.tsx';
import { StatusColor } from '@plitvice/ui/components/chips/StatusChip.tsx';
import CommonChips from '@/components/CommonChips.tsx';
import { putServerStatus } from '@/api/services/serverStatus.ts';

interface Props {
    data: ServerInstance[];
}
const columnHelper = createColumnHelper<ServerInstance>();

function ServerStatusList({ data }: Props) {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'instanceName', desc: false }]);

    const handlePutStatus = (instanceId: string, status: string) => {
        putServerStatus(instanceId, status)
            .then((res) => {
                if (res.code === 20000) {
                    showToast(`${instanceId} ${status}`, 'info');
                } else {
                    showToast(`${instanceId} failed to ${status}`, 'error');
                }
            })
            .catch(() => showToast(`${instanceId} failed to ${status}`, 'error'));
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('serverType', {
                header: ({ column }) => <SortHeader title={t('serverStatus.tableCol0')} column={column} />,
                cell: (info) => <CommonChips value={info.getValue()} />,
                enableSorting: true,
            }),
            columnHelper.accessor('status', {
                header: ({ column }) => <SortHeader title={t('serverStatus.tableCol1')} column={column} />,
                cell: (info) => {
                    let chipColor: StatusColor = 'grey';
                    switch (info.getValue()) {
                        case ServerStatusType[1]:
                            chipColor = 'yellow';
                            break;
                        case ServerStatusType[2]:
                            chipColor = 'green';
                            break;
                        case ServerStatusType[3]:
                            chipColor = 'orange';
                            break;
                    }
                    return (
                        <div className={`flex items-center justify-between gap-[12px] truncate`}>
                            <StatusChip color={chipColor}>● {firstUpperCase(info.getValue())}</StatusChip>
                            <div className={'flex gap-[12px]'}>
                                <Button
                                    fill={false}
                                    size={'small'}
                                    disabled={info.row.original.serverType !== 'cloud'}
                                    onClick={() => handlePutStatus(info.row.original.instanceId, 'start')}
                                >
                                    {t('button.start')}
                                </Button>
                                <Button
                                    fill={false}
                                    size={'small'}
                                    disabled={info.row.original.serverType !== 'cloud'}
                                    onClick={() => handlePutStatus(info.row.original.instanceId, 'stop')}
                                >
                                    {t('button.stop')}
                                </Button>
                            </div>
                        </div>
                    );
                },
                enableSorting: true,
                sortingFn: (rowA, rowB) => {
                    const indexA = ServerStatusType.indexOf(rowA.original.status);
                    const indexB = ServerStatusType.indexOf(rowB.original.status);
                    return indexA - indexB;
                },
            }),
            columnHelper.accessor('instanceName', {
                header: ({ column }) => <SortHeader title={t('serverStatus.tableCol2')} column={column} />,
                cell: (info) => <p className={`line-clamp-1 break-all`}>{info.getValue()}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('instanceId', {
                header: ({ column }) => <SortHeader title={t('serverStatus.tableCol3')} column={column} />,
                cell: (info) => <p className={`line-clamp-1 break-all`}>{info.getValue()}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('createdAt', {
                header: ({ column }) => <SortHeader title={t('serverStatus.tableCol4')} column={column} />,
                cell: (info) => <p>{info.getValue()}</p>,
                enableSorting: true,
            }),
            columnHelper.accessor('updatedAt', {
                header: ({ column }) => <SortHeader title={t('serverStatus.tableCol5')} column={column} />,
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
                <col width="118px" />
                <col width="260px" />
                <col width="100%" />
                <col width="80%" />
                <col width="156px" />
                <col width="156px" />
            </colgroup>
            <thead className={'text-b16 text-grey-70 sticky top-0 z-20'}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className={`border-grey-10 border-b`}>
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
}
export default ServerStatusList;
