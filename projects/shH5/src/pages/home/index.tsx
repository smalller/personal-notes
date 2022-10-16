import './index.less';
import TeacherHome from './teacherHome';
import ParentHome from './parentHome';
import { history, useModel } from 'umi';
import { redirectLogin } from '@/base/common';
// import Vconsole from 'vconsole';
// new Vconsole();
// if (process.env.NODE_ENV === 'development') {

// }
declare const my: any; //预注册支付宝小程序内置API
export default () => {
  const { token, userId } = useModel('user');
  const userType = sessionStorage.getItem('userType');
  if (!token || !userId) {
  }

  document.title = '首页';
  if (userType === 'teacher') {
    return <TeacherHome />;
  } else if (userType === 'parent') {
    return <ParentHome />;
  } else {
    const type = sessionStorage.getItem('navigatorType');
    if (type === 'alipay') {
      my.getEnv(function (res: any) {
        if (+res.miniprogram) {
          history.push({
            pathname: '/payStatus',
          });
        } else {
          redirectLogin();
        }
      });
    } else {
      redirectLogin();
    }

    return <div></div>;
  }
};
