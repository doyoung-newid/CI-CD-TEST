import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import useLibrary, { LibrarySearchFilterList } from '@/pages/home/features/library/index.hooks.ts';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { CellButton, SearchInput, SelectBox, SettingIcon } from '@plitvice/ui';
import { Content } from '@/api/model/content.ts';
import { ContentType } from '@/types/common.ts';
import { LinearData } from '@/api/model/linear.ts';
import MetadataSheet from '@/pages/home/features/library/Metadata.tsx';
import { MetadataItem } from '@/api/model/metadata.ts';

function LibraryPage() {
    const { t } = useTranslation();
    const { contentType } = useParams();
    const { titleKey, filteredList, searchFilter, setSearchFilter, setSearchKey, metadataUpdateFn } = useLibrary({
        contentType,
    });
    const [selectedContent, setSelectedContent] = useState<Content>();

    const data = useMemo(() => {
        if (!filteredList.length) return [];
        setSelectedContent(filteredList[0]);
        return filteredList;
    }, [filteredList]);
    const handleDrawerClose = (metadata?: MetadataItem) => {
        if (metadata) {
            metadataUpdateFn(metadata);
        }
        setSelectedContent(undefined);
    };

    const columnHelper = createColumnHelper<Content>();
    const columns = useMemo(() => {
        return [
            columnHelper.accessor('thumbUrl.wide.small', {
                header: t('library.tableCol0'),
                cell: (info) => (
                    <img
                        src={info.getValue()}
                        className={'height-[72px] block w-[128px] max-w-[128px]'}
                        alt="thumbnail"
                    />
                ),
                meta: {
                    headerClass: 'max-w-[128px] text-center',
                    className: 'max-w-[128px]',
                },
            }),
            columnHelper.accessor('contentId', {
                header: t('library.tableCol1'),
                cell: (info) => (
                    <p className={'h-[72px] max-h-[72px] min-h-[72px] content-center truncate'}>{info.getValue()}</p>
                ),
                meta: {
                    headerClass: `min-w-[172px] text-center`,
                    className: `mim-w-[172px] px-[22px] text-center`,
                },
            }),
            columnHelper.accessor('title', {
                header: t('library.tableCol2'),
                cell: ({ row }) => {
                    const content = row.original;
                    let title = content.title;
                    if (contentType === ContentType.LINEAR) {
                        title = `${(content as LinearData).no} ${title}`;
                    }
                    return <p className={'h-[72px] content-center truncate px-[22px]'}>{title}</p>;
                },
                meta: { className: `min-w-[396px] w-full` },
            }),
            columnHelper.display({
                id: 'extension',
                cell: ({ row }) => (
                    <div
                        className={
                            'content-center opacity-0 transition-opacity duration-100 group-hover/extension:opacity-100'
                        }
                    >
                        <CellButton onClick={() => setSelectedContent(row.original)}>
                            <SettingIcon className={'text-grey-70'} />
                        </CellButton>
                    </div>
                ),
                meta: { className: `flex h-[72px] w-[48px]` },
            }),
            columnHelper.display({
                header: t('library.tableCol3'),
                cell: ({ row }) => (
                    <p className={'h-[72px] content-center truncate px-[22px]'}>
                        {row.original.metadata.updatedDate || '0000-00-00'}
                    </p>
                ),
                meta: {
                    headerClass: `min-w-[146px] text-center`,
                    className: `min-w-[146px] text-center`,
                },
            }),
            columnHelper.display({
                header: t('library.tableCol4'),
                cell: ({ row }) => {
                    const name = row.original.metadata.categoryName;
                    return (
                        <p className={`h-[72px] content-center truncate px-[22px] ${name ? '' : 'text-red-500'}`}>
                            {row.original.metadata.categoryName || t('library.categoryEmpty')}
                        </p>
                    );
                },
                meta: {
                    headerClass: `max-w-[192px] text-center`,
                    className: `max-w-[192px] text-center`,
                },
            }),
            columnHelper.display({
                header: t('library.tableCol5'),
                cell: ({ row }) =>
                    row.original.metadata.categoryWeight ? (
                        <p className={'h-[72px] content-center truncate px-[22px]'}>
                            {row.original.metadata.categoryWeight}
                        </p>
                    ) : (
                        <p className={'h-[72px] content-center truncate px-[22px] text-red-500'}>-</p>
                    ),
                meta: {
                    headerClass: `min-w-[98px] text-center`,
                    className: `min-w-[98px] text-center`,
                },
            }),
        ];
    }, [columnHelper]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
    });

    return (
        <div className={'flex h-screen w-full flex-col p-[36px] pt-[48px]'}>
            <h1>
                {titleKey ? t(titleKey) : ''} {t('library.title')}
            </h1>
            <div className={'mt-[20px] flex gap-[8px]'}>
                <SelectBox
                    size={'medium'}
                    width={180}
                    optionList={LibrarySearchFilterList}
                    value={searchFilter}
                    onChange={setSearchFilter}
                />
                <SearchInput size={'medium'} width={372} onChange={setSearchKey} />
            </div>
            <div
                className={
                    'border-grey-20 mt-[8px] w-full min-w-[1200px] flex-grow overflow-y-auto rounded-[4px] border bg-white'
                }
            >
                <table className={'w-full border-separate border-spacing-0 text-left'}>
                    <thead className={'text-b16 sticky top-0 z-20'}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            className={`border-grey-20 border-b-[2px] bg-white ${header.column.columnDef.meta?.headerClass}`}
                                        >
                                            <h3 className={'px-[22px] leading-[50px]'}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </h3>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className={'text-r16'}>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="group/extension hover:bg-grey-10">
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className={`border-grey-20 border-b ${cell.column.columnDef.meta?.className}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <MetadataSheet
                content={selectedContent}
                contentType={contentType ?? ContentType.PROGRAM}
                onClose={handleDrawerClose}
            />
        </div>
    );
}
export default LibraryPage;
