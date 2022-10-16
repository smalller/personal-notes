import {getNameList} from "@/views/incomeList/list/api";

export interface QueryParams {
    mncStatus?: string;
    beginTime?: string;
    endTime?: string;
    projectName?: string;
    status?: string;
}

export interface FunChargeRateBos {
    id: string;
    rate: string;
}

export interface TableListItem {
    beginTime: string;
    endTime: string;
    notInvolved: number;
    id: number;
    paid: number;
    projectName: string;
    schedule: string;
    status: string;
    totalPeople: number;
    unpaid: number;
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
