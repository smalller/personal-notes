import { useState, useCallback, useEffect } from 'react';

interface StuInfo {
  classId: string;
  className: string;
  mName: string;
  gradeName: string;
  studentName: string;
  studentId: number;
  [key: string]: number | string;
}

export default function studentInfo() {
  const [stuList, setStuLists] = useState<StuInfo[]>(
    JSON.parse(sessionStorage.getItem('stuList') || '[]') || [],
  );

  const [stuInfo, setStuInfo] = useState<StuInfo>();

  const setStuList = useCallback((list: StuInfo[]) => {
    setStuLists(list);
    sessionStorage.setItem('stuList', JSON.stringify(list));
  }, []);

  const setStu = useCallback((stu: any) => {
    sessionStorage.setItem('studentId', stu.studentId);
    setStuInfo(stu);
  }, []);

  useEffect(() => {
    if (stuList.length > 0) {
      const studentId = sessionStorage.getItem('studentId');
      if (!studentId) {
        setStu(stuList[0]);
      } else {
        const stu = stuList.find(
          (item: StuInfo) => item.studentId.toString() === studentId.toString(),
        );
        if (stu) {
          setStu(stu);
        } else {
          setStu(stuList[0]);
        }
      }
    }
  }, [stuList]);

  return {
    stuList,
    setStuList,
    setStu,
    stuInfo,
  };
}
