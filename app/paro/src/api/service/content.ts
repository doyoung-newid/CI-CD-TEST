import { LinearData } from '@/api/model/linear.ts';
import { apiClient } from '@/api/apiClient.ts';
import { AvodData } from '@/api/model/avod.ts';

interface IGetRequest {
    country: string;
    lang: string;
}

export const getFormattedDate = (format: { isKebab: boolean }): string => {
    const date = new Date();
    const year = date.getUTCFullYear().toString().slice(0, 4);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return format.isKebab ? `${year}-${month}-${day}` : `${year}${month}${day}`;
};

export async function fetchLinear(params: IGetRequest): Promise<LinearData[]> {
    const today = getFormattedDate({ isKebab: true });
    return apiClient.get(
        `${import.meta.env.VITE_CDN_URL}/app/prod/linear/${params.country}/${params.lang}/${today}.json`,
    );
}

export async function fetchAvod(params: IGetRequest): Promise<AvodData> {
    const date = getFormattedDate({ isKebab: false });
    return apiClient.get(`${import.meta.env.VITE_CDN_URL}/app/prod/feed/${params.country}/${params.lang}/data.json`, {
        params: date,
    });
}
