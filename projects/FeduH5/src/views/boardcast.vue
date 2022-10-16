<template>
  <OpenAppBox :open="isApp">
    <div class="boardcast">
      <div class="top-bg">
        <div class="videoContainer">
          <div
            class="title-img"
            v-if="+liveInfo.status !== 3 "
          >
            <img
              :src="liveInfo.coverImg"
              alt=""
            />
            <div class="title-info">
              <div class="title-wait">
                <span v-if="+liveInfo.status == 2 || liveInfo.status == 1">未开播请等待</span>
                <span v-if="+liveInfo.status == 4 ">直播已结束</span>

                <van-button
                  class="title-btn"
                  @click="getLiverInfo"
                  v-if="+liveInfo.status === 2 || liveInfo.status == 1"
                >
                  刷新
                </van-button>
              </div>

            </div>
          </div>

          <player
            v-show="+liveInfo.status === 3 "
            ref="player"
            @videoError="videoError"
          ></player>
        </div>
        <div class="content">
          <van-tabs
            v-model="active"
            sticky
            class="select"
            color="#3b87f7"
          >
            <!-- <van-tab
              :title="'聊天' + ' ' + '(' + dataList.length + ')'"
              :class="isApp?'content-list':''"
            >
              <div ref="msgListBoxUl">
                <div
                  class="content-box"
                  v-for="(item,index) in dataList"
                  :key="index"
                >
                  <div class="content-user">
                    <img :src="item.msgFromUserPortrait" />
                    <span>{{item.msgFromUser}}</span>
                  </div>
                  <div class="content-info">
                    <span>{{item.msgContent}}</span>
                  </div>
                </div>
              </div>
            </van-tab> -->
            <van-tab title="详情">
              <div
                class="info"
                v-html="liveInfo.content"
              ></div>
            </van-tab>
          </van-tabs>
        </div>
        <div
          class="review"
          v-if="isApp && +active === 0"
        >
          <van-field
            v-model="message"
            placeholder="写评论..."
            enterkeyhint="send"
            @keyup.enter="sendData"
            class="review-box"
          />
          <img
            @click="setStar"
            v-if="!showSend"
            :src="isPraise? isStar:star"
          />
          <van-button
            v-if="showSend"
            class="send"
            @click="sendData"
          >发送</van-button>
        </div>
      </div>
    </div>
  </OpenAppBox>
</template>

<script>
import OpenAppBox from '@/layout/openApp';
import smoothscroll from 'smoothscroll-polyfill';
import axios from "axios";
import player from '@/components/player';
import { EventSourcePolyfill } from "event-source-polyfill";


