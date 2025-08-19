import { CloseIcon, Drawer, DropdownIcon } from '@plitvice/ui';
import { CategoryContentType, CategoryItem } from '@/api/model/category.ts';
import { LinkedAvod, LinkedContents, LinkedLinear } from '@/pages/home/features/category/categoryLinkSheet.hook.ts';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { ReactNode, useMemo, useState } from 'react';
import useCategoryLinks from '@/pages/home/features/category/categoryLinkSheet.hook.ts';
import { useTranslation } from 'react-i18next';

type Props = {
    category?: CategoryItem;
    isOpen: boolean;
    onClose: () => void;
    onCategoryReset: () => void;
};

const CategoryLinkSheet = ({ category, isOpen, onClose, onCategoryReset }: Props) => {
    const { contents } = useCategoryLinks(category);

    return (
        <Drawer
            className={'scrollbar absolute h-full w-full overflow-y-scroll px-[36px] py-[54px]'}
            width={750}
            open={isOpen}
            onClose={onClose}
            onTransitionEnd={() => {
                if (!isOpen) {
                    onCategoryReset();
                }
            }}
        >
            <div className="flex w-full items-center justify-between">
                <p className="text-b20 text-grey-90 min-w-0 flex-1 truncate">{category?.name.en ?? 'Category'}</p>
                <button className="ml-[8px]" onClick={onClose}>
                    <CloseIcon className={'size-[24px]'} />
                </button>
            </div>
            <div className="bg-grey-20 mt-[20px] h-px w-full" />
            {category && (
                <>
                    <ContentTypeTabs contents={contents} />
                    <LinkedContentTable {...contents} />
                </>
            )}
        </Drawer>
    );
};
export default CategoryLinkSheet;

function ContentTypeTabs({ contents }: { contents: LinkedContents }) {
    function Divider() {
        return <div className="bg-grey-20 mx-[10px] h-[14px] w-[1px]" />;
    }

    const entries = Object.entries(contents) as [keyof LinkedContents, unknown[]][];
    const totalCount = entries.reduce((sum, [, list]) => sum + list.length, 0);

    return (
        <div className="mt-[20px] flex items-center">
            <div className="flex items-center">
                <span className="text-r16 text-grey-90">All ({totalCount})</span>
                <Divider />
            </div>
            {entries.map(([key, list], idx) => (
                <div key={key} className="flex items-center">
                    <span className="text-r16 text-grey-90 capitalize">
                        {key} ({list.length})
                    </span>
                    {idx < entries.length - 1 && <Divider />}
                </div>
            ))}
        </div>
    );
}

export function LinkedContentTable({ linear, avod }: LinkedContents) {
    const { t } = useTranslation();

    return (
        <div className={'mt-[40px] flex flex-col gap-[28px]'}>
            <ExpandableSection title={t('category.type.linear')} count={linear.length}>
                <ContentTable contents={linear} contentType="linear" />
            </ExpandableSection>
            <ExpandableSection title={t('category.type.avod')} count={avod.length}>
                <ContentTable contents={avod} contentType="avod" />
            </ExpandableSection>
        </div>
    );
}

interface ExpandableSectionProps {
    title: string;
    count: number;
    children: ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, count, children }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const rotation = isExpanded ? 'rotate-180' : 'rotate-0';

    return (
        <div className="border-grey-20 overflow-hidden rounded border">
            <div
                className="bg-grey-10 flex items-center justify-between px-[15px] py-[12px]"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <p className="text-b20 text-grey-70">
                    {title} ({count})
                </p>
                <button className="text-gray-400 hover:text-gray-600">
                    <DropdownIcon
                        className={`size-[24px] ${rotation} text-grey-50 transition-transform duration-100`}
                    />
                </button>
            </div>
            {isExpanded && <div>{children}</div>}
        </div>
    );
};

interface ContentTableProps {
    contents: (LinkedLinear | LinkedAvod)[];
    contentType: CategoryContentType;
}

const ContentTable: React.FC<ContentTableProps> = ({ contents, contentType }) => {
    const { t } = useTranslation();

    const columnHelper = useMemo(() => createColumnHelper<LinkedLinear | LinkedAvod>(), []);
    const columns = useMemo(() => {
        return [
            columnHelper.accessor('thumbUrl', {
                id: 'thumbnail',
                header: 'Thumbnail',
                cell: (info) => (
                    <div className="aspect-video w-full">
                        <img
                            src={info.getValue().wide.small || undefined}
                            alt={'thumbnail'}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                ),
                size: 127,
                meta: {
                    headerClass: 'pl-[21px] pr-[22px] ',
                },
            }),

            columnHelper.accessor('title', {
                id: 'title',
                header: 'Title',
                cell: (info) => {
                    const row = info.row.original;

                    return (
                        <p className="text-grey-90 text-r16 truncate">
                            {contentType === CategoryContentType.LINEAR && 'no' in row ? `${row.no} ` : ''}
                            {info.getValue()}
                        </p>
                    );
                },
                size: 360,
                meta: {
                    headerClass: 'px-[22px]',
                    className: 'px-[22px]',
                },
            }),

            columnHelper.accessor('contentId', {
                id: 'id',
                header: 'ID',
                cell: (info) => (
                    <div className="border-grey-25 bg-grey-10 inline-block h-[24px] max-w-full overflow-hidden rounded-full border px-[8px]">
                        <span className="text-m12 text-grey-50 block h-[22px] w-full truncate whitespace-nowrap leading-[22px]">
                            {info.getValue()}
                        </span>
                    </div>
                ),
                size: 182,
                meta: {
                    headerClass: 'px-[22px] ',
                    className: 'max-w-[182px] pl-[12px] pr-[11px]',
                },
            }),
        ];
    }, [contentType, columnHelper]);

    const table = useReactTable({
        data: contents,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (contents.length === 0) {
        return (
            <div className="text-grey-90 text-r16 py-[26px] text-center">
                {t('category.emptyMessage.content', {
                    type:
                        contentType === CategoryContentType.AVOD
                            ? contentType.toUpperCase()
                            : contentType.toLowerCase(),
                })}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-full table-fixed border-collapse">
                <thead className="text-grey-70 text-b16 bg-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className={'border-b-2 border-gray-200'}>
                            {headerGroup.headers.map((header) => {
                                const meta = header.column.columnDef.meta;

                                return (
                                    <th
                                        key={header.id}
                                        style={{ width: `${header.getSize()}px` }}
                                        className={`text-left ${meta?.headerClass}`}
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
                <tbody className="bg-white">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="h-[73px] border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => {
                                const meta = cell.column.columnDef.meta;

                                return (
                                    <td
                                        key={cell.id}
                                        style={{ width: `${cell.column.getSize()}px` }}
                                        className={`h-[72px] text-left ${meta?.className}`}
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
    );
};
