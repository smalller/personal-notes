import { Toast } from 'react-vant';
import { history, useModel } from 'umi';
import { useEffect, useState } from 'react';

export default () => {
  const { setCancelCheckPath } = useModel('user');
  setCancelCheckPath(history.location.pathname); //允许游客访问页面

  const payInfo = JSON.parse(sessionStorage.getItem('payInfo') as string);
  console.log('缓存信息', payInfo);

  const resAuthInfo = history.location.query;
  console.log('授权信息', resAuthInfo);

  const { creatWXOrder } = useModel('pay');

  if (payInfo) {
    if (+payInfo.payType === 2) {
      if (resAuthInfo?.openid) {
        // Toast.success('微信授权成功');
        creatWXOrder(
          payInfo.payType,
          payInfo.projectId,
          payInfo.projectType,
          payInfo.splitOrderNumber,
          resAuthInfo?.openid as string,
        );
      } else {
        Toast.info('微信授权失败');
        history.push('/payType');
      }
    }
    // if (+payInfo.payType === 1) {
    //   if (resAuthInfo?.user_id) {
    //     Toast.success('支付宝授权成功');
    //   } else {
    //     Toast.info('支付宝授权失败');
    //     history.push('/payType');
    //   }
    // }
  } else {
    Toast.info('无支付信息，无法完成支付');
    history.push('/payType');
    return;
  }

  return <></>;
};
