import { useEffect, useState } from 'react';
import { useFetchers, useNavigation } from 'react-router';

import IconLoading from '@/assets/icLoading.svg?react';

export const GlobalLoading = () => {
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const fetchers = useFetchers();
    const busy = navigation.state !== 'idle' || fetchers.some((f) => f.state !== 'idle');

    useEffect(() => {
        if (busy) {
            const id = setTimeout(() => setShow(true), 200);
            return () => clearTimeout(id);
        }
        setShow(false);
    }, [busy]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/70">
            <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          45% { transform: scale(0.5); }
        }
      `}</style>
            <IconLoading
                className="h-24 w-24"
                style={{ animation: 'pulse-scale 1.067s cubic-bezier(0.58,0.79,0.15,1) infinite' }}
            />
        </div>
    );
};
