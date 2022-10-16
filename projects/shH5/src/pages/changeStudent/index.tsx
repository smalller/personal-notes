import './index.less';
import { Switch, Toast } from 'react-vant';
import { history, useModel } from 'umi';
import { getStuList } from '@/base/common';

interface StuInfo {
  classId: string;
  className: string;
  mName: string;
  gradeName: string;
  studentName: string;
  studentId: number;
  mId: number;
  [key: string]: number | string;
}

const StuNormal = () => (
  <div className="SchoolNormal">
    <img src={require('@/assets/image/normal.png')} alt="" />
    <span>暂无孩子</span>
  </div>
);

const StuItemEl = (props: any) => {
  const { setStu } = useModel('student');
  const { mId, studentId } = props.stuItem;

  function handleSetStu() {
    setStu(props.stuItem);
    changeStu(mId, studentId);
    setTimeout(() => {
      history.goBack();
    }, 300);
  }

  // 切换学生
  async function changeStu(merchantId: number, studentId: number) {
    const { code } = await getStuList(merchantId, studentId);
    if (+code === 1000) {
      Toast.success('切换成功');
    }
  }

  return (
    <div
      className={'schoolItem'}
      onClick={() => {
        handleSetStu();
      }}
    >
      <div className="schoolName rv-multi-ellipsis--l2">
        <span>{props.stuItem.studentName}</span>
      </div>
      <div className={'schoolInfo'}>
        <div className="left">
          <span>
            {props.stuItem.mName} - {props.stuItem.gradeName}
            {props.stuItem.className}
          </span>
        </div>
        <div className="right">
          <Switch
            activeColor="#62E24D"
            inactiveColor="#C4C4C4"
            checked={props.active}
            size={'16px'}
          />
        </div>
      </div>
    </div>
  );
};

const StuList = (props: any) => {
  const { stuInfo } = useModel('student');
  return (
    <div className={'schoolList'}>
      {props?.stuList.map((item: StuInfo) => {
        return (
          <StuItemEl
            key={item.studentId}
            stuItem={item}
            active={stuInfo?.studentId === item.studentId}
          />
        );
      })}
    </div>
  );
};

const ChangeStu = () => {
  document.title = '切换孩子';
  const { stuList } = useModel('student');

  if (stuList.length > 0) {
    return (
      <div className={'changeSchool'}>
        <StuList stuList={stuList} />
      </div>
    );
  } else {
    return (
      <div className={'changeSchool'}>
        <StuNormal />
      </div>
    );
  }
};

export default ChangeStu;
