import {
    FileListResponse,
    FileUploadResponse,
    FileValidateResponse,
    UploadCompletionRequest,
    UploadCompletionResponse,
    UploadedFileItem,
} from '@/api/models/fileUploads.ts';

import { PartUploadResult } from '@/routes/fileUpload/uploading.utils.ts';

import { MediaFile } from '@/types/mediainfo.types.ts';

import { api } from '@/api';

export const validateFile = async (fileName: string, userEncryptKey: string): Promise<boolean | null> => {
    try {
        const response = await api.post('upload/files/validate', {
            json: { files: [fileName] },
            searchParams: { userEncryptKey },
        });
        const result = await response.json<FileValidateResponse>();

        return result.data as boolean;
    } catch {
        return null;
    }
};

export const requestPresignedFile = async (file: MediaFile, userEncryptKey: string): Promise<FileUploadResponse> => {
    const response = await api.post('upload/file', {
        json: {
            fileName: file?.metadata?.fileName || '',
            extension: file?.metadata?.extension || '',
            resolution: file?.metadata?.resolution || '',
            fileSize: file?.metadata?.fileSize || 0,
            duration: file?.metadata?.duration || 0,
            bitrate: file?.metadata?.bitrate || 0,
            codecInfo: file?.metadata?.codecInfo || '',
            frameRate: file?.metadata?.frameRate || 0,
            audioCodec: file?.metadata?.audioCodec || '',
            audioBitRate: file?.metadata?.audioBitRate || 0,
            subtitleFiles: file?.subtitles?.map((sub) => sub.file.name) || null,
        },
        searchParams: { userEncryptKey },
    });

    return await response.json<FileUploadResponse>();
};

export const notifyUploadCompletion = async (
    programId: string,
    uploadId: string,
    parts: PartUploadResult[],
    userEncryptKey: string,
): Promise<UploadCompletionResponse> => {
    const requestData: UploadCompletionRequest = { files: [{ programId, uploadId, parts }] };
    try {
        const response = await api.post('upload/files/completed', {
            json: requestData,
            searchParams: { userEncryptKey },
        });

        return await response.json<UploadCompletionResponse>();
    } catch (error) {
        console.error('업로드 완료 알림 에러:', {
            error,
            requestData,
            userEncryptKey,
        });

        if (error instanceof Error) {
            console.error('에러 메시지:', error.message);
            console.error('에러 스택:', error.stack);
        }

        throw error;
    }
};

export const fetchUploadedFiles = async (userEncryptKey: string): Promise<FileListResponse> => {
    const response = await api.get('upload/files', { searchParams: { userEncryptKey } });
    return await response.json<FileListResponse>();
};

export const deleteUploadFiles = (programIdList: string[], userEncryptKey: string) =>
    api.delete('upload/files', {
        json: { programIds: programIdList },
        searchParams: { userEncryptKey },
    });

export const requestRunEncoding = async (
    fileList: UploadedFileItem[],
    userEncryptKey: string,
    isAutoEncoding: boolean,
): Promise<FileListResponse> => {
    const response = await api.post('encoding/queue', {
        json: { encodingQueues: fileList },
        searchParams: { userEncryptKey, isAutoEncoding },
    });

    return await response.json<FileListResponse>();
};
