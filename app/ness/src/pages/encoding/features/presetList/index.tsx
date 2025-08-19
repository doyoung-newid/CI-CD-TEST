import { useLoaderData } from 'react-router';
import { PresetItem, PresetResponse } from '@/api/models/preset.ts';
import { useTranslation } from 'react-i18next';
import { useGlobalContext } from '@/hooks/useGlobal.context.tsx';
import EncodingPresetList from '@/pages/encoding/features/presetList/List.tsx';
import EncodingPresetMetadataSheet from '@/pages/encoding/features/presetList/Metadata.tsx';
import { useState } from 'react';
import { WarningIcon } from '@plitvice/ui';

const EncodingPresetPage = () => {
    const { t } = useTranslation();
    const { isUploading } = useGlobalContext();
    const presetData = useLoaderData() as PresetResponse;
    const [selectedItem, setSelectedItem] = useState<PresetItem>();

    const handleDrawerClose = (): void => {
        setSelectedItem(undefined);
    };

    return (
        <div className="bg-grey-5 flex h-full min-w-[1200px] flex-col p-[36px]">
            <h1>{t('presetList.title')}</h1>
            <p className={`text-r14 text-grey-60 whitespace-pre-line pb-[24px] pt-[12px]`}>
                {t('presetList.description')}
            </p>
            <div className="relative h-full overflow-auto rounded-[4px] border border-gray-200 bg-white">
                {(!presetData.data || presetData.data.length === 0) && (
                    <div className="flex h-32 items-center justify-center text-gray-500">업로드된 파일이 없습니다.</div>
                )}
                <EncodingPresetList data={presetData.data} onItemClick={setSelectedItem} />
            </div>
            <EncodingPresetMetadataSheet content={selectedItem} onClose={handleDrawerClose} />
            {isUploading ? (
                <div className={`fixed right-[36px] top-[96px] flex items-center gap-[4px]`}>
                    <WarningIcon className={`animate-[warning-color-anim_2s_ease-in-out_infinite]`} />
                    <p className={`text-r14`}>{t('fileUploads.alertNowUploading')}</p>
                </div>
            ) : null}
        </div>
    );
};
export default EncodingPresetPage;
