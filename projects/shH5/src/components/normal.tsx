import './normal.less';

interface Props {
  title: string;
}

export default function Normal(props: Props) {
  return (
    <div className="noticeNormal">
      <img src={require('@/assets/image/normal.png')} alt="" />
      <span>{props.title}</span>
    </div>
  );
}
