export interface QueryObj {
    mName: string;
    contactName: string;
    contactPhone: string;
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
    contactName: string;
    contactPhone: string;
    mName: string;
    refundMoney: string;
    serviceRate: string;
    subsidyRate: string;
    totalMoney: string;
}

export interface MerchantDetailTableListItem {

}