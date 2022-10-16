import { getTeacherSchool, SchoolItem } from './schoolService';
import { useState, useCallback, useEffect } from 'react';
import { useModel } from 'umi';

export default function schoolInfo() {
  const [schoolList, setSchoolList] = useState<SchoolItem[]>(
    JSON.parse(sessionStorage.getItem('schoolList') || '[]') || [],
  );
  const [schoolInfo, setSchoolInfo] = useState<SchoolItem>({
    h5MessageSchoolVos: [],
    mId: '',
    mName: '',
    className: '',
  });

  const setSchoolLists = useCallback((schools: SchoolItem[]) => {
    if (schoolList.length === 0) {
      const list: SchoolItem[] = [];
      schools.forEach((item) => {
        const data = list.find((s) => s.mId === item.mId);
        if (!data) {
          list.push(item);
        }
      });
      setSchoolList(list);
      sessionStorage.setItem('schoolList', JSON.stringify(list));
    }
  }, []);

  const setSchool = useCallback((school: any) => {
    sessionStorage.setItem('schoolId', school.mId);
    school.className = school.className;
    setSchoolInfo(school);
  }, []);

  useEffect(() => {
    if (schoolList.length > 0) {
      const mid = sessionStorage.getItem('schoolId');
      if (!mid) {
        setSchool(schoolList[0]);
      } else {
        const school = schoolList.find(
          (item) => item.mId.toString() === mid.toString(),
        );
        if (school) {
          setSchool(school);
        } else {
          setSchool(schoolList[0]);
        }
      }
    }
  }, [schoolList]);

  return {
    schoolList,
    schoolInfo,
    setSchool,
    setSchoolLists,
  };
}
