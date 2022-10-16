export interface QueryObj {
    mcName: string;
    contactsName: string;
    contactsPhone: string;
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

export interface PayInfo {
    itemName: string;
    orderNumber: string;
    payStatus: string;
    payTime: string;
    payType: string;
    projectName: string;
    totalMoney: number;
}
