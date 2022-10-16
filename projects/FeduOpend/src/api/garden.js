//园所管理
import request from '@/utils/request'

//园所启停管理
const FORBIDGARDEN = '/schools/api/school/forbid'
//园所信息修改
const EDITDGARDEN = '/schools/api/school'
//删除摄像头
const DELCAMER = '/facility/device'
//新增园所信息
export function AddGarden(data) {
  return request({
    url: '/schools/api/school/add',
    method: 'post',
    data,
  })
}

//修改园所信息
export function EditGarden(data, id) {
  return request({
    url: `${EDITDGARDEN}/${id}`,
    method: 'put',
    data,
  })
}
//禁用园所信息
export function ForbidGarden(id) {
  return request({
    url: `${FORBIDGARDEN}/${id}/${id}?enable=1`,
    method: 'put',
  })
}

//启用园所信息
export function OpenGarden(id) {
  return request({
    url: `${FORBIDGARDEN}/${id}/${id}?enable=0`,
    method: 'put',
  })
}
//删除摄像头信息
export function DelCamer(id) {
  return request({
    url: `${DELCAMER}/${id}`,
    method: 'delete',
  })
}

//查询学校班级信息
export function GetSchoolClass(id) {
  return request({
    url: '/schools/api/clazz/getClazz',
    method: 'get',
    headers: {
      schoolId: id,
    },
  })
}

//查询学校监控数量
export function GetSchoolCamera(id) {
  return request({
    url: '/schools/api/school/getCameraNum?schoolId=' + id,
    method: 'get',
    headers: {
      schoolId: id,
    },
  })
}

//查询学校监控数量
export function SetSchoolCamera(num, id) {
  return request({
    url: `/schools/api/school/setCameraNum?cameraNum=${num}&schoolId=${id}`,
    method: 'put',
    headers: {
      schoolId: id,
    },
  })
}
