<template>
  <screen-box class="screenVideo" :head-show="false">
    <div class="screenVideoBox">
      <div class="videoContent">
        <Player ref="player" v-if="+schoolInfo.cameraType !== 1"></Player>
        <iframe
          class="ysVideo"
          :src="evPlay"
          v-if="+schoolInfo.cameraType === 1"
        ></iframe>
      </div>
      <div class="videoInfo">
        <span>测试</span>
      </div>
      <div class="videoTabs">
        <div
          v-for="item in videoList"
          :key="item.channelId"
          :class="{ active: activeIndex === item.channelId }"
          @click="setActiveIndex(item)"
        ></div>
      </div>
    </div>
  </screen-box>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import ScreenBox from "@/views/largeScreen/components/screenBox.vue";
import Player from "./player.vue";
import { queryDevicePage, queryEvCamera } from "@/api/surveillanceVideo";
import { useStore } from "vuex";
import Message from "@/themes/message/index";
export default defineComponent({
  name: "screenVideo",
  components: { ScreenBox, Player },
  setup(props) {
    const $store = useStore();
    const player = ref(null);
    interface Devices {
      flvUrl: string;
      channelId: string;
      playbackAddress?: string;
    }
    const schoolInfo = computed(() => $store.state.user.schoolInfo);
    const activeIndex = ref("");
    const videoList = ref<Devices[]>([]);
    onMounted(() => {
      if (+schoolInfo.value.cameraType === 1) {
        getEvCamera();
      } else {
        videoDetails();
      }
    });
    const evPlay = ref("");
    const setActiveIndex = (device: Devices) => {
      if (+schoolInfo.value.cameraType !== 1) {
        activeIndex.value = device.channelId;
        const video = player.value as unknown as any;
        video.setPlay(device.flvUrl, {
          autoPlay: true,
          live: false,
        });
      } else {
        if (!device.playbackAddress) {
          Message.warning("没有获取到视频链接");
          return;
        } else {
          evPlay.value = device.playbackAddress;
        }
      }
    };
    //查询NVR监控
    const videoDetails = () => {
      queryDevicePage({
        pageNo: 1,
        pageSize: 999,
      }).then((res) => {
        if (+res.code === 0) {
          res.data.list.forEach((item: Devices) => {
            videoList.value.push(item);
          });
          if (videoList.value.length > 0) {
            setActiveIndex(videoList.value[0]);
          }
        }
      });
    };

    //查询萤石云监控
    const getEvCamera = () => {
      queryEvCamera({
        pageNo: 1,
        pageSize: 999,
      }).then((res) => {
        if (+res.code === 0) {
          res.data.list.forEach((item: Devices) => {
            videoList.value.push(item);
          });
          if (videoList.value.length > 0) {
            setActiveIndex(videoList.value[0]);
          }
        }
      });
    };

    return {
      activeIndex,
      player,
      videoList,
      setActiveIndex,
      schoolInfo,
      evPlay,
    };
  },
});
</script>
<style lang="less" scoped>
.screenVideo {
  display: flex;
  // flex-direction: column;
  .screenVideoBox {
    flex: 1;
    display: flex;
    flex-direction: column;
    .videoContent {
      flex: 1;
      .videoBox {
        background: red;
      }
    }
    .videoInfo {
      height: 0.43rem;
      display: flex;
      align-items: center;
      span {
        font-size: 0.14rem;
        color: #acd3fc;
      }
    }
    .videoTabs {
      height: 0.21rem;
      display: flex;
      justify-content: center;
      > div {
        cursor: pointer;
        margin-left: 0.04rem;
        width: 0.17rem;
        height: 0.05rem;
        background: rgba(255, 255, 255, 0.2);
        &:first-child {
          margin-left: 0;
        }
        &.active {
          background: #acd3fc;
        }
      }
    }
  }
}
</style>
