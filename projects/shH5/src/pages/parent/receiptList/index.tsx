import './index.less';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { receiptList } from './service';
import Normal from '@/components/normal';

interface ListDetails {
  mName: string;
  payTime: number;
  money: string;
  orderId: number;
}

interface ListItem {
  monthTime: string;
  h5ParentReceiptVos: ListDetails[];
}

const TransactionItem = (props: ListDetails) => {
  return (
    <div
      className={'transactionDetailsItem'}
      onClick={() => {
        history.push({
          pathname: '/parent/receipDetail',
          query: {
            orderId: String(props.orderId),
          },
        });
      }}
    >
      <div className={'left'}>
        <div className={'name'}>{props.mName}</div>
        <div className={'time'}>
          {dayjs(props.payTime).format('YYYY/MM/DD HH:mm')}
        </div>
      </div>
      <div className={'right'}>
        <span>{props.money}</span>
        <img src={require('@/assets/image/right.png')} alt="" />
      </div>
    </div>
  );
};

const TransactionBox = (props: ListItem) => {
  return (
    <div className={'transactionItem'}>
      <div className={'dateBox'}>
        {dayjs(props.monthTime).format('YYYY年MM月')}
      </div>
      <div className={'detailsList'}>
        {props.h5ParentReceiptVos.map((item) => (
          <TransactionItem
            orderId={item.orderId}
            key={item.orderId}
            money={item.money}
            mName={item.mName}
            payTime={item.payTime}
          />
        ))}
      </div>
    </div>
  );
};

interface TransactionListProp {
  list: ListItem[];
}
const TransactionList = (props: TransactionListProp) => {
  return (
    <div className={'transactionList'}>
      <div className={'content'}>
        {props.list.map((item, index) => (
          <TransactionBox
            key={index}
            monthTime={item.monthTime}
            h5ParentReceiptVos={item.h5ParentReceiptVos}
          />
        ))}
      </div>
      <div className="btnBox">
        <div
          className="btn"
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
  document.title = '电子收据';
  const [list, setList] = useState<ListItem[]>([]);
  let [pageNum, setPageNum] = useState<number>(1);
  let totalNum: number = 0;

  useEffect(() => {
    getPayHistory();
    window.onscroll = () => {
      const clientHeight = document.documentElement.clientHeight; // 网页可视区域高度
      const scrollTop = document.documentElement.scrollTop; // 滚动条垂直位置
      const scrollHeight = document.documentElement.scrollHeight; // 网页总高度

      if (clientHeight + scrollTop >= scrollHeight) {
        if (list.length < totalNum) {
          console.log(list.length, totalNum);

          setPageNum(pageNum++);
          getPayHistory();
          console.log('触底了');
        }
      }
    };
  }, []);

  async function getPayHistory() {
    const { code, data } = await receiptList({
      pageNum,
      pageSize: 20,
    });
    if (+code === 1000) {
      setList((list) => {
        return (list = list.concat(data.list));
      });
      totalNum = data.total;
    }
  }

  if (list.length === 0) {
    return <Normal title={'暂无信息'} />;
  } else {
    return <TransactionList list={list} />;
  }
};
