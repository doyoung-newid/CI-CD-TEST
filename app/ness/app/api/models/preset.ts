export interface EncodingOptions {
    // 비디오 설정
    video?: {
        codec?: string; // 비디오 코덱 (h264, h265, vp9 등)
        bitrate?: number; // 비디오 비트레이트 (bps)
        resolution?: string; // 해상도 (1920x1080 등)
        frameRate?: number; // 프레임레이트
        crf?: number; // Constant Rate Factor (품질 설정)
        preset?: string; // 인코딩 프리셋 (fast, medium, slow 등)
    };

    // 오디오 설정
    audio?: {
        codec?: string; // 오디오 코덱 (aac, mp3 등)
        bitrate?: number; // 오디오 비트레이트 (bps)
        sampleRate?: number; // 샘플 레이트 (Hz)
        channels?: number; // 채널 수
    };

    // 기타 설정
    format?: string; // 출력 포맷 (mp4 등)
    customParams?: string[]; // 커스텀 FFmpeg 파라미터
}

export interface PresetItem {
    id: number;
    name: string;
    userGroup: string;
    companyName: string;
    options: EncodingOptions | null;
    ffmpegCommand: string;
    type: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface PresetResponse {
    code: number;
    msg: string;
    data: PresetItem[];
}
