import { useCallback, useState } from 'react';
import { RelevanceLocalized } from '@/api/model/relevance.ts';
import { Language } from '@/types/enums.ts';

function useRelevanceForm() {
    const [codeList, setCodeList] = useState(InitCodeList);

    const changeFn = useCallback((code: string, value: string) => {
        setCodeList((prev) => ({
            ...prev,
            [code]: value,
        }));
    }, []);

    const insertFn = useCallback(() => {
        if (codeList.en) {
            return codeList;
        }
    }, [codeList]);

    return {
        setCodeList,
        codeList,
        changeFn,
        insertFn,
    };
}
export default useRelevanceForm;

const InitCodeList: RelevanceLocalized = Language.reduce((acc, current) => {
    acc[current.value] = '';
    return acc;
}, {});
