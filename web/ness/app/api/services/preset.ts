import { PresetResponse } from '@/api/models/preset.ts';

import { api } from '@/api';

export const fetchPresetList = async (userEncryptKey: string): Promise<PresetResponse> => {
    return await api.get(`preset`, { searchParams: { userEncryptKey } }).json<PresetResponse>();
};
