import store from '../store'
import axios from 'axios'

const server = axios.create({
  baseURL: process.env['VUE_APP_BASE_API'],
  timeout: 10000,
  headers: {
    userId: sessionStorage.getItem('userId'),
    token: sessionStorage.getItem('token'),
    schoolId: sessionStorage.getItem('schoolId'),
    version: process.env.NODE_ENV ==='dev'?'1.4.0':'',
    firmId: 'zdyjb'
  }
})

//请求拦截器
server.interceptors.request.use(config => {

  config.headers.userId = store.state.userId
  config.headers.token = store.state.token

  return config
})

//响应拦截器
server.interceptors.response.use(response => {
  return Promise.resolve(response.data)

})

const service = (url, option = {}) => {
  option.url = url
  return server.request(option)
}

export default service;
