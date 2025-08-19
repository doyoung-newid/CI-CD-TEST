import { Language, LegalType } from '@/types/enums.ts';
import useLegals from '@/pages/home/features/legals/index.hooks.ts';
import { Button, SelectBox, SelectOption, TabMenu, TextArea } from '@plitvice/ui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

function LegalsPage() {
    const { t } = useTranslation();
    const { data, lang, text, setType, setText, changeLang, resetText, upsert } = useLegals();

    return (
        <div className={'flex h-screen min-w-[1200px] flex-col p-[36px]'}>
            <h1>{t('legal.title')}</h1>
            <p className={`text-r14 text-grey-60 whitespace-pre-line pb-[32px] pt-[12px]`}>{t('legal.description')}</p>
            <TabMenu tabList={getLegalList(t)} value={LegalType.TERMS_OF_USE} onChange={setType} />
            <div className={`border-grey-20 flex h-full flex-col gap-[24px] border-t pt-[24px]`}>
                <div className={'flex items-end justify-between'}>
                    <SelectBox size={'medium'} width={252} value={lang} onChange={changeLang} optionList={Language} />
                    <div className={'flex gap-[16px]'}>
                        <Button size={'medium'} disabled={data.content === text} onClick={resetText}>
                            {t('button.reset')}
                        </Button>
                        <Button
                            size={'medium'}
                            variant={'normal'}
                            disabled={data.content === text}
                            onClick={() => upsert(text)}
                        >
                            {t('button.update')}
                        </Button>
                    </div>
                </div>
                <TextArea value={text} onChange={setText} className={`h-full`} />
            </div>
        </div>
    );
}
export default LegalsPage;

const getLegalList = (t: TFunction): SelectOption[] => {
    return [
        {
            value: LegalType.TERMS_OF_USE,
            label: t('legal.tab0'),
        },
        {
            value: LegalType.PRIVACY_POLICY,
            label: t('legal.tab1'),
        },
        {
            value: LegalType.DO_NOT_SHARE,
            label: t('legal.tab2'),
        },
    ];
};
