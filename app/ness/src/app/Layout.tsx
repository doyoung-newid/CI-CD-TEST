import { ReactNode, Suspense } from 'react';
import { Outlet } from 'react-router';
import LoadingMask from '@/app/LoadingMask.tsx';
import FileUploadsPage from '@/pages/encoding/features/fileUploads';
import { useGlobalContext } from '@/hooks/useGlobal.context.tsx';

interface Props {
    children: ReactNode;
}
const Layout = ({ children }: Props) => {
    const { auth } = useGlobalContext();

    return (
        <div
            className={
                'relative grid h-full w-full grid-cols-[240px_1fr] grid-rows-[60px_1fr] justify-start overflow-hidden'
            }
        >
            <div className={`col-span-2 bg-blue-600 px-[24px] py-[16px]`}>
                <a href={`./`}>
                    <img src={`/logo.png`} width={110} height={28} alt={'logo'} />
                </a>
            </div>
            {auth.userGroup !== 'cp' ? (
                <>
                    <div className={`overflow-hidden`}>{children}</div>
                    <div className={'bg-grey-5 border-grey-20 relative h-full w-full overflow-auto border-l'}>
                        <Suspense fallback={<LoadingMask />}>
                            <Outlet />
                        </Suspense>
                        <LoadingMask />
                    </div>{' '}
                </>
            ) : (
                <>
                    <div className={`col-span-2 h-full w-full overflow-hidden`}>
                        <FileUploadsPage />
                    </div>
                    <LoadingMask />
                </>
            )}
        </div>
    );
};
export default Layout;
