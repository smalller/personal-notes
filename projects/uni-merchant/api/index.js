import Vue from 'vue'
import uniRequest from 'uni-request';
import RongIMLib from '../common/js/RongIMLib-3.0.7.1-dev.js'


let token = '',
	appkey = '', //融云apk
	url = '', //请求地址
	showImgPrefix = '', //图片头
	fileUpload = ''; //图片上传地址

if (process.env.NODE_ENV === 'development') {
	appkey = '82hegw5u8vgdx';
	url = '/h5api';
	showImgPrefix = '/h5api/merchant/store/system/upload/down?keyName=';
	fileUpload = '/h5api/merchant/store/system/upload/create';
} else {
	appkey = '82hegw5u8vgdx';
	url = 'https://storetest.cdhqht.com';
	showImgPrefix = 'https://storetest.cdhqht.com/merchant/store/system/upload/down?keyName=';
	fileUpload = 'https://storetest.cdhqht.com/merchant/store/system/upload/create';

	// appkey = 'e0x9wycfepwtq';
	// url = 'https://store.cdhqht.com';
	// showImgPrefix = 'https://store.cdhqht.com/merchant/store/system/upload/down?keyName=';
	// fileUpload = 'https://store.cdhqht.com/merchant/store/system/upload/create';
}


uniRequest.defaults.baseURL = url;
uniRequest.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';


//融云客户端初始化
var config = {
	appkey
};
var im = RongIMLib.init(config);



// 请求拦截
uniRequest.interceptors.request.use(
	request => {
		//配置请求头
		token = uni.getStorageSync('uni-userInfo') ? JSON.parse(uni.getStorageSync('uni-userInfo')).token : '';
		request.headers.common['X-Store-Token'] = token;
		return Promise.resolve(request);
	},
	err => {
		uni.hideLoading()
		Vue.prototype.$errToast('请求失败，请检查网络')
		return Promise.reject(err);
	});


// 响应拦截
uniRequest.interceptors.response.use(function(response) {
	if (response.data.code === 0) {
		return Promise.resolve(response);
	} else if (response.data.code === 700) {
		//如果未登录或者被禁用，就直接跳到登录页面
		//断开链接融云服务器
		im.disconnect().then(() => {});
		uni.navigateTo({
			url: '/pages/login/login'
		})
		Vue.prototype.$errToast(response.data.msg);
		uni.removeStorageSync('uni-userInfo');
		return response;
	} else if (response.data.code === 660) {
		//店铺被禁用
		Vue.prototype.$errToast(response.data.msg);
		return response;
	} else {
		Vue.prototype.$errToast(response.data.msg);
		return response;
	}
}, function(error) {
	uni.hideLoading()
	Vue.prototype.$errToast('请求失败，请检查网络')
	return Promise.reject(error);
});


//文件上传
function file_post(fileUrl, data = []) {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: fileUrl,
			filePath: data,
			timeout: 30000,
			name: 'file',
			success: (uploadFileRes) => {
				resolve(JSON.parse(uploadFileRes.data))
			},
			fail: (err) => {
				reject(err)
			}
		});
	})
}

//传值为纯数组时
function arr_post(url, data = []) {
	return new Promise((resolve, reject) => {
		uni.request({
			method: 'POST',
			url: uniRequest.defaults.baseURL + url,
			data,
			timeout: 30000,
			header: {
				'Content-Type': 'application/json;charset=UTF-8',
				'X-Store-Token': token
			},
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err)
			}
		});
	})
}

function get(url, data = {}) {
	return new Promise((resolve, reject) => {
		uniRequest.get(url, data).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err)
		});
	})
}

function post(url, data = {}) {
	return new Promise((resolve, reject) => {
		uniRequest.post(url, data).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err)
		});
	})
}

function Delete(url, data = {}) {
	return new Promise((resolve, reject) => {
		uniRequest.delete(url, data).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err)
		});
	})
}

function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		uniRequest.put(url, data).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err)
		});
	})
}


export {
	get,
	post,
	Delete,
	put,
	file_post,
	arr_post,
	showImgPrefix,
	fileUpload,
	appkey
}
