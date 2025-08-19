import { useCallback, useEffect, useState } from 'react';
import { LegalItem } from '@/api/model/legal.ts';
import { fetchLegals, upsertLegal } from '@/api/service/legals.ts';
import { Language, LegalType } from '@/types/enums.ts';
import useCountry from '@/hooks/useCountry.ts';
import { SelectOption } from '@plitvice/ui';

function useLegals() {
    const { country } = useCountry();
    const [type, setType] = useState(LegalType.TERMS_OF_USE);
    const [lang, setLang] = useState(Language[0].value);
    const [list, setList] = useState<LegalItem[]>([]);
    const [data, setData] = useState<LegalItem>({
        id: 0,
        content: '',
        type: LegalType.PRIVACY_POLICY,
        lang: Language[0].value,
        country: country,
        updatedAt: '',
    });
    const [text, setText] = useState('');

    const changeLang = useCallback((lang: string) => {
        const selectedItem: SelectOption = Language.find((item) => item.value === lang) || Language[0];
        setLang(selectedItem.value);
    }, []);

    const resetText = useCallback(() => {
        setText(data.content);
    }, [data]);

    const upsert = useCallback(
        (text: string) => {
            const newData: LegalItem = {
                ...data,
                content: text,
            };
            upsertLegal(newData).then((result) => {
                const updatedList = [...list];
                const index = list.findIndex((item) => item.id === newData.id);
                if (result) {
                    if (index < 0) {
                        updatedList.push(newData);
                    } else {
                        updatedList[index] = newData;
                    }
                    setList(updatedList);
                } else {
                    setList(list);
                }
            });
        },
        [list, data],
    );

    useEffect(() => {
        fetchLegals(country).then((result) => setList(result));
    }, [country]);

    useEffect(() => {
        const data = list.find((item) => item.type === type && item.lang === lang);
        if (data) {
            setData(data);
            setText(data.content);
        } else {
            setData({
                id: 0,
                content: '',
                type: type,
                lang: lang,
                country: country,
                updatedAt: '',
            } as LegalItem);
            setText('');
        }
    }, [country, type, lang, list]);

    return {
        data,
        lang,
        text,
        setType,
        setText,
        changeLang,
        resetText,
        upsert,
    };
}
export default useLegals;
