import './index.less';
import { useState } from 'react';
import dayjs from 'dayjs';
import { history } from 'umi';

interface ListItem {
  type: string;
  num: number;
  date: string;
  source: string;
  id: string;
}
interface PayListItem {
  date: string;
  list: ListItem[];
}

const ListItem = function (props: ListItem) {
  return (
    <div
      className="listItem"
      onClick={() => {
        history.push({
          pathname: '/teacher/walletInfo',
          query: {
            id: props.id,
          },
        });
      }}
    >
      <div className={'left'}>
        <span>{props.type === 'get' ? '收入' : '提现'}</span>
        <span>{props.date}</span>
      </div>
      <div className={'right'}>
        <div>
          <span className={`${props.type === 'get' ? 'plus' : 'send'}`}>
            {props.type === 'get' ? `+${props.num}` : `-${props.num}`}
          </span>
          <span>{props.source}</span>
        </div>
        <img src={require('@/assets/image/right.png')} className="" alt="" />
      </div>
    </div>
  );
};

const PayListItem = function (props: PayListItem) {
  const date = props.date;
  const list = props.list;
  return (
    <div className="payItemBox">
      <div className={'itemTop'}>{dayjs(date).format('YYYY年MM月')}</div>
      <div className={'itemBody'}>
        {list.map((item) => (
          <ListItem
            key={item.id}
            type={item.type}
            date={item.date}
            num={item.num}
            source={item.source}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
};

interface WalletDetails {
  getNum: string;
  getLength: number;
  setNum: string;
  setLength: number;
}

const WalletDetails = function () {
  const [walletDetails] = useState<WalletDetails>({
    getNum: '14000.100',
    getLength: 33,
    setNum: '688.60',
    setLength: 1,
  });

  const list: PayListItem[] = [
    {
      date: '2022/3/3',
      list: [
        {
          type: 'get',
          num: 665,
          source: '微信支付',
          id: '222',
          date: '2022/3/3 14:44:44',
        },
        {
          type: 'send',
          num: 665,
          source: '民生银行',
          id: '1233',
          date: '2022/3/3 14:44:44',
        },
      ],
    },
  ];

  return (
    <div className={'walletDetails'}>
      <div className="head">
        <div className={'item'}>
          <div className={'left'}>
            <span>收入总额： </span>
            <span>￥{walletDetails.getNum}</span>
          </div>
          <div className={'right'}>共{walletDetails.getLength}笔</div>
        </div>
        <div className={'item'}>
          <div className={'left'}>
            <span>收入总额：</span>
            <span>￥{walletDetails.setNum}</span>
          </div>
          <div className={'right'}>共{walletDetails.setLength}笔</div>
        </div>
      </div>
      <div className={'content'}>
        {list.map((item) => (
          <PayListItem key={item.date} date={item.date} list={item.list} />
        ))}
      </div>
      <div className={'btnBox'}>
        <div
          className={'btn'}
          onClick={() => {
            history.goBack();
          }}
        >
          确定
        </div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '钱包明细';
  return <WalletDetails />;
};
