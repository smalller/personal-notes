import './index.less';
import { history } from 'umi';
import { selectPurseSum } from './service';
import { useState } from 'react';

const WalletHead = function (props: Props) {
  return (
    <div className={'walletHead'}>
      <div className={'box'}>
        <div className={'title'}>可提现余额</div>
        <div className={'num'}>￥ {props.balance}</div>
        <div className={'subTitle'}>（提现金额将在一个工作日内到账）</div>
      </div>
      <div
        className={'itemCell'}
        onClick={() => {
          history.push({
            pathname: '/teacher/walletDetails',
          });
        }}
      >
        <div className={'left'}>
          <img src={require('@/assets/image/wallet/walletInfo.png')} alt="" />
          <span>钱包明细 </span>
        </div>
        <div className={'right'}>
          <img src={require('@/assets/image/right.png')} alt="" />
        </div>
      </div>
    </div>
  );
};

interface Props {
  [key: string]: any;
}

const Wallet = function (props: Props) {
  return (
    <div className={'wallet'}>
      <WalletHead balance={props.balance} />
    </div>
  );
};

export default () => {
  document.title = '钱包';
  const [balance, setBalance] = useState('');
  async function handleSelectPurseSum() {
    const { code, data } = await selectPurseSum();
    if (+code === 1000) {
      setBalance(data);
    }
  }
  handleSelectPurseSum();
  return <Wallet balance={balance} />;
};
