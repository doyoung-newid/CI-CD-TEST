import api from '@/api';
import { PresetResponse } from '@/api/models/preset.ts';

export const fetchPresetList = async (userId: string): Promise<PresetResponse> => {
    return await api.get(`preset/user/${userId}`).json<PresetResponse>();
};
