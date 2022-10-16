import { HomeItem, Btn } from './components';
import { TeacherBar } from '@/components/common';
import { history, useModel } from 'umi';
import { useEffect, useState } from 'react';
import { teacherIndexDetail } from './service';

interface UserInfo {
  userName: string;
  mName: string;
}

const TeacherHome = () => {
  const jhBtn: Btn[] = [
    {
      icon: require('@/assets/image/home/statistics.png'),
      name: '缴费统计',
      path: '/teacher/paymentStatistics',
    },
    {
      icon: require('@/assets/image/home/detailed.png'),
      name: '缴费明细',
      path: '/teacher/paymentData',
    },
    // {
    //   icon: require('@/assets/image/home/wallet.png'),
    //   name: '钱包',
    //   path: '/teacher/wallet',
    // },
  ];
  const xwBtn: Btn[] = [
    {
      icon: require('@/assets/image/home/notice.png'),
      name: '学校公告',
      path: '/teacher/notice',
    },
  ];
  const { schoolInfo } = useModel('school');
  const { headimgurl } = useModel('user');
  const [userInfo, setUserInfo] = useState<UserInfo>();

  async function getTeacherIndexDetail() {
    const { code, data } = await teacherIndexDetail();
    if (+code === 1000) {
      setUserInfo(data);
    }
  }

  useEffect(() => {
    getTeacherIndexDetail();
  }, []);

  return (
    <div className={'home'}>
      <div className="homeHead">
        <div className="headBox">
          <div className="pic">
            <img
              src={headimgurl || require('@/assets/image/userPic.png')}
              alt=""
            />
          </div>
          <div className="infoBox">
            <div className="title">
              <span>{userInfo?.mName}</span>
            </div>
            <div className="userInfo">
              <div className="userName">
                <span>{userInfo?.userName}</span>
                <span>老师</span>
              </div>
              <div
                className="changeSchoolBtn"
                onClick={() => {
                  history.push({
                    pathname: '/changeSchool',
                    query: {
                      userName: userInfo?.userName as string,
                    },
                  });
                }}
              >
                <img src={require('@/assets/image/attribution.png')} alt="" />
                <span>切换学校</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeItem title={'缴费管理'} btnList={jhBtn} />
      <div className="line" />
      <HomeItem title={'校务管理'} btnList={xwBtn} />
      <TeacherBar active={'home'} />
    </div>
  );
};

export default TeacherHome;
