import api from '../index.ts';
import {
    FileListResponse,
    FileUploadResponse,
    FileValidateResponse,
    UploadCompletionRequest,
    UploadCompletionResponse,
    UploadedFileItem,
} from '@/api/models/fileUploads.ts';
import { MediaFile } from '@/types/mediainfo.types.ts';

export const validateFile = async (fileName: string, userId: string): Promise<boolean | null> => {
    try {
        const response = await api.post('upload/files/validate', {
            json: { files: [fileName] },
            searchParams: { uploadUserId: userId },
        });
        const result = await response.json<FileValidateResponse>();

        return result.data as boolean;
    } catch {
        return null;
    }
};

export const requestPresignedFile = async (file: MediaFile, uploadUserId: string): Promise<FileUploadResponse> => {
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
        searchParams: {
            uploadUserId,
        },
    });

    return await response.json<FileUploadResponse>();
};

// 업로드 완료 알림 API
export const notifyUploadCompletion = async (
    completionData: {
        programId: string;
        uploadId: string;
        completedAt: string;
        parts: {
            PartNumber: number;
            ETag: string;
        }[];
    },
    uploadUserId: string,
): Promise<UploadCompletionResponse> => {
    const requestData: UploadCompletionRequest = { files: [completionData] };
    try {
        const response = await api.post('upload/files/completed', {
            json: requestData,
            searchParams: {
                uploadUserId,
            },
        });

        return await response.json<UploadCompletionResponse>();
    } catch (error) {
        console.error('업로드 완료 알림 에러:', {
            error,
            requestData,
            uploadUserId,
        });

        // 에러 상세 정보 로그
        if (error instanceof Error) {
            console.error('에러 메시지:', error.message);
            console.error('에러 스택:', error.stack);
        }

        throw error;
    }
};

export const fetchUploadedFiles = async (uploadUserId: string): Promise<FileListResponse> => {
    const response = await api.get('upload/files', {
        searchParams: {
            uploadUserId,
        },
    });

    return await response.json<FileListResponse>();
};

export const deleteUploadsFiles = (programIdList: string[], uploadUserId: string) =>
    api.delete('upload/files', {
        json: { programIds: programIdList },
        searchParams: { uploadUserId },
    });

export const requestRunEncoding = async (
    fileList: UploadedFileItem[],
    uploadUserId: string,
    isAutoEncoding: boolean,
): Promise<FileListResponse> => {
    const response = await api.post('encoding/queue', {
        json: { encodingQueues: fileList },
        searchParams: { uploadUserId, isAutoEncoding },
    });

    return await response.json<FileListResponse>();
};
