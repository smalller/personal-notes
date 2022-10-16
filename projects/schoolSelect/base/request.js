import store from '../store'
import axios from 'axios'

// 自定义适配器来适配uniapp语法
axios.defaults.adapter = function(config) {
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		uni.request({
			method: config.method.toUpperCase(),
			url: uni.getStorageSync('baseUrl') + buildURL(config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data||{},
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};
				settle(resolve, reject, response);
			}
		})
	})
}

const server = axios.create({
  // baseURL: 'http://gateway.yjbit.zhidiansaas.com',
  // baseURL: 'https://api.v2.jinshuy.com',
  // baseURL: 'https://gateway.v2.test.jinshuy.com',
  timeout: 10000,
  headers: {
    version: '1.4.0',
    firmId: 'zdyjb',
	deviceType: 'mp-weixin'
  }
})

//请求拦截器
server.interceptors.request.use(config => {

  config.headers.userId = store.state.userId
  
  config.headers.token = store.state.token
  // config.headers.token = 'appdf978f30e4eb7536bc7940d14ffde8ec'

  return config
})

//响应拦截器
server.interceptors.response.use(response => {
	// console.log(response)
	if(response.data.code == 401) {
		// console.log('登录过期')
		uni.showToast({
			icon: 'none',
			title: '登录过期'
		})
		store.dispatch('loginOut')
	}
	  return Promise.resolve(response.data)

})

const service = (url, option = {}) => {
  option.url = url
  return server.request(option)
}

export default service;
