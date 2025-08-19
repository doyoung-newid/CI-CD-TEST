import { Country, LegalType } from '@/types/enums';

export type LegalItem = {
    id: number;
    content: string;
    type: LegalType;
    lang: string;
    country: Country;
    updatedAt: string;
};
