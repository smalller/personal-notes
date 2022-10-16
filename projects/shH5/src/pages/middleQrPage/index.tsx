// http://192.168.1.221:8000/#/middleQrPage?projectId=1
// http://192.168.1.221:8000/#/middleQrPage?projectId=2
// https://h5sd.jinshuy.com/#/middleQrPage?projectId=1

import './index.less';
import { Field, Toast } from 'react-vant';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { goPay, chargeCodeDetail } from './service';
import { PayBox } from './PayBox';
import { checkMoney } from '@/utils/index';

interface PayItemList {
  checked: string;
  itemChargeMoney: string;
  itemChargeType: string;
  itemId: number;
  itemName: string;
  itemRequired: string;
  status?: boolean;
}

const PayDetails = () => {
  const projectId = history.location.query?.projectId as string;
  const [detailData, setDetailData] = useState<any>();

  const [num, setNum] = useState(0);
  const [sendPayList, setSendPayList] = useState<PayItemList[]>([]);
  const [registerList, setRegisterList] = useState<any[]>() as any;

  async function getChargeCodeDetail(codeId: string) {
    if (!codeId) {
      Toast.info('无项目id');
      return;
    }
    const { code, data } = await chargeCodeDetail(codeId);
    if (+code === 1000) {
      setDetailData(data);
      setRegisterList(data.registerList);
    }
  }

  useEffect(() => {
    getChargeCodeDetail(projectId);
  }, []);

  // 去支付
  async function handleGoPay() {
    if (+detailData.existType === 1) {
      const flag = checkMoney(sendPayList[0]?.itemChargeMoney);
      if (!flag) {
        Toast.info('请输入正确的金额');
        return;
      }
    }

    if ((registerList?.length as number) > 0) {
      for (let i = 0; i < registerList?.length; i++) {
        if (!registerList[i].registerValue) {
          Toast.info('请填写登记信息');
          return;
        }
      }
    }

    const { code, data, message } = await goPay({
      projectId,
      projectType: detailData.projectType,
      projectItems: sendPayList,
      registerList,
      remark: detailData.remark,
    });
    if (+code === 1000) {
      const newRegisterList = registerList?.map((i: any) => {
        return {
          registerName: i.registerName,
          registerValue: i.registerValue,
        };
      });
      history.push({
        pathname: '/parent/qrSurePay',
        query: {
          orderSonNumber: data.splitSonOrderVo[0].orderSonNumber,
          projectId,
          projectType: detailData.projectType,
          projectName: detailData.chargeProjectName,
          payTotalMoney: data.payTotalMoney,
          registerList: JSON.stringify(newRegisterList),
        },
      });
    } else {
      Toast.info(message as string);
    }
  }

  // 修改登记信息
  function setRegInfo(index: number, val: string | number) {
    const newList = JSON.parse(JSON.stringify(registerList));
    newList[index].registerValue = val;
    setRegisterList(newList);
  }

  return (
    <div className={'payDetailsWrap'}>
      <div className={'payDetailsBox'}>
        <div className={'payHead'}>
          <div className={'title'}>
            <img src={require('@/assets/image/scan.png')} alt="" />
            {detailData?.chargeProjectName}
          </div>
        </div>
        <PayBox
          detailData={detailData}
          setNum={setNum}
          setSendPayList={setSendPayList}
        ></PayBox>
      </div>
      <div className="setInfo">
        <div className={'payHead'}>
          <div className={'title'}>登记信息</div>
        </div>
        <div>
          {registerList?.map((item: any, index: number) => (
            <div className="fieldBox" key={item.registerId}>
              <Field
                labelWidth="6.5rem"
                type={+item.registerType === 1 ? 'text' : 'number'}
                value={item.registerValue}
                label={item.registerName}
                onChange={(val: string | number) => {
                  setRegInfo(index, val);
                }}
                placeholder={item.registerRemark}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={'payBtnBox'}>
        <div className={'left'}>
          <span>合计: </span>
          <span>￥{num}</span>
        </div>
        <div className={'right'} onClick={handleGoPay}>
          去支付
        </div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '扫码缴费';
  const { setCancelCheckPath } = useModel('user');
  setCancelCheckPath(history.location.pathname); //允许游客访问页面
  const navigatorType = sessionStorage.getItem('navigatorType');
  // TODO只允许支付宝/微信打开
  // if (navigatorType !== 'wechat' && navigatorType !== 'alipay') {
  //   history.push({
  //     pathname: '/accessFor',
  //   });
  // }
  return <PayDetails />;
};