export default {
  name: 'repiceShare',
  components: { OpenAppBox, player },
  data() {
    return {
      star: require("../assets/image/star.png"),
      isStar: require("../assets/image/isStar.png"),
      dataList: [],
      recipeType: '-1',
      dishesImgUrl: '',
      recipeList: [],
      weeksArr: [],
      weeksMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      active: 0,
      contentNum: 855,
      liveId: '',
      liveInfo: {
        status: '0'
      },
      message: '',
      isApp: false,
      userId: "",
      userToken: "",
      userInfo: {},
      isReset: true,
      isAndroid: false,
      isPraise: false,
      starInfo: {},
      timer: null,
      num: 5,
      sse: null
    };
  },
  methods: {
    videoError() {

      this.reConnect()
    },
    // 了解更多
    openWeb() {
      location.href = 'https://www.jinshuy.com';
    },
    getAddInfo() {
      let url = `${process.env['VUE_APP_BASE_API']}/community/hincrby/increment?dataType=LiveVideoH5&id=${this.liveId}`;
      axios({
        url: url,
        method: 'post',
        headers: {
          userId: this.userId,
          token: this.UrlParamHash('token'),
          sysType: 'app',
        },
      })
        .then((res) => {
        }).catch((err) => {
        })
    },
    // 锚点定位
    moveToPosition(week) {
      if (+this.recipeType === 1 && this.weeksArr.includes(week)) {
        smoothscroll.polyfill();
        // 跳转到指定位置并且平滑滚动
        this.$el
          .querySelector(`.item-${week}`)
          .scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    },
    UrlParamHash(queryName) {
      let query = decodeURI(window.location.search.substring(1))//将url转码
      let vars = query.split("&");//分割字符串，将url切割成数组形式的对象
      for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }//如果匹配输出结果
      }
      return null;
    },
    getLiverInfo() {
      return new Promise((resolve, reject) => {
        this.liveInfo = {}
        let url = `${process.env['VUE_APP_BASE_API']}/mamserver/api/liveVideo/unAccess/queryById/${this.liveId}`
        axios
          .get(url)
          .then((res) => {
            if (res.data.code === 0) {
              this.liveInfo = { ...res.data.data }
              if (this.liveInfo.schoolId && +this.liveInfo.status === 3) {
                const url = micell.ua.isIOS() ? this.liveInfo.pullHlsStreamAddress : this.liveInfo.pullFlvStreamAddress
                this.$refs.player.setPlay(url, {
                  autoPlay: true,
                  live: true
                })
                if (this.userId) {
                  this.getUserData()
                  this.getPraiseData()
                }
                this.getLiveData()
                this.getAddInfo()
                resolve()
              }
            } else {
              this.$message.warning("直播信息错误!");
              // this.openWeb()
              reject()
            }

          }).catch(() => {
            reject()
          })
      })
    },
    getLiveData() {
      if (this.sse) {
        this.sse.close();
        this.sse = null
      }
      const url = `${process.env.VUE_APP_SSE_API}/live/v2/play/${this.liveId}`;
      const source = new EventSourcePolyfill(url, {
        withCredentials: false,
        headers: {
          schoolId: this.liveInfo.schoolId,
          userId: !!this.userId ? this.userId : micell.randomString(20),
        },
      });
      this.sse = source
      source.onopen = (ev) => {
        return ev;
      };
      source.onmessage = (ev) => {
        const data = ev.data ? JSON.parse(ev.data) : ev.data;
        // console.log(data)
        switch (data?.action) {
          case "stopLive":
            break;
          case "heartbeat":
            // console.log("心跳");
            break;
          case "pushStatus":
            // console.log("停止", data.streamStatus)
            if (data?.streamStatus === "publish") {
              setTimeout(() => {
                this.getLiverInfo()
              }, 15000);
              //停止推流
            } else if (data?.streamStatus === "publish_done") {
              this.liveInfo.status = 2
            }
            break;
          case "del":
            if (data) {
              this.dataList = this.dataList.filter((item) => {
                if (+item.id !== +data.id) {
                  return item
                }
              })
            }
            break;
          case "chat":
            this.dataList.push(data);
            setTimeout(() => {
              console.log(this.$refs.msgListBoxUl, '9999999999999')
              this.$refs.msgListBoxUl.scrollIntoView({
                block: "end",
                inline: "nearest",
                behavior: "smooth",
              });
            }, 100);
            break;
          default:
            break;
        }
      };
      source.onerror = (err) => {
        console.error(err)
        this.sse.close();
        this.sse = null
        this.reConnect()
      };
    },
    reConnect() {
      let self = this;
      if (self.timer) {
        clearTimeout(self.timer);
        self.timer = null
      }
      self.timer = setTimeout(() => {
        console.log(2222)
        this.getLiverInfo().then(() => {
          clearTimeout(self.timer);
          self.timer = null
          self.num = 5
        }).catch(() => {
          if (self.num > 0) {
            self.num--
            self.reConnect()
          } else {
            self.liveInfo.status = 2
          }
        })
      }, 30000)
    },
    getPraiseData() {
      this.starInfo = {}
      if (this.userId) {
        let url = `${process.env['VUE_APP_BASE_API']}/community/praise/getPraise?relatedId=${this.liveId}&userId=${this.userId}`;
        axios({
          url: url,
          method: 'get',
          headers: {
            userId: this.userId,
            token: this.UrlParamHash('token'),
            sysType: 'app',
          },
        })
          .then((res) => {
            if (res.data.code == 0) {
              if (res.data.data) {
                this.starInfo = { ...res.data.data }
                this.isPraise = true;
              } else {
                this.isPraise = false;
              }
            }
          }).catch((err) => {
          })
      }
    },
    setStar() {
      if (this.isPraise) {
        this.cancelStar();
      } else {
        this.addPraise()
      }
    },
    cancelStar() {
      if (this.userId) {
        let url = `${process.env['VUE_APP_BASE_API']}/community/praise/${this.starInfo.id}`;
        axios({
          url: url,
          method: 'DELETE',
          headers: {
            userId: this.userId,
            token: this.UrlParamHash('token'),
            sysType: 'app',
          }
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.isPraise = false
            }
          }).catch((err) => {
          })
      }
    },
    addPraise() {
      if (this.userId) {
        let params = {
          praiseType: "LiveVideoH5",
          sysUserName: this.userInfo.nickName,
          relatedId: this.liveId,
          relatedUser: this.liveInfo.publishUser,
          sysUserId: this.userId,

        }
        let url = `${process.env['VUE_APP_BASE_API']}/community/praise/add`;
        axios({
          url: url,
          method: 'post',
          headers: {
            userId: this.userId,
            token: this.UrlParamHash('token'),
            sysType: 'app',
          },
          data: params
        })
          .then((res) => {
            if (res.data.code == 0) {
              // this.$message.success("点赞成功!");
              this.isPraise = true
            }
          }).catch((err) => {
          })
      }
    },
    getUserData() {
      let url = `${process.env['VUE_APP_BASE_API']}/userserver/user/selectOne`;
      axios({
        url: url,
        method: 'post',
        headers: {
          userId: this.userId,
          token: this.UrlParamHash('token'),
          sysType: 'app',
        },
      })
        .then((res) => {
          if (res.data.code == 0) {
            this.userInfo = { ...res.data.data.user }
          }
        }).catch((err) => {
        })
    },
    sendData() {
      if (this.message !== '') {
        let params = {
          liveId: this.liveId,
          msgFromUser: this.userInfo.nickName,
          msgToId: this.liveId,
          msgToIdType: "group",
          msgType: "txt",
          msgContent: this.message,
          msgFromUserPortrait: this.userInfo.userHeadPortait ? this.userInfo.userHeadPortait : 'https://yjbfiles.oss-cn-shenzhen.aliyuncs.com/6uL/5C/6uL8LtcSlcn119jdnDUG5C.jpg?w=640&h=360',
        }
        axios({
          url: `${process.env.VUE_APP_SSE_API}/live/v2/msg/chat`,
          method: "post",
          data: params,
          headers: {
            userId: this.userId,
            schoolId: this.liveInfo.schoolId,
            token: this.UrlParamHash('token'),
          },
        })
          .then((res) => {
            // this.$message.success("评论成功!");
            this.message = ''
          }).catch((err) => {
            console.log(err)
          })
      }

    }
  },
  created() {
  },
  mounted() {

    this.liveId = ''
    this.userId = ''
    if (window.location.search) {
      this.liveId = this.UrlParamHash('liveId')
      this.userId = this.UrlParamHash('userId')
      this.userToken = this.UrlParamHash('token')
      if (this.liveId) {
        this.getLiverInfo()
      } else {
        this.$message.warning("直播信息错误!");
      }
      this.isApp = JSON.parse(this.UrlParamHash('isApp'))
      this.isReset = true; //是否归位
      if (micell.ua.isIOS()) {
        document.body.addEventListener('focusin', () => {
          // 软键盘弹出的事件处理
          this.isReset = false;
        });
        document.body.addEventListener('focusout', () => {
          // 软键盘收起的事件处理
          this.isReset = true;
          setTimeout(() => {
            // 当焦点在弹出层的输入框之间切换时先不归位
            if (this.isReset) {
              window.scroll(0, 0); // 失焦后强制让页面归位
            }
          }, 300);
        });
      } else if (!micell.ua.isIOS()) {
        this.isAndroid = true
      }
    }
  },
  computed: {
    showSend() {
      let data = this.message !== ''
      return data
    }
  }
};
</script>

