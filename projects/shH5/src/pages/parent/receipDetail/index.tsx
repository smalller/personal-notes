import './index.less';
import { history } from 'umi';
import { receiptDetail } from './service';
import { useEffect, useState } from 'react';
import { ImagePreview } from 'react-vant';
import dayjs from 'dayjs';

interface DetailData {
  money: string;
  projectName: string;
  projectType: string;
  payTime: string;
  payType: string;
  payStatus: string;
  orderNumber: string;
}

const TransactionDetails = () => {
  const orderId = history.location.query?.orderId as string;
  const [detailData, setDetailData] = useState<DetailData>();
  const [reImg, setReImg] = useState<string[]>([]);

  useEffect(() => {
    getPayHistoryDetail();
  }, []);

  async function getPayHistoryDetail() {
    const { code, data } = await receiptDetail(orderId);
    if (+code === 1000) {
      setReImg([data.imageUrl]);
      setDetailData(data);
    }
  }

  return (
    <div className={'receipDetail'}>
      <div className="receipBox">
        <div className="top">电子收据预览</div>
        <div className="imgBox">
          <img
            src={reImg[0]}
            onClick={() => {
              ImagePreview.open({
                images: reImg,
                closeable: true,
              });
            }}
          />
          <p>（点击可查看大图，长按图片可保存凭证）</p>
        </div>
      </div>
      <div className="content">
        <div className="info">
          <div className="top">收据信息</div>
          <div className="item">
            <div className="left">支付金额</div>
            <div className="right">{detailData?.money}</div>
          </div>
          <div className="item">
            <div className="left">交易项目</div>
            <div className="right">{detailData?.projectName}</div>
          </div>
          <div className="item">
            <div className="left">支付场景</div>
            <div className="right">{detailData?.projectType}</div>
          </div>
          <div className="item">
            <div className="left">交易时间</div>
            <div className="right">
              {dayjs(detailData?.payTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
          <div className="item">
            <div className="left">交易方式</div>
            <div className="right">{detailData?.payType}</div>
          </div>
          <div className="item">
            <div className="left">交易状态</div>
            <div className="right">{detailData?.payStatus}</div>
          </div>
          <div className="item">
            <div className="left">交易单号</div>
            <div className="right">{detailData?.orderNumber}</div>
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
  document.title = '收据详情';
  return <TransactionDetails />;
};
