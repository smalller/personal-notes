import './index.less';
import { TeacherBar } from '@/components/common';
import { history, useModel } from 'umi';
import { Switch, Dialog } from 'react-vant';
import { useState, useEffect } from 'react';
import { myDetail, updateMyDetail } from '../editUser/service';
import { Toast } from 'react-vant';
interface UserInfo {
  userName: string;
  account: string;
  noticeStatus: string | boolean | string;
  headerUrl: string;
  checkStatus: number;
}

const TeacherUser = function () {
  const { headimgurl } = useModel('user');
  const [value, setValue] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    getMyDetail();
  }, []);

  // 获取个人信息
  async function getMyDetail(): Promise<void> {
    const { code, data } = await myDetail();
    if (+code === 1000) {
      setValue(+data.noticeStatus === 1 ? true : false);
      setUserInfo(data);
    }
  }

  // 修改个人信息
  async function handleUpdateMyDetail(flag: boolean): Promise<void> {
    const { code } = await updateMyDetail({
      noticeStatus: flag === true ? '1' : '0',
    });
    if (+code === 1000) {
      Toast.success('修改成功');
    } else {
      Toast.info('修改失败');
    }
  }

  const onChange = async (checked: boolean) => {
    let txt = '';
    if (value) {
      txt = '关闭';
    } else {
      txt = '打开';
    }
    try {
      await Dialog.confirm({
        title: '提醒',
        message: `是否${txt}收款通知？`,
      });
      setValue(checked);
      handleUpdateMyDetail(checked);
    } catch {
      // 取消dialog
    }
  };

  return (
    <div className="teacherUser">
      <div className="head">
        <div className={'userInfo'}>
          <div>
            <span>{userInfo?.userName}</span>
            <span>老师</span>
          </div>
          <div>{userInfo?.account}</div>
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
            <img src={require('@/assets/image/user/user.png')} alt="" />
            <span>个人资料</span>
          </div>
          <div
            onClick={() => {
              history.push({
                pathname: '/teacher/editUser',
              });
            }}
          >
            <span>点击编辑个人资料</span>
            <img src={require('@/assets/image/right.png')} alt="" />
          </div>
        </div>
        <div className={'item'}>
          <div>
            <img src={require('@/assets/image/user/receipt.png')} alt="" />
            <span>交易记录</span>
          </div>
          <div
            onClick={() => {
              history.push({
                pathname: '/teacher/transactionList',
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
        <div className={'item'}>
          <div>
            <img src={require('@/assets/image/user/notification.png')} alt="" />
            <span>收款通知</span>
          </div>
          <div>
            <Switch
              size="24px"
              activeColor="#ee0a24"
              checked={value}
              onChange={onChange}
            />
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
      <TeacherBar active={'user'} />
    </div>
  );
};
