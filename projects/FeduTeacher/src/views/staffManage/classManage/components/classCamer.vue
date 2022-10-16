<template>
  <div class="videoList">
    <Nodata v-if="videoList.length === 0 && !loading" :type="3"></Nodata>
    <div class="listBox scroll" v-loading="loading">
      <video-item
        :sceneList="sceneList"
        @play="openDetails"
        @edit="getClassCamer"
        v-for="item in videoList"
        :key="item.id"
        :info="item"
        :video-type="schoolInfo.cameraType"
      ></video-item>
      <!-- <div class="videoItem" v-for="i in num" :key="i">暂未配置，敬请期待</div> -->
    </div>
  </div>
  <ui-pagination
    :total="pageForm.total"
    :currentPage="pageForm.page"
    :pageSize="pageForm.pageSize"
    @handleCurrentChange="pageChange"
    @handleSizeChange="pageSizeChange"
  >
  </ui-pagination>
  <ui-video v-model:visible="videoPlayerShow" ref="videoPlayer"></ui-video>
  <div v-if="showEv" class="video-ev">
    <div class="ui-video-closeBtn" @click="showEv = false">
      <ui-icon icon="icon-a-zu238"></ui-icon>
    </div>
    <iframe class="video-ev" :src="evPlay"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from "vue";
import VideoItem from "@/components/videoItem.vue";
import { useStore } from "vuex";
import Nodata from "./noData.vue";
import { VideoPlayer } from "@/base/interface";
import { queryClassDevice, queryDevicePage } from "@/api/surveillanceVideo";
import { queryAllScene } from "@/api/classManage";
import Message from "@/themes/message";

export default defineComponent({
  components: { VideoItem, Nodata },
  props: {
    classId: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    const $store = useStore();
    const schoolInfo = computed(() => $store.state.user.schoolInfo);
    const page = reactive({
      page: 0,
    });
    const form = reactive({
      project: "",
      sceneId: "",
      ipcName: "",
    });
    const pageForm = reactive({
      page: 1,
      pageSize: 20,
      total: 0,
    });
    let videoList = ref([]);
    const detailsList = ref([]);
    const drawerStatus = ref(false);
    const detailsContentIndex = ref(0);
    const videoPlayer = ref(null);
    const sceneList = ref([]);
    const loading = ref(true);
    let videoDetails = reactive({});
    const num = ref(0);
    const videoPlayerShow = ref(false);
    watch(drawerStatus, (newValue) => {
      if (!newValue) {
        videoDetails = {};
      }
    });

    /**
     * 查询学校班级
     */
    $store.dispatch("getClassList");
    const classList = computed(() => $store.state.commonData.classList);

    /**
     *查询学校的所有场景
     */
    const queryAllScenes = (): void => {
      loading.value = true;
      queryAllScene({
        clazzId: props.classId,
      }).then((res) => {
        if (res.code === 0) {
          sceneList.value = res.data;
          loading.value = false;
        }
      });
    };
    queryAllScenes();

    /**
     * 通过名称查询数据
     */
    const handleSearchInfo = (): void => {
      // console.log(form.name);
      getClassCamer();
    };

    let searchTime: number;
    watch(
      () => form.ipcName,
      () => {
        if (searchTime) {
          clearTimeout(searchTime);
        }
        searchTime = setTimeout(() => {
          getClassCamer();
        }, 500);
      }
    );

    interface VideoItem {
      channelId: string;
      coverPictureUrl: string;
      flvUrl: string;
      hlsUrl: string;
      playbackAddress?: string;
    }
    const showEv = ref(false);
    const evPlay = ref("");
    /**
     * 打开视频详情
     */
    const openDetails = (item: VideoItem) => {
      console.log(item);
      videoDetails = item;

      if (+schoolInfo.value.cameraType !== 1) {
        if (!item.hlsUrl) {
          Message.warning("没有获取到视频链接");
          return;
        }
        videoPlayerShow.value = true;
        // drawerStatus.value = true;
        const dp = (videoPlayer.value as unknown as VideoPlayer).init(
          // "http://cclive2.aniu.tv/live/anzb.m3u8",
          item.hlsUrl,
          {
            live: true,
            autoPlay: true,
          }
        );
        dp.volume(0.7, true, true);
      } else {
        showEv.value = false;
        evPlay.value = "";
        if (!item.playbackAddress) {
          Message.warning("没有获取到视频链接");
          return;
        } else {
          showEv.value = true;
          evPlay.value = item.playbackAddress;
        }

        console.log("123212313123", videoDetails);
      }
    };

    /**
     * 翻页
     * @param page
     */
    const pageChange = (page: number) => {
      pageForm.page = page;
      getClassCamer();
    };

    /**
     * pageSize修改
     * @param pageSize
     */
    const pageSizeChange = (pageSize: number) => {
      pageForm.pageSize = pageSize;
      getClassCamer();
    };

    // //获取毕业NVR信息
    // const getClassCamer = async (): Promise<any> => {
    //   let url = "/facility/api/cameraStream/queryClazzPage";
    //   let { code, data } = await setTableData(
    //     url,
    //     pageForm.page,
    //     pageForm.pageSize,
    //     Object.assign(
    //       {},
    //       {
    //         schoolId: sessionStorage.getItem("schoolId") || "",
    //         clazzId: props.classId,
    //         // schoolId: "SCH1402529539370160128",
    //         // clazzId: "CLZ1402533345910755328",
    //       }
    //     )
    //   );
    //   if (+code === 0) {
    //     console.log(data, "666666333333333333");
    //     pageForm.total = data.list.length;
    //     videoList.value = data.list;
    //     // classOverList.value = data.list;
    //     // totalNum.value = data.list.length;
    //   }
    // };
    // getClassCamer();

    /**
     * 查询数据
     */
    const getClassCamer = () => {
      if (+schoolInfo.value.cameraType === 1) {
        queryClassDevice(props.classId).then((res) => {
          console.log(res);
          if (+res.code === 0) {
            pageForm.total = res.data.page.totalNum;
            videoList.value = res.data.list;
            num.value = pageForm.pageSize - res.data.list.length;
            num.value = num.value > 0 ? num.value : 0;
          }
        });
      } else {
        queryDevicePage({
          pageNo: pageForm.page,
          pageSize: pageForm.pageSize,
          sceneId: form.sceneId,
          ipcName: form.ipcName,
          clazzId: props.classId,
        }).then((res) => {
          if (res.code === 0) {
            pageForm.total = res.data.page.totalNum;
            videoList.value = res.data.list;
            num.value = pageForm.pageSize - res.data.list.length;
            num.value = num.value > 0 ? num.value : 0;
          }
        });
      }
    };
    getClassCamer();
    return {
      videoList,
      classList,
      page,
      form,
      drawerStatus,
      detailsContentIndex,
      detailsList,
      pageForm,
      sceneList,
      videoDetails,
      videoPlayer,
      videoPlayerShow,
      schoolInfo,
      // num,
      openDetails,
      pageChange,
      pageSizeChange,
      handleSearchInfo,
      getClassCamer,
      loading,
      showEv,
      evPlay,
    };
  },
});
</script>

