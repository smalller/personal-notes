import { history, useModel } from 'umi';
import './index.less';
import { useEffect, useState } from 'react';
import { ArrowDown } from '@react-vant/icons';
import { Radio, Toast } from 'react-vant';
import { getPaymentDetails, updatePayType } from './service';
import dayjs from 'dayjs';
import { splitSonOrderExist, handleInfo } from './service';

const Heads = function (props: Props) {
  return (
    <div className={'head'}>
      <div className={'headBox'}>
        <div className="top">
          <span>还剩 {props.data?.unpaids} 人</span>
          <span>
            已交款{props.data?.paids}人，有{props.data?.notInvolveds}
            人不参与或全额退款
          </span>
        </div>
        <div className="button">
          <span>
            {props.data?.gradeName}
            {props.data?.className}，{props.data?.projectMame}
          </span>
          <span>
            截止时间：{dayjs(props.data?.endTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
      </div>
    </div>
  );
};

interface TabList {
  onChange: (index: number) => void;
}

const TabList = function (props: TabList) {
  const onChange = props.onChange;
  const [index, setIndex] = useState(1);
  const setI = (index: number) => {
    setIndex(index);
    onChange(index);
  };
  return (
    <div className={'tabList'}>
      <div
        className={`tab ${index === 1 ? 'active' : ''}`}
        onClick={() => setI(1)}
      >
        <span>未交款</span>
        <div />
      </div>
      <div
        className={`tab ${index === 2 ? 'active' : ''}`}
        onClick={() => setI(2)}
      >
        <span>已交款</span>
        <div />
      </div>
      <div
        className={`tab ${index === 3 ? 'active' : ''}`}
        onClick={() => setI(3)}
      >
        <span>不参与/全额退款</span>
        <div />
      </div>
    </div>
  );
};

interface PayItem {
  studentName?: string;
  name?: string;
  id: number;
  status?: string;
  paymentDetails?: () => Promise<void>;
}

async function getChargeNameDetail(
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
    pathname = '/teacher/payDetails';
  }
  history.push({
    pathname,
    query: {
      classId: String(classId),
      gradeId: String(gradeId),
      projectId: String(projectId),
      studentId: String(studentId),
    },
  });
}

// 为他代付
const sendPay = (
  classId: number,
  gradeId: number,
  projectId: number,
  studentId: number,
) => {
  getChargeNameDetail(classId, gradeId, projectId, studentId);
};

interface NotPayItem extends PayItem {
  paymentDetails: () => Promise<void>;
  data: Props;
  classId: number;
  gradeId: number;
  id: number;
  studentId: number;
}

const NotPayItem = function (props: NotPayItem) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('标记为');

  useEffect(() => {
    if (value !== '标记为') {
      handleUpdatePayType(changeValue(value));
    }
  }, [value]);

  function changeValue(txt: string): number {
    let res = -1;
    switch (txt) {
      case '未缴费':
        res = 0;
        break;
      case '已缴费':
        res = 1;
        break;
      case '不参与/全额退款':
        res = 2;
        break;
    }
    return res;
  }

  async function handleUpdatePayType(status: number) {
    const { code } = await updatePayType(props.id, props.studentId, status);
    if (+code === 1000) {
      Toast.success('标记成功');
      if (props) {
        props.paymentDetails();
      }
    }
  }

  return (
    <div className={'notPayItem'}>
      <div className={'left'}>
        <span>{props.name}</span>
      </div>
      <div className={'right'}>
        <div
          onClick={() => {
            sendPay(props.classId, props.gradeId, props.id, props.studentId);
          }}
        >
          <span>为TA代付</span>
        </div>
        <div
          onClick={() => {
            setVisible(true);
          }}
        >
          <span>{value}</span>
          <ArrowDown color="#3775F6" fontSize={'14px'} />
          <Popup
            visible={visible}
            value={value}
            close={() => {
              setVisible(false);
            }}
            onChange={(value) => {
              setValue(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface Popup {
  visible: boolean;
  close: () => void;
  value: string;
  onChange: (value: string) => void;
}
interface PopupItem {
  label: string;
  value: number;
}
const Popup = (props: Popup) => {
  const onChange = props.onChange;
  const list: PopupItem[] = [
    { label: '标记为', value: -1 },
    // { label: '未缴费', value: 0 },
    { label: '已缴费', value: 1 },
    { label: '不参与/全额退款', value: 2 },
  ];
  const close = props.close;
  const [visible, setVisible] = useState(props.visible);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  useEffect(() => {
    if (!visible) {
      close();
    }
  }, [visible]);

  if (visible) {
    return (
      <div className={'payPopup'}>
        {visible}
        <div
          className="mask"
          onClick={() => {
            setVisible(false);
          }}
        />
        <div className={'popupContent'}>
          <Radio.Group
            value={props.value}
            defaultValue={1}
            iconSize={'20px'}
            checkedColor={'#62E24D'}
            onChange={(e: string | number) => {
              onChange(e.toString());
              setVisible(false);
            }}
          >
            {list.map((item) => (
              <Radio key={item.value} name={item.label}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

// 未交款列表
const NotPay = function (props: Props) {
  const [data, setData] = useState(props.data?.unpaidsVos);
  useEffect(() => {
    setData(props.data?.unpaidsVos);
  }, [props.data]);
  return (
    <div className={'notPay'}>
      {data?.map((item: PayItem) => (
        <NotPayItem
          name={item.studentName}
          studentId={item.id}
          key={item.id}
          {...props.data}
          paymentDetails={props.paymentDetails}
        />
      ))}
    </div>
  );
};

// 已交款列表
const Paid = function (props: Props) {
  const [data, setData] = useState(props.data);
  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  return (
    <div className={'notPay'}>
      {data?.map((item: PayItem) => (
        <PaidItem
          name={item.studentName}
          id={item.id}
          key={item.id}
          status={item.status}
        />
      ))}
    </div>
  );
};
const PaidItem = function (props: PayItem) {
  function changeStatus(status: string | undefined) {
    switch (status) {
      case '1':
        return '支付宝';
      case '2':
        return '微信';
      case '3':
        return '其他';
    }
  }

  return (
    <div className={'notPayItem'}>
      <div className={'left'}>
        <span>{props.name}</span>
      </div>
      <div className={'right'}>
        <span>{changeStatus(props.status)}</span>
      </div>
    </div>
  );
};

// 不参与/全额退款列表
const NotPartIn = function (props: Props) {
  const [data, setData] = useState(props.data);
  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  return (
    <div className={'notPay'}>
      {data?.map((item: PayItem) => (
        <NotPartInItem
          id={item.id}
          name={item.studentName}
          key={item.studentName}
        />
      ))}
    </div>
  );
};
const NotPartInItem = function (props: PayItem) {
  return (
    <div className={'notPayItem'}>
      <div className={'left'}>
        <span>{props.name}</span>
      </div>
      <div className={'right'}>
        <span>不参与</span>
      </div>
    </div>
  );
};

// 一键催缴
async function goHandleInfo(classId: number) {
  const id = history.location.query?.id as string;
  const { code } = await handleInfo(id, classId);
  if (+code === 1000) {
    Toast.success('催缴成功');
  }
}

const PayBtnBox = function (props: Props) {
  const time = 5; // 分钟数
  let isSendCode = false;
  let timer = null as any;
  function torrGohandleInfo() {
    if (!isSendCode) {
      isSendCode = true;
      goHandleInfo(props.classId);
      timer = setTimeout(() => {
        isSendCode = false;
      }, 60000 * time);
    } else {
      Toast.info('短时间内请勿重复发送');
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={'btnBox'}>
      <div className="btn" onClick={() => torrGohandleInfo()}>
        一键催缴
      </div>
    </div>
  );
};

const Content = function (props: Props) {
  switch (props.index) {
    case 1:
      return <NotPay data={props.data} paymentDetails={props.paymentDetails} />;
    case 2:
      return <Paid data={props.data?.paidsVos} />;
    case 3:
      return <NotPartIn data={props.data?.notInvolvedsVos} />;
    default:
      return <div />;
  }
};

const PaymentDetails = (props: Props) => {
  const [tabIndex, setTabIndex] = useState(1);
  return (
    <div className="paymentDetails">
      <Heads data={props.detailData} />
      <TabList
        onChange={(index) => {
          setTabIndex(index);
        }}
      />
      <Content
        index={tabIndex}
        data={props.detailData}
        paymentDetails={props.paymentDetails}
      />
      <PayBtnBox classId={props?.detailData?.classId} />
    </div>
  );
};

interface Props {
  [key: string]: any;
}

export default () => {
  const [detailData, setDetailData] = useState();

  const id = history.location.query?.id as string;
  const mcId = history.location.query?.mcId as string;

  useEffect(() => {
    paymentDetails();
  }, []);

  async function paymentDetails() {
    const { code, data } = await getPaymentDetails(id, mcId);
    if (+code === 1000) {
      setDetailData(data);
    }
  }

  return (
    <PaymentDetails detailData={detailData} paymentDetails={paymentDetails} />
  );
};
