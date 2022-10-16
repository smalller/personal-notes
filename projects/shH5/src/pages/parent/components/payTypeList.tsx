import { useEffect, useState } from 'react';
import { Checkbox } from 'react-vant';
import './payTypeList.less';

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
  onChangeList: (value: any) => void;
  datalist: PayItemList[];
}

export interface TypeItem {
  num: number;
  label: string;
  status: boolean;
  isDefault: boolean;
}

const PayTypeList = (props: Props) => {
  const [length, setLength] = useState(0);
  const [num, setNum] = useState(0);
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
    setNum(+num.toFixed(2)); // 返回要交的金额
    const nList = list?.filter((item) => +item.checked === 1);
    setLength(nList.length); // 返回勾选的选项长度
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
            key={item.itemId}
            onChange={() => selectItem(item)}
            checked={+item.checked === 1 ? true : false}
            className="payType"
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
      <div className={'numBox'}>
        <div className="left">已选 ({length})</div>
        <div className="right">
          <span>合计：</span>
          <span>￥{num}</span>
        </div>
      </div>
    </div>
  );
};

export default PayTypeList;
