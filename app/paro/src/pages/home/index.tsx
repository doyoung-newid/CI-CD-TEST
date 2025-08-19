import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { SideNavBar } from '@plitvice/ui';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { SideNavSection } from '@plitvice/ui/components/navigation/sideNavBar.types.ts';
import Layout from '@/app/Layout.tsx';

function HomeLayout() {
    const { t } = useTranslation();
    const navMap = useMemo(() => getNavMap(t), [t]);
    const navigate = useNavigate();

    return (
        <Layout>
            <div className={`border-grey-20 border-b px-[24px] py-[18px]`}>
                <p className={`text-m18`}>BINGE Korea</p>
                <p className={`text-grey-50 text-r12 pt-[4px]`}>{t('common.location')}: </p>
            </div>
            <div className={`overflow-y-auto pb-[48px] pt-[24px]`}>
                <SideNavBar width={0} sectionList={navMap} onNavigate={navigate} />
            </div>
        </Layout>
    );
}
export default HomeLayout;

const getNavMap = (t: TFunction): SideNavSection[] => {
    return [
        {
            title: t('nav.home.feedBuilder.title'),
            child: [
                {
                    path: '/pages',
                    label: t('nav.home.feedBuilder.pages.title'),
                    child: [
                        { path: '/pages/home', label: t('nav.home.feedBuilder.pages.home') },
                        { path: '/pages/linear', label: t('nav.home.feedBuilder.pages.channels') },
                        { path: '/pages/avod', label: t('nav.home.feedBuilder.pages.onDemand') },
                    ],
                },
            ],
        },
        {
            title: t('nav.home.contentSetup.title'),
            child: [
                {
                    path: '/library',
                    label: t('nav.home.contentSetup.library.title'),
                    child: [
                        { path: '/library/linear', label: t('nav.home.contentSetup.library.linear') },
                        { path: '/library/series', label: t('nav.home.contentSetup.library.series') },
                        { path: '/library/program', label: t('nav.home.contentSetup.library.program') },
                    ],
                },
            ],
        },
        {
            title: t('nav.home.appSettings.title'),
            child: [
                {
                    path: '/searchKeywords',
                    label: t('nav.home.appSettings.suggestedKeywords'),
                },
                {
                    path: '/legals',
                    label: t('nav.home.appSettings.legals'),
                },
            ],
        },
        {
            title: t('nav.home.operations.title'),
            child: [
                {
                    path: '/settings/info',
                    label: t('nav.home.operations.platformSettings'),
                },
                {
                    path: '/deployment',
                    label: t('nav.home.operations.deployment'),
                },
                {
                    path: '/preview',
                    label: t('nav.home.operations.appPreview'),
                },
            ],
        },
    ];
};
