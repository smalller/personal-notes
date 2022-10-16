import './index.less';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import PayTypeList from '@/pages/parent/components/payTypeList';
import { chargeNameDetail, goPay, notHandin } from './service';
import dayjs from 'dayjs';
import { Toast } from 'react-vant';

interface PayItemList {
  checked: string;
  itemChargeMoney: string;
  itemChargeType: string;
  itemId: number;
  itemName: string;
  itemRequired: string;
  status?: boolean;
}

async function dropOutOf(projectId: number) {
  const studentId = history.location.query?.studentId as string;
  const flag = history.location.query?.flag as string;
  const { code } = await notHandin(projectId, studentId);
  if (+code === 1000) {
    Toast.success('成功不参与名单缴费');
    if (+flag === 1) {
      history.push({
        pathname: '/parent/notice',
      });
    } else {
      // 因为列表页的查询数据是从查询页面传过来的，所以只能先跳回查询页重新查询
      history.push({
        pathname: '/parent/paymentStatisticsSelect',
      });
    }
  }
}

const PayDetails = (props: any) => {
  const classId = history.location.query?.classId as string;
  const gradeId = history.location.query?.gradeId as string;
  const projectId = history.location.query?.projectId as string;
  const studentId = history.location.query?.studentId as string;

  const { detailData } = props;
  const [sendPayList, setSendPayList] = useState<PayItemList[]>();

  async function handleGoPay() {
    const { code } = await goPay({
      projectId,
      projectType: detailData.projectType,
      projectItems: sendPayList,
      remark: detailData.remark,
      studentId,
    });
    if (+code === 1000) {
      history.push({
        pathname: '/pay',
        query: {
          classId,
          gradeId,
          projectId,
          studentId,
        },
      });
    }
  }

  // 去支付
  const sendPay = () => {
    handleGoPay();
  };

  return (
    <div className={'parentPayDetails'}>
      <div className="content">
        <div className="head">
          <div className={'title'}>{detailData?.projectName}</div>
          <div className={'subTitle'}>
            <span>
              截至时间：
              {dayjs(detailData?.endTime).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <span>{detailData?.className}</span>
          </div>
        </div>
        <PayTypeList
          datalist={detailData?.itemList}
          onChangeList={(res) => {
            setSendPayList(res);
          }}
        />
        <div className={'remarksBox'}>备注：{detailData?.remark}</div>
      </div>
      <div className="btnBox">
        <div
          className="btn left"
          onClick={() => {
            dropOutOf(detailData?.projectId);
          }}
        >
          不参与
        </div>
        <div
          className="btn right"
          onClick={() => {
            sendPay();
          }}
        >
          去支付
        </div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '缴费详情';

  const classId = history.location.query?.classId as string;
  const gradeId = history.location.query?.gradeId as string;
  const projectId = history.location.query?.projectId as string;
  const studentId = history.location.query?.studentId as string;

  const [detailData, setDetailData] = useState();

  useEffect(() => {
    getChargeNameDetail();
  }, []);

  async function getChargeNameDetail() {
    const { code, data } = await chargeNameDetail({
      classId,
      gradeId,
      projectId,
      studentId,
    });
    if (+code === 1000) {
      setDetailData(data);
    }
  }
  return <PayDetails detailData={detailData} />;
};