<style lang="less" scoped>
.video-ev {
  position: fixed;
  z-index: 2;
  left: 50%;
  top: 50%;
  width: 800px;
  height: 450px;
  transform: translate(-50%, -50%);
  .ui-video-closeBtn {
    position: absolute;
    z-index: 100001;
    right: 8px;
    top: 8px;
    cursor: pointer;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      fill: #ffffff;
    }
  }
}
.videoList {
  .fromBox {
    display: flex;
    padding: 22px 0 15px 0;
    justify-content: space-between;

    > div {
      display: flex;
      flex-wrap: wrap;
    }
    .fromBoxItem {
      margin-right: 16px;
      display: flex;
      white-space: nowrap;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        height: 32px;
        line-height: 32px;
      }
    }

    span {
      font-size: 14px;
      color: #999999;
      margin-right: 6px;
    }
    .primary {
      span {
        color: #ffffff;
      }
    }
  }
  .listBox {
    width: 100%;
    overflow-y: auto;
    //display: flex;
    //flex-wrap: wrap;
    //justify-content: flex-start;
    display: grid;
    //grid-template-rows: repeat(auto-fill, minmax(146px, 208px));
    grid-template-columns: repeat(auto-fill, minmax(150px, 280px));
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    > div {
      //margin-bottom: 20px;
      //margin-right: 14px;
      width: 100%;
      //height: 100%;
      //width: 19vw;
      //max-height: 208px;
      // height: calc(370px / 1.777);
      //min-height: 164px;
      //min-width: 260px;
      //min-height: calc(260px / 1.7788);
      // &:nth-child(4n + 0) {
      //   //margin-right: 0;
      // }
    }
    .videoItem {
      background: #f7f7f7;
      border: 1px solid #d9d9d9;
      display: flex;
      height: 155px;
      width: 280px;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #bfbfbf;
      box-sizing: border-box;
    }
  }
}
</style>
