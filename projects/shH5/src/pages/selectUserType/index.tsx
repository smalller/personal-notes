import './index.less';
import { history, useModel } from 'umi';
import {
  switchingIdentityParent,
  switchingIdentityTeacher,
  choseIdentity,
} from './service';
import { getTeacherInfo, getParentInfo } from '../loginInfo/service';

// 家长切换到教师
async function hanldeSwitchingIdentityParent() {
  const { code } = await switchingIdentityParent();
  if (+code === 1000) {
    history.push({
      pathname: '/',
    });
  }
}

// 教师切换到家长
async function hanldeSwitchingIdentityTeacher() {
  const { code } = await switchingIdentityTeacher();
  if (+code === 1000) {
    history.push({
      pathname: '/parent/notice',
    });
  }
}

const SelectUserType = () => {
  const flag = history.location.query?.flag as string; // 1表示从登录页跳过来，2表示点击切换身份跳过来

  const { setSchoolLists } = useModel('school');
  const { setStuList } = useModel('student');

  // 获取老师学校列表
  async function handleGetTeacherInfo() {
    const { code, data } = await getTeacherInfo();
    if (+code === 1000) {
      setSchoolLists(data?.h5MessageSchoolVos);
    }
  }

  // 获取家长娃儿列表
  async function handleGetParentInfo() {
    const { code, data } = await getParentInfo();
    if (+code === 1000) {
      setStuList(data?.userCheckMessageVos);
    }
  }

  const selectUserType = (type: string) => {
    sessionStorage.setItem('userType', type);
    if (+flag === 1) {
      handleChoseIdentity(type === 'teacher' ? 1 : 2);
    } else {
      if (type === 'teacher') {
        hanldeSwitchingIdentityParent();
        handleGetTeacherInfo();
      } else {
        hanldeSwitchingIdentityTeacher();
        handleGetParentInfo();
      }
    }
  };

  async function handleChoseIdentity(userType: number) {
    const { code, data } = await choseIdentity(userType);
    if (+code === 1000) {
      sessionStorage.setItem('userId', data.id);
      // 已经不是第一次登录，直接跳首页，否则去核对相关信息
      if (data.merchantId || data.studentId) {
        if (userType === 1) {
          handleGetTeacherInfo();
        } else {
          handleGetParentInfo();
        }
        history.push({
          pathname: userType === 1 ? '/' : '/parent/notice',
        });
      } else {
        history.push({
          pathname: '/loginInfo',
        });
      }
    }
  }

  return (
    <div className={'selectUserType'}>
      <div className="selectTitle">
        <span>请选择您的在校身份</span>
      </div>
      <div className="selectBox">
        <div className="selectItem" onClick={() => selectUserType('parent')}>
          <div className={'itemLeft'}>
            <img src={require('@/assets/image/parent.png')} alt="" />
            <span>我是家长</span>
          </div>
          <div className={'itemRight'}>
            <img src={require('@/assets/image/right.png')} alt="" />
          </div>
        </div>
        <div className="selectItem" onClick={() => selectUserType('teacher')}>
          <div className={'itemLeft'}>
            <img src={require('@/assets/image/teacher.png')} alt="" />
            <span>我是老师</span>
          </div>
          <div className={'itemRight'}>
            <img src={require('@/assets/image/right.png')} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  document.title = '切换身份';
  const { setCancelCheckPath } = useModel('user');
  setCancelCheckPath(history.location.pathname); //允许游客访问页面
  return (
    <div>
      <SelectUserType />
    </div>
  );
};
