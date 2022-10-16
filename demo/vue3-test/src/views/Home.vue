<template>
  <svg-icon icon-class="mf"></svg-icon>
  <div
    ref="dplayer"
    class="dplayer"
  ></div>
  <button @click="pause">暂停</button>
  <button @click="sendDanmu">发送弹幕</button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import HLS from "hls.js";
import FLV from "flv.js";
import DPlayer from "dplayer";

export default defineComponent({
  setup() {
    const dplayer = ref(null);
    let dp: null | DPlayer;

    const isMP4 = (src: string): boolean => src.indexOf(".mp4") > -1;
    const isHLS = (src: string): boolean => src.indexOf(".m3u8") > -1;
    const isFLV = (src: string): boolean => src.indexOf(".flv") > -1;

    // const url = "/mp4";
    const url =
      "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"; //视频
    // const url = "http://cclive2.aniu.tv/live/anzb.m3u8"; //直播
    // const url =
    //   "https://t12.cdn2020.com:12337/video/m3u8/2021/10/07/12cadcc9/index.m3u8";

    onMounted(() => {
      initDplayer();
    });

    function initDplayer(): void {
      dp = new DPlayer({
        container: dplayer.value,
        video: {
          url,
          type: getVideoType(url),
          customType: getCustomType(url),
          pic: require("@/assets/logo.png"),
        },
        autoplay: true,
        // live: true,
        logo: require("@/assets/logo.png"),
        screenshot: true,

        danmaku: {
          id: "9E2E3368B56CDBB4",
          api: "https://api.prprpr.me/dplayer/",
          token: "tokendemo",
          maximum: "1000",
          addition: ["https://s-sh-17-dplayercdn.oss.dogecdn.com/1678963.json"], //获取弹幕地址
          user: "DIYgod",
          bottom: "15%",
          unlimited: true,
        },
      });
    }

    // 获取视频类型
    function getVideoType(src: string) {
      if (isHLS(src)) {
        return "customHls";
      }
      if (isMP4(src)) {
        return "auto";
      }
      if (isFLV(src)) {
        return "customFlv";
      }
    }

    // 获取视频流类型
    function getCustomType(src: string) {
      if (isHLS(src)) {
        return {
          customHls: function (video: HTMLVideoElement) {
            const hls = new HLS();
            hls.loadSource(video.src);
            hls.attachMedia(video);
          },
        };
      }

      if (isFLV(src)) {
        return {
          customFlv: function (video: HTMLVideoElement) {
            const flvPlayer = FLV.createPlayer({
              type: "flv",
              url: video.src,
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
          },
        };
      }

      if (isMP4(src)) {
        return "";
      }
    }

    function pause() {
      if (dp) {
        dp.pause();
      }
    }

    function sendDanmu() {
      if (dp) {
        dp.danmaku.send(
          {
            text: "老铁666",
            color: "#b7daff",
            type: "right", // should be `top` `bottom` or `right`
          },
          function () {
            console.log("success");
          }
        );
      }
    }

    return {
      dplayer,
      pause,
      sendDanmu,
    };
  },
});
</script>

<style>
.dplayer {
  width: 600px;
  height: 400px;
}

.dplayer-logo {
  width: 20px;
  height: 20px;
}
</style>
