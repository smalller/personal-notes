import { ParentBar } from '@/components/common';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './index.less';
import { history } from 'umi';
import { selectStudentNotices, splitSonOrderExist } from './service';
import { Toast, PullRefresh } from 'react-vant';
import Normal from '@/components/normal';

interface Notice {
  className: string;
  createTime: string;
  gradeName: string;
  id: number;
  mName: string;
  status: string;
  studentName: string;
  title: string;
  type: string;
  classId: number;
  gradeId: number;
  studentId: number;
  projectId: number;
  statusStr: string;
  content: string;
}

interface NoticeItemProps {
  data: Notice;
}

async function goToPayDetail(
  classId: number,
  gradeId: number,
  projectId: number,
  studentId: number,
) {
  const { code } = await splitSonOrderExist({
    classId,
    gradeId,
    projectId,
    studentId,
  });
  let pathname = '';
  if (+code === 1000) {
    pathname = '/pay';
  } else {
    pathname = '/parent/payDetails';
  }
  history.push({
    pathname,
    query: {
      classId: String(classId),
      gradeId: String(gradeId),
      projectId: String(projectId),
      studentId: String(studentId),
      flag: '1',
    },
  });
}

const NoticeItem = (props: NoticeItemProps) => {
  const data: Notice = props.data;
  return (
    <div
      className={'noticeItem'}
      onClick={() => {
        if (+data.type === 1) {
          if (+data.status === 1) {
            Toast.info('该订单已完成');
            return;
          }
          goToPayDetail(
            data.classId,
            data.gradeId,
            data.projectId,
            data.studentId,
          );
        }
      }}
    >
      <div className={'date'}>
        <span>{dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>
      <div className={'content'}>
        <div className={'statusBox'}>
          <div className="left">
            <img src={require('@/assets/image/bi.png')} alt="" />
            <span className={'type'}>
              {data.type === '1' ? '缴费' : '通知'}
            </span>
            <span className={'name'}>({data.studentName})</span>
            <div className={`${data.type === '1' ? 'point' : ''}`}></div>
          </div>
          <div className="right">
            <div className={`status ${data.status === '1' ? 'ok' : ''}`}>
              {data.statusStr}
            </div>
          </div>
        </div>
        <div className={'titleBox'}>
          <div className={'title'}>{data.title}</div>
          {data?.content && <div>{data.content}</div>}
          <div className={'className'}>
            <span>{data.mName}</span>
            <span> - </span>
            <span>
              {data.gradeName}年级
              {data.className}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NoticeProps {
  list: Notice[];
  onRefresh: () => void;
}

const Notice = (props: NoticeProps) => {
  const { list } = props;
  return (
    <PullRefresh
      onRefresh={() => {
        props.onRefresh();
      }}
      className={'notice'}
    >
      {list?.map((item) => (
        <NoticeItem data={item} key={item.id} />
      ))}
    </PullRefresh>
  );
};

export default () => {
  document.title = '通知';

  const [isReady, setIsReady] = useState(false);
  let [pageNum, setPageNum] = useState<number>(1);
  let totalNum: number = 0;
  const [list, setList] = useState<Notice[]>([]);

  useEffect(() => {
    getSelectStudentNotices();
    window.onscroll = () => {
      const clientHeight = document.documentElement.clientHeight; // 网页可视区域高度
      const scrollTop = document.documentElement.scrollTop; // 滚动条垂直位置
      const scrollHeight = document.documentElement.scrollHeight; // 网页总高度

      if (clientHeight + scrollTop >= scrollHeight) {
        if (list.length < totalNum) {
          setPageNum(pageNum++);
          getSelectStudentNotices();
          console.log('触底了');
        }
      }
    };
  }, []);

  async function getSelectStudentNotices() {
    const { code, data } = await selectStudentNotices({
      pageNum,
      pageSize: 20,
    });
    if (+code === 1000) {
      setList((list) => {
        return (list = list.concat(data.list));
      });
      if (data.list.length === 0) {
        let page = data.pageNum - 1;
        if (page < 1) {
          page = 1;
        }
        console.log(data.pageNum, page);
        setPageNum(page);
      }
      totalNum = data.total;
      setIsReady(true);
    }
  }

  return (
    <div>
      {list.length > 0 ? (
        <Notice
          list={list}
          onRefresh={() => {
            setPageNum(1);
            setList([]);
            getSelectStudentNotices();
          }}
        />
      ) : isReady ? (
        <Normal title={'暂无信息'} />
      ) : (
        <></>
      )}
      <ParentBar active={'notice'} />
    </div>
  );
};
