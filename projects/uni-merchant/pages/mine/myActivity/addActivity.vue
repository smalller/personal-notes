<template>
	<view>
		<!-- <navBars >添加活动</navBars> -->
		<view class="nav-bar-wrap">
			<view class="back-btn" @click="handleBack">
				<text class="iconfont">&#xe625;</text>
			</view>
			<view class="title-box">添加活动</view>
		</view>
		<view class="add">
			<view class="one">
				<text>活动主题</text>
				<input placeholder-style="color:#ccc" placeholder="请输入活动标题" v-model="name" class="input" />
			</view>
			<view class="two">
				<text>活动简介</text>
				<textarea placeholder-style="color:#ccc" placeholder="请输入活动简介" class="intext" maxlength="60" v-model="textarea"
				 @input="change" />
				<view class="bujin">
          <input v-model="num" />
          <text>/</text>
          <text>60</text>
        </view>
      </view>
      <view class="one">
        <text>活动时间</text>
        <input
          placeholder="请选择活动开始时间"
		  placeholder-style="color:#ccc"
          v-model="beganTime"
          :disabled="true"
          @click="checkTime"
		   class="input"
        />
        <u-picker
          v-model="timeShow"
          mode="time"
          :params="params"
          @confirm="timeConfirm"
        ></u-picker>
      </view>
      <view class="one" style="margin-top: 24rpx">
        <text style="color: #fff">结束时间</text>
        <input
          placeholder="请选择活动结束时间"
		  placeholder-style="color:#ccc"
          v-model="overTime"
          :disabled="true"
          @click="checkTime1"
		   class="input"
        />
        <u-picker
          v-model="timeShow1"
          mode="time"
          :params="params"
          @confirm="timeCancel"
        ></u-picker>
      </view>
      <view class="three">
        <text>活动缩略图</text>
        <view class="file-upload" @click="chooseImage" v-if="imgFlag"></view>
        <view
          style="width: 100%; height: 308rpx; position: relative"
          v-if="!imgFlag"
        >
          <image
            :src="getimg"
            mode=""
            style="width: 100%; height: 100%"
            @click="lookImg"
          ></image>
          <image
            src="../../../static/icon/delete.png"
            class="chacha"
            @click="delshi"
          ></image>
        </view>
      </view>
      <view class="four">
        <text>活动详情</text>
        <view class="rich" @click="block">
          <view v-html="this.html"></view>
        </view>
      </view>
    </view>
    <view class="footer">
      <view class="left" @click="cancle">取消</view>
      <view class="right" @click="submit">保存</view>
    </view>

    <!-- 遮罩 -->
    <u-modal
      v-model="show"
      :content="contents"
      :show-cancel-button="true"
      @confirm="conButton"
	   :mask-close-able="true"
    ></u-modal>
    <view class="surperBox"></view>
  </view>
</template>

<script>
	import {
		chooseImage
	} from '../../../common/js/upload.js'
