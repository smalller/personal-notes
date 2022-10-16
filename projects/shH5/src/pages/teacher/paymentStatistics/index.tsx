import './index.less';
import { Circle } from 'react-vant'; //<UnderwayO  />
import { UnderwayO } from '@react-vant/icons';
import { history, useModel } from 'umi';
import { getSelectStatistics, PaymentDetailsStatistics } from './service';
import React, { useEffect, useState } from 'react';

const Normal = () => (
  <div className="paymentNormal">
    <img src={require('@/assets/image/normal.png')} alt="" />
    <span>暂无缴费信息</span>
  </div>
);

interface PaymentList {
  PaymentList: PaymentDetailsStatistics[];
}

const PaymentDetails = (props: PaymentDetailsStatistics) => {
  const num = Number(
    props.orderProgress.substring(0, props.orderProgress.length - 1),
  );
  return (
    <div
      className="paymentItemDetails"
      onClick={() => {
        history.push({
          pathname: '/teacher/paymentDetails',
          query: {
            id: props.id.toString(),
            mcId: props.mcId.toString(),
          },
        });
      }}
    >
      <div className={'paymentHead'}>
        <img src={require('@/assets/image/paymentList.png')} alt="" />
      </div>
      <div className={'paymentTop'}>
        <div className={'left'}>
          <div className={'title'}>{props.projectName}</div>
          <div className={'className'}>{props.className}</div>
        </div>
        <div className={'right'}>
          <Circle
            defaultRate={0}
            rate={num}
            size={80}
            layerColor={'#EBEBEB'}
            color={'#35E17A'}
            fill={'#ffffff'}
            strokeWidth={140}
            strokeLinecap={'square'}
            speed={100}
            text={props.orderProgress}
          />
        </div>
      </div>
      <div className="paymentBottom">
        <div className={'left'}>
          {/*<img src={require('@/assets/image/time.png')} alt=""/>*/}
          <UnderwayO
            color={+props.sumPayStatus === 1 ? '#898989' : '#3775F6'}
            fontSize={'20px'}
          />
          <span
            style={{ color: +props.sumPayStatus === 1 ? '#898989' : '#3775F6' }}
          >
            {+props.sumPayStatus === 1 ? '已结束' : '进行中'}
          </span>
        </div>
        <div className={'right'}>
          <span>已处理：</span>
          <span className={'num'}>{props.orderProgress}</span>
        </div>
        <div className={'circle circleLeft'}></div>
        <div className={'circle circleRight'}></div>
      </div>
    </div>
  );
};

const PaymentList = (props: PaymentList) => {
  return (
    <div className={'paymentList'}>
      {props.PaymentList.map((item) => {
        return (
          <PaymentDetails
            key={item.id}
            className={item.className}
            gradeName={item.gradeName}
            id={item.id}
            mcId={item.mcId}
            orderProgress={item.orderProgress}
            projectName={item.projectName}
            sumPayStatus={item.sumPayStatus}
          />
        );
      })}
    </div>
  );
};

export default () => {
  document.title = '缴费统计';
  const [isReady, setIsReady] = useState(false);
  let [list, setList] = useState<PaymentDetailsStatistics[]>([]);
  let [pageNum, setPageNum] = useState<number>(1);
  let totalNum: number = 0;

  useEffect(() => {
    getSelectStatisticsList();
    window.onscroll = () => {
      const clientHeight = document.documentElement.clientHeight; // 网页可视区域高度
      const scrollTop = document.documentElement.scrollTop; // 滚动条垂直位置
      const scrollHeight = document.documentElement.scrollHeight; // 网页总高度
      if (clientHeight + scrollTop >= scrollHeight) {
        if (list.length < totalNum) {
          setPageNum(pageNum++);
          getSelectStatisticsList();
          console.log('触底了');
        }
      }
    };
  }, []);

  function getSelectStatisticsList() {
    getSelectStatistics({
      pageNum,
      pageSize: 20,
    })
      .then((res) => {
        const { code, data } = res;
        if (+code === 1000) {
          setList((list) => {
            return (list = list.concat(data.list));
          });
          totalNum = data.total;
        }
      })
      .finally(() => {
        setIsReady(true);
      });
  }
  if (list.length > 0) {
    return (
      <div className={'paymentStatistics'}>
        <PaymentList PaymentList={list} />
      </div>
    );
  } else if (isReady) {
    return <Normal />;
  } else {
    return <></>;
  }
};
