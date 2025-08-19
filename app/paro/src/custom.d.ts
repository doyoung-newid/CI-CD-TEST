import '@tanstack/react-table';

declare module '@tanstack/react-table' {
    interface ColumnMeta {
        pinned?: boolean;
        headerClass?: string;
        className?: string;
        width?: number | string;
        textAlign?: 'left' | 'right' | 'center';
    }
}
