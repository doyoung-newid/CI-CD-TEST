import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CellButton, Drawer, SelectBox, SettingIcon, TextInput } from '@plitvice/ui';
import { Language, WeightScore } from '@/types/enums.ts';
import useMetadata from '@/pages/home/features/library/metadata.hooks.ts';
import { InitMetadataRelevance, MetadataItem, MetadataRelevance, MetadataTag } from '@/api/model/metadata.ts';
import { Content } from '@/api/model/content.ts';
import { ContentType } from '@/types/common.ts';
import { LinearData } from '@/api/model/linear.ts';
import useMetadataQuery from '@/api/query/metadata.query.ts';

type Props = {
    content?: Content;
    contentType: ContentType;
    onClose: (metadata?: MetadataItem) => void;
};

const linkPrefix = {
    [ContentType.LINEAR]: '/?cmd=channel&id=',
    [ContentType.SERIES]: '/?cmd=series_edit&series_id=',
    [ContentType.PROGRAM]: '/?cmd=edit&id=',
};

function MetadataSheet({ content, contentType, onClose }: Props) {
    const { t } = useTranslation();
    const { categoryList, relevanceList } = useMetadataQuery();
    const {
        metadata,
        updateFn,
        categoryChangeFn,
        categoryWeightChangeFn,
        relevanceChangeFn,
        updatedDateChangeFn,
        tagChangeFn,
        isModified,
    } = useMetadata({ content });
    const [relevance, setRelevance] = useState(InitMetadataRelevance);
    const [tag, setTag] = useState<MetadataTag>();

    const handleCancel = () => {
        setTag(undefined);
        onClose();
    };
    const handleUpdate = async () => {
        const result = await updateFn();
        if (result) {
            result.categoryName = categoryList.find((category) => category.value === result.categoryId)?.label;
        }
        onClose(result);
    };
    const handleSetCategory = (id: number) => categoryChangeFn(id);
    const handleSetCategoryWeight = (weight: number) => categoryWeightChangeFn(weight);
    const handleSetRelevance = (id: number) => setRelevance((prev) => ({ ...prev, id: id }) as MetadataRelevance);
    const handleSetRelevanceWeight = (weight: number) =>
        setRelevance((prev) => ({ ...prev, weight: weight }) as MetadataRelevance);
    const handleAddRelevance = () => {
        if (relevance) {
            relevanceChangeFn(relevance, false);
        }
        setRelevance(InitMetadataRelevance);
    };
    const handleTagLang = (lang: string) => {
        const currentTag =
            metadata?.tag.find((tag) => tag.lang === lang) ??
            ({
                lang: lang,
                value: '',
            } as MetadataTag);
        setTag(currentTag);
    };
    const handleSetTag = (tag: string) => setTag((prev) => ({ ...prev, value: tag }) as MetadataTag);
    const handleTagUpsert = () => {
        if (tag) {
            tagChangeFn(tag, false);
            setTag(undefined);
        } else {
            alert('Need Information');
        }
    };

    return (
        <Drawer
            className={'flex h-screen flex-col gap-[28px] overflow-y-auto p-[36px] pt-[48px]'}
            width={552}
            open={content}
            onClose={handleCancel}
        >
            <div className={'flex items-center justify-between'}>
                <h2>
                    {contentType === ContentType.LINEAR ? `${(content as LinearData)?.no} ` : ''}
                    {content?.title}
                </h2>
                <div className={'flex gap-[16px]'}>
                    <Button size={'medium'} variant={'normal'} fill={false} onClick={handleCancel}>
                        {t('button.cancel')}
                    </Button>
                    <Button size={'medium'} variant={'normal'} disabled={!isModified} onClick={handleUpdate}>
                        {t('button.update')}
                    </Button>
                </div>
            </div>
            <div className={'flex flex-1 flex-col gap-[12px]'}>
                <div className={'border-grey-20 flex flex-row items-center rounded-[4px] border'}>
                    <h3 className={'bg-grey-10 w-[152px] rounded-l-[3px] px-[16px] leading-[50px]'}>
                        {t('library.metadataCol0')}
                    </h3>
                    <a
                        className={'flex-1 truncate px-[22px] leading-[50px]'}
                        href={`${linkPrefix[contentType]}${content?.contentId}`}
                        target={'get'}
                    >
                        {content?.contentId}
                    </a>
                </div>
                <div className={'border-grey-20 flex flex-col items-start rounded-[4px] border'}>
                    <h3 className={'bg-grey-10 w-full rounded-t-[3px] px-[16px] leading-[50px]'}>
                        {t('library.metadataCol1')}
                    </h3>
                    <div className={'flex gap-[60px] px-[16px] py-[24px]'}>
                        <div>
                            <p className={'text-m16'}>{t('library.metadataCol1-0')}</p>
                            <img src={content?.thumbUrl?.wide?.small} width={160} height={90} alt={'thumbnail'} />
                        </div>
                        <div>
                            <p>{t('library.metadataCol1-1')}</p>
                            <img src={content?.thumbUrl?.poster?.small} width={60} height={90} alt={'poster'} />
                        </div>
                    </div>
                </div>
                <div className={'border-grey-20 flex flex-col items-start rounded-[4px] border'}>
                    <h3 className={'bg-grey-10 w-full rounded-t-[3px] px-[16px] leading-[50px]'}>
                        {t('library.metadataCol2')}
                    </h3>
                    <div
                        className={'grid w-full grid-cols-[65fr_20fr_17fr] items-end gap-x-[16px] px-[16px] py-[24px]'}
                    >
                        <SelectBox
                            size={'medium'}
                            optionList={categoryList}
                            label={t('library.metadataCol2-0')}
                            labelColor={'var(--color-red-500)'}
                            placeholder={t('library.metadataCol2-0-placeholder')}
                            value={metadata?.categoryId}
                            onChange={handleSetCategory}
                        />
                        <SelectBox
                            size={'medium'}
                            optionList={WeightScore}
                            label={t('library.metadataCol2-1')}
                            value={metadata?.categoryWeight ?? WeightScore[0]}
                            onChange={handleSetCategoryWeight}
                            className={'col-span-2'}
                        />
                        <div className={'col-span-3 h-[36px] w-full'} />
                        <TextInput
                            size={'medium'}
                            label={t('library.metadataCol2-2')}
                            placeholder={t('library.metadataCol2-2-placeholder')}
                            value={metadata?.updatedDate}
                            onChange={updatedDateChangeFn}
                        />
                        <div className={'col-span-2'} />
                        <div className={'col-span-3 h-[36px] w-full'} />
                        <SelectBox
                            size={'medium'}
                            optionList={relevanceList}
                            label={t('library.metadataCol2-3')}
                            placeholder={t('library.metadataCol2-3-placeholder')}
                            value={relevance.id}
                            onChange={handleSetRelevance}
                        />
                        <SelectBox
                            size={'medium'}
                            optionList={WeightScore}
                            label={' '}
                            value={relevance.weight ?? WeightScore[0]}
                            onChange={handleSetRelevanceWeight}
                        />
                        <Button size={'medium'} onClick={handleAddRelevance} disabled={relevance.id < 0}>
                            {t('button.add')}
                        </Button>
                        <div className={'col-span-3 flex gap-[12px] pt-[16px]'}>
                            {metadata?.relevance.map((relevance, index) => {
                                const relevanceLabel = relevanceList.find(
                                    (item) => item.value === relevance?.id,
                                )?.label;
                                return (
                                    <div
                                        key={`sel-relevance-${index}`}
                                    >{`[${relevanceLabel} (${relevance.weight})]`}</div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className={'border-grey-20 flex flex-col items-start rounded-[4px] border'}>
                    <h3 className={'bg-grey-10 w-full rounded-t-[3px] px-[16px] leading-[50px]'}>
                        {t('library.metadataCol3')}
                    </h3>
                    <div
                        className={
                            'grid w-full grid-cols-[63fr_40fr] items-end gap-x-[16px] gap-y-[24px] px-[16px] py-[24px]'
                        }
                    >
                        <SelectBox
                            size={'medium'}
                            optionList={Language}
                            value={tag?.lang}
                            label={t('library.metadataCol3-0')}
                            placeholder={t('library.metadataCol3-0-placeholder')}
                            onChange={handleTagLang}
                            disabled={tag}
                        />
                        <div />
                        {tag ? (
                            <div className={'col-span-2 flex flex-col gap-y-[16px]'}>
                                <TextInput
                                    size={'medium'}
                                    label={t('library.metadataCol3-2')}
                                    placeholder={t('library.metadataCol3-2-placeholder')}
                                    value={tag?.value}
                                    onChange={handleSetTag}
                                />
                                <div className={'flex justify-end gap-x-[16px]'}>
                                    <Button fill={false} onClick={() => setTag(undefined)}>
                                        {t('button.cancel')}
                                    </Button>
                                    <Button onClick={handleTagUpsert}>{t('button.save')}</Button>
                                </div>
                            </div>
                        ) : (
                            <table
                                className={`border-grey-20 col-span-2 w-full border-t ${metadata?.tag?.length ? 'block' : 'hidden'}`}
                            >
                                <tbody>
                                    {metadata?.tag.map((item, index) => (
                                        <tr
                                            className={'hover:bg-grey-10 border-grey-20 group/extension-item border-b'}
                                            key={`extension-${index}`}
                                        >
                                            <td className={'min-w-[76px] px-[22px]'}>
                                                <p>{item.lang}</p>
                                            </td>
                                            <td className={'w-full content-start px-[22px] py-[14px]'}>
                                                <p className={'text-r14 text-grey-50 pt-[2px] leading-[18px]'}>
                                                    {item.value}
                                                </p>
                                            </td>
                                            <td
                                                className={
                                                    'min-w-[60px] px-[12px] py-[16px] opacity-0 transition-opacity duration-100 group-hover/extension-item:opacity-100'
                                                }
                                            >
                                                <CellButton onClick={() => handleTagLang(item.lang)}>
                                                    <SettingIcon className={'text-grey-70'} />
                                                </CellButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
export default MetadataSheet;
