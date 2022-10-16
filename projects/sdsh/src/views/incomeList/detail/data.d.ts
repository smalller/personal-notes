import {FunChargeRateBos} from "@/views/incomeList/list/data";

export interface QueryListParams {
    classId?: string;
    desc?: string;
    startTime?: string;
    endTime?: string;
    gradeId?: string;
    payStatus?: string;
    payType?: string;
    projectName?: string;
    studentName?: string;
    bill?: string;
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

export interface NameProjectItemDtos {
    chargeMoney: number;
    chargeType: string;
    itemName: string;
    required: string;
}

export interface CreateUserPay {
    beginTime: string;
    endTime: string;
    codeType: string;
    projectName: string;
    relationIds: string;
    remark: string;
    status: string;
    nameProjectItemDtos: NameProjectItemDtos[];
    funChargeRateBos: FunChargeRateBos[];
    times?: any[];
    id?: number|string;
}

