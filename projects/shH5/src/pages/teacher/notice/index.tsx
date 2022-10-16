import './index.less';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { getTeacherNotice, Notice } from '@/pages/teacher/notice/service';
import dayjs from 'dayjs';

const NoticeNormal = () => (
  <div className="noticeNormal">
    <img src={require('@/assets/image/normal.png')} alt="" />
    <span>暂未发布公告</span>
  </div>
);

interface NoticeList {
  noticeList: Notice[];
}

const NoticeItem = (props: any) => {
  const userType = sessionStorage.getItem('userType');
  return (
    <div className="noticeItemBox">
      {+props.type === 1 ? (
        <div
          className={'noticeItem'}
          onClick={() => {
            history.push({
              pathname: '/teacher/noticeDetails',
              query: {
                id: props.id,
              },
            });
          }}
        >
          <div className={'itemTop'}>
            <div className={'itemTitle'}>{props.title}</div>
          </div>
          <div className={'itemInfo'}>
            <div className={'left'}>
              {dayjs(props.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div className={'right active'}>查看详情</div>
          </div>
        </div>
      ) : (
        <div className={'noticeItem'}>
          <div className={'itemTop'}>
            <div className={'itemTitle'}>{props.projectName}</div>
          </div>
          <div className="stu-info">
            <span>{props.studentName}</span>
            <span>￥{props.payMoney}</span>
          </div>
          <div className={'itemInfo'}>
            <div className={'left'}>
              {dayjs(props.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NoticeList = (props: NoticeList) => {
  return (
    <div className={'noticeList'}>
      {props.noticeList.map((item) => {
        return <NoticeItem key={item.id} {...item} />;
      })}
    </div>
  );
};

export default () => {
  document.title = '学校公告';
  const [isReady, setIsReady] = useState(false);
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  let [pageNum, setPageNum] = useState<number>(1);
  let totalNum: number = 0;

  useEffect(() => {
    const userType = sessionStorage.getItem('userType');
    if (userType === 'teacher') {
      handleGetTeacherNotice();
      window.onscroll = () => {
        const clientHeight = document.documentElement.clientHeight; // 网页可视区域高度
        const scrollTop = document.documentElement.scrollTop; // 滚动条垂直位置
        const scrollHeight = document.documentElement.scrollHeight; // 网页总高度

        if (clientHeight + scrollTop >= scrollHeight) {
          if (noticeList.length < totalNum && noticeList.length >= 20) {
            setPageNum(pageNum++);
            handleGetTeacherNotice();
            console.log('触底了');
          }
        }
      };
    }
  }, []);

  async function handleGetTeacherNotice() {
    const { code, data } = await getTeacherNotice({
      pageNum,
      pageSize: 20,
    });
    if (+code === 1000) {
      setNoticeList((list) => {
        return (list = list.concat(data.list));
      });
      totalNum = data.total;
    }
    setIsReady(true);
  }

  if (noticeList.length > 0) {
    return (
      <div className={'notice'}>
        <NoticeList noticeList={noticeList} />
      </div>
    );
  } else if (isReady) {
    return (
      <div className={'notice'}>
        <NoticeNormal />
      </div>
    );
  } else {
    return <></>;
  }
};
