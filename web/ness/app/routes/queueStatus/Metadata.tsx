import { useTranslation } from 'react-i18next';

import { Button, Drawer, Tooltip } from '@plitvice/ui';

import { QueueFileItem } from '@/api/models/queueList.ts';

interface Props {
    content?: QueueFileItem;
    onClose: () => void;
}

export const QueueStatusMetadataSheet = ({ content, onClose }: Props) => {
    const { t } = useTranslation();

    return (
        <Drawer width={552} open={content !== undefined} onClose={onClose} className={`px-[36px] py-[48px]`}>
            <div className={`flex items-center justify-between gap-[12px]`}>
                <Tooltip text={content?.programTitle ?? ''}>
                    <h2 className={`line-clamp-1 break-all`}>{content?.programTitle}</h2>
                </Tooltip>

                <Button fill={false} variant={'normal'} onClick={onClose}>
                    {t('button.close')}
                </Button>
            </div>
            <div className={`border-grey-20 mt-[34px] rounded-[4px] border bg-white`}>
                <div className={`bg-grey-10 p-[16px]`}>
                    <h3>{t('queueStatus.drawerTitle0')}</h3>
                </div>
                <div className={`p-[16px]`}>
                    <p>{content?.startedAt || '-'}</p>
                </div>
            </div>
            <div className={`border-grey-20 mt-[34px] rounded-[4px] border bg-white`}>
                <div className={`bg-grey-10 p-[16px]`}>
                    <h3>{t('queueStatus.drawerTitle1')}</h3>
                </div>
                <div className={`p-[16px]`}>
                    <p>{content?.finishedAt || '-'}</p>
                </div>
            </div>
            <div className={`border-grey-20 mt-[34px] rounded-[4px] border bg-white`}>
                <div className={`bg-grey-10 p-[16px]`}>
                    <h3>{t('queueStatus.drawerTitle2')}</h3>
                </div>
                <div className={`break-all p-[16px]`}>
                    <p className={`text-r16 whitespace-pre-line`}>{content?.notes || '-'}</p>
                </div>
            </div>
        </Drawer>
    );
};
