import './index.less';
import { history } from 'umi';
import { readNotice } from './service';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface Details {
  title: string;
  createTime: string;
  content: string;
}

interface Html {
  __html: string;
}

const Details = (props: Details) => {
  const html: Html = {
    __html: props.content,
  };
  return (
    <div className={'details'}>
      <div className="titleBox">
        <div className="title">{props.title}</div>
        <div className="date">
          {dayjs(props.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
      <div className="content" dangerouslySetInnerHTML={html}></div>
    </div>
  );
};

export default () => {
  document.title = '学校公告';
  const [detailInfo, setDetailInfo] = useState<Details>({
    title: '',
    createTime: '',
    content: '',
  });
  const id = history.location.query?.id as string;

  useEffect(() => {
    handleReadNotice();
  }, []);

  async function handleReadNotice() {
    const { code, data } = await readNotice({
      id,
    });
    if (+code === 1000) {
      setDetailInfo(data);
    }
  }

  return (
    <div className={'noticeDetails'}>
      <Details
        title={detailInfo.title}
        createTime={detailInfo.createTime}
        content={detailInfo.content}
      />
    </div>
  );
};
