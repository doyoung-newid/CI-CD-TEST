import ky from 'ky';
import { CHUNK_SIZE } from '@/types/enum.ts';

export interface PartUploadResult {
    PartNumber: number;
    ETag: string;
}

export const splitFileIntoChunks = (file: File): Blob[] => {
    const chunks: Blob[] = [];
    let offset = 0;

    while (offset < file.size) {
        const chunk = file.slice(offset, offset + CHUNK_SIZE);
        chunks.push(chunk);
        offset += CHUNK_SIZE;
    }

    return chunks;
};

export const uploadChunk = async (
    url: string,
    chunk: Blob,
    contentType: string,
    partNumber: number,
    signal: AbortSignal,
    onPause: () => void,
): Promise<PartUploadResult> => {
    try {
        const response = await ky.put(url, {
            body: chunk,
            headers: {
                'Content-Type': contentType,
            },
            timeout: 1000 * 60 * 10,
            signal,
        });

        const etag = response.headers.get('ETag');
        if (!etag) {
            throw new Error('ETag를 받지 못했습니다.');
        }

        return {
            PartNumber: partNumber,
            ETag: etag.replace(/"/g, ''),
        };
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            onPause();
        }
        throw error;
    }
};

export const uploadSubtitleFile = async (_file: File, presignedUrl: string, signal?: AbortSignal): Promise<void> => {
    try {
        await ky.put(presignedUrl, {
            body: _file,
            headers: {
                'Content-Type': 'application/x-subrip',
            },
            signal,
        });
    } catch {
        return;
    }
};
