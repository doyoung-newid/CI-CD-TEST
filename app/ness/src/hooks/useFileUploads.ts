import { useCallback, useState } from 'react';
import {
    deleteUploadsFiles,
    notifyUploadCompletion,
    requestPresignedFile,
    validateFile,
} from '@/api/services/fileUploads.ts';
import {
    PartUploadResult,
    splitFileIntoChunks,
    uploadChunk,
    uploadSubtitleFile,
} from '@/pages/encoding/features/fileUploads/Uploading.utils.ts';
import { MediaFile, MediaFileStatus } from '@/types/mediainfo.types.ts';

interface Props {
    userId: string;
}

function useFileUploads({ userId }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [fileList, setFileList] = useState<MediaFile[]>([]);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const removeFile = useCallback((fileName: string) => {
        setFileList((prev) => {
            const fileToRemove = prev.find((file) => file.origin.name === fileName);
            if (fileToRemove && fileToRemove.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter((file) => file.origin.name !== fileName);
        });
    }, []);

    const uploadSingleFile = useCallback(
        async (
            file: MediaFile,
            onProgress: (progress: number) => void,
            onStatus: (status: MediaFileStatus) => void,
            controller: AbortController,
        ) => {
            try {
                const validate = await validateFile(file.origin.name, userId);
                if (validate) {
                    onStatus('uploaded');
                    return;
                }

                const presignedResponse = await requestPresignedFile(file, userId);
                const videoFileInfo = presignedResponse.data;

                if (file.subtitles && file.subtitles.length > 0 && videoFileInfo.subtitles) {
                    for (const subtitle of file.subtitles) {
                        if (controller.signal.aborted) {
                            deleteUploadsFiles([videoFileInfo.programId], userId);
                            return;
                        }

                        const subtitlePresignedUrl = videoFileInfo.subtitles.find(
                            (s) => s.language === subtitle.language,
                        )?.presignedUrl;

                        if (subtitlePresignedUrl) {
                            await uploadSubtitleFile(subtitle.file, subtitlePresignedUrl, controller.signal);
                        } else {
                            console.warn(`자막 파일 ${subtitle.file.name}에 대한 presigned URL을 찾을 수 없습니다.`);
                        }
                    }
                }

                if (controller.signal.aborted) {
                    deleteUploadsFiles([videoFileInfo.programId], userId);
                    return;
                }

                const chunks = splitFileIntoChunks(file.origin);
                const totalParts = chunks.length;
                const uploadResults: PartUploadResult[] = [];
                for (let i = 0; i < chunks.length; i++) {
                    if (controller.signal.aborted) {
                        deleteUploadsFiles([videoFileInfo.programId], userId);
                        return;
                    }

                    const chunk = chunks[i];
                    const partNumber = i + 1;
                    const presignedUrl = videoFileInfo.preSignedUrls[i];

                    const result = await uploadChunk(
                        presignedUrl,
                        chunk,
                        file.origin.type,
                        partNumber,
                        controller.signal,
                        () => deleteUploadsFiles([videoFileInfo.programId], userId),
                    );
                    uploadResults.push(result);

                    const completedParts = uploadResults.length;
                    const percentage = Math.round((completedParts / totalParts) * 100);
                    onProgress(percentage);
                }

                if (controller.signal.aborted) {
                    return;
                }

                const completionData = {
                    programId: videoFileInfo.programId,
                    uploadId: videoFileInfo.uploadId,
                    completedAt: new Date().toISOString(),
                    parts: uploadResults,
                };

                await notifyUploadCompletion(completionData, userId);
                onStatus('uploaded');
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    onStatus('error');
                }
            }
        },
        [userId],
    );

    const runUploads = useCallback(async () => {
        if (isUploading) return;
        setIsUploading(true);

        const controller = new AbortController();
        setAbortController(controller);

        for (const file of fileList) {
            if (file.status === 'pending') {
                console.log(file.origin.name);
                const handleProgress = (progress: number) =>
                    setFileList((prev) =>
                        prev.map((prevFile) =>
                            prevFile.id === file.id
                                ? { ...prevFile, status: 'uploading', progress: progress }
                                : prevFile,
                        ),
                    );

                const handleStatus = (status: MediaFileStatus) =>
                    setFileList((prev) =>
                        prev.map((prevFile) => (prevFile.id === file.id ? { ...prevFile, status: status } : prevFile)),
                    );
                await uploadSingleFile(file, handleProgress, handleStatus, controller);
                if (controller.signal.aborted) {
                    handleProgress(0);
                    handleStatus('pending');
                    break;
                }
            }
        }

        setIsUploading(false);
    }, [fileList, isUploading, uploadSingleFile]);

    const pauseUploads = useCallback(() => {
        setIsUploading(false);
        abortController?.abort();
    }, [abortController]);

    return {
        userGroup: 'none',
        isUploading,
        fileList,
        setFileList,
        removeFile,
        runUploads,
        pauseUploads,
    };
}
export default useFileUploads;
