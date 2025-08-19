// 중복파일 검증 요청 타입
interface FileValidateRequest {
    files: Array<{
        fileName: string;
    }>;
}

// 중복파일 검증 응답 타입
interface FileValidateResponse {
    code: number;
    msg: string;
    data: boolean | string;
}

// 파일 업로드 관련 타입
interface FileUploadRequest {
    files: Array<{
        fileName: string;
        extension: string;
        resolution: string;
        fileSize: number;
        duration: number;
        bitrate: number;
        codecInfo: string;
        frameRate: number;
        audioCodec: string;
        audioBitRate: number;
        subtitleFiles: string[] | null;
    }>;
}

// 파일 업로드 응답 타입
interface VideoFileInfo {
    fileName: string;
    programId: string;
    storagePath: string;
    uploadId: string;
    preSignedUrls: string[];
    createdAt: string;
    updatedAt: string;
    subtitles?: Array<{
        presignedUrl: string;
        language: string;
        filename: string;
    }>;
}

interface FileUploadResponse {
    code: number;
    msg: string;
    data: VideoFileInfo;
}

// 업로드 완료 관련 타입
interface UploadCompletionRequest {
    files: Array<{
        programId: string;
        uploadId: string;
        completedAt: string;
        parts: Array<{
            PartNumber: number;
            ETag: string;
        }>;
    }>;
}

interface UploadCompletionResponse {
    status_code: number;
    data: string;
}

// 파일 목록 조회 관련 타입
interface UploadedFileItem {
    fileName: string;
    programId: string;
    presetId: number;
    status: 'uploading' | 'uploaded' | 'done';
    languages: string | null;
    createdAt: string;
    updatedAt: string;
}

interface FileListResponse {
    code: number;
    msg: string;
    data: UploadedFileItem[];
}

export interface FileValidationRequest {
    fileName: string;
}

export interface FileValidationResponse {
    code: number;
    data: boolean;
    msg: string;
}

export interface FileUploadInitiateRequest {
    file_name: string;
    file_size: number;
    file_type: string;
    upload_path: string;
    upload_user: string;
}

export interface FileUploadInitiateResponse {
    file_id: string;
    parts: Array<{
        part_number: number;
        url: string;
    }>;
}

export interface FileUploadCompleteRequest {
    file_id: string;
    parts: Array<{
        part_number: number;
        etag: string;
    }>;
}

export interface FileUploadCompleteResponse {
    file_id: string;
    file_url: string;
}

// 타입들을 export (다른 곳에서 사용할 수 있도록)
export type {
    FileValidateRequest,
    FileValidateResponse,
    FileUploadRequest,
    VideoFileInfo,
    FileUploadResponse,
    UploadCompletionRequest,
    UploadCompletionResponse,
    UploadedFileItem,
    FileListResponse,
};
