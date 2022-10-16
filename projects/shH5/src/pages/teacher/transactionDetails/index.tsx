import './index.less';
import { history } from 'umi';
import { payHistoryDetail, setDetailRegister } from './service';
import { useEffect, useState } from 'react';
import { Toast } from 'react-vant';

interface RegInfoProps {
  id?: number;
  mccId?: number;
  registerName?: string;
  remark: string;
  userFillInType?: string;
  setTodoRegInfo: (res: any) => void;
}

function RegInfo(props: RegInfoProps) {
  return (
    <div className="reg-info-box">
      <div className="item">
        <div className="left">{props.registerName}</div>
        <div className="right">{props.remark}</div>
      </div>
    </div>
  );
}

function TodoRegInfo(props: RegInfoProps) {
  const setTodoRegInfo = props.setTodoRegInfo;
  const [remark, setRemark] = useState(props.remark);
  const userFillInType = props.userFillInType as string;

  return (
    <div className="reg-info-box">
      <div className="item">
        <div className="left">{props.registerName}</div>
        <div className="right">
          <input
            type={+userFillInType === 2 ? 'number' : 'text'}
            className="input"
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
              setTodoRegInfo(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

const TransactionDetails = (props: any) => {
  const [isSet, setIsSet] = useState<boolean>(false);
  const { detailData } = props;
  const { registerList } = detailData;

  let todoRegisterList = [] as RegInfoProps[];
  if (registerList) {
    todoRegisterList = JSON.parse(JSON.stringify(registerList));
  }

  function handleCancel() {
    setIsSet(false);
  }

  function setTodoRegInfo(index: number, res: string) {
    todoRegisterList[index].remark = res;
  }

  async function handleSetDetailRegister() {
    const { code } = await setDetailRegister(todoRegisterList);
    if (+code === 1000) {
      Toast.success('修改成功');
      setIsSet(false);
      props.handleGetPayHistoryDetail();
    }
  }

  return (
    <div className={'transactionDetails'}>
      <div className="content">
        <div className="info">
          <div className="top">
            <div className="left">支付金额</div>
            <div className="right">{detailData.payMoney}</div>
          </div>
          <div className="item">
            <div className="left">交易项目</div>
            <div className="right">{detailData.projectName}</div>
          </div>
          <div className="item">
            <div className="left">支付场景</div>
            <div className="right">{detailData.projectType}</div>
          </div>
          <div className="item">
            <div className="left">交易时间</div>
            <div className="right">{detailData.payTime}</div>
          </div>
          <div className="item">
            <div className="left">交易方式</div>
            <div className="right">{detailData.payType}</div>
          </div>
          <div className="item">
            <div className="left">交易状态</div>
            <div className="right">{detailData.payStatus}</div>
          </div>
          <div className="item">
            <div className="left">交易单号</div>
            <div className="right">{detailData.orderNumber}</div>
          </div>
        </div>
        {+detailData.projectType === 1 && (
          <div className="typeBox">
            <div className="top">
              <div className="left">登记信息</div>
              <div className="right">
                {isSet ? (
                  <div className="setBox">
                    <span onClick={handleSetDetailRegister}>确定</span>
                    <span
                      style={{
                        marginLeft: '30px',
                      }}
                      onClick={() => handleCancel()}
                      className="cancel"
                    >
                      取消
                    </span>
                  </div>
                ) : (
                  <div onClick={() => setIsSet(true)}>点击修改登记信息</div>
                )}
              </div>
            </div>
            {isSet
              ? todoRegisterList?.map((item: RegInfoProps, index: number) => {
                  return (
                    <TodoRegInfo
                      key={item.id}
                      {...item}
                      setTodoRegInfo={(res) => setTodoRegInfo(index, res)}
                    />
                  );
                })
              : registerList?.map((item: RegInfoProps) => {
                  return <RegInfo key={item.id} {...item} />;
                })}
          </div>
        )}
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
  const orderId = history.location.query?.orderId as string;
  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    getPayHistoryDetail();
  }, []);

  async function getPayHistoryDetail() {
    const { code, data } = await payHistoryDetail(orderId);
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
