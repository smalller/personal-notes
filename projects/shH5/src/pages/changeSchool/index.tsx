import './index.less';
import { useEffect, useState } from 'react';
import { Switch, Toast } from 'react-vant';
import { history, useModel } from 'umi';
import { SchoolItem } from '@/models/schoolService';
import { getSchoolList } from '@/base/common';

const SchoolNormal = () => (
  <div className="SchoolNormal">
    <img src={require('@/assets/image/normal.png')} alt="" />
    <span>没有学校</span>
  </div>
);

interface SchoolProps {
  schoolItem: SchoolItem;
  active: boolean;
}

const SchoolItemEl = (props: SchoolProps) => {
  const userType = sessionStorage.getItem('userType');
  const { setSchool } = useModel('school');
  const userName = history.location.query?.userName;

  function handleSetSchool() {
    const { mId } = props.schoolItem;
    setSchool(props.schoolItem);
    changeSchool(mId as number);
    history.goBack();
  }

  async function changeSchool(merchantId: number) {
    const { code } = await getSchoolList(merchantId);
    if (+code === 1000) {
      Toast.success('切换成功');
    }
  }

  return (
    <div
      className={'schoolItem'}
      onClick={() => {
        handleSetSchool();
      }}
    >
      <div className="schoolName rv-multi-ellipsis--l2">
        <span>{props.schoolItem.mName}</span>
      </div>
      <div className={'schoolInfo'}>
        <div className="left">
          <span>{userName}</span>
          <span>{userType === 'parent' ? '同学' : '老师'}</span>
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

interface SchoolListProps {
  schoolList: SchoolItem[];
}

const SchoolList = (props: SchoolListProps) => {
  const { schoolInfo } = useModel('school');

  return (
    <div className={'schoolList'}>
      {props.schoolList.map((item, index) => {
        return (
          <SchoolItemEl
            key={item.mId}
            schoolItem={item}
            active={schoolInfo.mId === item.mId}
          />
        );
      })}
    </div>
  );
};

const ChangeSchool = () => {
  document.title = '切换学校';

  const { schoolList } = useModel('school');

  if (schoolList.length > 0) {
    return (
      <div className={'changeSchool'}>
        <SchoolList schoolList={schoolList} />
      </div>
    );
  } else {
    return (
      <div className={'changeSchool'}>
        <SchoolNormal />
      </div>
    );
  }
};

export default ChangeSchool;
