/**
 * 바이트를 읽기 쉬운 형태로 변환
 */
export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * 비트레이트를 읽기 쉬운 형태로 변환
 *
 * 비트레이트(Bitrate)란 1초에 해당하는 동영상에 얼마의 비트(bit) 수를 가지느냐를 의미.
 * 높을수록 좋은 화질이지만, 용량또한 커지게 됨.
 */
export const formatBitrate = (bps: number) => {
    if (bps < 1000) {
        return `${bps} bps`;
    } else if (bps < 1000000) {
        return `${(bps / 1000).toFixed(0)} kbps`;
    } else {
        return `${(bps / 1000000).toFixed(1)} Mbps`;
    }
};

import Cookies from 'js-cookie';

/**
 * 쿠키에서 사용자 ID를 가져오는 함수
 * 쿠키는 브라우저 메모리에 저장되어 있으므로 네트워크 요청이나 파일 시스템 접근이 필요하지 않아 동기 함수로 작성.
 */
export const getUserId = () => {
    const userId = Cookies.get('previous_id_logged');
    if (!userId) {
        throw new Error('User ID not found in cookies');
    }
    return userId;
};

export const firstUpperCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const formatDuration = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return '-';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getFileName = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
        return filename;
    }
    return filename.slice(0, lastDotIndex);
};

export const getLanguageCode = (filename: string): string | null => {
    const originFileName = getFileName(filename);
    const parts = originFileName.split('_');
    if (parts.length > 1) {
        return parts.pop() || null;
    }
    return null;
};

// 날짜 유틸리티 함수들 - MM-DD-YYYY 형식으로 변경
export const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
};

// HTML input[type="date"]는 YYYY-MM-DD 형식을 사용하므로 변환 함수 추가
export const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const parseDateFromInput = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`; // MM-DD-YYYY로 변환
};

export const getDefaultDateRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
        startDate: formatDate(thirtyDaysAgo), // MM-DD-YYYY
        endDate: formatDate(today), // MM-DD-YYYY
    };
};
