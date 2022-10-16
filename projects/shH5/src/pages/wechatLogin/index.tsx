import { useEffect, useState } from 'react';
import { history } from '@@/core/history';
import { getWechatInfo, wechatLogin } from '@/pages/login/service';
import { useModel } from '@@/plugin-model/useModel';
import { redirectLogin } from '@/base/common';

const WechatLogin = () => {
  // @ts-ignore
  const { wechatLoginSetData } = useModel('user');

  useEffect(() => {
    //微信登录
    if (sessionStorage.getItem('navigatorType') === 'wechat') {
      if (history.location.query?.code) {
        wechatLogin(history.location.query.code as string).then((res) => {
          if (+res.code === 1000) {
            if (res.data?.token && !res.data?.openId) {
              wechatLoginSetData(res.data).then(() => {
                history.push({
                  pathname: '/selectUserType',
                  query: {
                    flag: '1',
                  },
                });
              });
            } else {
              redirectLogin({ openId: res.data.openId });
            }
          }
          if (+res.code === 1016) {
            location.href = location.origin + location.pathname;
          }
        });
      } else {
        getWechatInfo().then((res) => {
          if (+res.code === 1000) {
            location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.data}&redirect_uri=${location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
          }
        });
      }
    }

    document.title = '登录';
  }, []);

  return <></>;
};

export default () => {
  return <WechatLogin />;
};
