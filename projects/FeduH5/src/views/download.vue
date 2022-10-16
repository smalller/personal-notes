<template>
  <div class="mobileIndex">
    <div class="home">
      <div class="arrow">
        <img
          class="img1"
          src="../assets/arrow.png"
        />
      </div>
      <div class="title1">
        <div class="icon">
          <span class="num"> 1 </span>
        </div>
        <p class="icon-front">点击右上角的</p>
        <div class="box1">
          <p class="icon-dot">...</p>
        </div>
        <p class="icon-front">按钮</p>
      </div>
      <div class="title1">
        <div class="icon">
          <span class="num"> 2 </span>
        </div>
        <p class="icon-front">选择</p>
        <div class="box2">
          <p class="icon-front">在浏览器中打开</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import qs from 'qs'
export default {
  data() {
    return {
      androidMsg: {},
      jzInfo: {},
      ydInfo: {},
      ydIos: 'itms-apps://itunes.apple.com/app/id1593326584',
      jzIos: 'itms-apps://itunes.apple.com/app/id1560759387',
      type: ''
    };
  },
  // mounted() {
  //   location.href=micell.ua.isIOS()?'https://www.jinshuy.com/app/':'android://fltd.jyb/openwith'
  //   // this.getVersion();
  //   setTimeout(() => {
  //     location.href='https://www.jinshuy.com/m'
  //   },200)
  // },
  created() {
    this.getVersion()
    const params = qs.parse(location.search.split('?')[1])
    this.type = params.type
    this.iosUrl = this.type === 'yd' ? this.ydIos : this.jzIos
  },
  methods: {
    async getVersion() {
      axios
        .get("https://api.v2.jinshuy.com/mamserver/api/version/latest/Android?currVersion=0")
        .then((res) => {
          // console.log(res.data.data)
          res.data.data.forEach(item => {
            if (item.appSide.name === 'PARENT') {
              console.log('家长', item)
              this.jzInfo = item
            }
            if (item.appSide.name === 'TEACHER') {
              console.log('园丁', item)
              this.ydInfo = item
            }
          })
          this.isWeixin()
        });
    },
    isWeixin() {
      if (micell.ua.isWeChat()) {
        return true;
      } else {
        this.isAndroid();
      }
    },
    isAndroid() {
      if (micell.ua.isAndroid()) {
        this.jumpUrl(this.type === 'yd' ? this.ydInfo.apkPath : this.jzInfo.apkPath)
      } else {
        this.jumpUrl(this.iosUrl)
      }
      // if (micell.ua.isIOS()) {
      //   this.jumpUrl(this.iosUrl)
      // }
    },
    jumpUrl(url) {
      location.href = url
    }
  },
};
</script>
<style  lang="less">
.mobileIndex {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  .home {
    background: url("../assets/image/download.png") no-repeat;
    width: 100%;
    height: 100%;
    width: 100%;
    background-size: 100% 100%;
    position: absolute;
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/image/download.png',sizingMethod='scale');
  }
  .arrow {
    width: 100%;
    .img1 {
      display: block;
      width: 80px;
      margin-left: 240px;
    }
  }

  .title1 {
    width: 100%;
    height: 80px;
    display: flex;
  }
  .icon {
    width: 35px;
    height: 35px;
    background: #ffffff;
    border-radius: 50%;
    margin-left: 12%;
    opacity: 1;
  }
  .num {
    width: 26px;
    height: 62px;
    font-size: 25px;
    font-family: PingFang SC;
    font-weight: 800;
    margin-left: 10px;
    color: #ff8f44;
    opacity: 1;
  }
  .icon-front {
    height: 59px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    margin-top: 2px;
    margin-left: 2px;
    opacity: 1;
  }
  .box1 {
    width: 50px;
    height: 35px;
    background: #000000;
    margin-top: 0px;
    opacity: 0.5;
    border-radius: 11px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .box2 {
    margin-left: 5px;
    width: 175px;
    height: 35px;
    background: #000000;
    margin-top: 0px;
    opacity: 0.5;
    border-radius: 11px;
    padding-left: 10px;
  }
  .icon-dot {
    width: 36px;
    font-size: 38px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    margin-left: 10px;
    margin-top: -21px;
    display: block;
    padding: 0;
  }
}
</style>
