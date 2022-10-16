import {
	dcode
} from '../api/pay.js'
import store from '../store/index.js'

/**
 * 获取服务供应商
 */
export function getServerType(type = '') {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: type,
			success: (e) => {
				resolve(e.provider)
			}
		})
	})
}

/**
 * @param {Object} code
 * @param {Object} iv
 * 解码微信加密信息
 */
export function wxDeCode(code, iv) {
	return new Promise((resolve, reject) => {
		dcode({
			iv: iv,
			encryptedData: code,
			openid: uni.getStorageSync('openId')
		}).then(res => {
			if (+res.code === 0) {
				resolve(JSON.parse(res.data))
			}

		})
	})
}

/**
 * 自动生成最近5年年份选项
 * @returns
 */
export const createFiveYears = () => {
	const arr = [{
		label: new Date().getFullYear(),
		value: new Date().getFullYear(),
	}, ];
	for (let i = 1; i < 5; i++) {
		const obj = {
			label: arr[arr.length - 1].label - 1,
			value: arr[arr.length - 1].value - 1,
		};
		arr.push(obj);
	}
	return arr;
};

/**
 * 获取微信用户信息
 */
uni.removeStorageSync('wxUserInfo')
export const getWxUserInfo = () => {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			desc: '发布评论',
			success: (e) => {
				uni.setStorageSync('wxUserInfo', e.userInfo);
				resolve(true);
			},
			fail: () => {
				// resolve(false);
				reject(false)
			}
		})
	})
}


export const uploadFile = (filePaths = [], type = 'image') => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			mask: true,
			title: '上传中'
		})
		const arr = [];
		filePaths.forEach(src => {
			uni.uploadFile({
				url: `${uni.getStorageSync('baseUrl')}/mamserver/api/file/appletUpload?bizType=${type}&fileType=${type}`,
				filePath: src,
				name: 'file',
				header: {
					userId: store.state.userId,
					token: store.state.token,
					version: '1.4.0',
					firmId: 'zdyjb',
					deviceType: 'mp-weixin'
				},
				success: (e) => {
					const data = JSON.parse(e.data)
					if (+data.code === 0) {
						arr.push(data.data)
						if (arr.length === filePaths.length) {
							uni.hideLoading()
							resolve(arr)
						}
					} else {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: data.msg
						})
					}
				},
				fail() {
					uni.hideLoading()
					uni.showToast({
						icon: 'error',
						title: '上传失败'
					})
				}
			})
		})
	})



}


export const getIDPhoto = () => {
	return new Promise((resolve, reject) => {
		let routes = getCurrentPages() //获取当前页面栈
		if (Array.isArray(routes) && routes.length === 0) {
			uni.setStorageSync('redirect', '/')
		} else {
			let curRoute ='/' + routes[routes.length - 1].route //获取当前页面的路由
			uni.setStorageSync('redirect', curRoute)
		}
		uni.navigateTo({
			url: '/pageCamera/camera/camera'
		})
	})
}
var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

export const wxBtoa = (string) => {
	string = String(string);
	var bitmap, a, b, c, result = "",
		i = 0,
		rest = string.length % 3;
	for (; i < string.length;) {
		if ((a = string.charCodeAt(i++)) > 255 ||
			(b = string.charCodeAt(i++)) > 255 ||
			(c = string.charCodeAt(i++)) > 255)
			throw new TypeError(
				"Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range."
				);
		bitmap = (a << 16) | (b << 8) | c;
		result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) +
			b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
	}
	return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
};

export const wxAtob = (string) => {
	string = String(string).replace(/[\t\n\f\r ]+/g, "");
	if (!b64re.test(string))
		throw new TypeError(
			"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
	string += "==".slice(2 - (string.length & 3));
	var bitmap, result = "",
		r1, r2, i = 0;
	for (; i < string.length;) {
		bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12 |
			(r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));
		result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
			r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
			String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
	}
	return result;
};
