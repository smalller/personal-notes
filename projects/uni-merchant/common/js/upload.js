import Vue from 'vue'

//选择图片
function chooseImage(type) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1,
			success: (chooseImageRes) => {
				const isJPG = chooseImageRes.tempFiles[0].type === 'image/jpeg';
				const isPNG = chooseImageRes.tempFiles[0].type === 'image/png';
				// const isLt2M = chooseImageRes.tempFiles[0].size / 1024 / 1024 <= 1; //限制文件大小

				// //限制上传文件格式
				if (!isJPG && !isPNG) {
					Vue.prototype.$errToast('上传图片只能是JPG/PNG格式');
					return;
				}

				// //限制上传文件大小
				// if (isJPG || isPNG) {
				// 	if (!isLt2M) {
				// 		Vue.prototype.$errToast('图片大小不能超过1MB');
				// 		return;
				// 	}
				// }


				//resolve的值
				const fileInfo = {
					type,
					path: chooseImageRes.tempFilePaths[0]
				}
				resolve(fileInfo)
			},
			fail: err => {
				reject(err);
			}
		});
	})
}

//获取图片信息
// function getImgInfo(type, src) {
// 	return new Promise((resolve, reject) => {
// 		uni.getImageInfo({
// 			src,
// 			success: (image) => {
// 				resolve(image)
// 			},
// 			fail: err => {
// 				reject(err)
// 			}
// 		});
// 	})
// }

//图片压缩
// uni.getImageInfo({
// 	src,
// 	success: image => {
// 		let canvasWidth = image.width //图片原始长宽
// 		let canvasHeight = image.height;
// 		let base = canvasWidth / canvasHeight;
// 		//设置画布最大宽度
// 		if (canvasWidth > 80) {
// 			canvasWidth = 80;
// 			canvasHeight = Math.floor(canvasWidth / base);
// 		}
// 		let img = new Image();
// 		img.src = src; // 要压缩的图片  
// 		let canvas = document.createElement('canvas');
// 		let ctx = canvas.getContext('2d');
// 		canvas.width = canvasWidth;
// 		canvas.height = canvasHeight;
// 		// 清除画布
// 		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
// 		//  将图片画到canvas上面   使用Canvas压缩  
// 		ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
// 		// canvas.toDataURL 返回的是一串Base64编码的URL
// 		// 指定格式 PNG  
// 		src = canvas.toDataURL("image/png");

// 		const fileInfo = {
// 			type,
// 			path: src
// 		}
// 		resolve(fileInfo)
// 	}
// });


export {
	chooseImage
}
