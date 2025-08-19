import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { RelevanceItem, RelevanceLocalized, RelevanceTranslationItem } from '@/api/model/relevance.ts';
import { Language } from '@/types/enums.ts';
import { Button, BinIcon, CellInput, SearchInput } from '@plitvice/ui';
import useRelevance from '@/pages/settings/features/relevance/index.hooks.ts';
import RelevanceForm from '@/pages/settings/features/relevance/RelevanceForm.tsx';

const getCellId = (rowIndex: number, colIndex: number): string => `cell-${rowIndex}-${colIndex}`;

function RelevancePage() {
    const { t } = useTranslation();
    const { filteredList, insertFn, updateFn, deleteFn, setSearchTerm } = useRelevance();
    const [isSheetOpen, setSheetOpen] = useState(false);

    const handleInsert = async (data: RelevanceLocalized) => {
        const result = await insertFn(data);
        if (result) {
            alert(t('relevance.errorDuplicate', { key: result }));
        }
    };
    const handleUpdate = async (data: RelevanceTranslationItem) => {
        const result = await updateFn(data);
        if (!result) {
            alert(t('common.alertErrUnknown', { key: result }));
        }
    };
    const handleDelete = async (id: number) => {
        if (confirm(t('relevance.alertDelete'))) {
            const result = await deleteFn(id);
            if (!result) {
                alert(t('relevance.errorDelete'));
            }
        }
    };
    const handleEnterKey = useCallback(
        (rowIndex: number, colIndex: number) =>
            setTimeout(() => {
                let id = getCellId(rowIndex + 1, colIndex);
                if (rowIndex + 1 >= filteredList.length) {
                    id = getCellId(0, colIndex + 1);
                }
                document.getElementById(id)?.focus();
            }, 0),
        [filteredList],
    );

    const columnHelper = useMemo(() => createColumnHelper<RelevanceItem>(), []);
    const columns = useMemo(() => {
        const columnList = [
            columnHelper.accessor('id', {
                header: '',
                cell: (info) => (
                    <div className={'flex h-[50px] items-center justify-end'}>
                        <BinIcon
                            width={24}
                            height={24}
                            className={'hidden cursor-pointer text-red-500 group-hover/delete:block'}
                            onClick={() => handleDelete(info.getValue())}
                        />
                    </div>
                ),
                meta: {
                    headerClass: 'left-0 min-w-[36px] sticky text-center z-10 p-0',
                    className: 'left-0 min-w-[36px] sticky text-center z-10 p-0',
                },
            }),
            columnHelper.display({
                id: 'number',
                header: t('relevance.tableCol2'),
                cell: (info) => info.row.index + 1,
                meta: {
                    headerClass: 'left-[36px] min-w-[54px] sticky text-center z-10',
                    className: 'left-[36px] min-w-[54px] sticky text-center z-10',
                },
            }),
            columnHelper.accessor('name.en', {
                header: Language[0].label,
                cell: ({ row }) => {
                    const relevance = row.original;
                    return <p className={'text-r16 px-[11px] py-[9px]'}>{relevance.name.en}</p>;
                },
                meta: {
                    headerClass: `left-[90px] min-w-[360px] sticky z-10 px-[22px]`,
                    className: 'left-[90px] px-[12px] py-[5px] sticky z-10',
                },
            }),
        ];
        const filteredLanguage = Language.filter((lang) => lang.value !== 'en');
        filteredLanguage.map((lang, index) => {
            const column = columnHelper.accessor(`name.${lang.value}`, {
                header: lang.label,
                cell: ({ row }) => {
                    const relevance = row.original;
                    const currentCellId = getCellId(row.index, index + 1);

                    return (
                        <CellInput
                            id={currentCellId}
                            className={'px-[11px] py-[9px]'}
                            placeholder={t('relevance.cellPlaceholder')}
                            value={relevance.name[lang.value] ?? ''}
                            onDone={(value: string) =>
                                handleUpdate({
                                    id: relevance.id,
                                    name: value,
                                    lang: lang.value,
                                })
                            }
                            onEnter={() => handleEnterKey(row.index, index + 1)}
                        />
                    );
                },
                meta: {
                    headerClass: `min-w-[360px] px-[22px]`,
                    className: `px-[12px] py-[5px]`,
                },
            });
            columnList.push(column);
        });
        return columnList;
    }, [columnHelper, filteredList]);
    const table = useReactTable({
        data: filteredList,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
    });

    return (
        <div className={'flex h-screen min-w-[1000px] flex-col p-[36px] pt-[48px]'}>
            <h1>{t('relevance.title')}</h1>
            <p className={`text-r14 text-grey-60 mt-[12px] whitespace-pre-line`}>{t('relevance.description')}</p>
            <div className={'mt-[20px] flex justify-between'}>
                <SearchInput size={'medium'} width={400} onChange={setSearchTerm} />
                <Button variant={'normal'} onClick={() => setSheetOpen(true)}>
                    {t('relevance.add')}
                </Button>
            </div>
            <div className={'border-grey-20 relative mt-[12px] flex-grow overflow-auto rounded-[4px] border bg-white'}>
                <div
                    className={'z-100 sticky left-[428px] top-0 h-full w-[22px] shadow-[4px_0_4px_0_rgba(0,0,0,0.1)]'}
                />
                <table className={'absolute left-0 top-0 table-fixed border-separate border-spacing-0 text-left'}>
                    <thead className={'text-b16 sticky top-0 z-20'}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            className={`border-grey-20 border-b-[2px] bg-white ${header.column.columnDef.meta?.headerClass}`}
                                        >
                                            <h3 className={'leading-[50px]'}>
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
                            <tr
                                key={row.id}
                                className={
                                    'group/delete transition-bg [&:hover>td]:bg-grey-10 group h-[49px] duration-100 [&>td]:bg-white focus-within:[&>td]:bg-blue-100'
                                }
                            >
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className={`border-grey-20 border-b bg-white ${cell.column.columnDef.meta?.className}`}
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
            <RelevanceForm isOpen={isSheetOpen} onClose={() => setSheetOpen(false)} onAdd={handleInsert} />
        </div>
    );
}
export default RelevancePage;
