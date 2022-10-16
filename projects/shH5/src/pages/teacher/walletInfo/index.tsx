import './index.less';
import { history } from 'umi';

interface GetPayInfo {
  type: string;
  data: string;
  amount: number;
  num: number;
  anum: number;
  bnum: number;
  remarks: string;
}

interface SendPayInfo {
  type: string;
  data: string;
  amount: number;
  num: number;
  anum: number;
  bnum: number;
  remarks: string;
}

const GetPayInfo = function () {
  return (
    <div className={'info'}>
      <div className={'infoItem'}>
        <div>收款账户</div>
        <div className={'type'}>微信收款钱包</div>
      </div>
      <div className={'infoItem'}>
        <div>操作时间</div>
        <div>2022/3/16 16:56</div>
      </div>
      <div className={'infoItem'}>
        <div>收款总额</div>
        <div>+1400.00</div>
      </div>
      <div className={'infoItem'}>
        <div>退款总额</div>
        <div>-0.00</div>
      </div>
      <div className={'infoItem'}>
        <div>手续费</div>
        <div>-0.00</div>
      </div>
      <div className={'infoItem'}>
        <div>结算入账金额</div>
        <div>+1400.00</div>
      </div>
      <div className={'infoItem'}>
        <div>备注</div>
        <div>无</div>
      </div>
    </div>
  );
};

const SendPayInfo = function () {
  return (
    <div className={'info'}>
      <div className={'infoItem'}>
        <div>出款账户</div>
        <div className={'type'}>微信收款钱包</div>
      </div>
      <div className={'infoItem'}>
        <div>操作时间</div>
        <div>2022/3/16 16:56</div>
      </div>
      <div className={'infoItem'}>
        <div>提现金额</div>
        <div>+1400.00</div>
      </div>
      <div className={'infoItem'}>
        <div>备注</div>
        <div>无</div>
      </div>
      <div className={'infoItem'}>
        <div>提现账号</div>
        <div>农行0254</div>
      </div>
      <div className={'infoItem'}>
        <div>提现户名</div>
        <div>四川省成都区起源行幼儿园</div>
      </div>
      <div className={'infoItem'}>
        <div>状态</div>
        <div>提现成功</div>
      </div>
    </div>
  );
};

const WalletInfo = function () {
  return (
    <div className={'walletInfo'}>
      <div className={'content'}>
        <div className={'head'}>
          <span className={'type'}>收入</span>
          <span className={'amount'}>+1400.00</span>
          <span className={'status'}>提现成功</span>
        </div>
        <SendPayInfo />
      </div>
    </div>
  );
};

export default () => {
  document.title = '钱包详情';
  console.log(history.location.query);
  return <WalletInfo />;
};
