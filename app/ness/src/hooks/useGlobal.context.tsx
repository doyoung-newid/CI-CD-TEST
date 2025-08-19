import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MediaFile } from '@/types/mediainfo.types.ts';
import useFileUploads from '@/hooks/useFileUploads.ts';

interface GlobalContextType {
    userGroup: string;
    isUploading: boolean;
    fileList: MediaFile[];
    setFileList: Dispatch<SetStateAction<MediaFile[]>>;
    removeFile: (fileId: string) => void;
    runUploads: () => Promise<void>;
    pauseUploads: () => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const fileUploads = useFileUploads({ userId: 'minho' });

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = t('fileUploads.alertNowUploading');
        };

        if (fileUploads.isUploading) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [fileUploads.isUploading, t]);

    return <GlobalContext.Provider value={fileUploads}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a FileUploadsProvider');
    }
    return context;
};
