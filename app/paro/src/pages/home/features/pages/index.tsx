import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

function PagesPage() {
    const { t } = useTranslation();
    const { target } = useParams();
    const [titleKey, setTitleKey] = useState('');

    useEffect(() => {
        switch (target) {
            case 'main':
                setTitleKey('nav.home');
                break;
            case 'linear':
                setTitleKey('nav.channels');
                break;
            case 'avod':
                setTitleKey('nav.onDemand');
                break;
        }
    }, [target]);

    return (
        <div className={'flex h-screen flex-col gap-[21px] p-[36px] pt-[48px]'}>
            <div className={'flex justify-between'}>
                <h1>{t('pages.title')}</h1>
                <h1>{t(titleKey)}</h1>
            </div>
            <div className={'flex'}></div>
            <div className={'border-grey-20 flex-grow rounded-[4px] border bg-white'}>dd</div>
        </div>
    );
}
export default PagesPage;
