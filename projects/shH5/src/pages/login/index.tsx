import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { Toast } from 'react-vant';
import './index.less';
import { getWechatInfo, verrificationCode, wechatLogin } from './service';
import { redirectLogin } from '@/base/common';
const Login = () => {
  const [userPhone, setMobile] = useState('');
  const [verificationCode, setSmsCode] = useState('');
  const {} = useModel('user');
  const [isGetCode, setIsGetCode] = useState(false);
  const [time, setTime] = useState(60);
  // @ts-ignore
  const { login, wechatLoginSetData } = useModel('user');

  const [openId, setOpenId] = useState('');

  useEffect(() => {
    //微信登录
    if (sessionStorage.getItem('navigatorType') === 'wechat') {
      if (history.location.query?.openId) {
        setOpenId(history.location.query.openId as string);
      }
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
              setOpenId(res.data.openId);
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
    return () => {};
  }, []);

  const regPhone =
    /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|17[35678]|18[0-9]|14[57]|19[2])[0-9]{8}$/;
  const submit = () => {
    if (!userPhone) {
      Toast.info('请输入手机号码');
      return;
    }

    // if(!regPhone.test(userPhone)) {
    //   Toast.info('手机号码格式不正确');
    //   return;
    // }

    if (!verificationCode) {
      Toast.info('请输入短信验证码');
      return;
    }

    // setLoginFormData({
    //   userPhone,
    //   verificationCode,
    // });

    login({
      userPhone,
      verificationCode,
      openId,
    }).then(() => {
      history.push({
        pathname: '/selectUserType',
        query: {
          flag: '1',
        },
      });
    });
  };

  const getSms = () => {
    if (!userPhone) {
      Toast.info('请输入手机号码');
      return;
    }

    if (!regPhone.test(userPhone)) {
      Toast.info('手机号码格式不正确');
      return;
    }

    setIsGetCode(true);
  };

  // 获取验证码
  async function getVerrificationCode() {
    const { code, message } = await verrificationCode(userPhone);
    if (+code === 1000) {
      Toast.success('验证码发送成功');
    } else {
      Toast.info(message as string);
      setIsGetCode(false);
      clearInterval(timer);
    }
  }

  const timeDate: number = 60;
  let timer: any;
  let tim: number = timeDate;
  useEffect(() => {
    if (isGetCode) {
      getVerrificationCode();
      tim = timeDate;
      setTime(tim);
      timer = setInterval(() => {
        tim--;
        setTime(tim);
        if (tim <= 0) {
          clearInterval(timer);
          setIsGetCode(false);
        }
      }, 1000);
    }
  }, [isGetCode]);

  return (
    <div className={'login'}>
      <div className={'topBox'}>
        <div className="logoBox">
          <img src={require('../../assets/image/logo.png')} alt="" />
        </div>
        <div className="loginTitle">
          <span>请输入手机号码，验证您的身份信息</span>
        </div>
        <div className="loginForm">
          <div className="formItem">
            <div className={'itemIcon'}>
              <img src={require('@/assets/image/mobile.png')} alt="" />
            </div>
            <input
              type="number"
              value={userPhone}
              onChange={(e) => {
                setMobile(e.target.value);
              }}
              placeholder={'输入手机号码'}
            />
          </div>

          <div className="formItem">
            <div className={'itemIcon'}>
              <img src={require('@/assets/image/key.png')} alt="" />
            </div>
            <input
              type="number"
              value={verificationCode}
              onChange={(e) => {
                setSmsCode(e.target.value.trim());
              }}
              placeholder={'输入验证码'}
            />
          </div>
        </div>
        <div className="smsBox">
          <div className={'smsBtn'} onClick={() => getSms()}>
            <span>{isGetCode ? time + 's' : '获取验证码'}</span>
          </div>
        </div>
        <div className={'btnBox'}>
          <button onClick={() => submit()}>登录</button>
        </div>
      </div>

      <div className="footerBox">
        <p>本产品由中国民生银行提供金融支持</p>
        <p>copyright ©2022 成都在线支点教育科技出品</p>
      </div>
    </div>
  );
};

export default function () {
  return (
    <div>
      <Login />
    </div>
  );
}
