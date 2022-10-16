<template>
  <div class="dynamic">
    <div class="content">
      <div
        class="img-box"
        v-if="+data.dynamicType === 1"
      >
        <van-swipe
          :autoplay="3000"
          class="my-swipe"
          @change="onChangeSwiper"
          :show-indicators="false"
        >
          <van-swipe-item
            v-for="(image) in data.imageUrls"
            :key="image"
          >
            <img :src="image" />
          </van-swipe-item>
        </van-swipe>
        <div class="custom-indicator">{{ currentImg + 1 }}/{{data.imageUrls.length}}</div>
        <div
          class="upload-btn"
          @click="handleUploadImg(data.imageUrls[currentImg])"
        >
          <img
            src="../assets/dynamic-share/upload.png"
            alt=""
          >
        </div>
      </div>
      <Player
        v-else
        v-show="data.videoPath"
        ref="player"
      />
    </div>
    <div class="content-box">
      <div class="top-content">
        <div class="header-info">
          <img
            :src="author.img"
            alt=""
          >
        </div>
        <div class="user-info">
          <p class="user-name">{{author.userName}}</p>
          <p>{{ author.date }}</p>
        </div>
        <div
          v-if="author.schoolName"
          class="school-info"
          @click="handleToSchool(author.schoolId)"
        >
          {{author.schoolName}}
        </div>
      </div>
      <div class="botm-content">
        <div
          class="text"
          :class="[isTextOver?'is-over':'',showMoreText ==='展开'?'':'zk']"
          ref="botmContent"
        >
          {{ author.content }}
        </div>
        <div
          class="show-more"
          v-if="isOver"
          @click="showMore"
        >
          {{showMoreText}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// http://localhost:8081/details?shareId=e061185ada74bc98c69917df70ef1532&type=3&userId=EMP1466225836557979648
// http://localhost:8081/details?shareId=39f9439c3af376db2b94e5c660f79fec&type=3&userId=EMP1466225836557979648

import AuthorInfo from "@/components/authorInfo";
import Player from './newDynamicPlayer.vue';
import dayjs from 'dayjs'
import axios from 'axios';

export default {
  name: "dynamic",
  components: { AuthorInfo, Player },
  props: {
    data: {
      type: Object,
      default: {
        videoPath: ''
      }
    }
  },
  data() {
    return {
      author: {},
      currentImg: 0,
      isOver: false,
      showMoreText: '展开',
      images: [
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
        'https://yjbfiles.oss-cn-shenzhen.aliyuncs.com/6G9/tj/6G9HofnJFdaeOAmJm1G5tj.jpg?w=828&h=1472'
      ],
      isTextOver: false,
    }
  },
  watch: {
    data: {
      handler() {
        this.author = {
          userName: this.data.publisher,
          date: dayjs(this.data.publishTime).format('MM-DD HH:mm'),
          img: this.data.headPortrait,
          schoolId: this.data.schoolId,
          schoolName: this.data.schoolName,
          content: this.data.content
        }

        this.$nextTick(() => {
          if (this.$refs.botmContent.clientHeight > 50) {
            this.isTextOver = true
            this.isOver = true;
          }
        })

        if (this.data?.videoPath && +this.data?.dynamicType === 2) {
          // this.data.videoPath = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
          this.$refs.player.setPlay(this.data.videoPath, {
            autoPlay: false,
            live: false
          })
        }
      },
      deep: true
    }
  },
  methods: {
    onChangeSwiper(index) {
      this.currentImg = index;
    },

    handleUploadImg(img) {
      window.open(img);
    },

    handleToSchool(schoolId) {
      if (schoolId) {
        axios.get(`${process.env["VUE_APP_BASE_API"]}/schools/unAccess/admissions/query?schoolId=${schoolId}`).then(
          res => {
            if (res.data.data) {
              this.$router.push(`/school?schoolId=${schoolId}`);
            } else {
              vant.Toast({
                message: '暂无该学校信息',
                position: 'bottom',
              });
            }
          }
        )
      }
    },

    showMore() {
      if (this.showMoreText === '展开') {
        this.showMoreText = '折叠'
      } else {
        this.showMoreText = '展开'
        this.isTextOver = true;
      }

    }
  },
}
</script>

<style lang="less">
.openAppHead {
  display: none !important;
}

.details .footer {
  display: none !important;
}

.details {
  padding: 0 !important;
}

.dynamic {
  width: 100%;
  background-color: #000;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .content-box {
    position: absolute;
    bottom: 60px;
    left: 0;
    padding: 0 16px;
    box-sizing: border-box;

    .top-content {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .header-info {
        margin-right: 8px;
        > img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }
      }

      .user-info {
        font-size: 10px;
        color: #fff;
        margin-right: 10px;
        .user-name {
          max-width: 180px;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .school-info {
        padding: 7px 9px;
        box-sizing: border-box;
        background-color: #f1b94a;
        color: #fff;
        font-size: 12px;
        border-radius: 7px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .botm-content {
      .text {
        font-size: 14px;
        color: #e8e8e8;
        line-height: 24px;
        width: 80%;
        position: relative;
      }

      .show-more {
        color: #f1b94a;
        text-align: left;
        font-size: 14px;
        margin-top: 2px;
      }
    }

    .is-over {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      max-height: 48px;
      transition: all 0.6s;
      &.zk {
        -webkit-line-clamp: 999;
        max-height: 100vh;
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .img-box {
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;

      .my-swipe {
        width: 100%;
        height: auto;

        .van-swipe__track {
          display: flex;
          align-items: center;
        }

        img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }

      .upload-btn {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 16px;
        top: 15px;

        > img {
          width: 20px;
          height: 20px;
        }
      }

      .custom-indicator {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 18px;
        color: #e8e8e8;
      }
    }
  }
}
</style>
