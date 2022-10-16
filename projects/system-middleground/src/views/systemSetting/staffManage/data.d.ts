export interface QueryObj {
    userName: string;
    account: string;
    status: string | number
}

export interface UserItem {
    userName: string;
    account: string;
    password: string | number,
    rePassword: string | number,
    roleList: Array ,

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
    status:number|string,
    id:string|number
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