import { ReactNode, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router';
import LoadingPage from './LoadingPage.tsx';
import useAssetQuery from '@/api/query/asset.query.ts';
import { useSetAtom } from 'jotai';
import { contentAssetsAtom } from '@/store/app.ts';
import LoadingMask from '@/app/LoadingMask.tsx';

interface Props {
    children: ReactNode;
}
function Layout({ children }: Props) {
    const setContentAssets = useSetAtom(contentAssetsAtom);
    const { contentAssets } = useAssetQuery();

    useEffect(() => {
        if (contentAssets) {
            setContentAssets(contentAssets);
        }
    }, [contentAssets]);

    return (
        <div className={'relative grid h-screen w-full grid-cols-[240px_1fr] justify-start overflow-hidden'}>
            <div className={`overflow-hidden`}>{children}</div>
            <div className={'bg-grey-5 border-grey-20 relative h-full w-full overflow-auto border-l'}>
                <Suspense fallback={<LoadingPage />}>
                    <Outlet />
                </Suspense>
                <LoadingMask />
            </div>
        </div>
    );
}
export default Layout;
