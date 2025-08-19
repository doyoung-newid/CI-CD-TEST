export interface EncodingStatistics {
    total: number;
    pending: number;
    running: number;
    completed: number;
    stopped: number;
}

export interface QueueFileItem {
    programId: string;
    programTitle: string | null;
    status: string;
    type: string;
    duration: number;
    createdAt: string;
    startedAt: string;
    finishedAt: string | null;
    totalTimeSpent: number | null;
    notes: string | null;
}

export interface EncodingFilesData {
    statistics: EncodingStatistics;
    encodingFileList: QueueFileItem[];
}

export interface FileListResponse {
    code: number;
    msg: string;
    data: EncodingFilesData;
}

export interface FileListParams {
    uploadUserId: string;
    startDate: string; // MM-DD-YYYY format
    endDate: string; // MM-DD-YYYY format
}
