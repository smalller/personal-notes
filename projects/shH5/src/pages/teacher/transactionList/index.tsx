import './index.less';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { payHistory } from './service';

interface ListDetails {
  projectName: string;
  payTime: string;
  payMoney: string;
  orderId: string;
}

interface ListItem {
  payTime: string;
  list: ListDetails[];
}

const TransactionItem = (props: ListDetails) => {
  return (
    <div
      className={'transactionDetailsItem'}
      onClick={() => {
        history.push({
          pathname: '/teacher/transactionDetails',
          query: {
            orderId: props.orderId,
          },
        });
      }}
    >
      <div className={'left'}>
        <div className={'name'}>{props.projectName}</div>
        <div className={'time'}>
          {dayjs(props.payTime).format('YYYY/MM/DD HH:mm')}
        </div>
      </div>
      <div className={'right'}>
        <span>{props.payMoney}</span>
        <img src={require('@/assets/image/right.png')} alt="" />
      </div>
    </div>
  );
};

const TransactionBox = (props: ListItem) => {
  return (
    <div className={'transactionItem'}>
      <div className={'dateBox'}>
        {dayjs(props.payTime).format('YYYY年MM月')}
      </div>
      <div className={'detailsList'}>
        {props.list.map((item) => (
          <TransactionItem
            orderId={item.orderId}
            key={item.orderId}
            payMoney={item.payMoney}
            projectName={item.projectName}
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
          <TransactionBox key={index} payTime={item.payTime} list={item.list} />
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
  document.title = '交易记录';
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
    const { code, data } = await payHistory({
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

  return <TransactionList list={list} />;
};
