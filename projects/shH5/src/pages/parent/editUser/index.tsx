import './index.less';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { history } from '@@/core/history';
import { myDetail, updateMyDetail } from './service';
import { Toast } from 'react-vant';

interface UserInfo {
  userName: string;
  userPhone: string;
  headerUrl: string;
}

const UserInfo = function () {
  const { schoolInfo } = useModel('school');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  useEffect(() => {
    if (userInfo.userName) {
      setUserName(userInfo.userName);
    }
    if (userInfo.userPhone) {
      setUserPhone(userInfo.userPhone);
    }
  }, [userInfo]);

  useEffect(() => {
    getMyDetail();
  }, []);

  // 获取个人信息
  async function getMyDetail(): Promise<void> {
    const { code, data } = await myDetail();
    if (+code === 1000) {
      setUserInfo(data);
    }
  }

  // 修改个人信息
  async function handleUpdateMyDetail(): Promise<void> {
    const { code } = await updateMyDetail({
      userPhone,
      userName,
    });
    if (+code === 1000) {
      Toast.success('修改成功');
      history.goBack();
    }
  }

  return (
    <div className={'editUserInfo'}>
      <div className="userForm">
        <div className={'userItem'}>
          <div className="left">头像</div>
          <div className="right">
            <img
              className={'pic'}
              src={userInfo.headerUrl || require('@/assets/image/userPic.png')}
              alt=""
            />
          </div>
        </div>
        <div className={'userItem'}>
          <div className="left">姓名</div>
          <div className="right">
            <input
              type="text"
              value={userName}
              onChange={(val) => {
                setUserName(val.target.value);
              }}
            />
          </div>
        </div>
        <div className={'userItem'}>
          <div className="left">手机号码</div>
          <div className="right">
            <input
              type="number"
              value={userPhone}
              onChange={(val) => {
                setUserPhone(val.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="btnBox">
        <div
          className="btn"
          onClick={() => {
            handleUpdateMyDetail();
          }}
        >
          确定
        </div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '个人资料 ';
  return <UserInfo />;
};
