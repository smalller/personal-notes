import './index.less';
import { history, useModel } from 'umi';
import { useEffect, useState } from 'react';
import { cityListReq, schoolListReq } from './service';
import { Field, Toast } from 'react-vant';
import { Popup, Picker } from 'react-vant';

interface CityList {
  cityCode: string;
  cityName: string;
}

interface SchoolList {
  schoolId: string;
  schoolName: string;
}

function SelectParams() {
  const [visible, setVisible] = useState(false);
  const [popupStatus, setPopupStatus] = useState('');

  const [cityList, setCityList] = useState([]); // 城市列表
  const [cityListObj, setcityListObj] = useState([]); // 键值对城市列表
  const [city, setCity] = useState<string | number>(); // 回显选择的城市

  const [schoolList, setSchoolList] = useState([]); // 学校列表
  const [schoolListObj, setSchoolListObj] = useState([]); // 键值对学校列表
  const [school, setSchool] = useState<string | number>(); // 选择的学校的id
  const [schoolName, setschoolName] = useState<string | number>(); // 回显学校名称

  const [childName, setChildName] = useState(''); // 回显学生姓名

  function openPopup(status: string) {
    if (status === 'school' && schoolList.length === 0) {
      Toast.info('请先选择城市');
      return;
    }
    setPopupStatus(status);
    setVisible(true);
  }

  function handleSearch() {
    if (!school || !childName) {
      Toast.info('请选择并填写相关信息');
      return;
    }
    history.push({
      pathname: '/parent/paymentStatistics',
      query: {
        schoolId: String(school),
        studentName: childName,
      },
    });
  }

  // 城市列表
  async function getCityList() {
    const { code, data } = await cityListReq();
    if (+code === 1000) {
      setcityListObj(data);
      const arr = data.map((i: CityList) => i.cityName);
      setCityList(arr);

      // 默认展示第一个城市和学校
      setCity(data[0].cityName);
      getSchoolList(data[0].cityCode);
    }
  }

  // 选择城市
  function handleChooseCity(res: string | number) {
    setCity(res);
    let resCityCode = '';
    cityListObj.forEach((i: CityList) => {
      if (i.cityName === res) {
        resCityCode = i.cityCode;
      }
    });
    setschoolName('');
    getSchoolList(resCityCode);
    setVisible(false);
  }

  // 学校列表
  async function getSchoolList(resCityCode: string) {
    const { code, data } = await schoolListReq(resCityCode);
    if (+code === 1000) {
      // 默认设置第一个学校的id
      setschoolName(data[0].schoolName);
      setSchool(data[0].schoolId);
      setSchoolListObj(data);
      const arr = data.map((i: SchoolList) => i.schoolName);
      setSchoolList(arr);
    }
  }

  // 选择学校
  function handleChooseSchool(res: string | number) {
    setschoolName(res);
    let resSchoolId = '';
    schoolListObj.forEach((i: SchoolList) => {
      if (i.schoolName === res) {
        resSchoolId = i.schoolId;
      }
    });
    setSchool(resSchoolId);
    setVisible(false);
  }

  useEffect(() => {
    getCityList();
  }, []);

  return (
    <div className="selectParamsBox">
      <div className="selectList">
        <div
          className="selectItem"
          onClick={() => {
            openPopup('city');
          }}
        >
          <span>城市</span>
          <div className="showSelect">
            <span>{city}</span>
            <img src={require('@/assets/image/down.png')} alt="" />
          </div>
        </div>
        <div
          className="selectItem"
          onClick={() => {
            openPopup('school');
          }}
        >
          <span>学校</span>
          <div className="showSelect">
            <span>{schoolName}</span>
            <img src={require('@/assets/image/down.png')} alt="" />
          </div>
        </div>
        <div className="selectItem">
          <span>孩子姓名</span>
          <div>
            <Field
              placeholder="请输入孩子姓名"
              value={childName}
              onChange={(res) => {
                setChildName(res);
              }}
            />
          </div>
        </div>
        <Popup
          position="bottom"
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
        >
          {popupStatus === 'city' ? (
            <Picker
              title="城市列表"
              columns={cityList}
              onCancel={() => setVisible(false)}
              onConfirm={(res: string | number) => {
                handleChooseCity(res);
              }}
            />
          ) : (
            <Picker
              title="学校列表"
              columns={schoolList}
              onCancel={() => setVisible(false)}
              onConfirm={(res: string | number) => {
                handleChooseSchool(res);
              }}
            />
          )}
        </Popup>
      </div>
      <div className="btnBox">
        <button
          onClick={() => {
            handleSearch();
          }}
        >
          查询
        </button>
      </div>
    </div>
  );
}

export default () => {
  document.title = '查询缴费';
  return <SelectParams></SelectParams>;
};
