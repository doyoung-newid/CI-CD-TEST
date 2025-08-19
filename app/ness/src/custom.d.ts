import '@tanstack/react-table';

declare global {
    interface Window {
        __PRELOADED_DATA__?: PreloadedData;
    }
}

declare module '@tanstack/react-table' {
    interface ColumnMeta {
        thStyle?: string;
        tdStyle?: string;
        widthStyle?: string;
        pinned?: boolean;
        textAlign?: 'left' | 'right' | 'center';
    }
}
