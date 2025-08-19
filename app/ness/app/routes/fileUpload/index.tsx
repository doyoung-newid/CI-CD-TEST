import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { data, useLoaderData } from 'react-router';

import { TFunction } from 'i18next';

import { TabMenu } from '@plitvice/ui/components/navigation/TabMenu.tsx';
import { SelectOption } from '@plitvice/ui/components/selectbox/DropdownList.tsx';

import { WarningIcon } from '@plitvice/ui/index.ts';

import { fetchPresetList } from '@/api/services/preset.ts';

import { useFileUpload } from '@/routes/fileUpload/index.hook.ts';
import { FileUploadedList } from '@/routes/fileUpload/uploaded.tsx';
import { FileUploadingList } from '@/routes/fileUpload/uploading.tsx';

import { commonLoader } from '@/middleware/auth.server.ts';

enum TabMenuType {
    UPLOADING = 'uploading',
    UPLOADED = 'uploaded',
}

export const loader = commonLoader(async ({ userEncryptKey, cookie }: { userEncryptKey: string; cookie?: string }) => {
    return data({ userEncryptKey }, cookie ? { headers: { 'Set-Cookie': cookie } } : undefined);
});

const FileUploadPage = () => {
    const { t } = useTranslation();
    const { userEncryptKey } = useLoaderData();
    const [tabMenu, setTabMenu] = useState(TabMenuType.UPLOADING);
    const presetList = useMemo<SelectOption[]>(() => [], []);
    const { isUploading, fileList, setFileList, removeFile, runUpload, pauseUpload } = useFileUpload(userEncryptKey);

    useEffect(() => {
        if (!userEncryptKey) return;

        fetchPresetList(userEncryptKey).then((res) => {
            res.data.map((item) => {
                presetList.push({ value: item.id, label: item.name });
            });
        });
    }, [userEncryptKey]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = t('fileUpload.alertNowUploading');
        };

        if (isUploading) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [t, isUploading]);

    return (
        <div className="bg-grey-5 relative flex h-full min-w-[1200px] flex-1 flex-col p-[36px]">
            <h1>{t('fileUpload.title')}</h1>
            <p className={`text-r14 text-grey-60 mt-[12px] whitespace-pre-line pb-[24px]`}>
                {t('fileUpload.description')}
            </p>
            {userEncryptKey !== 'cp' ? (
                <>
                    <div className={`relative`}>
                        <TabMenu
                            tabList={getTabMenu(t)}
                            value={tabMenu}
                            onChange={(value) => setTabMenu(value as TabMenuType)}
                        />
                    </div>
                    <div className={`border-grey-20 border-t pb-[16px]`} />
                </>
            ) : null}
            <div className="flex h-full flex-col gap-[16px] overflow-auto">
                {tabMenu === TabMenuType.UPLOADING ? (
                    <FileUploadingList
                        isUploading={isUploading}
                        fileList={fileList}
                        setFileList={setFileList}
                        removeFile={removeFile}
                        runUpload={runUpload}
                        pauseUpload={pauseUpload}
                    />
                ) : (
                    <FileUploadedList userEncryptKey={userEncryptKey} presetList={presetList} />
                )}
            </div>
            {isUploading ? (
                <div className={`fixed right-[36px] top-[96px] flex items-center gap-[4px]`}>
                    <WarningIcon className={`animate-[warning-color-anim_2s_ease-in-out_infinite]`} />
                    <p className={`text-r14`}>{t('fileUpload.alertNowUploading')}</p>
                </div>
            ) : null}
        </div>
    );
};
export default FileUploadPage;

const getTabMenu = (t: TFunction): SelectOption[] => {
    return [
        {
            value: TabMenuType.UPLOADING,
            label: t('fileUpload.section0.title'),
        },
        {
            value: TabMenuType.UPLOADED,
            label: t('fileUpload.section1.title'),
        },
    ];
};
