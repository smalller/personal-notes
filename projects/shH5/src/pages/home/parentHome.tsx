import { HomeItem, Btn } from './components';
import { ParentBar } from '@/components/common';
import { history, useModel } from 'umi';
import { useEffect, useState } from 'react';
import { parentIndexDetail } from './service';

interface UserInfo {
  mcName: string;
  studentName: string;
}

const ParentHome = () => {
  const jhBtn: Btn[] = [
    {
      icon: require('@/assets/image/home/tuition.png'),
      name: '学费杂费',
      path: '/parent/paymentStatisticsSelect',
    },
    {
      icon: require('@/assets/image/home/bill.png'),
      name: '电子收据',
      path: '/parent/receiptList',
    },
  ];

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { headimgurl } = useModel('user');

  async function getParentIndexDetail() {
    const { code, data } = await parentIndexDetail();
    if (+code === 1000) {
      setUserInfo(data);
    }
  }

  useEffect(() => {
    getParentIndexDetail();
  }, []);

  return (
    <div className={'home parentHome'}>
      <div className="homeHead">
        <div className="headBox parentHead">
          <div className="pic">
            <img
              src={headimgurl || require('@/assets/image/userPic.png')}
              alt=""
            />
          </div>
          <div className="infoBox">
            <div className="title">
              <span>{userInfo?.studentName}</span>
            </div>
            <div className="userInfo">
              <div className="userName">
                <span className={'studentSchoolName'}>{userInfo?.mcName}</span>
              </div>
              <div
                className="changeSchoolBtn"
                onClick={() => {
                  history.push({
                    pathname: '/changeStudent',
                  });
                }}
              >
                <img src={require('@/assets/image/attribution.png')} alt="" />
                <span>切换孩子</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeItem title={'支付服务'} btnList={jhBtn} />
      <ParentBar active={'home'} />
    </div>
  );
};

export default ParentHome;
