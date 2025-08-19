import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { data, useRouteLoaderData } from 'react-router';

import { ServerInstance, ServerStatusResponse } from '@/api/models/serverStatus.ts';
import { fetchServerStatus } from '@/api/services/serverStatus.ts';

import { ServerStatusList } from '@/routes/serverStatus/List.tsx';

import { ServerStatusType } from '@/types/enum.ts';

import { StatusBox, StatusBoxProps } from '@/components';
import { commonLoader } from '@/middleware/auth.server.ts';
import { ROOT_ROUTE_ID } from '@/root.tsx';

export const loader = commonLoader(async ({ userEncryptKey, cookie }: { userEncryptKey: string; cookie?: string }) => {
    return data({ userEncryptKey }, cookie ? { headers: { 'Set-Cookie': cookie } } : undefined);
});

const ServerStatusPage = () => {
    const { t } = useTranslation();
    const { userEncryptKey } = useRouteLoaderData(ROOT_ROUTE_ID);
    const [serverStatusData, setServerStatusData] = useState<ServerStatusResponse | null>(null);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [filteredData, setFilteredData] = useState<ServerInstance[]>([]);

    useEffect(() => {
        if (!userEncryptKey) return;

        fetchServerStatus(userEncryptKey).then((res) => {
            setServerStatusData(res);
        });
    }, [userEncryptKey]);

    useEffect(() => {
        if (!serverStatusData) return;

        setFilteredData(
            selectedStatus === 0
                ? serverStatusData.data
                : serverStatusData.data?.filter((item) => item.status === StatusSetting[selectedStatus].type),
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
                                ? serverStatusData?.data.length
                                : serverStatusData?.data.filter((item) => item.status.toLowerCase() === box.type).length
                        }
                        selected={selectedStatus === index}
                        onClick={() => setSelectedStatus(index)}
                        key={`status-box-${index}`}
                    />
                ))}
            </div>
            <div className="border-grey-20 relative h-full overflow-auto rounded-[4px] border bg-white">
                {(!filteredData || filteredData.length === 0) && (
                    <div className="text-grey-50 flex h-full items-center justify-center">
                        {t('presetList.emptyList')}
                    </div>
                )}
                <ServerStatusList data={filteredData} />
            </div>
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
