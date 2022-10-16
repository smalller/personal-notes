import {
	createOrder,
	startPay
} from '../api/pay.js'
import {
	getServerType
} from './common.js'
/**
 * @param {Object} params
 */
export default function(params) {
	return new Promise((resolve, reject) => {
		let data = {
			productType: 'Camera',
			productId: '',
			number: 1,
			openId: ''
		}
		data = Object.assign(data, params)
		createOrder(data).then(res => {
			// console.log(res);
			if (+res.code === 0) {
				pay(res.data).then(e => {
					// console.log(e);
					resolve(e)
				}).catch(e => {
					reject(e)
				})
			} else{
				reject(res)
			}
		})
	})
}

export async function pay(orderInfo) {
	const payType = await getServerType('payment')
	const openId = uni.getStorageSync('openId')
	return new Promise((resolve, reject) => {
		startPay({
			amount: orderInfo.amount,
			openId: openId,
			orderDesc: `金树丫-${orderInfo.description}`,
			orderId: orderInfo.id,
			payTradeType: 'MINI_PROGRAM',
			payGatewayType: '0',
			returnUrl: '1',
			schoolId: '1'
		}).then(res => {
			if (+res.code === 0) {
				const {
					data
				} = res;
				//#ifdef MP-WEIXIN
				wx.requestPayment({
					provider: payType.toString(),
					orderInfo: '',
					timeStamp: data.extraMsg.timeStamp,
					nonceStr: data.extraMsg.nonceStr,
					package: data.extraMsg.package,
					signType: data.extraMsg.signType,
					paySign: data.extraMsg.paySign,
					success: (e) => {
						// console.log(e, '支付成功');
						resolve(e)
					},
					fail: (e) => {
						// console.error(e, '支付失败')
						reject(e)
					}
				})
				//#endif
			}
		})

	})
}
