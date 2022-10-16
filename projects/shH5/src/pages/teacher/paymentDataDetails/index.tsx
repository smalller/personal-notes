import './index.less';
import { history } from 'umi';
import { orderDetail } from './service';
import { useEffect, useState } from 'react';

interface RegInfoProps {
  registerName?: string;
  remark?: string;
  userFillInType?: string;
  itemName?: string;
  itemChargeMoney?: string;
  itemId?: string;
  id?: string;
}

const PaymentDataDetails = (props: any) => {
  const { detailData } = props;
  const { registerList, itemList } = detailData;
  return (
    <div className={'paymentDataDetails'}>
      <div className="content">
        <div className="box">
          <div className="top">
            <div className="left">支付金额</div>
            <div className="right">{detailData.payMoney}</div>
          </div>
          <div className="item">
            <div className="left">支付项目</div>
            <div className="right">{detailData.projectName}</div>
          </div>
          <div className="item">
            <div className="left">支付时间</div>
            <div className="right">{detailData.payTime}</div>
          </div>
          <div className="item">
            <div className="left">支付方式</div>
            <div className="right">{detailData.payType}</div>
          </div>
          <div className="ref-info-box">
            <div className="title">学费</div>
            {itemList?.map((item: RegInfoProps) => {
              return (
                <div className="item" key={item.itemId}>
                  <div className="left">{item.itemName}</div>
                  <div className="right">{item.itemChargeMoney}</div>
                </div>
              );
            })}
          </div>
          {+detailData.projectType === 1 && (
            <div className="ref-info-box">
              <div className="title">登记信息</div>
              {registerList?.map((item: RegInfoProps) => {
                return (
                  <div className="item" key={item.id}>
                    <div className="left">{item.registerName}</div>
                    <div className="right">{item.remark}</div>
                  </div>
                );
              })}
            </div>
          )}
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
  document.title = '缴费明细详情';
  const id = history.location.query?.orderId as string;
  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    getOrderDetail();
  }, []);

  async function getOrderDetail() {
    const { code, data } = await orderDetail(id);
    if (+code === 1000) {
      setDetailData(data);
    }
  }

  return <PaymentDataDetails detailData={detailData} />;
};
