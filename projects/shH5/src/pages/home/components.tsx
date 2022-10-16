import {history} from "umi";

export interface Btn {
  icon: string;
  name: string;
  path: string;
}

interface HomeItem {
  title: string;
  btnList: Btn[];
}


const Btn = (props: Btn) => {
  return (
    <div className="btn" onClick={() => {
      history.push({
        pathname: props.path || '/'
      })
    }}>
      <img src={props.icon} alt=""/>
      <span>{props.name}</span>
    </div>
  )
}

export const HomeItem = (props: HomeItem) => {
  const btnList = props.btnList.map((item) => {
    return <Btn key={item.name} icon={item.icon} name={item.name} path={item.path}/>
  })
  return (
    <div className="homeItem">
      <div className="itemTitle">
        <span/>
        <p>{props.title}</p>
      </div>
      <div className="itemBox">
        {btnList}
      </div>
    </div>
  )
}
