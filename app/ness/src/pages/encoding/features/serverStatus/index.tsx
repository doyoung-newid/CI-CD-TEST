import { useLoaderData } from 'react-router';
import { ServerInstance, ServerStatusResponse } from '@/api/models/serverStatus.ts';
import { useTranslation } from 'react-i18next';
import { ServerStatusType } from '@/types/enum.ts';
import ServerStatusList from '@/pages/encoding/features/serverStatus/List.tsx';
import { useEffect, useState } from 'react';
import StatusBox, { StatusBoxProps } from '@/components/StatusBox.tsx';
import { useGlobalContext } from '@/hooks/useGlobal.context.tsx';
import { WarningIcon } from '@plitvice/ui';

const ServerStatusPage = () => {
    const { t } = useTranslation();
    const { isUploading } = useGlobalContext();
    const serverStatusData = useLoaderData() as ServerStatusResponse;
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [filteredData, setFilteredData] = useState<ServerInstance[]>([]);
    serverStatusData.data = sample;

    useEffect(() => {
        setFilteredData(
            selectedStatus === 0
                ? serverStatusData?.data
                : serverStatusData?.data?.filter((item) => item.status === StatusSetting[selectedStatus].type),
        );
    }, [serverStatusData, selectedStatus]);

    return (
        <div className="bg-grey-5 flex h-full min-w-[1200px] flex-col p-[36px]">
            <h1>{t('serverStatus.title')}</h1>
            <p className={`text-r14 text-grey-60 whitespace-pre-line pb-[24px] pt-[12px]`}>
                {t('serverStatus.description')}
            </p>
            <div className={`flex w-[1128px] gap-[12px] pb-[24px]`}>
                {StatusSetting.map((box, index) => (
                    <StatusBox
                        title={t(`serverStatus.${box.type}`)}
                        titleSlice={box.titleSlice}
                        color={box.color}
                        count={
                            index === 0
                                ? serverStatusData.data.length
                                : serverStatusData.data.filter((item) => item.status.toLowerCase() === box.type).length
                        }
                        selected={selectedStatus === index}
                        onClick={() => setSelectedStatus(index)}
                        key={`status-box-${index}`}
                    />
                ))}
            </div>
            <div className="border-grey-20 relative h-full overflow-auto rounded-[4px] border bg-white">
                {(!filteredData || filteredData.length === 0) && (
                    <div className="text-grey-90 flex h-32 items-center justify-center">업로드된 파일이 없습니다.</div>
                )}
                <ServerStatusList data={filteredData} />
            </div>
            {isUploading ? (
                <div className={`fixed right-[36px] top-[96px] flex items-center gap-[4px]`}>
                    <WarningIcon className={`animate-[warning-color-anim_2s_ease-in-out_infinite]`} />
                    <p className={`text-r14`}>{t('fileUploads.alertNowUploading')}</p>
                </div>
            ) : null}
        </div>
    );
};
export default ServerStatusPage;

const StatusSetting: StatusBoxProps[] = [
    { type: ServerStatusType[0], titleSlice: 'T', color: 'bg-[#D8E9FD] border-[#4897F9] text-[#4897F9]' },
    { type: ServerStatusType[1], titleSlice: 'P', color: 'bg-[#FEF7B9] border-[#DBA00A] text-[#DBA00A]' },
    { type: ServerStatusType[2], titleSlice: 'R', color: 'bg-[#BAF8D7] border-[#15A271] text-[#15A271]' },
    { type: ServerStatusType[3], titleSlice: 'SP', color: 'bg-[#FFEACC] border-[#F68855] text-[#F68855]' },
    { type: ServerStatusType[4], titleSlice: 'SD', color: 'bg-[#EBEBEB] border-[#8E8E90] text-[#8E8E90]' },
];

const sample = [
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'in-house',
        status: 'pending',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'stopping',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'stopped',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
    {
        createdAt: '04-14-2025 14:16:40',
        instanceId: 'i-01e1ec0fdcad64db2',
        instanceName: '10.0.10.99.test.encoder.ec2.seoul',
        serverType: 'cloud',
        status: 'running',
        updatedAt: '06-26-2025 08:08:37',
    },
];
