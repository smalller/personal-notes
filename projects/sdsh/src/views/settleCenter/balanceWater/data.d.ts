export interface QueryObj {
    projectName: string
    paymentNo: string
    itemMoneyBegin: string
    itemMoneyEnd: string
    payTimeBegin: string
    payTimeEnd: string
    payType: string | number
    projectType: string | number
    payStatus: string | number
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