import { useState, useCallback, useEffect } from 'react';
import request from '@/base/request';
import { Toast } from 'react-vant';
import { history } from 'umi';
import wx from 'weixin-js-sdk';

// 创建支付订单
export const pay = (data: any) =>
  request('/pay/pay', {
    method: 'post',
    data,
  });

export default function handlePay() {
  // 创建微信支付订单
  const creatWXOrder = useCallback(
    async (
      payType: string | number,
      projectId: string,
      projectType: string,
      splitOrderNumber: string,
      openId: string,
    ) => {
      let dataObj: any = {
        payType,
        projectId,
        projectType,
        splitOrderNumber,
        openId,
      };
      if (+projectType === 1) {
        dataObj.uuid = sessionStorage.getItem('uuid');
      }
      const { code, data, message } = await pay(dataObj);
      if (+code === 1000) {
        console.log('创建的订单信息', data);
        const {
          sdk_appid,
          sdk_timestamp,
          sdk_noncestr,
          sdk_signtype,
          sdk_package,
          sdk_paysign,
        } = data;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: sdk_appid, // 必填，公众号的唯一标识
          timestamp: sdk_timestamp, // 必填，生成签名的时间戳
          nonceStr: sdk_noncestr, // 必填，生成签名的随机串
          signature: sdk_signtype, // 必填，签名
          jsApiList: ['chooseWXPay'], // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
          wx.chooseWXPay({
            timestamp: sdk_timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: sdk_noncestr, // 支付签名随机串，不长于 32 位
            package: sdk_package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: sdk_signtype, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
            paySign: sdk_paysign, // 支付签名
            success: function (res: any) {
              alert(12333);
              // 支付成功后的回调函数
              console.log('支付成功后的回调函数', res);
            },
            fail: function (err: any) {
              // 支付失败后的回调函数
              console.log('支付失败后的回调函数', err);
            },
            cancel: function () {
              Toast.info('取消支付');
              history.push('/payType');
            },
          });
        });
      } else {
        Toast.info(message as string);
        history.push('/payType');
      }
    },
    [],
  );

  return {
    creatWXOrder,
  };
}
