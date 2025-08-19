export interface ServerInstance {
    instanceId: string;
    instanceName: string;
    status: string;
    serverType: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServerStatusResponse {
    code: number;
    msg: string;
    data: ServerInstance[];
}
