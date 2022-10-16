<template>
  <div class="home">
    <div class="home-img">
      <div>
        <span class="home-title">金树丫，懂家校 更懂您的需要</span>
        <span class="home-title1">专注幼教行业，致力打造具有前瞻性的家校共育系统</span>
      </div>
    </div>
    <div class="home-content">
      <span class="home-title2">我们的优势</span>
      <div class="content-list">
        <div
          v-for="(item, index) in contentList"
          :key="index"
        >
          <div class="content-box">
            <img
              :src="item.icon"
              alt=""
            />
            <span>{{ item.title }}</span>
            <!-- <p v-for="(items,index) in item.dsc" :key="index">{{items }}</p> -->
            <div>
              <p v-html="item.dsc"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="home-download">
        <span class="home-title2">{{photoInfo.title}}</span>
        <div>
          <span
            class="download-title1"
            v-html="photoInfo.dsc"
          ></span>
        </div>

        <van-swipe
          class="download-swipe"
          :autoplay="6000"
          indicator-color="#eeeeee"
          width="380"
          @change="getPage"
        >
          <van-swipe-item>
            <img
              class="show-img"
              src="@/assets/image/home2.png"
            />
          </van-swipe-item>
          <van-swipe-item>
            <img
              class="show-img"
              src="@/assets/image/home3.png"
            />
          </van-swipe-item>
          <van-swipe-item>
            <img
              class="show-img"
              src="@/assets/image/home4.png"
            />
          </van-swipe-item>
          <van-swipe-item>
            <img
              class="show-img"
              src="@/assets/image/home5.png"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isTop: true,
      androidMsg: "",
      contentList: [
        {
          title: "深耕教育行业",
          dsc: "<p>12年教育行业软件研发经验<br/>了解行业最深层次的使用需求</p>",
          icon: require("../assets/image/img-list0.png"),
        },
        {
          title: "技术实力雄厚",
          dsc: "<p>核心团队成员均来自<br/>知名互联网公司技术实力雄厚</p>",
          icon: require("../assets/image/img-list1.png"),
        },
        {
          title: "完善服务支撑",
          dsc: "<p>高效敏捷的运营团队<br/>及时为代理商提供产品问题<br/>解决方案和技术支撑</p>",
          icon: require("../assets/image/img-list2.png"),
        },
        {
          title: "口碑诚信保障",
          dsc: "<p>500+家全国经销商<br/>500W+用户认可<br/>品牌有保障，持续高收益</p>",
          icon: require("../assets/image/img-list3.png"),
        },
      ],
      photoList: [
        {
          title: "实时动态",
          dsc: "<p>保证实时音视频直播宝宝在园成长 不同场景一键触达，随时掌握宝宝状态<br/></p>",
          icon: require("../assets/image/home2.png"),
        },
        {
          title: "班级相册",
          dsc: "<p>从入园到毕业，照片/视频<br/>轻松展现宝宝的每一个成长点滴</p>",
          icon: require("../assets/image/home2.png"),

        },
        {
          title: "活动直播",
          dsc: "<p>实时活动直播，万人观看不卡顿<br/>满足不同的直播需求，支持活动分享，高效引流</p>",
          icon: require("../assets/image/home2.png"),

        },
        {
          title: "幼儿考勤",
          dsc: "<p>实时活动直播，万人观看不卡顿<br/>满足不同的直播需求，支持活动分享，高效引流</p>",
          icon: require("../assets/image/home2.png"),

        },
      ],
      photoIndex: 0,
      photoInfo: {}
    };
  },
  mounted() {
    this.photoInfo = this.photoList[0]
    this.getVersion();
  },
  methods: {
    toIos() {
      window.open(
        "https://apps.apple.com/cn/app/%E9%87%91%E6%A0%91%E4%B8%AB/id1560759387#?platform=iphone"
      );
    },
    toAndriod() {
      window.open(this.androidMsg.apkPath);
    },
    async getVersion() {
      axios
        .get("https://api.v2.jinshuy.com/mamserver/api/version/latestVersion")
        .then((res) => {
          this.androidMsg = res.data.data[0];
        });
    },
    getPage(data) {
      console.log(data)
      this.photoInfo = { ...this.photoList[data] }
    }
  },
};
</script>

<style scoped lang="less">
.home {
  text-align: center;
}

.home-img {
  width: 100%;
  height: 600px;
  background: url("../assets/image/home1.png") no-repeat;
  background-size: cover;
  margin-bottom: 10px;
}
.home-title {
  display: block;
  margin: auto;
  padding-top: 30px;
  width: 225px;
  height: 84px;
  font-size: 32px;
  font-family: zihun59hao-chuangcuhei, zihun59hao-chuangcuhei-Regular;
  font-weight: 400;
  text-align: center;
  color: #4c2609;
  line-height: 41px;
  letter-spacing: 0px;
}
.home-title1 {
  display: block;
  padding-top: 30px;
  width: 100%;
  height: 33px;
  font-size: 14px;
  font-weight: 500;
  line-height: 36px;
  color: #30290e;
  opacity: 1;
}

.home-title2 {
  display: block;
  width: 190px;
  height: 53px;
  font-size: 20px;
  font-weight: bold;
  line-height: 53px;
  color: #1e1e1e;
  opacity: 1;
  margin: auto;
  margin-top: 30px;
}
.content-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.content-box {
  width: 46vw;
  height: 50vw;
  background: #ffffff;
  border: 3px solid #fbd646;
  opacity: 1;
  border-radius: 12px;
  margin-left: 5%;
  margin-right: 10px;
  margin-bottom: 10px;
  img {
    width: 16vw;
    height: 16vw;
    margin-left: 0px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  span {
    display: block;
    margin: auto;
    width: 134px;
    height: 25px;
    font-size: 16px;
    font-weight: 600;
    // margin-top: -10px;
    // margin-left: 15px;
    color: #1e1e1e;
    opacity: 1;
  }
  p {
    display: block;
    // text-align: center;
    margin: auto;
    width: 156px;
    height: 45px;
    font-size: 10px;
    font-weight: 400;
    line-height: 24px;
    color: #888888;
    opacity: 1;
  }
}
.home-download {
  width: 100%;
}
.download-title1 {
  width: 66vw;
  height: 9.47vw;
  font-size: 14px;
  font-weight: 600;
  line-height: 5.07vw;
  color: #30290e;
  opacity: 1;
  margin: auto;
  margin-bottom: 0px;
  display: block;
}
.download-swipe {
  // margin:auto;
  height: 615px;
  width: 100%;
  border-radius: 35px;
  // border: 1px solid rgba(112,112,112,0.12);
  // box-shadow: 10px 20px 60px 0px rgba(0,0,0,0.15);
}
.show-img {
  width: 65%;
  margin-top: 40px;
}
.downBtn {
  // clear: both;
  width: 100%;
  display: flex;
  .iosDown {
    cursor: pointer;
    width: 29vw;
    height: 11vw;
    line-height: 44px;
    background: #fbd646;
    border-radius: 40px;
    font-size: 14px;
    margin-left: 54px;
    margin-bottom: 10px;
    margin-top: 10px;
    img {
      float: left;
      margin: 10px 10px 0 12px;
      width: 5vw;
      height: 6vw;
    }
  }
}
</style>
