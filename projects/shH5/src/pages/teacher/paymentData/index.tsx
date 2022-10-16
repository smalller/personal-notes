import './index.less';
import React, { UIEventHandler, useEffect, useState } from 'react';
import { Popup, Popover, Calendar, Radio } from 'react-vant';
import dayjs from 'dayjs';
import Normal from '@/components/normal';
import { history } from 'umi';
import { getGradeList, screeningTotal, orderScreening } from './service';

interface SearchForm {
  className?: string;
  student?: string;
  classId?: string;
  gradeId?: string;
  moneyBegin?: string;
  moneyEnd?: string;
  payBeginTime?: string;
  payEndTime?: string;
  payType?: string;
  projectType?: string;
  searchName?: string;
  searchType?: string;
}

interface PayDataItem {
  orderId: string;
  projectName: string;
  studentName: string;
  payMoney: string;
  payTime: string;
  payType: string;
}

interface PayDataItemProps {
  data: PayDataItem;
}

const PayDataItem = (props: PayDataItemProps) => {
  const data = props.data;
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
  return (
    <div
      className="payDataItem"
      onClick={() => {
        history.push({
          pathname: '/teacher/paymentDataDetails',
          query: {
            orderId: data.orderId,
          },
        });
      }}
    >
      <div className="left">
        <div className={'name'}>{data.projectName}</div>
        <div className={'info'}>
          <span>{data.studentName}</span>
          <span>{changePayType(data.payType)}</span>
        </div>
      </div>
      <div className="right">
        <div>{data.payMoney}</div>
        <div>{dayjs(data.payTime).format('YYYY/MM/DD HH:mm')}</div>
      </div>
    </div>
  );
};

interface Props {
  searchForm: SearchForm;
  list: PayDataItem[];
  scrollEvent: UIEventHandler<HTMLDivElement>;
  isReady: boolean;
}

const PayData = (props: Props) => {
  const { list, scrollEvent, isReady } = props;
  if (list.length > 0) {
    return (
      <div className={'payData'} id="pay-data-box" onScroll={scrollEvent}>
        {list.map((item) => (
          <PayDataItem key={item.orderId} data={item} />
        ))}
      </div>
    );
  } else if (isReady) {
    return <Normal title={'暂无缴费信息'} />;
  } else {
    return <></>;
  }
};

interface FilterProps {
  filterForm: SearchForm;
  onChange: (searchForm: SearchForm) => void;
}

interface Grade {
  gradeId: string;
  gradeName: string;
}

