import React from 'react';
import { Tabbar } from 'react-vant';
import { history } from 'umi';

export const BackIcon = () => (
  <img src={require('@/assets/image/arrow-left.png')} alt="" />
);

interface TeacherBar {
  active: string;
}

export const TeacherBar = (props: TeacherBar) => {
  return (
    <Tabbar
      safeAreaInsetBottom={true}
      value={props.active}
      activeColor="#3775F6"
      inactiveColor="#999999"
      onChange={(e) => {
        history.push({
          pathname: e === 'home' ? '/' : '/teacher/user',
        });
      }}
    >
      <Tabbar.Item
        name={'home'}
        icon={(ac) => (
          <img
            style={{ width: '24px', height: '24px' }}
            src={
              ac
                ? require('@/assets/image/bar/home_a.png')
                : require('@/assets/image/bar/home.png')
            }
            alt={''}
          />
        )}
      >
        首页
      </Tabbar.Item>
      <Tabbar.Item
        name={'user'}
        icon={(ac) => (
          <img
            style={{ width: '24px', height: '24px' }}
            src={
              ac
                ? require('@/assets/image/bar/user_a.png')
                : require('@/assets/image/bar/user.png')
            }
            alt={''}
          />
        )}
      >
        我的
      </Tabbar.Item>
    </Tabbar>
  );
};

export const ParentBar = (props: TeacherBar) => {
  return (
    <Tabbar
      safeAreaInsetBottom={true}
      value={props.active}
      activeColor="#3775F6"
      inactiveColor="#999999"
      onChange={(e) => {
        let path = '/';
        switch (e) {
          case 'home':
            path = '/';
            break;
          case 'notice':
            path = '/parent/notice';
            break;
          case 'user':
            path = '/parent/user';
            break;
        }
        history.push({
          pathname: path,
        });
      }}
    >
      <Tabbar.Item
        name={'notice'}
        icon={(ac) => (
          <img
            style={{ width: '24px', height: '24px' }}
            src={
              ac
                ? require('@/assets/image/bar/notice_a.png')
                : require('@/assets/image/bar/notice.png')
            }
            alt={''}
          />
        )}
      >
        通知
      </Tabbar.Item>
      <Tabbar.Item
        name={'home'}
        icon={(ac) => (
          <img
            style={{ width: '24px', height: '24px' }}
            src={
              ac
                ? require('@/assets/image/bar/home_a.png')
                : require('@/assets/image/bar/home.png')
            }
            alt={''}
          />
        )}
      >
        首页
      </Tabbar.Item>
      <Tabbar.Item
        name={'user'}
        icon={(ac) => (
          <img
            style={{ width: '24px', height: '24px' }}
            src={
              ac
                ? require('@/assets/image/bar/user_a.png')
                : require('@/assets/image/bar/user.png')
            }
            alt={''}
          />
        )}
      >
        我的
      </Tabbar.Item>
    </Tabbar>
  );
};
