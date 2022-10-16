import { useEffect, useState } from 'react';
import { Checkbox, Field } from 'react-vant';

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

export function PayBox(props: any) {
  const { detailData, setSendPayList, setNum } = props;
  const [existType, setExistType] = useState(''); // 自定义收费/选择项目收费
  const [length, setLength] = useState(0);
  const [money, setMoney] = useState(0);
  const [customMonObj, setCustomMonObj] = useState<any>();

  useEffect(() => {
    setExistType(detailData?.existType);
    if (detailData?.itemList.length > 0) {
      setCustomMonObj(detailData?.itemList[0]);
      setNum(detailData?.itemList[0].itemChargeMoney);
      setSendPayList(detailData?.itemList);
    }
  }, [detailData]);

  function setCustomMon(val: string | number) {
    const newObj = JSON.parse(JSON.stringify(customMonObj));
    newObj.itemChargeMoney = val;
    setCustomMonObj(newObj);
    setSendPayList([newObj]);
  }

  return (
    <div>
      {+existType === 1 ? (
        <>
          <div className="monState">
            <div className="title">费用说明</div>
            <div>{detailData?.chargeRemark}</div>
          </div>
          <div className="monState">
            <div className="title">填写金额</div>
            <Field
              value={
                customMonObj?.itemChargeMoney == '0.00'
                  ? ''
                  : customMonObj?.itemChargeMoney
              }
              type="number"
              label="￥"
              onChange={(val: string | number) => {
                setCustomMon(val);
                setNum(val);
              }}
              placeholder="请输入缴费金额"
            />
          </div>
        </>
      ) : (
        <>
          <div className="selectTitle">请选择缴费项目（多选）</div>
          <PayTypeList
            datalist={detailData?.itemList}
            onChangeNum={(res) => {
              setNum(res);
              setMoney(res);
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
              <span>{money}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
