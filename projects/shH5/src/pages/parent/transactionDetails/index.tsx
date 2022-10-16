import './index.less';
import { history } from 'umi';
import { payHistoryDetail, setDetailRegister } from './service';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

interface RegInfoProps {
  id?: number;
  mccId?: number;
  registerName?: string;
  remark: string;
  userFillInType?: string;
  setTodoRegInfo: (res: any) => void;
}

// function RegInfo(props: RegInfoProps) {
//   return (
//     <div className="reg-info-box">
//       <div className="item">
//         <div className="left">{props.registerName}</div>
//         <div className="right">{props.remark}</div>
//       </div>
//     </div>
//   );
// }

function changePayStatus(status: string) {
  switch (status) {
    case '0':
      return '支付未完成';
    case '1':
      return '待支付';
    case '2':
      return '已支付';
    case '3':
      return '支付失败';
    case '4':
      return '退款';
  }
}

function changePayType(status: string) {
  switch (status) {
    case '1':
      return '支付宝';
    case '2':
      return '微信';
    case '3':
      return '其他';
  }
}

function projectType(status: string) {
  switch (status) {
    case '1':
      return '扫码收费';
    case '2':
      return '名单收费';
  }
}

// function TodoRegInfo(props: RegInfoProps) {
//   const setTodoRegInfo = props.setTodoRegInfo;
//   const [remark, setRemark] = useState(props.remark);
//   const userFillInType = props.userFillInType as string;

//   return (
//     <div className="reg-info-box">
//       <div className="item">
//         <div className="left">{props.registerName}</div>
//         <div className="right">
//           <input
//             type={+userFillInType === 2 ? 'number' : 'text'}
//             className="input"
//             value={remark}
//             onChange={(e) => {
//               setRemark(e.target.value);
//               setTodoRegInfo(e.target.value);
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

const TransactionDetails = (props: any) => {
  const { detailData } = props;
  // const [isSet, setIsSet] = useState<boolean>(false);
  // const { registerList } = detailData;

  // let todoRegisterList = [] as RegInfoProps[];
  // if (registerList) {
  //   todoRegisterList = JSON.parse(JSON.stringify(registerList));
  // }

  // function handleCancel() {
  //   setIsSet(false);
  // }

  // function setTodoRegInfo(index: number, res: string) {
  //   todoRegisterList[index].remark = res;
  // }

  // async function handleSetDetailRegister() {
  //   const { code } = await setDetailRegister(todoRegisterList);
  //   if (+code === 1000) {
  //     Toast.success('修改成功');
  //     setIsSet(false);
  //     props.handleGetPayHistoryDetail();
  //   }
  // }

  return (
    <div className={'transactionDetails'}>
      <div className="content">
        <div className="info">
          <div className="top">
            <div className="left">支付金额</div>
            <div className="right">{detailData.payMoney}</div>
          </div>
          <div className="item">
            <div className="left">班级名称</div>
            <div className="right">{detailData.className}</div>
          </div>
          <div className="item">
            <div className="left">交易项目</div>
            <div className="right">{detailData.projectName}</div>
          </div>
          <div className="item">
            <div className="left">支付场景</div>
            <div className="right">{projectType(detailData.projectType)}</div>
          </div>
          <div className="item">
            <div className="left">交易时间</div>
            <div className="right">
              {dayjs(detailData.payTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
          <div className="item">
            <div className="left">交易方式</div>
            <div className="right">{changePayType(detailData.payType)}</div>
          </div>
          <div className="item">
            <div className="left">交易状态</div>
            <div className="right">{changePayStatus(detailData.payStatus)}</div>
          </div>
          <div className="item">
            <div className="left">交易单号</div>
            <div className="right">{detailData.orderNumber}</div>
          </div>
        </div>
      </div>
      <div className="btnBox">
        <div
          className="btn"
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '交易详情';
  const id = history.location.query?.id as string;
  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    getPayHistoryDetail();
  }, []);

  async function getPayHistoryDetail() {
    const { code, data } = await payHistoryDetail(id);
    if (+code === 1000) {
      setDetailData(data);
    }
  }

  return (
    <TransactionDetails
      detailData={detailData}
      handleGetPayHistoryDetail={getPayHistoryDetail}
    />
  );
};
