import './index.less';
import { Checkbox, Toast } from 'react-vant';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import dayjs from 'dayjs';
import { chargeNameDetail, goPay } from './service';

interface PayItemList {
  checked: string;
  itemChargeMoney: string;
  itemChargeType: string;
  itemId: number;
  itemName: string;
  itemRequired: string;
  status?: boolean;
}

interface Props {
  onChangeNum: (value: number) => void;
  onChangeLen: (value: number) => void;
  onChangeList: (value: any) => void;
  datalist: PayItemList[];
}

const PayTypeList = (props: Props) => {
  const onChangeNum = props.onChangeNum;
  const onChangeLen = props.onChangeLen;
  const onChangeList = props.onChangeList;
  const { datalist } = props;
  const [list, setList] = useState<PayItemList[]>([]);

  useEffect(() => {
    setList(datalist);
  }, [datalist]);

  const selectItem = (data: PayItemList) => {
    if (+data.itemRequired !== 1) {
      setList((dataList) => {
        const index = dataList.findIndex((item) => item.itemId === data.itemId);
        if (+dataList[index].checked === 1) {
          dataList[index].checked = '2';
        } else {
          dataList[index].checked = '1';
        }
        return [...dataList];
      });
    }
  };

  const computedData = () => {
    let num = list
      ?.map((item) => (+item.checked === 1 ? Number(item.itemChargeMoney) : 0))
      .reduce((sum, currentNum) => sum + currentNum, 0);
    onChangeNum(+num.toFixed(2)); // 返回要交的金额
    const nList = list?.filter((item) => +item.checked === 1);
    onChangeLen(nList.length); // 返回勾选的选项长度
    onChangeList(list); // 返回经过处理的勾选列表
  };

  useEffect(() => {
    if (list) {
      computedData();
    }
  }, [list]);

  return (
    <div className={'payTypeList'}>
      {list?.map((item) => {
        return (
          <Checkbox
            className="payType"
            key={item.itemId}
            onChange={() => selectItem(item)}
            checked={+item.checked === 1 ? true : false}
            iconSize="20px"
            checkedColor="#62E24D"
          >
            <span>
              {+item.itemRequired === 1
                ? `${item.itemName}（必交）`
                : `${item.itemName}（可选）`}
            </span>
            <span>￥{item.itemChargeMoney}</span>
          </Checkbox>
        );
      })}
    </div>
  );
};

const PayDetails = (props: any) => {
  const classId = history.location.query?.classId as string;
  const gradeId = history.location.query?.gradeId as string;
  const projectId = history.location.query?.projectId as string;
  const studentId = history.location.query?.studentId as string;

  const { detailData } = props;
  const [length, setLength] = useState(0);
  const [num, setNum] = useState(0);
  const [sendPayList, setSendPayList] = useState<PayItemList[]>();

  async function handleGoPay() {
    const { code, message } = await goPay({
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
    } else {
      Toast.info(message as string);
    }
  }

  // 去支付
  const sendPay = () => {
    handleGoPay();
  };

  return (
    <div className={'payDetails'}>
      <div className={'payDetailsBox'}>
        <div className={'payHead'}>
          <div className={'title'}>{detailData?.projectName}</div>
          <div className={'time'}>
            <span>截至时间：</span>
            <span>
              {dayjs(detailData?.endTime).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </div>
        </div>
        <PayTypeList
          datalist={detailData?.itemList}
          onChangeNum={(res) => {
            setNum(res);
          }}
          onChangeLen={(res) => {
            setLength(res);
          }}
          onChangeList={(res) => {
            setSendPayList(res);
          }}
        />
        <div className={'payNumBox'}>
          <div className={'left'}>
            <span>已选</span>
            <span>({length})</span>
          </div>
          <div className={'right'}>
            <span>合计：</span>
            <span>{num}</span>
          </div>
        </div>
      </div>
      <div className={'payBtnBox'}>
        <div className={'left'}>
          <span>合计: </span>
          <span>￥{num}</span>
        </div>
        <div className={'right'} onClick={sendPay}>
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
