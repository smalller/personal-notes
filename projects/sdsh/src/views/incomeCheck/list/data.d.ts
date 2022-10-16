export interface QueryObj {
    createUserId?: string;
    startTime?: string;
    endTime?: string;
    projectName?: string;
}

export interface TableListItem {
    beginTime: string;
    endTime: string;
    id: number;
    projectName: string;
    status: string;
    type: number;
    userName: string;
}

export interface StatusParams {
    id: number;
    status: string;
    type: number;
}
