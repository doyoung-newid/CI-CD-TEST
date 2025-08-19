import { useCallback, useEffect, useState } from 'react';

import { UploadedFileItem } from '@/api/models/fileUploads.ts';
import { deleteUploadFiles, fetchUploadedFiles, requestRunEncoding } from '@/api/services/fileUpload.ts';

export const useFileUploaded = (userEncryptKey: string) => {
    const [uploadedList, setUploadedList] = useState<UploadedFileItem[]>([]);

    const changePreset = useCallback((programId: string, presetId: number) => {
        setUploadedList((prev) => {
            if (!prev) return [];
            return prev.map((file) => (file.programId === programId ? { ...file, presetId: presetId } : file));
        });
    }, []);

    const changePresetAll = useCallback((presetId: number) => {
        setUploadedList((prev) => {
            if (!prev) return [];
            return prev.map((file) => ({ ...file, presetId: presetId }));
        });
    }, []);

    const removeFile = useCallback(
        (programId: string) => {
            deleteUploadFiles([programId], userEncryptKey);
        },
        [userEncryptKey],
    );

    const runEncoding = useCallback(
        async (data: UploadedFileItem[]) => {
            try {
                const result = await requestRunEncoding(data, userEncryptKey, false);
                if (result.code === 20000) {
                    setUploadedList([]);
                    return true;
                } else {
                    return false;
                }
            } catch {
                return false;
            }
        },
        [userEncryptKey],
    );

    useEffect(() => {
        if (userEncryptKey) {
            fetchUploadedFiles(userEncryptKey).then((res) => setUploadedList(res.data));
        }
    }, [userEncryptKey]);

    return {
        uploadedList,
        changePreset,
        changePresetAll,
        removeFile,
        runEncoding,
    };
};
