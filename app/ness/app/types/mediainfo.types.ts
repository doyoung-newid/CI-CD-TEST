export interface MediaFile {
    origin: File;
    preview: string;
    id: string;
    progress: number;
    status: MediaFileStatus;
    metadata?: MediaMetadata;
    subtitles?: MediaSubFile[];
    error?: string;
}

export interface MediaSubFile {
    file: File;
    language: string;
}

export interface MediaMetadata {
    fileName: string;
    extension: string;
    resolution: string;
    fileSize: number;
    duration: number;
    bitrate: number;
    codecInfo: string;
    frameRate: number;
    audioCodec: string;
    audioBitRate: number;
}

export type MediaFileStatus = 'pending' | 'uploading' | 'uploaded' | 'encoded' | 'error';

/** Format of the result type */
export type FormatType = 'object' | 'JSON' | 'XML' | 'HTML' | 'text';

/** MediaInfo Track 인터페이스 */
export interface Track {
    readonly '@type': 'General' | 'Video' | 'Audio' | 'Text' | 'Menu' | 'Other';
    // 모든 필드는 선택적이며 string 또는 변환된 number 타입
    readonly [key: string]: string | number | undefined;

    // 주요 필드들 (실제로는 더 많은 필드가 있음)
    readonly Duration?: string | number;
    readonly Duration_String?: string;
    readonly 'Duration/String'?: string;
    readonly Duration_String1?: string;
    readonly Duration_String2?: string;
    readonly Duration_String3?: string;
    readonly FileSize?: string | number;
    readonly Format?: string;
    readonly OverallBitRate?: string | number;
    readonly Width?: string | number;
    readonly Height?: string | number;
    readonly BitRate?: string | number;
    readonly FrameRate?: string | number;
    readonly CodecID?: string;
}

/** MediaInfo 결과 인터페이스 */
export interface MediaInfoResult {
    readonly media: {
        readonly track: readonly Track[];
        readonly '@ref'?: string;
    };
}

/** 결과 매핑 인터페이스 */
export interface ResultMap {
    object: MediaInfoResult;
    JSON: string;
    XML: string;
    HTML: string;
    text: string;
}

/** 크기 인수 타입 */
export type SizeArg = (() => Promise<number> | number) | number;

/** 청크 읽기 함수 타입 */
export type ReadChunkFunc = (size: number, offset: number) => Promise<Uint8Array> | Uint8Array;

/** MediaInfo 팩토리 옵션 */
export interface MediaInfoFactoryOptions<TFormat extends FormatType> {
    /** Output cover data as base64 */
    coverData?: boolean;
    /** Chunk size used by `analyzeData` (in bytes) */
    chunkSize?: number;
    /** Result format (`object`, `JSON`, `XML`, `HTML` or `text`) */
    format?: TFormat;
    /** Full information display (all internal tags) */
    full?: boolean;
    /** locateFile 함수 */
    locateFile?: (path: string, prefix: string) => string;
}

/** MediaInfo 인스턴스 인터페이스 */
export interface MediaInfoInstance<TFormat extends FormatType = 'object'> {
    /** 데이터 분석 (Promise 버전) */
    analyzeData(size: SizeArg, readChunk: ReadChunkFunc): Promise<ResultMap[TFormat]>;

    /** 데이터 분석 (콜백 버전) */
    analyzeData(
        size: SizeArg,
        readChunk: ReadChunkFunc,
        callback: (result: ResultMap[TFormat] | null, err?: unknown) => void,
    ): void;

    /** MediaInfo 인스턴스 종료 */
    close(): void;
}

/** MediaInfo 팩토리 함수 타입 */
export interface MediaInfoFactory {
    <TFormat extends FormatType = 'object'>(
        options?: MediaInfoFactoryOptions<TFormat>,
    ): Promise<MediaInfoInstance<TFormat>>;
}
