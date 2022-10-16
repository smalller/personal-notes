export interface QueryObj {
    mName: string;
    contactName: string;
    contactPhone: string;
    status: string | number;
    createTime: string | Date
}

export interface TableListItem {
    chargeRate: string;
    contactsName: string;
    contactsPhone: string;
    createTime: number;
    detailAddress: string;
    mName: string;
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

export interface MerchantDetailTableListItem {

}