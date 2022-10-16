import VueCookie from 'vue-cookie'
import axios from 'axios'
import micell from 'micell'

export function getUrl() {
  let str_before = string.split(str)[0]
  return str_before
  // return 'fltdkzkt'
  // return process.env.NODE_ENV !== 'production' ? 'fltdkzkt' : 'yab'
}
export function getShareUrl(courseId, shareId) {
  let url =
    process.env.NODE_ENV === 'prod'
      ? '.live.zhidiansaas.com'
      : '.live.test.zhidiansaas.com'
  // return `https://${window.firmId}${url}/mobile/classMsg?${shareId}___`
  if (window.firmId === 'yab') {
    url = `https://live.tcc2017.org.cn/actionMoblieClass?${shareId}___`
  } else {
    url = `https://${window.firmId}${url}/actionMoblieClass?${shareId}___`
  }
  return url
}
export function getTouristUrl(shareId) {
  const url =
    process.env.NODE_ENV !== 'production'
      ? '.live.zhidiansaas.com'
      : '.live.test.zhidiansaas.com'
  return !shareId
    ? `https://${window.firmId}${url}/live`
    : `https://${window.firmId}${url}/live?${shareId}___`
}
export function DateFormat(date, fmt, outTime) {
  if (outTime) {
    const time = date.getTime() - outTime
    date.setTime(time)
  }

  const o = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        +RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function toHHmmss(time) {
  // console.log(time)
  let times
  let year = new Date().getFullYear()
  let month =
    new Date().getMonth() + 1 < 10
      ? `0${new Date().getMonth() + 1}`
      : new Date().getMonth() + 1
  let day =
    new Date().getDate() < 10
      ? `0${new Date().getDate()}`
      : new Date().getDate()
  let nowTime = `${year}-${month}-${day}`
  if (+time === +nowTime) {
    let s = new Date()
    let hours = s.getHours()
    let minutes = s.getMinutes()
    let seconds = s.getSeconds()
    times = `${hours}:${minutes}:${seconds}`
  } else {
    times = `00:00:00`
  }
  return times
}

export function download(url, name, school) {
  axios
    .get(url, {
      headers: {
        token: VueCookie.get(`token_${firmId}`),
        userId: VueCookie.get(`${firmId}_user_id`),
        schoolId: school,
      },
      responseType: 'blob',
    })
    .then((res) => {
      const blob = res.data
      const downUrl = URL.createObjectURL(blob)
      micell.download(downUrl, name)
    })
}
