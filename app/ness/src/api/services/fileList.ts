import api from '../index.ts';
import { FileListParams, FileListResponse } from '@/api/models/queueList.ts';
import { format } from 'date-fns';

export const fetchFileList = async (params: FileListParams): Promise<FileListResponse> => {
    const searchParams = new URLSearchParams({
        uploadUserId: params.uploadUserId,
        startDate: normalizeDate(params.startDate) || '2024-01-01',
        endDate: normalizeDate(params.endDate) || format(new Date(), 'yyyy-MM-dd'),
    });

    return await api.get(`encoding/files?${searchParams.toString()}`).json<FileListResponse>();
};

function normalizeDate(date: string) {
    const parts = date.split(/[-/.]/);
    let year, month, day;
    if (parts[0].length === 4) {
        [year, month, day] = parts;
    } else if (parts[2].length === 4) {
        [month, day, year] = parts;
    } else {
        return null;
    }
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const formattedMonth = String(monthNum).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');

    return `${formattedMonth}-${formattedDay}-${yearNum}`;
}
