import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import ErrorPage from './ErrorPage.tsx';
import HomeLayout from '@/pages/home';
import SettingsLayout from '@/pages/settings';

const PagesPage = lazy(() => import('@/pages/home/features/pages'));
const LibraryPage = lazy(() => import('@/pages/home/features/library'));
const CategoryPage = lazy(() => import('@/pages/home/features/category'));
const RelevancePage = lazy(() => import('@/pages/settings/features/relevance'));
const LegalPage = lazy(() => import('@/pages/home/features/legals'));
const NotFoundPage = lazy(() => import('@/app/NotFoundPage.tsx'));

const router = createBrowserRouter([
    {
        path: '/',
        Component: HomeLayout,
        children: [
            {
                index: true,
                Component: () => <div>Home</div>,
                errorElement: <ErrorPage />,
            },
            {
                path: 'pages/:target',
                Component: PagesPage,
                errorElement: <ErrorPage />,
            },
            {
                path: 'library/:contentType',
                Component: LibraryPage,
                errorElement: <ErrorPage />,
            },
            {
                path: 'legals',
                Component: LegalPage,
                errorElement: <ErrorPage />,
            },
            {
                path: 'deployment',
                Component: LegalPage,
                errorElement: <ErrorPage />,
            },
            {
                path: 'preview',
                Component: LegalPage,
                errorElement: <ErrorPage />,
            },
            {
                path: '*',
                Component: NotFoundPage,
            },
        ],
    },
    {
        path: '/settings',
        Component: SettingsLayout,
        children: [
            {
                index: true,
                Component: () => <div>Settings</div>,
                errorElement: <ErrorPage />,
            },
            {
                path: 'info',
                Component: PagesPage,
                errorElement: <ErrorPage />,
            },
            {
                path: 'categorise',
                Component: CategoryPage,
                errorElement: <ErrorPage />,
            },
            {
                path: 'relevance',
                Component: RelevancePage,
                errorElement: <ErrorPage />,
            },
        ],
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};
export default AppRouter;
