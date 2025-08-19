import { useCallback } from 'react';
import { SelectOption } from '@plitvice/ui';
import { fetchPresetList } from '@/api/services/preset.ts';
import { UploadedFileItem } from '@/api/models/fileUploads.ts';
import { deleteUploadsFiles, fetchUploadedFiles, requestRunEncoding } from '@/api/services/fileUploads.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Props {
    userId: string;
}

const useFileUploaded = ({ userId }: Props) => {
    const queryClient = useQueryClient();
    const { data: uploadedList = [] } = useQuery({
        queryKey: ['uploaded_files', userId],
        queryFn: async () => {
            const res = await fetchUploadedFiles(userId);
            return res.data; // .filter((item) => item.status === 'uploaded');
        },
        staleTime: 1000,
    });
    const { data: presetOptionList = [] } = useQuery({
        queryKey: ['preset_list', userId],
        queryFn: async () => {
            const dumpList: SelectOption[] = [];
            const res = await fetchPresetList(userId);
            res.data.map((item) => {
                dumpList.push({ value: item.id, label: item.name });
            });
            return dumpList;
        },
        staleTime: 1000 * 60 * 60,
    });

    const changePreset = useCallback(
        (programId: string, presetId: number) => {
            queryClient.setQueryData<UploadedFileItem[]>(['uploaded_files', userId], (oldData) => {
                if (!oldData) return [];
                return oldData.map((file) => (file.programId === programId ? { ...file, presetId: presetId } : file));
            });
        },
        [queryClient, userId],
    );

    const changePresetAll = useCallback(
        (presetId: number) => {
            queryClient.setQueryData<UploadedFileItem[]>(['uploaded_files', userId], (oldData) => {
                if (!oldData) return [];
                return oldData.map((file) => ({ ...file, presetId: presetId }));
            });
        },
        [queryClient, userId],
    );

    const removeFile = useCallback(
        (programId: string) => {
            deleteUploadsFiles([programId], userId);
        },
        [userId],
    );

    const runEncoding = useCallback(
        async (data: UploadedFileItem[]) => {
            try {
                const result = await requestRunEncoding(data, userId, false);
                if (result.code === 20000) {
                    queryClient.setQueryData<UploadedFileItem[]>(['uploaded_files', userId], () => []);
                    return true;
                } else {
                    return false;
                }
            } catch {
                return false;
            }
        },
        [queryClient, userId],
    );

    return {
        uploadedList,
        presetOptionList,
        changePreset,
        changePresetAll,
        removeFile,
        runEncoding,
    };
};
export default useFileUploaded;
