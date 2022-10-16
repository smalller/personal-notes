import './index.less';
import { Radio, Cell, Toast } from 'react-vant';
import { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { getAuthStatus, getWXOpenId } from './service';
import micell from 'micell';
import qs from 'qs';
interface WXPayDataObj {
  ins_cd: string;
  mchnt_cd: string;
  uuid?: string;
  userId?: string;
}
declare const my: any; //预注册支付宝小程序内置API
const PayTypeBox = (props: any) => {
  const [payType, setPayType] = useState('');
  const {
    projectId,
    projectName,
    projectType,
    splitOrderNumber,
    payTotalMoney,
  } = props;
  const registerList = history.location.query?.registerList as string; // 为扫码支付时，展示登记信息
  const [authCodeInfo, setAuthCodeInfo] = useState<any>(); //授权码信息
  sessionStorage.setItem('uuid', micell.uuid()); // 存储一个固定的uuid
  const { creatWXOrder } = useModel('pay');
  const navigatorType = sessionStorage.getItem('navigatorType'); //支付环境

  useEffect(() => {
    if (navigatorType === 'alipay') {
      setPayType('1');
    }
    if (navigatorType === 'wechat') {
      setPayType('2');
    }
  }, []);

  // 支付
  async function handlePay() {
    if (!payType) {
      Toast.info('请选择支付方式');
      return;
    }
    const payInfo = {
      payType,
      projectId,
      projectName,
      projectType,
      splitOrderNumber,
      payTotalMoney,
    };
    sessionStorage.setItem('payInfo', JSON.stringify(payInfo));

    // 支付宝
    if (+payType === 1) {
      handleGetAliAuth();
    }

    // 微信
    if (+payType === 2) {
      handleGetAuthStatus();
    }
  }

  // 获取微信是否存在授权码
  async function handleGetAuthStatus() {
    const { code, data } = await getAuthStatus(payType);
    if (+code === 1000) {
      console.log('已授权信息', data);
      setAuthCodeInfo(data);
      // 已授权就直接创建订单并支付
      if (+payType === 2) {
        creatWXOrder(
          payType,
          projectId,
          projectType,
          splitOrderNumber,
          data?.openId,
        );
      }
    } else {
      // 未授权
      handleGetWXOpenId();
    }
  }

  // 获取微信授权
  async function handleGetWXOpenId() {
    let dataObj: WXPayDataObj = {
      ins_cd: '08A9999999',
      mchnt_cd: '0002900F0370542',
    };

    // 扫码支付/未登录情况
    if (+projectType === 1) {
      dataObj.uuid = sessionStorage.getItem('uuid') as string;
    }

    // 名单收费/已登录情况
    if (+projectType === 2) {
      dataObj.userId = sessionStorage.getItem('userId') as string;
    }

    const { code, data } = await getWXOpenId(dataObj);
    if (+code === 1000) {
      location.href = data;
    } else {
      Toast.info('支付失败');
      return;
    }
  }

  // 调起支付宝
  async function handleGetAliAuth() {
    const str = qs.stringify({
      status: +projectType === 1 ? 0 : 1, // 登录就传1，未登录就传0
      subject: projectName,
      total_amount: payTotalMoney,
      payType,
      projectId,
      projectType,
      splitOrderNumber,
    });
    my.getEnv(function (res: any) {
      if (res.miniprogram) {
        console.log(6666);

        my.postMessage({
          name: 'pay',
          data: {
            status: +projectType === 1 ? 0 : 1, // 登录就传1，未登录就传0
            subject: projectName,
            total_amount: payTotalMoney,
            payType,
            projectId,
            projectType,
            splitOrderNumber,
          },
        });
      } else {
        window.open(
          `alipays://platformapi/startapp?appId=2021003130656323&page=pages/index/index&query=${encodeURIComponent(
            str,
          )}`,
        );
      }
    });
  }

  return (
    <div className={'payTypeBox'}>
      <div className="content">
        <div className="head">
          <div className={'titleBox'}>
            <span>{props?.projectName}</span>
            {/* TODO由于回显参数是本地存储，所有从第三方支付页面跳回来就回显不出来了 */}
            {/* {registerList ? (
              JSON.parse(registerList)?.map((i: any, index: number) => (
                <span key={index}>
                  {i.registerName} - {i.registerValue}
                </span>
              ))
            ) : (
              <span>
                {props?.className} - {props?.studentName}
              </span>
            )} */}
          </div>
          <div className={'numBox'}>
            <span>支付金额：</span>
            <span> ￥{props?.payTotalMoney}</span>
          </div>
        </div>
        <div className="selectPayType">
          <div className={'more'}>支付方式</div>
          <Radio.Group
            value={payType}
            checkedColor={'#62E24D'}
            iconSize={'20px'}
          >
            <Cell.Group border={false}>
              {navigatorType === 'alipay' && (
                <Cell
                  border={false}
                  clickable
                  title=""
                  icon={
                    <div className={'payItem'}>
                      <img src={require('@/assets/image/aliPay.png')} alt="" />
                      支付宝支付
                    </div>
                  }
                  onClick={() => setPayType('1')}
                  rightIcon={<Radio name="1" />}
                />
              )}
              {navigatorType === 'wechat' && (
                <Cell
                  border={false}
                  clickable
                  title=""
                  icon={
                    <div className={'payItem'}>
                      <img
                        src={require('@/assets/image/wechatPay.png')}
                        alt=""
                      />
                      微信支付
                    </div>
                  }
                  onClick={() => setPayType('2')}
                  rightIcon={<Radio name="2" />}
                />
              )}
              {navigatorType === 'h5' && (
                <div>请在微信中打开本页面并完成支付</div>
              )}
            </Cell.Group>
          </Radio.Group>
        </div>
      </div>
      <div className="btnBox">
        <div
          className="btn"
          onClick={() => handlePay()}
        >{`确认支付 ${props?.payTotalMoney} 元`}</div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '收银台';
  const { setCancelCheckPath } = useModel('user');
  setCancelCheckPath(history.location.pathname); //允许游客访问页面

  let queryObj = null;
  if (history.location.query?.projectId) {
    queryObj = history.location.query;
  } else {
    queryObj = JSON.parse(sessionStorage.getItem('payInfo') as string);
  }
  console.log('待支付界面展示信息', queryObj);
  return <PayTypeBox {...queryObj} />;
};
