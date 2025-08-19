import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { LanguageCodes } from '@/types/enums.ts';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DraggableAttributes,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CategoryItem, CategoryTranslationItem } from '@/api/model/category.ts';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { BinIcon, CellButton, CellInput } from '@plitvice/ui';
import { useTranslation } from 'react-i18next';
import HandleIcon from '@/assets/icDragHandle.svg?react';
import { CellInputRef } from '@plitvice/ui/components/textfield/CellInput.tsx';

const getCellId = (rowId: number, colIndex: number) => {
    return `cell-${rowId}-${colIndex}`;
};

const hoverFadeClasses = 'opacity-0 transition-opacity duration-100 group-hover:opacity-100';

type CategoryTableProps = {
    categoryList: CategoryItem[];
    onUpdateCategory: (prop: CategoryTranslationItem) => Promise<boolean>;
    onReorderCategory: (props: { id: number; order: number; reorderedList: CategoryItem[] }) => Promise<void>;
    onRemoveCategory: (id: number) => Promise<boolean>;
    onExistsCategory: (item: CategoryTranslationItem) => boolean;
    onShowDetail: (category: CategoryItem) => void;
};

const CategoryTable = ({
    categoryList,
    onUpdateCategory,
    onReorderCategory,
    onRemoveCategory,
    onExistsCategory,
    onShowDetail,
}: CategoryTableProps) => {
    const { t } = useTranslation();

    const scrollRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);

    const cellRefsMap = useRef<Map<string, CellInputRef | null>>(new Map());
    const getCellRef = (cellId: string): CellInputRef | null => {
        return cellRefsMap.current.get(cellId) || null;
    };

    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id === over?.id) return;

        const oldIndex = categoryList.findIndex((item) => item.id === active.id);
        const newIndex = categoryList.findIndex((item) => item.id === over?.id);
        const reordered = arrayMove(categoryList, oldIndex, newIndex);

        await onReorderCategory({
            id: active.id as number,
            order: newIndex,
            reorderedList: reordered,
        });

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    const handleInputDone = async (cellId: string, item: CategoryTranslationItem) => {
        if (onExistsCategory(item)) {
            alert(t('category.errorMessage.duplicate', { key: item.name }));

            const cellElement = getCellRef(cellId);
            if (cellElement) {
                cellElement.reset();
            }
        } else {
            if (!(await onUpdateCategory(item))) {
                alert(t('category.errorMessage.update'));
            }
        }
    };

    const handleEnterKey = useCallback(
        (currentRowId: number, colIndex: number) => {
            const currentRowIndex = categoryList.findIndex((item) => item.id === currentRowId);
            if (currentRowIndex === -1) return;

            let targetRow = currentRowIndex + 1;
            let targetCol = colIndex;

            if (targetRow >= categoryList.length) {
                targetRow = 0;
                targetCol = colIndex + 1;
            }

            if (targetCol >= LanguageCodes.length) return;

            const targetRowId = categoryList[targetRow].id;
            const targetId = getCellId(targetRowId, targetCol);
            document.getElementById(targetId)?.focus();
        },
        [categoryList],
    );

    const handleRemoveCategory = useCallback(
        (id: number) => {
            const confirm = window.confirm(t('category.confirm.delete', { count: 1 }));
            if (confirm) {
                const succeeded = onRemoveCategory(id);
                if (!succeeded) {
                    alert(t('category.errorMessage.delete'));
                }
            }
        },
        [onRemoveCategory],
    );

    const categoryIds = useMemo(() => (categoryList.length ? categoryList.map((item) => item.id) : []), [categoryList]);

    const data = useMemo(() => {
        if (!categoryList.length) return [];
        return categoryList;
    }, [categoryList]);

    const columnHelper = useMemo(() => createColumnHelper<CategoryItem>(), []);

    const columns = useMemo(() => {
        const baseColumns = [
            columnHelper.display({
                id: 'dragHandle',
                cell: () => {
                    return (
                        <button className={`flex h-full cursor-grab items-center pl-[12px]`}>
                            <HandleIcon width={24} height={24} />
                        </button>
                    );
                },
                meta: {
                    width: 36,
                    headerClass: 'sticky left-0 z-10',
                    className: 'sticky left-0 z-10',
                },
            }),
            columnHelper.display({
                id: 'delete',
                cell: ({ row }) => {
                    return (
                        <button
                            className={`flex h-full items-center pl-[12px] text-red-500 ${hoverFadeClasses}`}
                            onClick={() => handleRemoveCategory(row.original.id)}
                        >
                            <BinIcon width={24} height={24} />
                        </button>
                    );
                },
                meta: {
                    width: 36,
                    headerClass: 'sticky left-[36px] z-10',
                    className: 'sticky left-[36px] z-10',
                },
            }),
            columnHelper.accessor(() => '', {
                id: 'index',
                header: '#',
                cell: ({ row }) => row.index + 1,
                meta: {
                    width: 54,
                    textAlign: 'center',
                    headerClass: 'sticky left-[72px] z-10',
                    className: 'sticky left-[72px] z-10',
                },
            }),
            columnHelper.accessor('name.en', {
                header: 'EN',
                cell: ({ row }) => {
                    const category = row.original;
                    const rowId = category.id;
                    const currentCellId = getCellId(rowId, 0);

                    return (
                        <CellInput
                            id={currentCellId}
                            key={currentCellId}
                            className="px-[11px] py-[9px]"
                            value={category.name['en'] ?? ''}
                            placeholder={''}
                            onDone={async (value: string) => {
                                await handleInputDone(currentCellId, {
                                    id: category.id,
                                    lang: 'en',
                                    name: value,
                                });
                            }}
                            onEnter={() => handleEnterKey(rowId, 0)}
                            ref={(instance: CellInputRef | null) => {
                                cellRefsMap.current.set(currentCellId, instance);
                            }}
                        />
                    );
                },
                meta: {
                    headerClass: `sticky left-[126px] z-10 px-[22px]`,
                    className: `sticky left-[126px] z-10 px-[12px] py-[5px]`,
                    width: 360,
                },
            }),
            columnHelper.display({
                id: 'view',
                cell: ({ row }) => {
                    return (
                        <div className={`h-[50px] p-[6px] ${hoverFadeClasses}`}>
                            <CellButton onClick={() => onShowDetail(row.original)}>
                                {t('category.button.view')}
                            </CellButton>
                        </div>
                    );
                },
                meta: {
                    width: LanguageCodes.length === 1 ? 'auto' : 70,
                    headerClass: `sticky left-[486px] min-w-[70px] z-10`,
                    className: 'sticky left-[486px] min-w-[70px] z-10',
                },
            }),
        ];

        const filteredLanguage = LanguageCodes.filter((lang) => lang !== 'en');
        const languageColumns = filteredLanguage.map((lang, index) =>
            columnHelper.accessor((row) => row?.name?.[lang] ?? '', {
                id: lang,
                header: lang.toUpperCase(),
                cell: ({ row }) => {
                    const category = row.original;
                    const rowId = category.id;
                    const currentCellId = getCellId(rowId, index + 1);

                    return (
                        <CellInput
                            key={currentCellId}
                            id={currentCellId}
                            className="px-[11px] py-[9px]"
                            value={category.name[lang] ?? ''}
                            placeholder={''}
                            onDone={async (value: string) => {
                                await handleInputDone(currentCellId, {
                                    id: category.id,
                                    lang,
                                    name: value,
                                });
                            }}
                            onEnter={() => handleEnterKey(rowId, index + 1)}
                            ref={(instance: CellInputRef | null) => {
                                cellRefsMap.current.set(currentCellId, instance);
                            }}
                        />
                    );
                },
                meta: {
                    width: index === LanguageCodes.length - 1 ? 'auto' : 360,
                    headerClass: `min-w-[360px] px-[22px]`,
                    className: 'min-w-[360px] px-[12px] px-[5px]',
                },
            }),
        );

        return [...baseColumns, ...languageColumns];
    }, [columnHelper, categoryList, onUpdateCategory]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        if (!categoryList.length && LanguageCodes.length <= 1) return;

        const scrollEl = scrollRef.current;
        const shadowEl = shadowRef.current;
        if (!scrollEl || !shadowEl) return;

        const update = () => {
            shadowEl.style.opacity = '1';

            const thead = scrollEl.querySelector('thead tr th:nth-child(5)');
            if (thead) {
                const element = thead as HTMLElement;
                shadowEl.style.left = `${element.offsetLeft + element.offsetWidth}px`;
            }
        };

        window.addEventListener('resize', update);
        update();

        return () => {
            window.removeEventListener('resize', update);
        };
    }, [categoryList]);

    return (
        <div className="border-grey-20 relative mt-[20px] min-w-[504px] max-w-full flex-1 overflow-hidden rounded-[4px] border bg-white">
            <div
                className="bg-grey-20 z-100 pointer-events-none absolute top-0 h-full w-[1px] opacity-0 transition-opacity duration-200 after:absolute after:left-0 after:top-0 after:h-full after:w-[5px] after:bg-[linear-gradient(to_right,_#E5E5E6_0%,_rgba(229,229,230,0)_100%)] after:content-['']"
                ref={shadowRef}
            />
            <div ref={scrollRef} className="h-full w-full overflow-auto [contain:layout]">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
                        <table className="w-full table-fixed border-separate border-spacing-0">
                            <thead className="text-grey-70 text-b16 sticky top-0 z-30 bg-white">
                                {table.getHeaderGroups().map((headerGroup) => {
                                    return (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                const meta = header.column.columnDef.meta;
                                                const textAlign = meta?.textAlign || 'left';
                                                const width =
                                                    typeof meta?.width === 'number' ? `${meta.width}px` : meta?.width;

                                                return (
                                                    <th
                                                        key={header.id}
                                                        className={`border-grey-20 border-b-[2px] bg-white ${meta?.headerClass} text-${textAlign}`}
                                                        style={{
                                                            width,
                                                        }}
                                                    >
                                                        <h3 className={'leading-[50px]'}>
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext(),
                                                            )}
                                                        </h3>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </thead>
                            <tbody className={'text-r16 text-grey-90'}>
                                {table.getRowModel().rows.map((row) => {
                                    return <CategoryRow key={row.original?.id} row={row} />;
                                })}
                            </tbody>
                        </table>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default CategoryTable;

const CategoryRow = ({ row }: { row: Row<CategoryItem> }) => {
    const rowId = row.original?.id;

    const { setNodeRef, transform, transition, isDragging, attributes, listeners } = useSortable({
        id: rowId,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative' as const,
        zIndex: isDragging ? 100 : 0,
        opacity: isDragging ? 0.8 : 1,
    };

    const trClassName =
        'h-[49px] transition-bg [&:hover>td]:bg-grey-10 group duration-100 focus-within:[&>td]:bg-blue-100';
    const tdClass = 'border-grey-20 border-b bg-white';

    return (
        <tr ref={setNodeRef} className={trClassName} style={style} key={`row-${rowId}`}>
            {row.getVisibleCells().map((cell, cellIndex) => {
                const cellId = getCellId(rowId, cellIndex);
                const meta = cell.column.columnDef.meta;
                const width = typeof meta?.width === 'number' ? `${meta.width}px` : meta?.width;
                const textAlign = meta?.textAlign || 'left';
                const className = meta?.className ?? '';

                const dndProps =
                    cell.column.id === 'dragHandle'
                        ? ({
                              ...attributes,
                              ...listeners,
                          } as DraggableAttributes & SyntheticListenerMap)
                        : undefined;

                return (
                    <td
                        key={cellId}
                        className={`${tdClass} text-${textAlign} ${className} group`}
                        style={{
                            width,
                        }}
                        {...(dndProps ?? {})}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                );
            })}
        </tr>
    );
};
