import Vue from 'vue'
import RongIMLib from '../../common/js/RongIMLib-3.0.7.1-dev.js'


//客户端初始化
var config = {
	appkey: Vue.prototype.$appkey,
};
var im = RongIMLib.init(config);


//客户端连接服务器
function connectRongIM() {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('uni-userInfo') ? JSON.parse(uni.getStorageSync('uni-userInfo')).rongToken : '';
		im.connect({
			token,
		}).then((user) => {
			resolve(user)
		}).catch((error) => {
			reject(error)
		});
	})
}


//客户端断开链接服务器
function disconnect() {
	im.disconnect().then(() => {});
}


//获取会话列表
function getConversationList() {
	return new Promise((resolve, reject) => {
		im.Conversation.getList().then(conversationList => {
			resolve(conversationList);
		}).catch(err => {
			reject(err);
		});
	})
}


export {
	connectRongIM,
	getConversationList,
	disconnect
}
