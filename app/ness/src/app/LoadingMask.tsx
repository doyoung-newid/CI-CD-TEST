import { useAtomValue } from 'jotai';
import { loadingState } from '@/stores';

function LoadingMask() {
    const isLoading = useAtomValue(loadingState);

    return isLoading ? (
        <div className={`fixed left-0 top-0 z-[99999] flex h-full w-full items-center justify-center bg-[#ffffffbb]`}>
            <p className={`text-b28`}>Loading</p>
        </div>
    ) : null;
}
export default LoadingMask;
