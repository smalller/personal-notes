import './index.less';
import { ParentBar } from '@/components/common';
import { history, useModel } from 'umi';
import { useState, useEffect } from 'react';
import { myDetail } from './service';

interface UserInfo {
  userName: string;
  userPhone: string;
  noticeStatus: string | boolean | string;
  headerUrl: string;
  checkStatus: number;
}

const TeacherUser = function () {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { headimgurl } = useModel('user');

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

  return (
    <div className="parentUser">
      <div className="head">
        <div className={'userInfo'}>
          <div>
            <span className="userName">{userInfo?.userName}</span>
          </div>
          <div>{userInfo?.userPhone}</div>
        </div>
        <div className="userPic">
          <img
            src={headimgurl || require('@/assets/image/userPic.png')}
            alt=""
          />
        </div>
      </div>
      <div className={'content'}>
        <div className={'item'}>
          <div>
            <img src={require('@/assets/image/user/receipt.png')} alt="" />
            <span>交易记录</span>
          </div>
          <div
            onClick={() => {
              history.push({
                pathname: '/parent/transactionList',
              });
            }}
          >
            <span>支付凭证查询</span>
            <img src={require('@/assets/image/right.png')} alt="" />
          </div>
        </div>
        {userInfo?.checkStatus === 1 && (
          <div
            className={'item'}
            onClick={() => {
              history.push({
                pathname: '/selectUserType',
                query: {
                  flag: '2',
                },
              });
            }}
          >
            <div>
              <img src={require('@/assets/image/user/new.png')} alt="" />
              <span>身份切换</span>
            </div>
            <div>
              <span>家长、教师身份切换</span>
              <img src={require('@/assets/image/right.png')} alt="" />
            </div>
          </div>
        )}
        <div
          className={'item'}
          onClick={() => {
            history.push({
              pathname: '/parent/editUser',
            });
          }}
        >
          <div>
            <img src={require('@/assets/image/user/user.png')} alt="" />
            <span>个人资料</span>
          </div>
          <div>
            <span>点击编辑</span>
            <img src={require('@/assets/image/right.png')} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  return (
    <div>
      <TeacherUser />
      <ParentBar active={'user'} />
    </div>
  );
};
