import { format } from 'date-fns';

import { FileListResponse } from '@/api/models/queueList.ts';

import { api } from '@/api';

export const fetchFileList = async (
    userEncryptKey: string,
    startDate: string,
    endDate: string,
): Promise<FileListResponse> => {
    const searchParams = new URLSearchParams({
        userEncryptKey: userEncryptKey,
        startDate: normalizeDate(startDate) || '01-01-2024',
        endDate: normalizeDate(endDate) || format(new Date(), 'MM-dd-yyyy'),
    });

    return await api.get(`encoding/files?${searchParams.toString()}`).json<FileListResponse>();
};

const normalizeDate = (date: string) => {
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
};
