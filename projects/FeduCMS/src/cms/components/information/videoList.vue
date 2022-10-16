<template>
  <div class="video-list-box">
    <ul>
      <li v-for="(item, index) in 6" :key="index">
        <div v-if="flag === 1" class="img-box">
          <img
            src="@/cms/assets/school-list/play.png"
            alt=""
            @click="handleOpenVideo"
          />
        </div>
        <div v-else class="no-video-box">
          <div class="btn-box">
            <el-button icon="el-icon-refresh-right" type="primary">
              刷新
            </el-button>
          </div>
          <div class="info-box">
            <img src="@/cms/assets/school-list/no-video.png" alt="" />
            <span class="red">无法开启视频</span>
            <span class="txt">请先检查网络后刷新，仍无法开启请联系客服</span>
          </div>
        </div>
        <div class="botom-box">
          <div class="left">大操场1</div>
          <div class="right">
            <i class="iconfont icon-a-108"></i>
            <span class="num">256</span>
          </div>
        </div>
      </li>
    </ul>
    <videoCom ref="videoPlayer"></videoCom>
  </div>
</template>

<script>
  import videoCom from './videoCom.vue'
  export default {
    components: {
      videoCom,
    },
    data() {
      return {
        flag: 1,
      }
    },
    methods: {
      handleOpenVideo() {
        this.$refs.videoPlayer.init('http://cclive2.aniu.tv/live/anzb.m3u8', {
          live: true,
          autoPlay: true,
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .video-list-box {
    > ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: -20px;
      > li {
        position: relative;
        width: 280px;
        height: 157px;
        border: 1px solid #d9d9d9;
        margin-bottom: 20px;
        .img-box {
          > img {
            width: 46px;
            height: 46px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
          }
        }
        .no-video-box {
          padding: 10px;
          background: #f5f9fc;
          .btn-box {
            display: flex;
            justify-content: flex-end;
          }
          .info-box {
            font-size: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            > img {
              width: 38px;
              height: 30px;
              margin-bottom: 10px;
            }
            .red {
              margin-bottom: 5px;
              color: #f56060;
            }
            .txt {
              color: #999;
            }
          }
        }
        .botom-box {
          font-size: 14px;
          color: #fff;
          width: 100%;
          height: 30px;
          background: #000000;
          opacity: 0.4;
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 5px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .right {
            .num {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
</style>
