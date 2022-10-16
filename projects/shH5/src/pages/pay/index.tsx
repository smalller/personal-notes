import './index.less';
import { history } from 'umi';
import { Popup, Picker, Toast } from 'react-vant';
import { Arrow } from '@react-vant/icons';
import { useEffect, useState } from 'react';
import {
  splitSonOrder,
  splitSonOrderExist,
  getAmountQuantity,
} from './service';

interface QueryData {
  projectId: string;
  studentName: string;
  className: string;
  projectName: string;
  money: string;
}

interface Prop {
  queryData: QueryData;
}

function OrderItem(props: any) {
  const { goToPay } = props;
  return (
    <li>
      <span>{props.orderSonNumber}</span>
      <span>{props.payMoney}</span>
      <button onClick={() => goToPay(props?.payMoney, props?.orderSonNumber)}>
        {props.payStatusStr}
      </button>
    </li>
  );
}

function handleResUpdate() {
  const userType = sessionStorage.getItem('userType');
  if (userType === 'parent') {
    history.push({
      pathname: '/parent/payDetails',
      query: history.location.query,
    });
  } else {
    history.push({
      pathname: '/teacher/payDetails',
      query: history.location.query,
    });
  }
}

const Pay = () => {
  const classId = history.location.query?.classId as string;
  const gradeId = history.location.query?.gradeId as string;
  const projectId = history.location.query?.projectId as string;
  const studentId = history.location.query?.studentId as string;

  const [tobePayObj, setTobePayObj] = useState<any>();
  const [splitMon, setSplitMon] = useState<string | number>(); //拆分金额
  const [visible, setVisible] = useState(false);
  const [payMoneyColumns, setPayMoneyColumns] = useState<string[]>([]); // 可拆分金额列表
  const [projectType, setProjectType] = useState<string>(''); // 交易类型

  // 查询存在子订单
  async function handleSplitSonOrderExist() {
    const { code, data } = await splitSonOrderExist({
      classId,
      gradeId,
      projectId,
      studentId,
    });
    if (+code === 1000) {
      setTobePayObj(data);
      setProjectType(data.splitSonOrderVo[0].projectType);
      if (parseInt(data.splitMoney) === -1) {
        setSplitMon('不拆分');
      } else {
        setSplitMon(data.splitMoney);
      }
    }
  }

  // 获取拆分金额
  async function hanldeGetAmountQuantity() {
    const { code, data } = await getAmountQuantity();
    if (+code === 1000) {
      let newData = data;
      newData.unshift('不拆分');
      setPayMoneyColumns(newData);
    }
  }

  // 拆分子订单
  async function handleSplitSonOrder(
    projectId: string,
    projectType: string,
    splitMoney: string | number,
    studentId: string,
  ) {
    const { code } = await splitSonOrder({
      projectId,
      projectType,
      splitMoney,
      studentId,
    });
    if (+code === 1000) {
      handleSplitSonOrderExist();
    }
  }

  // 选择拆分订单金额
  function handleChoose(value: string | number) {
    handleSplitSonOrder(
      projectId,
      projectType,
      value === '不拆分' ? '-1' : value,
      studentId,
    );
    if (+value > tobePayObj?.payTotalMoney) {
      Toast.info('拆分金额不能大于支付金额');
    }
    setVisible(false);
  }

  // 去支付
  function goToPay(payTotalMoney: string, splitOrderNumber: string) {
    history.push({
      pathname: '/payType',
      query: {
        projectName: tobePayObj?.projectName,
        className: tobePayObj?.className,
        studentName: tobePayObj?.studentName,
        payTotalMoney,
        projectId,
        projectType,
        splitOrderNumber,
      },
    });
  }

  useEffect(() => {
    handleSplitSonOrderExist();
    hanldeGetAmountQuantity();
  }, []);

  return (
    <div className={'pay'}>
      <div className="content">
        <div className="paymentHead">
          <img src={require('@/assets/image/paymentList.png')} alt="" />
        </div>
        <div className="head">
          <div>
            <span>姓名：</span>
            <span>{tobePayObj?.studentName}</span>
          </div>
          <div>
            <span>班级：</span>
            <span>{tobePayObj?.className}</span>
          </div>
        </div>
        <div className="payInfoBox">
          <div className="infoItem">
            <div className="left">项目名称：</div>
            <div className="right">
              <span className={'value'}>{tobePayObj?.projectName}</span>
            </div>
          </div>
          <div className="infoItem">
            <div className="left">支付金额：</div>
            <div className="right">
              <span className={'value'}>{tobePayObj?.payTotalMoney}</span>
            </div>
          </div>
          <div className="infoItem">
            <div className="left">分多笔支付：</div>
            <div className="right" onClick={() => setVisible(true)}>
              <span
                style={{
                  marginRight: '10px',
                }}
              >
                {splitMon}
              </span>
              <Arrow />
            </div>
            <Popup
              position="bottom"
              visible={visible}
              onClose={() => {
                setVisible(false);
              }}
            >
              <Picker
                title="拆分金额（元）"
                columns={payMoneyColumns}
                onCancel={() => setVisible(false)}
                onConfirm={(res: string | number) => {
                  handleChoose(res);
                }}
              />
            </Popup>
          </div>
        </div>
        {splitMon !== '不拆分' && (
          <div className="orderList">
            <div className="topHead">
              <span>子订单号</span>
              <span>金额</span>
              <span>操作</span>
            </div>
            <div className="listBox">
              <ul>
                {tobePayObj?.splitSonOrderVo.map((item: any) => (
                  <OrderItem
                    key={item.orderSonNumber}
                    {...item}
                    goToPay={(
                      payTotalMoney: string,
                      splitOrderNumber: string,
                    ) => {
                      goToPay(payTotalMoney, splitOrderNumber);
                    }}
                  ></OrderItem>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="btnBox">
        <div
          className="btn left"
          onClick={() => {
            handleResUpdate();
          }}
        >
          返回修改
        </div>
        {splitMon === '不拆分' && (
          <div
            className="btn right"
            onClick={() => {
              goToPay(
                tobePayObj?.payTotalMoney,
                tobePayObj?.splitSonOrderVo[0].orderSonNumber,
              );
            }}
          >
            提交订单
          </div>
        )}
      </div>
    </div>
  );
};

export default () => {
  document.title = '订单确认';
  return <Pay />;
};
