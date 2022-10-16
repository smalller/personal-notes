import request from "@/utils/request";
import { AxiosPromise } from "axios";

export interface MerchantApplyParams {
  mName: string;
  contactPhone: string;
  contactAddr: string;
  contactEmail: string;
  businessLicenseImg: string;
  mPassword: string;
}

/**
 * 提交开通商户申请
 * @param params
 */
export const merchantApply = (params: MerchantApplyParams): AxiosPromise =>
  request({
    url: "/pay-mg/merchant/merchantApply",
    baseURL: "https://jsypay.test.jinshuy.com",
    method: "POST",
    data: params,
  });
