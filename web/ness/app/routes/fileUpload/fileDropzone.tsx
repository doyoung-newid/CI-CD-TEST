import { ChangeEvent, MouseEvent, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@plitvice/ui';

const WHITELIST_MEDIA_EXTENSIONS = {
    'video/mp4': ['.mp4'],
    'video/quicktime': ['.mov'],
    'video/mpeg': ['.mpeg', '.mpg'],
};

const WHITELIST_SUB_EXTENSIONS = {
    'application/x-subrip': ['.srt'],
};

interface FileWithPath {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    path?: string;
    webkitRelativePath?: string;
}

interface FileDropzoneProps {
    onAddFile: (mediaFileList: File[], subFileList: File[]) => void;
    disabled?: boolean;
}

const FileDropzone = ({ onAddFile, disabled = false }: FileDropzoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const processFileList = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const mediaFileList = acceptedFiles.filter((file) => isValidMediaFile(file.name));
        const subFileList = acceptedFiles.filter((file) => isValidSubFile(file.name));

        onAddFile(mediaFileList, subFileList);
    };

    const handleFileSelect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (fileInputRef.current && !disabled) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            processFileList(selectedFiles);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFolderSelect = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (folderInputRef.current && !disabled) {
            folderInputRef.current.click();
        }
    };

    const handleFolderChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFileList = Array.from(event.target.files) as FileWithPath[];

            if (isNestedFolder(selectedFileList)) {
                alert('다중 폴더는 첨부가 불가능합니다.');
                if (folderInputRef.current) {
                    folderInputRef.current.value = '';
                }
                return;
            }

            const rootFolderName =
                selectedFileList.length > 0 ? (selectedFileList[0].webkitRelativePath || '').split('/')[0] : '';

            const folderFiles = selectedFileList.filter((file) => {
                const path = file.webkitRelativePath || '';
                const pathParts = path.split('/');
                const isDirectChild = pathParts.length === 2 && pathParts[0] === rootFolderName;
                const isSupportedType = isValidMediaFile(file.name);

                return isDirectChild && isSupportedType;
            });

            processFileList(folderFiles as File[]);

            if (folderInputRef.current) {
                folderInputRef.current.value = '';
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: WHITELIST_MEDIA_EXTENSIONS,
        onDrop: processFileList,
        noClick: true,
        disabled,
    });

    return (
        <div
            {...getRootProps()}
            className={`flex h-[70px] w-full items-center justify-center rounded-[4px] border border-dashed ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-[#8E8E90]'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
            <input {...getInputProps()} />

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".mp4,.mov,.mpeg,.mpg,.srt"
                className="hidden"
                onChange={handleFileChange}
            />

            <input
                ref={folderInputRef}
                type="file"
                // @ts-expect-error - webkitdirectory is not in the standard HTMLInputElement type definition
                webkitdirectory="true"
                directory="true"
                mozdirectory="true"
                multiple
                className="hidden"
                onChange={handleFolderChange}
            />

            <div className="flex items-center">
                {isDragActive ? (
                    <span>Drop files here to upload</span>
                ) : (
                    <>
                        Drag and drop files or folders here to upload, or click &nbsp;
                        <Button onClick={handleFileSelect} size="small" disabled={disabled}>
                            Add File
                        </Button>
                        &nbsp;or &nbsp;
                        <Button onClick={handleFolderSelect} size="small" disabled={disabled}>
                            Add Folder
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};
export default FileDropzone;

const isNestedFolder = (files: FileWithPath[]): boolean => {
    return files.some((file) => {
        const filePath = file.path || file.webkitRelativePath || '';
        const splitPathCnt = filePath.replace(/\\/g, '/').split('/').length;
        return splitPathCnt > 2;
    });
};

const isValidMediaFile = (filename: string): boolean => {
    const extension = filename.toLowerCase().match(/\.[0-9a-z]+$/);
    if (!extension) return false;
    return Object.values(WHITELIST_MEDIA_EXTENSIONS).some((types) => types.includes(extension[0]));
};

const isValidSubFile = (filename: string): boolean => {
    const extension = filename.toLowerCase().match(/\.[0-9a-z]+$/);
    if (!extension) return false;
    return Object.values(WHITELIST_SUB_EXTENSIONS).some((types) => types.includes(extension[0]));
};
