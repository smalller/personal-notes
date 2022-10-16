<template>
  <div class="player-container">
    <el-alert
      :closable="false"
      title="m3u8、flv演示环境暂不支持，请在正式环境查看效果"
      show-icon
      type="success"
    ></el-alert>
    <el-row :gutter="20">
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-card shadow="hover">
          <div slot="header">播放传统MP4</div>
          <vab-player-mp4 :config="config1" @player="Player1 = $event" />
        </el-card>
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-card shadow="hover">
          <div slot="header">播放m3u8，且不暴露视频地址</div>
          <vab-player-hls
            :config="config2"
            @player="Player2 = $event"
          ></vab-player-hls>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { VabPlayerHls, VabPlayerMp4 } from '@/extra/vabPlayer.js'

  export default {
    name: 'Player',
    components: {
      VabPlayerMp4,
      VabPlayerHls,
    },
    data() {
      return {
        config1: {
          id: 'mse1',
          url: 'https://cdn.jsdelivr.net/gh/chuzhixin/videos@master/video.mp4',
          volume: 1,
          autoplay: false,
          screenShot: false,
        },
        Player1: null,
        config2: {
          id: 'mse2',
          url: 'https://cdn.jsdelivr.net/gh/chuzhixin/videos@master/video.m3u8',
          volume: 1,
          autoplay: false,
          pip: false,
          screenShot: false,
        },
        Player2: null,
      }
    },
  }
</script>
