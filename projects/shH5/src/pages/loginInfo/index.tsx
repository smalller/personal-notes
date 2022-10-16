import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import './index.less';
import { ThacherUserInfo } from '@/models/userService';
import { getTeacherInfo, getParentInfo, choseDetail } from './service';

interface UserInfo {
  identityStatus: string;
  loginUserName: string;
  loginUserPhone: string;
  userCheckMessageVos: any[];
}

async function handleChoseDetail(merchantId: number, studentId?: number) {
  const { code } = await choseDetail(merchantId, studentId);
  if (+code === 1000) {
    history.push({
      pathname: '/',
    });
  }
}

function enterIndex(mId: number, studentId?: number) {
  const userType = sessionStorage.getItem('userType');
  if (userType === 'parent') {
    handleChoseDetail(mId, studentId);
  } else {
    handleChoseDetail(mId);
  }
}

const TeacherInfo = (props: any) => {
  const { loginUserName, loginUserPhone } = props.teacherUserInfo;
  const school = props.school;
  return (
    <div className={'userInfo'}>
      <div className={'userInfoHead'}>
        <div className={'headLeft'}>
          <span className={'userName'}>{loginUserName}</span>
          <span className={'userTitle'}>老师</span>
        </div>
        <div className="headRight">
          <span
            className="enter"
            onClick={() => {
              enterIndex(school.mId);
            }}
          >
            选择进入
          </span>
        </div>
      </div>
      <div className="userInfoForm">
        <div className="infoItem">
          <div className="itemLeft">
            <span>老师姓名</span>
          </div>
          <div className="itemRight">
            <span>{loginUserName}</span>
          </div>
        </div>
        <div className="infoItem">
          <div className="itemLeft">
            <span>手机号码</span>
          </div>
          <div className="itemRight">
            <span>{loginUserPhone}</span>
          </div>
        </div>
        <div className="infoItem">
          <div className="itemLeft">
            <span>所在学校</span>
          </div>
          <div className="itemRight">
            <span>{school.mName}</span>
          </div>
        </div>
        <div className="infoItem">
          <div className="itemLeft">
            <span>所带班级</span>
          </div>
          <div className="itemRight">
            <span>{school.className}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserInfo = (props: any) => {
  const userInfo: UserInfo = props.userInfo;
  const { userCheckMessageVos } = userInfo;
  let userList = [] as any;
  userCheckMessageVos?.map((i) => {
    const res = userList.find((j: any) => i.studentId === j.studentId);
    if (!res) {
      userList.push(i);
    }
  });

  return (
    <>
      {userList?.map((item: any) => (
        <div key={item.studentId} className={'userInfo'}>
          <div className={'userInfoHead'}>
            <div className={'headLeft'}>
              <span className={'userName'}>{item.studentName}</span>
              <span className={'userTitle'}>学生</span>
            </div>
            <div className="headRight">
              <span
                className="enter"
                onClick={() => {
                  enterIndex(item.mId, item.studentId);
                }}
              >
                选择进入
              </span>
            </div>
          </div>
          <div className="userInfoForm">
            <div className="infoItem">
              <div className="itemLeft">
                <span>小孩姓名</span>
              </div>
              <div className="itemRight">
                <span>{item.studentName}</span>
              </div>
            </div>
            <div className="infoItem">
              <div className="itemLeft">
                <span>所在学校</span>
              </div>
              <div className="itemRight">
                <span>{item.mName}</span>
              </div>
            </div>
            <div className="infoItem">
              <div className="itemLeft">
                <span>所在班级</span>
              </div>
              <div className="itemRight">
                <span>{item.className}</span>
              </div>
            </div>
            <div className="infoItem">
              <div className="itemLeft">
                <span>亲属关系</span>
              </div>
              <div className="itemRight">
                <span>{item.identityStatus}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export interface SchoolItem {
  h5MessageSchoolVos: any[];
  mId: string;
  mName: string;
  className: string;
}

const Info = () => {
  const { setSchoolLists } = useModel('school');
  const { setStuList } = useModel('student');
  const [parentUserInfo, setParentUserInfo] = useState({});
  const [teacherUserInfo, setTeacherUserInfo] = useState({});
  const userType = sessionStorage.getItem('userType');
  const [classList, setClassList] = useState([]);

  // 家长
  async function handleGetParentInfo() {
    const { code, data } = await getParentInfo();
    if (+code === 1000) {
      setParentUserInfo(data);
      setStuList(data.userCheckMessageVos);
    }
  }

  // 老师
  async function handleGetTeacherInfo() {
    const { code, data } = await getTeacherInfo();
    if (+code === 1000) {
      setClassList(data.h5MessageSchoolVos);
      setSchoolLists(data.h5MessageSchoolVos);
      setTeacherUserInfo(data);
    }
  }

  useEffect(() => {
    if (userType === 'parent') {
      handleGetParentInfo();
    } else {
      handleGetTeacherInfo();
    }
  }, []);

  if (userType === 'parent') {
    return <UserInfo userInfo={parentUserInfo} />;
  } else {
    return (
      <div>
        {classList.map((school: any) => (
          <TeacherInfo
            key={school.mId}
            school={school}
            teacherUserInfo={teacherUserInfo}
          />
        ))}
      </div>
    );
  }
};

const LoginInfo = () => {
  return (
    <div className={'loginInfo'}>
      <div className={'more'}>
        <span>*请您认真核对个人信息</span>
      </div>
      <Info />
      <div className={'tips'}>
        <span>温馨提示，为避免发生错误，请您认真核对个人信息</span>
      </div>
    </div>
  );
};

export default () => {
  useEffect(() => {
    document.title = '用户信息';
  }, []);
  return (
    <div>
      <LoginInfo />
    </div>
  );
};
