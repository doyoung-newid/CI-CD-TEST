import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { SelectOption, TabMenu, WarningIcon } from '@plitvice/ui';
import { useGlobalContext } from '@/hooks/useGlobal.context.tsx';
import FileUploadingList from './Uploading.tsx';
import FileUploadedList from './Uploaded.tsx';

enum TabMenuType {
    UPLOADING = 'uploading',
    UPLOADED = 'uploaded',
}

const FileUploadsPage = () => {
    const { t } = useTranslation();
    const { auth, isUploading } = useGlobalContext();
    const [tabMenu, setTabMenu] = useState(TabMenuType.UPLOADING);

    return (
        <div className="bg-grey-5 relative flex h-full min-w-[1200px] flex-1 flex-col p-[36px]">
            <h1>{t('fileUploads.title')}</h1>
            <p className={`text-r14 text-grey-60 mt-[12px] whitespace-pre-line pb-[24px]`}>
                {t('fileUploads.description')}
            </p>
            {auth.userGroup !== 'cp' ? (
                <>
                    <div className={`relative`}>
                        <TabMenu tabList={getTabMenu(t)} value={tabMenu} onChange={setTabMenu} />
                    </div>
                    <div className={`border-grey-20 border-t pb-[16px]`} />
                </>
            ) : null}
            <div className="flex h-full flex-col gap-[16px] overflow-auto">
                {tabMenu === TabMenuType.UPLOADING ? <FileUploadingList /> : <FileUploadedList />}
            </div>
            {isUploading ? (
                <div className={`fixed right-[36px] top-[96px] flex items-center gap-[4px]`}>
                    <WarningIcon className={`animate-[warning-color-anim_2s_ease-in-out_infinite]`} />
                    <p className={`text-r14`}>{t('fileUploads.alertNowUploading')}</p>
                </div>
            ) : null}
        </div>
    );
};
export default FileUploadsPage;

const getTabMenu = (t: TFunction): SelectOption[] => {
    return [
        {
            value: TabMenuType.UPLOADING,
            label: t('fileUploads.section0.title'),
        },
        {
            value: TabMenuType.UPLOADED,
            label: t('fileUploads.section1.title'),
        },
    ];
};
