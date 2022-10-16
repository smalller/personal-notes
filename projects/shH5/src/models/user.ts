import { useCallback, useEffect, useState } from 'react';
import { userLogin, getUserInfo } from '@/models/userService';
import type { LoginForm, ThacherUserInfo } from '@/models/userService';
import { history } from 'umi';
import { redirectLogin } from '@/base/common';

export default function useAuthModel() {
  const [thacherUserInfo, setThacherUserInfo] = useState<ThacherUserInfo>();
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [headimgurl, setHeadimgurl] = useState(
    sessionStorage.getItem('headimgurl'),
  );
  const [userName, setUserName] = useState('');
  const [loginForm, setLoginForm] = useState<LoginForm>();

  const setLoginFormData = useCallback((formItem: LoginForm) => {
    setLoginForm(formItem);
  }, []);

  const login = useCallback((loginForm: LoginForm) => {
    return new Promise((resolve, reject) => {
      userLogin(loginForm)
        .then((res) => {
          if (+res.code === 1000) {
            setThacherUserInfo(() => {
              setToken(res.data.token);
              sessionStorage.setItem('token', res.data.token);
              setUserId(res.data.id);
              // sessionStorage.setItem('userId', res.data.id);
              return res.data;
            });
            resolve(res.data);
          } else {
            console.log(res.message);
            reject(res);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }, []);

  // const getTeacherUserInfo = useCallback(() => {
  //   getUserInfo().then((res) => {
  //     if (+res.code === 1000) {
  //       setUserName(res.data.loginUser);
  //       setThacherUserInfo(res.data);
  //     }
  //   });
  // }, ['token']);

  const wechatLoginSetData = (data: any) => {
    return new Promise((resolve) => {
      setThacherUserInfo(() => {
        setToken(data.token);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('headimgurl', data.headimgurl);
        setHeadimgurl(data.headimgurl);
        setUserId(data.id);
        // sessionStorage.setItem('userId', res.data.id);
        return data;
      });
      resolve('');
    });
  };

  const loginOut = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserName('');
  }, []);

  let visitorPathName: string = '';
  // 设置游客页面
  const setCancelCheckPath = useCallback((pathname: string) => {
    visitorPathName = pathname;
  }, []);

  useEffect(() => {
    if (token && userId) {
      // console.log(token,userId)
      // getTeacherUserInfo();
    } else {
      if (visitorPathName !== history.location.pathname) {
        if (history.location.pathname !== '/payStatus') {
          loginOut();
          redirectLogin();
        }
      }
    }
  }, []);

  return {
    userId,
    token,
    userName,
    login,
    loginForm,
    setLoginFormData,
    thacherUserInfo,
    // getTeacherUserInfo,
    loginOut,
    setCancelCheckPath,
    wechatLoginSetData,
    headimgurl,
  };
}
