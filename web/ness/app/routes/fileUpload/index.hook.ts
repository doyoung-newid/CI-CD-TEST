import { useCallback, useState } from 'react';

import {
    deleteUploadFiles,
    notifyUploadCompletion,
    requestPresignedFile,
    validateFile,
} from '@/api/services/fileUpload.ts';

import {
    PartUploadResult,
    splitFileIntoChunks,
    uploadChunk,
    uploadSubtitleFile,
} from '@/routes/fileUpload/uploading.utils.ts';

import { MediaFile, MediaFileStatus } from '@/types/mediainfo.types.ts';

export const useFileUpload = (userEncryptKey: string) => {
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
                const validate = await validateFile(file.origin.name, userEncryptKey);
                if (validate) {
                    onStatus('uploaded');
                    return;
                }

                const presignedResponse = await requestPresignedFile(file, userEncryptKey);
                const videoFileInfo = presignedResponse.data;

                if (file.subtitles && file.subtitles.length > 0 && videoFileInfo.subtitles) {
                    for (const subtitle of file.subtitles) {
                        if (controller.signal.aborted) {
                            deleteUploadFiles([videoFileInfo.programId], userEncryptKey);
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
                    deleteUploadFiles([videoFileInfo.programId], userEncryptKey);
                    return;
                }

                const chunks = splitFileIntoChunks(file.origin);
                const totalParts = chunks.length;
                const uploadResults: PartUploadResult[] = [];
                for (let i = 0; i < chunks.length; i++) {
                    if (controller.signal.aborted) {
                        deleteUploadFiles([videoFileInfo.programId], userEncryptKey);
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
                        () => deleteUploadFiles([videoFileInfo.programId], userEncryptKey),
                    );
                    uploadResults.push(result);

                    const completedParts = uploadResults.length;
                    const percentage = Math.round((completedParts / totalParts) * 100);
                    onProgress(percentage);
                }

                if (controller.signal.aborted) {
                    return;
                }

                await notifyUploadCompletion(
                    videoFileInfo.programId,
                    videoFileInfo.uploadId,
                    uploadResults,
                    userEncryptKey,
                );
                onStatus('uploaded');
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    onStatus('error');
                }
            }
        },
        [userEncryptKey],
    );

    const runUpload = useCallback(async () => {
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

    const pauseUpload = useCallback(() => {
        setIsUploading(false);
        abortController?.abort();
    }, [abortController]);

    return {
        isUploading,
        fileList,
        setFileList,
        removeFile,
        runUpload,
        pauseUpload,
    };
};
