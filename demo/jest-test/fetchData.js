import axios from 'axios'

export const fetchData1 = () => {
  return axios({
    url: 'http://api.tianapi.com/txapi/tiangou/index',
    method: 'get'
  })
}

export const fetchData2 = () => {
  return axios({
    url: 'http://api1.tianapi.com/txapi/tiangou/index',
    method: 'get'
  })
}

export const fetchData3 = () => {
  return axios({
    url: 'http://api.tianapi.com/txapi/tiangou/index',
    method: 'get'
  })
}