import { useAtomValue } from 'jotai';
import { loadingState } from '@/store';

function LoadingMask() {
    const isLoading = useAtomValue(loadingState);

    return isLoading ? (
        <div
            className={`fixed left-[240px] top-0 z-[99999] flex h-full w-[calc(100%-240px)] items-center justify-center bg-[#ffffffbb]`}
        >
            <p className={`text-b28`}>Loading</p>
        </div>
    ) : null;
}
export default LoadingMask;
