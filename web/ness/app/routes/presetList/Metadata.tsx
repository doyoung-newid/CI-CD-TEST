import { useTranslation } from 'react-i18next';

import { Button, Drawer, StatusChip, useToast } from '@plitvice/ui';
import { copyToClipboard } from '@plitvice/util/index.ts';

import { PresetItem } from '@/api/models/preset.ts';

import { firstUpperCase } from '@/utils';

interface Props {
    content?: PresetItem;
    onClose: () => void;
}

export const EncodingPresetMetadataSheet = ({ content, onClose }: Props) => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const handleCommandCopy = (text?: string) => {
        if (text) {
            copyToClipboard(text).then((result) => {
                if (result) {
                    showToast(t('presetList.toastClipboard'), 'info');
                }
            });
        }
    };

    const EncodingOption = () => {
        const options = content?.options || {};

        return (
            <div className={`flex flex-col gap-[2px] p-[16px]`}>
                {Object.entries(options).map(([key, value], index) => {
                    return (
                        <div key={`encoding-option-${index}`} className={`flex items-start`}>
                            <p className={`text-m14 text-grey-50 w-[90px]`}>{firstUpperCase(key)}: </p>
                            <p className={`text-r14 flex gap-[6px]`}>
                                {Array.isArray(value)
                                    ? value.map((item: string, index) => (
                                          <StatusChip color={'grey'} key={`encoding-option-res-${index}`}>
                                              {item}
                                          </StatusChip>
                                      ))
                                    : value}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Drawer width={552} open={content !== undefined} onClose={onClose} className={`px-[36px] py-[48px]`}>
            <div className={`flex items-center justify-between`}>
                <h2>{content?.name}</h2>
                <Button fill={false} variant={'normal'} onClick={onClose}>
                    {t('button.close')}
                </Button>
            </div>
            {content?.options ? (
                <div className={`border-grey-20 mt-[34px] rounded-[4px] border bg-white`}>
                    <div className={`bg-grey-10 p-[16px]`}>
                        <h3>{t('presetList.drawerTitle0')}</h3>
                    </div>
                    <EncodingOption />
                </div>
            ) : null}
            <div className={`border-grey-20 mt-[34px] rounded-[4px] border bg-white`}>
                <div className={`bg-grey-10 p-[16px]`}>
                    <h3>{t('presetList.drawerTitle1')}</h3>
                </div>
                <div className={`p-[16px]`}>
                    <p
                        className={`line-clamp-16 cursor-copy`}
                        onClick={() => handleCommandCopy(content?.ffmpegCommand)}
                    >
                        {content?.ffmpegCommand ?? ''}
                    </p>
                </div>
            </div>
        </Drawer>
    );
};
