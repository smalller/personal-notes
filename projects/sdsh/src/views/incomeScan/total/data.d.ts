export interface QueryObj {
    projectName?: string;
    startTime?: string;
    endTime?: string;
    codeStatus?: string;
}



export interface QueryItemParams {
    Mid?: number;
    endTime?: string;
    startTime?: string;
}

export interface TableListItem {
    chargeRate: string;
    contactsName: string;
    contactsPhone: string;
    createTime: number;
    detailAddress: string;
    mcName: string;
    merchantId: number;
    proceduresBalance: string;
    totalBalance: string;
}

export interface BasicDetailInfo {
    chargeRate: string;
    contactsName: string;
    contactsPhone: string;
    mcName: string;
    refundMoney: string;
    serviceRate: string;
    subsidyRate: string;
    totalMoney: string;
}

