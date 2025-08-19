import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { BinIcon, Button, Tooltip } from '@plitvice/ui';

import { useMediaMetadata } from '@/hooks/useMediaInfo.ts';

import FileDropzone from '@/routes/fileUpload/fileDropzone.tsx';

import { MediaFile, MediaFileStatus, MediaSubFile } from '@/types/mediainfo.types.ts';

import { CommonChips } from '@/components';

import { formatDuration, formatFileSize, getFileName, getLanguageCode } from '@/utils';

interface Props {
    isUploading: boolean;
    fileList: MediaFile[];
    setFileList: Dispatch<SetStateAction<MediaFile[]>>;
    removeFile: (fileName: string) => void;
    runUpload: () => void;
    pauseUpload: () => void;
}

const columnHelper = createColumnHelper<MediaFile>();

export const FileUploadingList = ({
    isUploading,
    fileList,
    setFileList,
    removeFile,
    runUpload,
    pauseUpload,
}: Props) => {
    const { t } = useTranslation();
    const { extractMetadata } = useMediaMetadata();

    const handleAddFile = useCallback(
        async (newMediaList: File[], newSubList: File[]) => {
            const extractedList = await extractMetadata(newMediaList);
            const newAddedList: MediaFile[] = [];

            extractedList.forEach((newFile) => {
                const mediaFile = fileList.find((file) => file.origin.name === newFile.origin.name);
                if (mediaFile) {
                    const isConfirmed = confirm(
                        t('fileUpload.section0.confirmDuplicated', { fileName: mediaFile.origin.name }),
                    );
                    if (isConfirmed) {
                        newAddedList.push(newFile);
                    }
                } else {
                    newAddedList.push(newFile);
                }
            });

            setFileList((prev) => {
                const existingNames = new Set(newAddedList.map((file) => file.origin.name));
                const changedPrevList = prev.filter((oldFile) => !existingNames.has(oldFile.origin.name));
                const resultList = [...changedPrevList, ...newAddedList];
                resultList.map((file) => {
                    const filteredSubList = newSubList.filter((sub) =>
                        sub.name.startsWith(getFileName(file.origin.name)),
                    );
                    const validSubList: MediaSubFile[] = [];
                    filteredSubList.forEach((sub) => {
                        const languageCode = getLanguageCode(sub.name);
                        if (languageCode) {
                            validSubList.push({
                                file: sub,
                                language: languageCode,
                            });
                        }
                    });
                    file.subtitles = validSubList.length > 0 ? validSubList : undefined;
                });
                return resultList;
            });
        },
        [extractMetadata, setFileList, fileList, t],
    );

    const handleRemoveFile = useCallback(
        (file: MediaFile) => {
            const isConfirmed = confirm(t('fileUpload.section0.alertDelete', { fileName: file.origin.name }));
            if (isConfirmed) {
                removeFile(file.origin.name);
            }
        },
        [removeFile, t],
    );

    const handleRunUpload = useCallback(() => {
        const isConfirmed = confirm(t('fileUpload.section0.confirmUploading'));
        if (isConfirmed) {
            runUpload();
        }
    }, [runUpload, t]);

    const handlePauseUpload = useCallback(() => {
        const isConfirmed = confirm(t('fileUpload.section0.confirmPause'));
        if (isConfirmed) {
            pauseUpload();
        }
    }, [pauseUpload, t]);

    const renderProgress = useCallback(
        (status?: MediaFileStatus, progress = 0) => {
            let progressBar = <></>;
            let tooltipText = t('fileUpload.section0.pending');
            switch (status) {
                case 'uploading':
                    tooltipText = t('fileUpload.section0.uploading');
                    progressBar = (
                        <div
                            className="h-full overflow-hidden rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    );
                    break;
                case 'uploaded':
                    tooltipText = t('fileUpload.section0.uploaded');
                    progressBar = <div className="h-full w-full rounded-full bg-green-600" />;
                    break;
                case 'encoded':
                    tooltipText = t('fileUpload.section0.encoded');
                    progressBar = <div className="h-full w-full rounded-full bg-yellow-400" />;
                    break;
                case 'error':
                    tooltipText = t('fileUpload.section0.error');
                    progressBar = <div className="h-full w-full rounded-full bg-red-600" />;
                    break;
            }
            return (
                <Tooltip text={tooltipText} className={`w-full`}>
                    <div className="bg-grey-20 relative h-[8px] w-full overflow-hidden rounded-full">
                        {progressBar}
                        {(status === 'pending' || status === 'uploading') && isUploading && (
                            <div className="absolute left-0 top-0 h-full w-full -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        )}
                    </div>
                </Tooltip>
            );
        },
        [isUploading, t],
    );

    const columns = useMemo(() => {
        return [
            columnHelper.display({
                id: 'delete',
                cell: ({ row }) => {
                    const disabled =
                        isUploading || (row.original.status !== 'pending' && row.original.status !== 'error');
                    return (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => handleRemoveFile(row.original)}
                                className={`text-grey-50 flex-shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-100 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-red-500'}`}
                            >
                                <BinIcon className="h-6 w-6 transition-colors" />
                            </button>
                        </div>
                    );
                },
                meta: { tdStyle: 'pl-[12px] text-left' },
            }),
            columnHelper.accessor('origin.name', {
                header: () => t('fileUpload.section0.tableCol0'),
                cell: ({ row }) => (
                    <div className={`flex gap-[4px]`}>
                        {row.original.subtitles ? (
                            <div className={`flex gap-[4px] pr-[8px]`}>
                                {row.original.subtitles.map(({ language }) => (
                                    <CommonChips value={language} key={`${row.original.id}-${language}`} />
                                ))}
                            </div>
                        ) : null}
                        <p className={`line-clamp-1`}>{row.original.origin.name}</p>
                    </div>
                ),
                meta: {
                    thStyle: 'text-left',
                    tdStyle: 'px-[22px] text-left',
                },
            }),
            columnHelper.accessor('metadata.duration', {
                header: () => t('fileUpload.section0.tableCol1'),
                cell: ({ getValue }) => formatDuration(getValue()),
                meta: { tdStyle: 'px-[22px]' },
            }),
            columnHelper.accessor('origin.size', {
                header: () => t('fileUpload.section0.tableCol2'),
                cell: ({ getValue }) => formatFileSize(getValue()),
                meta: { tdStyle: 'px-[22px]' },
            }),
            columnHelper.display({
                id: 'progress',
                header: t('fileUpload.section0.tableCol3'),
                cell: ({ row }) => renderProgress(row.original.status, row.original.progress),
                meta: { tdStyle: 'px-[22px]' },
            }),
        ];
    }, [handleRemoveFile, renderProgress, t]);

    const table = useReactTable({
        data: fileList,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <FileDropzone onAddFile={handleAddFile} disabled={isUploading} />
            <div className={`border-grey-20 relative flex-1 overflow-auto rounded-[4px] border bg-white`}>
                <table className={'w-full table-fixed border-separate border-spacing-0 text-left'}>
                    <colgroup>
                        <col width="36px" />
                        <col width="100%" />
                        <col width="120px" />
                        <col width="120px" />
                        <col width="146px" />
                    </colgroup>
                    <thead className="border-grey-20 sticky top-0 z-10 border-[2px]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            className={`border-grey-20 border-b-[2px] bg-white px-[22px] text-center ${header.column.columnDef.meta?.thStyle}`}
                                            key={header.id}
                                        >
                                            <h3 className={`py-[14px]`}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </h3>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr
                                key={`${row.id}-${index}`}
                                className="border-grey-20 hover:bg-grey-10 group border-b text-center"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`border-grey-20 text-r16 text-grey-90 border-b py-[12px] ${cell.column.columnDef.meta?.tdStyle}`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {fileList.length === 0 && (
                    <p
                        className={`text-r16 text-grey-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-[52px]`}
                    >
                        {t('fileUpload.section0.empty')}
                    </p>
                )}
            </div>
            <Button
                variant={isUploading ? 'default' : 'normal'}
                size="medium"
                disabled={fileList.length === 0 || !fileList.find((file) => file.status === 'pending')}
                onClick={isUploading ? handlePauseUpload : handleRunUpload}
            >
                {isUploading ? t('fileUpload.section0.btnPause') : t('fileUpload.section0.btnRun')}
            </Button>
        </>
    );
};
