import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { DropdownIcon, SideNavBar } from '@plitvice/ui';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { SideNavSection } from '@plitvice/ui/components/navigation/sideNavBar.types.ts';
import Layout from '@/app/Layout.tsx';

function SettingsLayout() {
    const { t } = useTranslation();
    const navMap = useMemo(() => getNavMap(t), [t]);
    const navigate = useNavigate();

    return (
        <Layout>
            <div className={`border-grey-20 border-b p-[18px]`}>
                <div className={`flex h-[24px] items-center gap-[8px]`}>
                    <button
                        onClick={() => navigate('/pages/home')}
                        className={`hover:bg-grey-10 size-[24px] items-center rounded-[4px] border-transparent`}
                    >
                        <DropdownIcon className={`size-[24px] rotate-90`} />
                    </button>
                    <p className={`text-m18`}>{t('nav.platformSettings.title')}</p>
                </div>
            </div>
            <div className={`overflow-y-auto pb-[48px] pt-[24px]`}>
                <SideNavBar width={0} sectionList={navMap} onNavigate={navigate} />
            </div>
        </Layout>
    );
}
export default SettingsLayout;

const getNavMap = (t: TFunction): SideNavSection[] => {
    return [
        {
            title: '',
            child: [
                {
                    path: '/settings/info',
                    label: t('nav.platformSettings.platformInfo'),
                },
                {
                    path: '/settings/categorise',
                    label: t('nav.platformSettings.categorise'),
                },
                {
                    path: '/settings/relevance',
                    label: t('nav.platformSettings.relevance'),
                },
            ],
        },
    ];
};
