import { createBrowserRouter, RouterProvider } from 'react-router';
import FileUploadsPage from '@/pages/encoding/features/fileUploads';
import EncodingPresetPage from '@/pages/encoding/features/presetList';
import { fetchPresetList } from '@/api/services/preset.ts';
import { fetchServerStatus } from '@/api/services/serverStatus.ts';
import { getDefaultDateRange, getUserId } from '@/utils';
import ErrorPage from '@/app/ErrorPage.tsx';
import HomeLayout from '@/pages/encoding';
import { lazy } from 'react';
import { fetchFileList } from '@/api/services/fileList.ts';

const ServerStatusPage = lazy(() => import('@/pages/encoding/features/serverStatus'));
const EncodingFileListPage = lazy(() => import('@/pages/encoding/features/queueStatus'));

const router = createBrowserRouter([
    {
        path: '/',
        Component: HomeLayout,
        errorElement: <div>404 Not Found</div>,
        children: [
            {
                index: true,
                Component: FileUploadsPage,
                errorElement: <ErrorPage />,
                hydrateFallbackElement: <div>HydrateFallbackElement</div>,
            },
            {
                path: '/queue-status',
                Component: EncodingFileListPage,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const userId = getUserId();
                    const { startDate, endDate } = getDefaultDateRange();
                    return await fetchFileList({
                        uploadUserId: userId,
                        startDate,
                        endDate,
                    });
                },
            },
            {
                path: '/server-status',
                Component: ServerStatusPage,
                errorElement: <ErrorPage />,
                loader: async () => {
                    return await fetchServerStatus();
                },
            },
            {
                path: '/preset-list',
                Component: EncodingPresetPage,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const userId = getUserId();
                    return await fetchPresetList(userId);
                },
            },
        ],
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};
export default AppRouter;
