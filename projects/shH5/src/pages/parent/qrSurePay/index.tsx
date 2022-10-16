import './index.less';
import { history, useModel } from 'umi';

const Pay = () => {
  const orderSonNumber = history.location.query?.orderSonNumber as string;
  const projectId = history.location.query?.projectId as string;
  const projectType = history.location.query?.projectType as string;
  const payTotalMoney = history.location.query?.payTotalMoney as string;
  const projectName = history.location.query?.projectName as string;
  const registerList = history.location.query?.registerList as string;
  const showRegisterList = JSON.parse(registerList);

  // 提交订单
  function goToPay() {
    history.push({
      pathname: '/payType',
      query: {
        projectName,
        payTotalMoney,
        projectId,
        projectType,
        splitOrderNumber: orderSonNumber,
        registerList,
      },
    });
  }

  return (
    <div className={'pay'}>
      <div className="content">
        <div className="paymentHead">
          <img src={require('@/assets/image/paymentList.png')} alt="" />
        </div>
        <div className="head">
          {showRegisterList.map((i: any, index: number) => (
            <div key={index}>
              <span>{i.registerName}：</span>
              <span>{i.registerValue}</span>
            </div>
          ))}
        </div>
        <div className="payInfoBox">
          <div className="infoItem">
            <div className="left">项目名称：</div>
            <div className="right">
              <span className={'value'}>{projectName}</span>
            </div>
          </div>
          <div className="infoItem">
            <div className="left">支付金额：</div>
            <div className="right">
              <span className={'value'}>{payTotalMoney}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="btnBox">
        <div
          className="btn left"
          onClick={() => {
            history.goBack();
          }}
        >
          返回修改
        </div>
        <div
          className="btn right"
          onClick={() => {
            goToPay();
          }}
        >
          提交订单
        </div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '订单确认';
  const { setCancelCheckPath } = useModel('user');
  setCancelCheckPath(history.location.pathname); //允许游客访问页面
  return <Pay />;
};