const FilterBox = (props: FilterProps) => {
  const change = props.onChange;
  const [filterForm, setFilterForm] = useState<SearchForm>({
    // payBeginTime: dayjs().format('YYYY-MM-DD'),
    // payEndTime: dayjs().format('YYYY-MM-DD'),
    payBeginTime: '',
    payEndTime: '',
    moneyBegin: '',
    moneyEnd: '',
    payType: '',
    gradeId: '',
  });
  const [dateVisibility, setDateVisibility] = useState(false);
  const [gradeList, setGrade] = useState<Grade[]>([]);

  useEffect(() => {
    change(filterForm);
  }, [filterForm]);

  useEffect(() => {
    getGradeList().then((res) => {
      if (+res.code === 1000) {
        // console.log(res.data)
        setGrade(res.data);
      }
    });
  }, []);

  return (
    <div className={'filterBox'}>
      <div className="filterItem">
        <div className="label">时间：</div>
        <div className="itemBox dateBox">
          <div
            className={'dateSelectBtn'}
            onClick={() => {
              setDateVisibility(true);
            }}
          >
            {filterForm.payBeginTime || '开始时间'}
            <img src={require('@/assets/image/date.png')} alt="" />
          </div>
          <div className={'line'}></div>
          <div
            className={'dateSelectBtn'}
            onClick={() => {
              setDateVisibility(true);
            }}
          >
            {filterForm.payEndTime || '结束时间'}
            <img src={require('@/assets/image/date.png')} alt="" />
          </div>
          <Calendar
            minDate={new Date(2021, 0, 1)}
            maxDate={new Date()}
            showConfirm={false}
            visible={dateVisibility}
            type="range"
            onClose={() => setDateVisibility(false)}
            onConfirm={(v) => {
              if (Array.isArray(v)) {
                const data = JSON.parse(JSON.stringify(filterForm));
                data.payBeginTime = dayjs(v[0]).format('YYYY-MM-DD');
                data.payEndTime = dayjs(v[1]).format('YYYY-MM-DD');
                setFilterForm(data);
              }
              setDateVisibility(false);
            }}
          />
        </div>
      </div>
      <div className="filterItem">
        <div className="label">年级：</div>
        <div className="itemBox classSelect">
          <div
            className={`gradeItem ${filterForm.gradeId === '' ? 'active' : ''}`}
            onClick={() => {
              const data = JSON.parse(JSON.stringify(filterForm));
              data.gradeId = '';
              setFilterForm(data);
            }}
          >
            全部年级
          </div>
          {gradeList.map((item) => (
            <div
              className={`gradeItem ${
                filterForm.gradeId === item.gradeId ? 'active' : ''
              }`}
              key={item.gradeId}
              onClick={() => {
                const data = JSON.parse(JSON.stringify(filterForm));
                data.gradeId = item.gradeId;
                setFilterForm(data);
              }}
            >
              {item.gradeName}
            </div>
          ))}
        </div>
      </div>
      <div className="filterItem">
        <div className="label">金额范围：</div>
        <div className="itemBox numBox">
          <input
            type={'number'}
            className={'num'}
            value={filterForm.moneyBegin}
            onChange={(e) => {
              const data = JSON.parse(JSON.stringify(filterForm));
              data.moneyBegin = e.target.value;
              setFilterForm(data);
            }}
          />
          <div className={'line'}></div>
          <input
            type={'number'}
            className={'num'}
            value={filterForm.moneyEnd}
            onChange={(e) => {
              const data = JSON.parse(JSON.stringify(filterForm));
              data.moneyEnd = e.target.value;
              setFilterForm(data);
            }}
          />
        </div>
      </div>
      <div className="filterItem">
        <div className="label">缴费方式：</div>
        <div className="itemBox typeSelect">
          <Radio.Group
            defaultValue="1"
            direction="horizontal"
            value={filterForm.payType}
            onChange={(val) => {
              const data = JSON.parse(JSON.stringify(filterForm));
              data.payType = val;
              setFilterForm(data);
            }}
          >
            <Radio iconSize="20px" checkedColor="#62E24D" name={''}>
              全部
            </Radio>
            <Radio iconSize="20px" checkedColor="#62E24D" name={'1'}>
              支付宝
            </Radio>
            <Radio iconSize="20px" checkedColor="#62E24D" name={'2'}>
              微信
            </Radio>
            <Radio iconSize="20px" checkedColor="#62E24D" name={'3'}>
              其他
            </Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

interface SearchHeadProps {
  onChange: (value: SearchForm) => void;
  numInfo: NumInfo;
}

const SearchHead = (props: SearchHeadProps) => {
  const { numInfo } = props;
  const onChange = props.onChange;
  const [searchForm, setSearchForm] = useState<SearchForm>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('姓名');
  const [name, setName] = useState<string>('');
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const actions = [{ text: '姓名' }, { text: '班级' }];

  useEffect(() => {
    const data = JSON.parse(JSON.stringify(searchForm));
    data.projectType = type;
    setSearchForm(data);
  }, [type]);

  useEffect(() => {
    onChange(searchForm);
  }, [searchForm]);

  const select = (option: any) => {
    setSearchType(option.text);
  };

  const sendChange = () => {
    const data: SearchForm = JSON.parse(JSON.stringify(searchForm));
    if (searchType === '姓名') {
      data.searchType = '2';
    }
    if (searchType === '班级') {
      data.searchType = '1';
    }
    setSearchForm(data);
    onChange(data);
    setVisible(false);
  };

  return (
    <div className="head" ref={wrapperRef}>
      <div className="content">
        <div className={'typeChangeBox'}>
          <div
            className={`changeItem ${type === '' ? 'active' : ''}`}
            onClick={() => setType('')}
          >
            缴费明细(总)
          </div>
          <div
            className={`changeItem ${type === '1' ? 'active' : ''}`}
            onClick={() => setType('1')}
          >
            按名单缴费
          </div>
          <div
            className={`changeItem ${type === '2' ? 'active' : ''}`}
            onClick={() => setType('2')}
          >
            扫码收费
          </div>
        </div>
        <div className={'searchInputBox'}>
          <div className="inputBox">
            <Popover
              placement={'bottom-start'}
              actions={actions}
              onSelect={select}
              reference={
                <span className={'typeBtn'}>
                  按{searchType}
                  <img src={require('@/assets/image/downFill.png')} alt="" />
                </span>
              }
            />
            <input
              type="text"
              placeholder={`请输入学生${searchType}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                const data: SearchForm = JSON.parse(JSON.stringify(searchForm));
                data.searchName = e.target.value;
                setSearchForm(data);
              }}
            />
            <img
              className={'searchIcon'}
              src={require('@/assets/image/search.png')}
              alt=""
              onClick={() => {
                sendChange();
              }}
            />
          </div>
          <div
            className="filterBtn"
            onClick={() => {
              setVisible(true);
            }}
          >
            <img src={require('@/assets/image/list.png')} alt="" />
            <span>筛选</span>
          </div>
        </div>
        <div className={'numInfoBox'}>
          <div>
            <span> 收款总额：</span>
            {numInfo.totalReceipts} 元，共 {numInfo.receiptsNumber} 笔
          </div>
          <div>
            <span>退款总额：</span>
            {numInfo.totalRefund} 元，共 {numInfo.refundNumber} 笔
          </div>
        </div>
      </div>
      <Popup
        teleport={() => wrapperRef.current as HTMLDivElement}
        visible={visible}
        position="bottom"
        destroyOnClose
        safeAreaInsetBottom
        round
        onClickOverlay={() => {
          setVisible(false);
        }}
      >
        <FilterBox
          filterForm={searchForm}
          onChange={(formData) => {
            const data: SearchForm = JSON.parse(JSON.stringify(searchForm));
            setSearchForm(Object.assign(data, formData));
          }}
        />
        <div className={'btnBox'}>
          <div className="btn" onClick={sendChange}>
            确定
          </div>
        </div>
      </Popup>
    </div>
  );
};

interface NumInfo {
  receiptsNumber?: number;
  refundNumber?: number;
  totalReceipts?: number;
  totalRefund?: number;
}
const PaymentData = () => {
  const [searchForm, setSearchForm] = useState<SearchForm>({});
  let [list, setList] = useState<PayDataItem[]>([]);
  let [pageNum, setPageNum] = useState<number>(1);
  const [totalNum, setTotalNum] = useState<number>(0);
  const [numInfo, setNumInfo] = useState<NumInfo>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log(searchForm);
    list = [];
    setList(list);
    setTimeout(() => {
      getOrderScreening(1);
      getScreeningTotal();
    }, 200);
  }, [searchForm]);

  // 获取缴费明细列表
  async function getOrderScreening(page: number) {
    const { code, data } = await orderScreening({
      pageNum: page,
      pageSize: 10,
      ...searchForm,
    });
    if (+code === 1000) {
      let listData = JSON.parse(JSON.stringify(list));
      listData = listData.concat(data.list);
      setList(listData);
      setTotalNum(data.total);
      setIsReady(true);
    }
  }

  // 获取缴费统计信息
  async function getScreeningTotal() {
    const { code, data } = await screeningTotal(searchForm);
    if (+code === 1000) {
      setNumInfo(data);
    }
  }

  function scrollEvent() {
    const box = document.getElementById('pay-data-box') as HTMLDivElement;
    // 如果元素的可见高度 + 元素的滚动条的垂直位置 >= 元素内容高度，则触底
    if (box?.clientHeight + box?.scrollTop >= box?.scrollHeight) {
      if (list.length < totalNum) {
        let pageNo = JSON.parse(JSON.stringify(pageNum));
        pageNo++;
        setPageNum(pageNo);
        setTimeout(() => {
          getOrderScreening(pageNo);
        }, 200);
        console.log('触底了');
      }
    }
  }

  return (
    <div className={'paymentData'}>
      <SearchHead
        numInfo={numInfo}
        onChange={(form) => {
          setIsReady(false);
          setSearchForm(form);
        }}
      />
      <PayData
        searchForm={searchForm}
        isReady={isReady}
        list={list}
        scrollEvent={scrollEvent}
      />
    </div>
  );
};

export default () => {
  document.title = '缴费明细';
  return <PaymentData />;
};
