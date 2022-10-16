import './index.less';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import { chargeNameListByStudent, splitSonOrderExist } from './service';
import { ClockO } from '@react-vant/icons';
import dayjs from 'dayjs';
import { Toast } from 'react-vant';
import Normal from '@/components/normal';

async function handleSplitSonOrderExist(
  classId: number,
  gradeId: number,
  projectId: number,
  studentId: number,
) {
  const { code } = await splitSonOrderExist({
    classId,
    gradeId,
    projectId,
    studentId,
  });
  let pathname = '';
  if (+code === 1000) {
    pathname = '/pay';
  } else {
    pathname = '/parent/payDetails';
  }
  history.push({
    pathname,
    query: {
      classId: String(classId),
      gradeId: String(gradeId),
      projectId: String(projectId),
      studentId: String(studentId),
      flag: '2',
    },
  });
}

const PaymentDetails = (props: any) => {
  return (
    <div
      className="paymentItemDetails"
      onClick={() => {
        if (+props.payStatus === 1) {
          Toast.info('该订单已完成');
          return;
        }
        handleSplitSonOrderExist(
          props.classId,
          props.gradeId,
          props.projectId,
          props.studentId,
        );
      }}
    >
      <div className="topInfo">
        <div className="top">
          {+props.payStatus !== 1 && <span className="dot"></span>}
          <div className="right">
            <span className="projectName">{props.projectName}</span>
            <span
              className={`payStatus ${
                +props.payStatus === 1 ? 'alreadyPay' : 'notPay'
              }`}
            >
              {props.payStatusStr}
            </span>
          </div>
        </div>
        <div className="botom">{props.className}</div>
      </div>
      <div className="botomInfo">
        <ClockO></ClockO>
        <span className="time">
          截止日期：{dayjs(props.endTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
    </div>
  );
};

const PaymentList = (props: any) => {
  return (
    <div className={'paymentList payment-statis'}>
      {props.PaymentList.map((item: any) => {
        return <PaymentDetails key={item.projectId} {...item} />;
      })}
    </div>
  );
};

function PeymentListBox() {
  const schoolId = history.location.query?.schoolId;
  const studentName = history.location.query?.studentName;

  let [list, setList] = useState([]);
  let [pageNum, setPageNum] = useState<number>(1);
  let totalNum: number = 0;

  useEffect(() => {
    getChargeNameListByStudent();
    window.onscroll = () => {
      const clientHeight = document.documentElement.clientHeight; // 网页可视区域高度
      const scrollTop = document.documentElement.scrollTop; // 滚动条垂直位置
      const scrollHeight = document.documentElement.scrollHeight; // 网页总高度
      if (clientHeight + scrollTop >= scrollHeight) {
        if (list.length < totalNum) {
          setPageNum(pageNum++);
          getChargeNameListByStudent();
          console.log('触底了');
        }
      }
    };
  }, []);

  function getChargeNameListByStudent() {
    chargeNameListByStudent({
      pageNum,
      pageSize: 20,
      schoolId,
      studentName,
    }).then((res) => {
      const { code, data } = res;
      if (+code === 1000) {
        setList((list) => {
          return (list = list.concat(data.list));
        });
        totalNum = data.total;
      }
    });
  }

  if (list.length === 0) {
    return <Normal title={'暂无信息'} />;
  } else {
    return <PaymentList PaymentList={list} />;
  }
}

export default () => {
  document.title = '查询缴费';
  return <PeymentListBox></PeymentListBox>;
};
