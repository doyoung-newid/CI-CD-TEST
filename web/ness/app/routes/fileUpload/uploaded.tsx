import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { differenceInCalendarDays, parse, startOfToday } from 'date-fns';

import { BinIcon, Button, ErrorIcon, MoreVertIcon, SelectBox, Tooltip, useToast } from '@plitvice/ui';
import { StatusChip } from '@plitvice/ui/components/chips/StatusChip.tsx';
import { DropdownList, SelectOption } from '@plitvice/ui/components/selectbox/DropdownList.tsx';

import { UploadedFileItem } from '@/api/models/fileUploads.ts';

import { useFileUploaded } from '@/routes/fileUpload/uploaded.hooks.ts';

import { CommonChips, SortHeader } from '@/components';

interface Props {
    userEncryptKey: string;
    presetList: SelectOption[];
}

const columnHelper = createColumnHelper<UploadedFileItem>();
const today = startOfToday();
const date = new Date();

export const FileUploadedList = ({ userEncryptKey, presetList }: Props) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'uploadedAt', desc: false }]);
    const [isOpenPresetAll, setIsOpenPresetAll] = useState(false);
    const { uploadedList, changePreset, changePresetAll, removeFile, runEncoding } = useFileUploaded(userEncryptKey);
    const availableEncoding = useCallback(() => {
        if (uploadedList.length > 0 && presetList.length > 0) {
            const presetIdList = new Set(presetList.map((preset) => preset.value));
            return uploadedList.some((uploaded) => !presetIdList.has(uploaded.presetId));
        } else {
            return true;
        }
    }, [uploadedList, presetList]);

    const handleChangePresetAll = useCallback(
        (option: SelectOption) => {
            changePresetAll(option.value as number);
            setIsOpenPresetAll(false);
        },
        [changePresetAll],
    );

    const handleRunEncoding = useCallback(
        (data: UploadedFileItem[]) => {
            runEncoding(data).then((result) => {
                if (result) {
                    showToast(t('fileUpload.section1.infoSuccess'), 'info');
                } else {
                    showToast(t('fileUpload.section1.errorQueued'), 'error');
                }
            });
        },
        [runEncoding, showToast, t],
    );

    const handleRemoveFile = useCallback(
        (programId: string) => {
            const isConfirmed = confirm(t('fileUpload.section0.alertDelete', { programId }));
            if (isConfirmed) {
                removeFile(programId);
            }
        },
        [removeFile, t],
    );

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'delete',
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(row.original.programId)}
                            className={`text-grey-50 flex-shrink-0 opacity-0 transition-all duration-200 hover:text-red-500 group-hover:opacity-100`}
                        >
                            <BinIcon className="h-6 w-6 transition-colors" />
                        </button>
                    </div>
                ),
                meta: { tdStyle: 'pl-[12px] text-left' },
            }),
            columnHelper.display({
                id: 'rowNumber',
                header: '#',
                meta: { thStyle: 'text-center', tdStyle: 'text-center' },
            }),
            columnHelper.accessor('presetId', {
                id: 'presetStatus',
                header: t('fileUpload.section1.tableCol0'),
                cell: (info) => {
                    const foundItem = presetList.find((item) => item.value === info.getValue());
                    return foundItem ? (
                        <StatusChip color={'blue'}>{t('fileUpload.section1.ready')}</StatusChip>
                    ) : (
                        <StatusChip color={'red'}>{t('fileUpload.section1.error')}</StatusChip>
                    );
                },
                meta: { thStyle: 'text-center', tdStyle: 'text-center' },
            }),
            columnHelper.accessor('presetId', {
                id: 'presetSelector',
                header: () => (
                    <div className={`relative flex items-center justify-between pr-[8px]`}>
                        <p>{t('fileUpload.section1.tableCol1')}</p>
                        <Tooltip className={`h-[24px]`} text={t('fileUpload.section1.tooltipPreset')}>
                            <button
                                className={`rounded-full ${isOpenPresetAll ? 'bg-blue-100 text-blue-600' : 'text-grey-50'} hover:text-blue-600`}
                                onClick={() => setIsOpenPresetAll(!isOpenPresetAll)}
                            >
                                <MoreVertIcon />
                            </button>
                        </Tooltip>
                        <DropdownList
                            size={'medium'}
                            isFocused={isOpenPresetAll}
                            optionList={presetList}
                            onSelected={handleChangePresetAll}
                        />
                    </div>
                ),
                cell: (info) => {
                    const origin = info.row.original;
                    const findIndex = presetList.findIndex((item) => item.value === origin.presetId);
                    if (presetList.length > 0 && findIndex > -1) {
                        return (
                            <div className={`pb-[5px] pt-[1px]`}>
                                <SelectBox
                                    size={'medium'}
                                    border={false}
                                    optionList={presetList}
                                    value={origin.presetId}
                                    onChange={(value) => changePreset(origin.programId, value as number)}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <div className={`flex items-center justify-between pr-[8px] text-red-600`}>
                                <p className={`text-r16 pl-[12px]`}>{t('fileUpload.section1.errorDesc')}</p>
                                <ErrorIcon />
                            </div>
                        );
                    }
                },
                meta: { thStyle: 'px-[22px]', tdStyle: 'pl-[12px] pr-[22px]' },
            }),
            columnHelper.accessor('fileName', {
                header: ({ column }) => <SortHeader title={t('fileUpload.section1.tableCol2')} column={column} />,
                cell: (info) => (
                    <div className={`flex gap-[4px]`}>
                        {info.row.original.languages ? (
                            <div className={`flex gap-[4px] pr-[8px]`}>
                                {info.row.original.languages.split(',').map((lang) => (
                                    <CommonChips value={lang} key={`${info.row.original.programId}-${lang}`} />
                                ))}
                            </div>
                        ) : null}
                        <p className={`line-clamp-1 break-all`}>{info.getValue()}</p>
                    </div>
                ),
                enableSorting: true,
                meta: { thStyle: 'px-[22px]', tdStyle: 'px-[22px]' },
            }),
            columnHelper.accessor('programId', {
                header: ({ column }) => <SortHeader title={t('fileUpload.section1.tableCol3')} column={column} />,
                cell: (info) => (
                    <div className={`flex gap-[4px]`}>
                        <a
                            className={`line-clamp-1 break-all hover:text-blue-600 hover:underline`}
                            target={'_blank'}
                            href={`https://partner.its-newid.net/?cmd=edit&id=${info.row.original.programId}`}
                        >
                            {info.getValue()}
                        </a>
                    </div>
                ),
                enableSorting: true,
                meta: { thStyle: 'px-[22px]', tdStyle: 'px-[22px]' },
            }),
            columnHelper.accessor('createdAt', {
                id: 'uploadedAt',
                header: ({ column }) => <SortHeader title={t('fileUpload.section1.tableCol4')} column={column} />,
                cell: (info) => info.getValue().split(' ')[0],
                enableSorting: true,
                meta: { thStyle: 'pl-[22px]', tdStyle: 'pl-[22px]' },
            }),
            columnHelper.accessor('createdAt', {
                id: 'destroyAt',
                header: () => t('fileUpload.section1.tableCol5'),
                cell: (info) => {
                    const createdAt = parse(info.getValue(), 'yyyy-MM-dd HH:mm:ss', date);
                    const dayDiff = differenceInCalendarDays(today, createdAt) - 7;
                    return <p className={`text-red-600`}>{dayDiff > 0 ? 'D-Day' : `D-${Math.abs(dayDiff)}`}</p>;
                },
                meta: { thStyle: 'text-center', tdStyle: 'text-center' },
            }),
        ],
        [changePreset, handleChangePresetAll, handleRemoveFile, isOpenPresetAll, presetList, t],
    );

    const table = useReactTable({
        data: uploadedList || [],
        columns: columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <div className={`border-grey-20 relative flex-1 overflow-auto rounded-[4px] border bg-white`}>
                <table className={'w-full table-fixed border-separate border-spacing-0 text-left'}>
                    <colgroup>
                        <col width="36px" />
                        <col width="54px" />
                        <col width="108px" />
                        <col width="200px" />
                        <col width="100%" />
                        <col width="80%" />
                        <col width="138px" />
                        <col width="94px" />
                    </colgroup>
                    <thead className={'text-b16 text-grey-70 sticky top-0 z-20'}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        className={`border-grey-20 border-b-[2px] bg-white ${header.column.columnDef.meta?.thStyle || ''}`}
                                        key={header.id}
                                    >
                                        <h3 className={'py-[12px]'}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </h3>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, rowIndex) => (
                            <tr
                                key={`${row.id}-${rowIndex}`}
                                className="border-grey-20 hover:bg-grey-10 group border-b"
                            >
                                {row.getVisibleCells().map((cell, index) => (
                                    <td
                                        key={`${cell.id}-${index}`}
                                        className={`border-grey-20 text-r16 text-grey-90 h-[50px] border-b ${cell.column.columnDef.meta?.tdStyle || ''}`}
                                    >
                                        {cell.column.id === 'rowNumber'
                                            ? rowIndex + 1
                                            : flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {uploadedList.length === 0 && (
                    <p
                        className={`text-r16 text-grey-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-[52px]`}
                    >
                        {t('fileUpload.section1.empty')}
                    </p>
                )}
            </div>
            <Button
                variant="normal"
                size="medium"
                disabled={availableEncoding()}
                onClick={() => handleRunEncoding(uploadedList)}
            >
                {t('fileUpload.section1.btn')}
            </Button>
        </>
    );
};
