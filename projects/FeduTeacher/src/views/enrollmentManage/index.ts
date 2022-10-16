export interface ruleFromDemo {
  admissionsCrowd: string;
  admissionsNum: string;
  admissionsPrecautions: string;
  admissionsTel: string;
  admissionsTitle: string;
  createUser: string;
  enableStatus: number;
  parentComments: [
    {
      names?: string;
      img?: string;
      imgOrder?: string | number;
      imgUrl?: string;
      workRemark?: string;
    }
  ];
  publicity: Array<publicDemo>;
  schoolAreaName?: string;
  schoolAreaNo?: string;
  schoolDescribe?: string;
  schoolGps?: string;
  schoolId?: string;
  schoolName: string;
  schoolRemark: string;
  themeId: string | number;
  stuWork: [
    {
      names?: string;
      img?: string;
      imgOrder?: string | number;
      imgUrl?: string;
      workRemark?: string;
    }
  ];
  id?:string,
  teacherRemark: [
    {
      names?: string;
      img?: string;
      imgOrder?: string | number;
      imgUrl?: string;
      workRemark?: string;
    }
  ];
}

interface publicDemo {
  names: string;
  img: string;
  imgOrder: string | number;
  imgUrl: string;
  workRemark: string;
}