<style  lang="less">
.boardcast {
  position: relative;
  display: flex;
  flex-direction: column;
  // height: auto;
  height: 100vh;
  max-height: 100vh;
  //  min-height: 100vh;
  .top-bg {
    // background: url("../assets/recipe/top-bg.png") no-repeat;
    // border: 1px solid #f1c929;
    background-size: cover;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .videoContainer {
      width: 100%;
      height: 32vh;
    }
    .title-img {
      img {
        // height: 15vh;
        z-index: 20;
        width: 100%;
        height: 32vh;
        overflow: hidden;
      }
      .title-info {
        position: absolute;
        top: 2px;
        z-index: 2;
        width: 100%;
        height: 32vh;
        background-color: rgba(8, 8, 8, 0.31);
        .title-wait {
          width: 300px;
          height: 100px;
          margin: auto;
          margin-top: 50px;
          span {
            width: 100%;
            text-align: center;
            font-size: 18px;
            display: block;
            color: #ffffff;
          }
          .title-btn {
            display: block;
            width: 90px;
            height: 40px;
            background: #ff9f01;
            border-radius: 40px;
            margin: auto;
            margin-top: 15px;
            border: none;
            span {
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .content {
    flex: 1;
    width: 100%;
    overflow: hidden;
    // min-height: 58vh;
    // padding-bottom: 50px;

    .select {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .van-tabs__content {
        overflow-y: auto;
        flex: 1;
      }
    }
    .info {
      // min-height: 50vh;
      min-width: 95vw;
      overflow: scroll;
      margin: 10px;
    }
    .content-list {
      overflow-y: auto;
    }
    .content-box {
      width: 90vw;

      background: #ffffff;
      .content-user {
        width: 90vw;
        display: flex;
        margin-top: 15px;
        margin-left: 15px;

        img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
        }
        span {
          display: block;
          margin-left: 10px;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 700;
          text-align: left;
          color: #1c1c1c;
        }
      }
      .content-info {
        margin-left: 60px;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: #1c1c1c;
        letter-spacing: 1px;
        display: inline-block;
        max-width: 85%;
        overflow-wrap: break-word;
        text-align: left;
      }
    }
  }
  .review {
    width: 100vw;
    padding: 10px;
    box-sizing: border-box;
    background: #fafafa;
    display: flex;
    .send {
      width: 60px;
      height: 35px;
      margin-top: 10px;
      margin-left: 5px;
      background: #3b87f7;
      border-radius: 28px;
      color: #ffffff;
    }
    .review-box {
      flex: 1;
      background: #f5f5f5;
      height: 40px;
      border-radius: 20px;
    }
    img {
      width: 36px;
      height: 36px;
    }
  }
  .footer {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    color: #0099ff;
    margin: 40px 0 30px 0;
  }
  .van-tab__text {
    font-size: 16px !important;
    font-weight: 400 !important;
    text-align: left;
    color: #1c1c1c;
  }
}
</style>