export default {
  data() {
    return {
      num: 0,
      show: false,
      timeShow: false, //时间开关
      timeShow1: false, //时间开关
      name: null, //活动名称
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: false,
        second: false,
      },
      beganTime: null,
      startTime: null, //提交
      overTime: null,
      endTime: null, //提交
      contents: "确定保存吗？",
      textarea: "",
      html: "",
      fileList: [], //活动缩略图
      newfileList: [{ url: "" }],
      overfileList: [],
      thumb: "",
      stateFlag: true, //什么状态进入
      id: "", //修改id一路到底
      getimg: null,
      imgFlag: true, //上传图片
    };
  },
  onLoad(option) {
    // console.log(option)
    let storageId = uni.getStorageSync("text").id;
    if (storageId) {
      this.stateFlag = false;
    }
    if (option.id) {
      this.stateFlag = false;
      this.imgFlag = false;
      this.$get(`/merchant/store/active/getOneById/${option.id}`).then(
        (res) => {
          // console.log(res)
		  if(process.env.NODE_ENV==='development'){
		  	res.data.content = res.data.content.replace('/file/merchant/store/system/upload/down?keyName=','./h5api/merchant/store/system/upload/down?keyName=')
		  }
          uni.setStorageSync("text", {
            thumb: res.data.thumb, //活动内容
            endTime: res.data.endTime, //结束时间
            examine: 0, //审核标记
            name: this.name, //活动名称
            startTime: res.data.startTime, //开始时间
            synopsis: res.data.synopsis, //活动简介
            content: res.data.content, //富
            id: res.data.id,
          });
          uni.setStorageSync("richs", res.data.content);
          this.thumb = res.data.thumb;
          this.getimg = this.$imgHead + this.thumb;
          this.name = res.data.name;
          this.textarea = res.data.synopsis;
          this.num = this.textarea.length;
          this.beganTime = this.$date.timeFormattingDay(res.data.startTime);
          this.overTime = this.$date.timeFormattingDay(res.data.endTime);
          this.startTime = res.data.startTime;
          this.endTime = res.data.endTime;
          this.id = res.data.id;
          this.html = res.data.html;
          this.$nextTick(() => {
            this.html = res.data.content;
          });
        }
      );
    }

    this.getSto();
  },
  methods: {
    // 返回键
    handleBack() {
      uni.removeStorageSync("text");
      uni.removeStorageSync("richs");
      this.getSto();
      this.beganTime = null;
      this.overTime = null;
      this.num = 0;
      this.html = "";
      uni.navigateTo({
        url: "myActivity",
      });
    },
    // 选者图片上传
    chooseImage() {
      let _this = this;
	 chooseImage(-1)
	 	.then(res => {
	 		// console.log(res)
	 		uni.showLoading({
	 			title: '上传中...'
	 		})
	 		var data = res.path;
	 		_this.$file_post(this.$fileUpload, data).then((res) => {
	 		  // console.log(res)
	 		  if (res.code == 0) {
				  uni.hideLoading()
	 		    _this.getimg = _this.$imgHead + res.data;
	 		    _this.thumb = res.data;
	 		    _this.imgFlag = false;
	 		  }else{
				  uni.showToast({
				  	icon: "none",
				  	title: res.msg,
				  });
			  }
	 		});
	 	}) 
    },
    // 获取图片信息
    getInfo(imgd) {
      uni.getImageInfo({
        src: imgd,
        success: (result) => {
          // console.log(result)
        },
      });
    },
    // 查看图片
    lookImg() {
      let imgArr = [];
      imgArr.push(this.$imgHead + this.thumb);

      uni.previewImage({
        current: this.thumb,
        urls: imgArr,
      });
    },
    // 删除图片
    delshi() {
      (this.thumb = ""), (this.imgFlag = true);
    },
    cancle() {
      uni.removeStorageSync("text");
      uni.removeStorageSync("richs");
      this.getSto();
      this.beganTime = null;
      this.overTime = null;
      this.num = 0;
      this.html = "";
      uni.navigateTo({
        url: "myActivity",
      });
    },
    submit() {
      this.show = true;
    },
    // 点击发布
    editOk(res) {
      // console.log(res)
      if (res.isPublic) {
      }
    },
    change() {
      this.num = this.textarea.length;
    },
    block() {
      uni.navigateTo({
        url: `rich`,
      });
      // let files = this.$refs.uUpload.lists;
      // console.log(files)
      // if(files[0].response.data){

      uni.setStorageSync("text", {
        thumb: this.thumb, //活动内容
        endTime: this.endTime, //结束时间
        examine: 0, //审核标记
        name: this.name, //活动名称
        startTime: this.startTime, //开始时间
        synopsis: this.textarea, //活动简介
        id: this.id,
        richs: this.html, //富文本
      });

      // }
    },
    // 时间
    checkTime() {
      this.timeShow = true;
    },
    // 时间
    checkTime1() {
      this.timeShow1 = true;
    },
    // 时间确定
    timeConfirm(e) {
      this.beganTime =
        e.year + "年" + e.month + "月" + e.day + "日" +' '+ e.hour + "时";
      this.startTime =
        e.year +
        "-" +
        e.month +
        "-" +
        e.day +
        " " +
        e.hour +
        ":" +
        "00" +
        ":" +
        "00";
    },
    // 时间取消
    timeCancel(e) {
      this.overTime =
        e.year + "年" + e.month + "月" + e.day + "日" + ' ' + e.hour + "时";
      this.endTime =
        e.year +
        "-" +
        e.month +
        "-" +
        e.day +
        " " +
        e.hour +
        ":" +
        "00" +
        ":" +
        "00";
    },
    // 确认按钮
    conButton() {
      this.id = uni.getStorageSync("text").id;
	  if(!this.name){
		 uni.showToast({
		   icon: "none",
		   title: "请添加活动主题",
		 });
		  return
	  }
	  if(!this.textarea){
	  	uni.showToast({
	  		icon: "none",
	  		title: "请添加活动简介",
	  	});
	  	return
	  }
	  if(!this.startTime){
	  		 uni.showToast({
	  		   icon: "none",
	  		   title: "请添加活动开始时间",
	  		 });
	  		  return
	  }
	  if(!this.endTime){
	  		 uni.showToast({
	  		   icon: "none",
	  		   title: "请添加活动结束时间",
	  		 });
	  		  return
	  }
	  const begingetTime = this.$date.timeStamp(this.startTime);
	  const overgetTime = this.$date.timeStamp(this.endTime);
	  if (begingetTime > overgetTime) {
	  	uni.showToast({
	  			icon: 'none',
	  			title: '结束时间小于开始时间'
	  	})
	  	return
	  }
	  if(!this.thumb){
	  	uni.showToast({
	  		icon: "none",
	  		title: "请添加活动缩略图",
	  	});
	  	return
	  }
	  if(!this.html){
	  	uni.showToast({
	  		icon: "none",
	  		title: "请添加活动详情",
	  	});
	  	return
	  }
      let data = {
        thumb: this.thumb, //活动内容
        content: this.html, //活动内容
        endTime: this.endTime, //结束时间
        examine: 0, //审核标记
        name: this.name, //活动名称
        startTime: this.startTime, //开始时间
        synopsis: this.textarea, //活动简介
        id: this.id,
      };
	  if(process.env.NODE_ENV==='development'){
	  	data.content = JSON.parse(JSON.stringify(data.content.replace('./h5api/merchant/store/system/upload/down?keyName=','/file/merchant/store/system/upload/down?keyName=')))
	  }
	  let type,url
	  if(this.stateFlag){
		  type = this.$post;
		  url = "/merchant/store/active/save"
	  }else{
		  type = this.$put;
		  url = "/merchant/store/active/update"
	  }
	  type(url,data).then((res=>{
		  uni.showLoading({
		    title: "正在上传",
		  });
		  if (res.code == 0) {
		    
		      uni.hideLoading();
			  uni.showToast({
			    icon: "success",
			    title: "操作成功",
			});
			setTimeout(() => {
		      uni.reLaunch({
		        url: "myActivity",
		      });
			   }, 500);
		      uni.removeStorageSync("text");
		      uni.removeStorageSync("richs");
		      this.getSto();
		      this.beganTime = null;
		      this.overTime = null;
		      this.num = 0;
		      this.html = "";
		   
		  } else {
			  this.$showToast(res.msg);
		  }
	  }))
    },
    // 获取缓存
    getSto() {
      this.html = uni.getStorageSync("richs");
      // console.log(this.html)
      var storageArr = uni.getStorageSync("text");
      this.name = storageArr.name;
      this.textarea = storageArr.synopsis;
      this.thumb = storageArr.thumb;
      if (storageArr.thumb) {
        this.imgFlag = false;
        this.getimg = this.$imgHead + this.thumb;
      }
      if (this.textarea) {
        this.num = this.textarea.length;
      }
      if (storageArr.startTime) {
        this.beganTime = this.$date.timeFormattingDay(storageArr.startTime);
		console.log(this.beganTime)
      }
      if (storageArr.endTime) {
        this.overTime = this.$date.timeFormattingDay(storageArr.endTime);
      }
      this.startTime = storageArr.startTime;
      this.endTime = storageArr.endTime;
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-bar-wrap {
  position: fixed;
  z-index: 990;
  width: 100%;
  height: 88rpx;
  background-color: $uni-bg-color-navbar;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .back-btn {
    height: 100%;
    position: absolute;
    left: 24rpx;
    display: flex;
    align-items: center;

    text {
      font-size: 32rpx;
    }
  }
  .title-box {
    margin: 0 auto;
    font-size: 32rpx;
    font-weight: 400;
    color: #000;
  }
}
.surperBox {
  width: 100%;
  height: 220rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
}
.add {
  padding: 136rpx 24rpx 100rpx;
  .one {
    display: flex;
    padding: 0 24rpx;
    white-space: nowrap;
    align-items: center;
    font-size: 32rpx;
    font-weight: 600;
    text {
      display: inline-block;
      width: 128rpx;
    }
    .input {
      font-size: 32rpx;
      font-weight: 400;
      margin-left: 24rpx;
      height: 76rpx;
      width: 100%;
      border-radius: 10rpx;
      border: 1px solid #67a8fc!important;
      padding: 16rpx 24rpx;
      box-sizing: border-box;
	  padding-left: 24rpx!important;
    }
  }
  .two {
    display: flex;
    padding: 0 24rpx;
    white-space: nowrap;
    font-size: 32rpx;
    font-weight: 600;
    position: relative;
    margin: 48rpx 0;
    .intext {
      font-size: 32rpx;
      font-weight: 400;
      margin-left: 24rpx;
      height: 182rpx;
      width: 100%;
      border-radius: 10rpx;
      border: 1px solid #67a8fc;
      padding: 16rpx 24rpx 42rpx;
      box-sizing: border-box;
    }
    .bujin {
      font-size: 24rpx;
      width: 70rpx;
      color: #cccccc;
      position: absolute;
      bottom: 16rpx;
      right: 50rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border: 1px solid transparent;
      input {
        display: inline-block;
        font-size: 25rpx;
        font-weight: 400;
      }
      text {
        &:nth-child(2) {
          font-size: 20rpx;
        }
        &:nth-child(3) {
          font-size: 25rpx;
        }

        color: #cccccc;
        font-weight: 400;
      }
    }
  }
  .three {
    margin-top: 48rpx;
    text {
      font-size: 32rpx;
      font-weight: 600;
    }
    image {
      height: 308rpx;
      width: 100%;
      border-radius: 10rpx;
      margin-top: 24rpx;
    }
    .file-upload {
      height: 308rpx;
      margin-top: 24rpx;
    }
    .chacha {
      width: 60rpx;
      height: 60rpx;
      position: absolute;
      right: 20rpx;
      top: 20rpx;
    }
  }
  .four {
    margin-top: 48rpx;
    font-size: 32rpx;
    font-weight: 600;
    display: flex;
    margin-bottom: 200rpx;
    .rich {
      width: 502rpx;
      height: 252rpx;
      border: 1px solid #67a8fc;
      border-radius: 10rpx;
      margin-left: 24rpx;
      overflow: auto;
    }
  }
}
.footer {
  position: fixed;
  background-color: #fff;
  z-index: 666;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 92rpx;
  box-shadow: 0 0 5rpx 0 #ccc;
  .left {
    font-size: 32rpx;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #f1f1f1;
  }
  .right {
    font-size: 32rpx;
    color: #67a8fc;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
</style>
