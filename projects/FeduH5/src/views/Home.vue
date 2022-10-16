<template>
  <div class="about">
    <div class="jsy-head">
      <div class="jsy-headBox">
        <div
          class="logo"
          @click="handleBackHome"
        >
          <img
            src="@/assets/logo.png"
            alt=""
          />
        </div>
        <div class="menu">
          <van-icon
            name="bars"
            size="2rem"
            @click="isShow = !isShow"
          />
        </div>
      </div>
      <transition name="mask">
        <div
          class="mask"
          v-show="isShow"
        ></div>
      </transition>
      <div class="popup">
        <transition name="nav">
          <div
            class="navBox"
            v-show="isShow"
          >
            <div
              class="navItem"
              v-for="(nav, index) in nav"
              :key="nav"
              @click="(type = index + 1), (isShow = !isShow)"
            >
              <span :style="{
                  'border-bottom':
                    type === index + 1 ? '2px solid #FBD646' : 'none',
                }">{{ nav }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="jsy-content">
      <homePage v-if="type === 1"></homePage>
      <about v-else-if="type === 2"></about>
      <cooperation v-else-if="type === 3"></cooperation>
      <join v-else-if="type === 4"></join>
    </div>
    <div
      v-if="type === 1"
      class="jsy-footer"
    >
      <span>COPYRIGHT © 2019-2022 成都在线支点教育科技有限公司 ALL RIGHTS RESERVED.
        蜀ICP备20023331号</span>
    </div>
    <div
      class="download"
      v-if="type === 1"
    >
      <van-button
        class="parent"
        @click="downApp('jz')"
      >家长端APP下载</van-button>
      <van-button
        class="teacher"
        @click="downApp('yd')"
      >园丁端APP下载</van-button>
    </div>
  </div>
</template>

<script>
import HomePage from '../components/homePage.vue';
import about from '../components/about.vue';
import cooperation from '../components/cooperation.vue';
import join from '../components/join.vue';
import axios from "axios";
export default {
  components: {
    HomePage,
    about,
    cooperation,
    join,
  },
  data() {
    return {
      isShow: false,
      type: 1,
      nav: ['首页', '关于我们', '幼儿园入驻', '金树丫合作'],
      jzInfo: {},
      ydInfo: {}
    };
  },
  mounted() {
    document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    });
  },
  methods: {
    getEl() {
      return document.querySelector('.popup');
    },
    handleBackHome() {
      this.type = 1;
    },
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
        });
    },
    downApp(type) {
      this.$router.push(
          { path: '/download', query: { type: type } }
      )
    },
    jumpUrl(url) {
      window.open(url)
    }
  },
  created() {
    this.getVersion()
  }
};
</script>

<style scoped lang="less">
.about {
  position: relative;
}
.nav-enter-active,
.nav-leave-active {
  transition: all 0.3s;
  //opacity: 1 !important;
  //height: auto!important;
  transform: translateY(0) !important;
}
.nav-enter,
.nav-leave-to {
  height: 0 !important;
  transform: translateY(-240px) !important;
  //opacity: 0 !important;
}
.mask-enter-active,
.mask-leave-active {
  transition: all 0.3s;
  opacity: 1 !important;
}
.mask-enter,
.mask-leave-to {
  opacity: 0 !important;
}
.jsy-head {
  width: 100%;
  height: 44px;
  background: #ffffff;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.16);
  position: relative;
  z-index: 10;
  left: 0;
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
  }
  &.top {
    position: absolute;
    top: 0;
  }
  &.bottom {
    position: fixed;
    bottom: 0;
  }
  .logo {
    display: flex;
    align-items: center;
    img {
      width: 23vw;
      height: 8vw;
    }
    span {
      color: #ff9900;
      font-size: 16px;
      margin-left: 8px;
      font-weight: 800;
    }

    .menu {
      text-align: right;
      margin-top: 5px;
    }
  }
  .jsy-headBox {
    padding: 0 16px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
    background: #ffffff;
  }
  .popup {
    width: 100%;
    position: relative;
    z-index: 1;
    .navBox {
      padding-left: 24px;
      background: #ffffff;
      .navItem {
        height: 55px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        border-top: 1px solid #d6d6d6;
        span {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
    }
  }
}

.jsy-content {
  min-height: 550px;
  margin-top: 1px;
}
.jsy-footer {
  text-align: center;
  width: 90%;
  height: 51px;
  margin: auto;
  font-size: 10px;
  font-weight: 400;
  line-height: 26px;
  margin-bottom: 60px;
  color: #30290e;
  opacity: 1;
  position: relative;
  //z-index:2;
}
.download {
  width: 100%;
  height: 50px;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.12);
  opacity: 1;
  border-radius: 0px;
  padding-top: 10px;
  position: fixed;
  bottom: 0px;
  .parent {
    width: 40%;
    height: 35px;
    background: #fbd646;
    opacity: 1;
    border-radius: 6px;
    margin-left: 5%;
    margin-right: 10%;
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 0px;
    color: #1e1e1e;
    opacity: 1;
  }
}
.teacher {
  width: 40%;
  height: 35px;
  background: #3c90fe;
  opacity: 1;
  border-radius: 6px;
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 0px;
  color: #ffffff;
  opacity: 1;
}
</style>
