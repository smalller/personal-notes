<template>
  <div class="videoList">
    <div class="fromBox">
      <div>
        <div class="fromBoxItem">
          <span>班级</span>
          <ui-select
            v-model="form.classId"
            @change="queryFrom"
            style="width: 140px"
          >
            <ui-select-option label="全选" value=""></ui-select-option>
            <ui-select-option
              v-for="item in classSelectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></ui-select-option>
          </ui-select>
        </div>
        <div class="fromBoxItem">
          <span>场景</span>
          <ui-select
            v-model="form.sceneId"
            @change="queryFrom"
            style="width: 140px"
          >
            <ui-select-option label="全部场景" value=""></ui-select-option>
            <ui-select-option
              v-for="item in sceneList"
              :key="item.id"
              :label="item.scene"
              :value="item.id"
            ></ui-select-option>
          </ui-select>
        </div>
        <div class="fromBoxItem">
          <ui-input
            placeholder="输入视频名称"
            icon="icon-a-101"
            v-model="form.ipcName"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
        </div>
      </div>
      <div>
        <div class="fromBoxItem">
          <ui-button icon="icon-a-zu1698" @click="queryFrom"
            >刷新设备</ui-button
          >
        </div>
      </div>
    </div>
    <div class="listBox scroll" v-loadings="loading">
      <video-item
        :sceneList="sceneList"
        @play="openDetails"
        @edit="queryFrom"
        v-for="item in videoLIst"
        :id="item.ipcId"
        :key="item.ipcId"
        :info="item"
        :videoType="schoolInfo.cameraType"
      ></video-item>
      <div class="videoItem" v-for="i in num" :key="i">暂未配置，敬请期待</div>
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

  <ui-video ref="videoPlayer" :visible="videoPlayerShow"></ui-video>
  <div v-if="ysyShow" class="video-ev">
    <div class="ui-video-closeBtn" @click="ysyShow = false">
      <ui-icon icon="icon-a-zu238"></ui-icon>
    </div>
    <iframe class="video-ev-box" :src="evPlay"></iframe>
  </div>
  <el-drawer
    custom-class="videoDrawerBox"
    destroy-on-close
    v-model="drawerStatus"
    :with-header="false"
  >
    <div class="videoDetailsBox">
      <ui-icon
        class="closeBtn"
        @click="drawerStatus = false"
        icon="icon-a-zu238"
      ></ui-icon>

      <div class="detailsHead">
        <div class="headVideoBox">
          <iframe
            class="ysVideo"
            :src="evPlay"
            v-show="+schoolInfo.cameraType === 1"
          ></iframe>
          <ui-video
            :mask="false"
            v-show="+schoolInfo.cameraType !== 1"
          ></ui-video>
        </div>
        <div class="videoInfoBox">
          <div>
            <p>
              大操场1
              <ui-icon icon="icon-a-52"></ui-icon>
            </p>
            <span>场景：操场</span>
            <span>创建时间：2018-08-24 18:20:32</span>
          </div>
          <div>
            <div>
              <p>268</p>
              <span>正在观看家长</span>
            </div>
            <div>
              <p>2.1w</p>
              <span>今日观看次数</span>
            </div>
            <div>
              <p>2.1w</p>
              <span>总观看次数</span>
            </div>
            <div>
              <p>20:50:30</p>
              <span>总观看时长</span>
            </div>
          </div>
        </div>
      </div>
      <div class="detailsContent">
        <ui-tab
          v-model:index="detailsContentIndex"
          :list="['正在观看', '观看记录']"
        ></ui-tab>
        <div class="fromBox">
          <div>
            <div class="fromBoxItem">
              <span>班级</span>
              <ui-select v-model="form.project" style="width: 140px">
                <ui-select-option label="1" value="1"></ui-select-option>
                <ui-select-option label="2" value="2"></ui-select-option>
                <ui-select-option label="3" value="3"></ui-select-option>
              </ui-select>
            </div>
            <div class="fromBoxItem" v-if="detailsContentIndex === 1">
              <span>时间</span>
              <ui-select v-model="form.project" style="width: 96px">
                <ui-select-option label="今天" value="1"></ui-select-option>
                <ui-select-option label="昨天" value="2"></ui-select-option>
                <ui-select-option label="7天内" value="3"></ui-select-option>
                <ui-select-option label="14天内" value="3"></ui-select-option>
                <ui-select-option label="30天内" value="3"></ui-select-option>
                <ui-select-option label="3个月内" value="3"></ui-select-option>
                <ui-select-option label="全部" value=""></ui-select-option>
              </ui-select>
            </div>
            <div class="fromBoxItem" v-if="detailsContentIndex === 1">
              <ui-date-picker
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></ui-date-picker>
            </div>
            <div class="fromBoxItem">
              <ui-input
                placeholder="输入姓名或手机号"
                icon="icon-a-101"
              ></ui-input>
            </div>
          </div>
          <div></div>
        </div>
        <div class="detailsTableBox">
          <ui-table :data="detailsList" v-if="detailsContentIndex === 0">
            <ui-table-column prop="id" label="幼儿家长"></ui-table-column>
            <ui-table-column prop="id" label="手机号"></ui-table-column>
            <ui-table-column prop="id" label="观看日期"></ui-table-column>
            <ui-table-column
              tips="111"
              prop="id"
              label="观看时间"
            ></ui-table-column>
          </ui-table>
          <ui-table :data="detailsList" v-if="detailsContentIndex === 1">
            <ui-table-column prop="id" label="幼儿家长"></ui-table-column>
            <ui-table-column prop="id" label="手机号"></ui-table-column>
            <ui-table-column prop="id" label="观看日期"></ui-table-column>
            <ui-table-column
              tips="111"
              prop="id"
              label="观看时间"
            ></ui-table-column>
          </ui-table>
          <ui-pagination></ui-pagination>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import VideoItem from "../../components/videoItem.vue";
import {
  queryAllScene,
  queryDevicePage,
  queryCameraType,
  queryEvCamera,
} from "@/api/surveillanceVideo";
import { useStore } from "vuex";
import { VideoPlayer } from "@/base/interface";
import Message from "@/themes/message/index";
import micell from "micell";

export default defineComponent({
  components: { VideoItem },
  setup() {
    const loading = ref(true);
    const $store = useStore();
    const schoolInfo = computed(() => $store.state.user.schoolInfo);
    const page = reactive({
      page: 0,
    });
    const form = reactive({
      classId: "",
      sceneId: "",
      ipcName: "",
      deviceName: "",
      project: "",
    });
    const pageForm = reactive({
      page: 1,
      pageSize: 20,
      total: 0,
    });
    interface Video {
      ipcId: string;
    }
    const videoLIst = ref<Video[]>([]);
    const detailsList = ref([]);
    const drawerStatus = ref(false);
    const detailsContentIndex = ref(0);
    const videoPlayer = ref(null);
    const sceneList = ref([]);
    let videoDetails = reactive({});
    const num = ref(0);
    const videoPlayerShow = ref(false);
    watch(drawerStatus, (newValue) => {
      if (!newValue) {
        videoDetails = {};
      }
    });

    /**
     * 查询班级信息
     */
    $store.dispatch("getClassList");
    const classSelectList = ref([]);
    const classList = computed(() => $store.state.commonData.classList);
    watch(classList, () => {
      classSelectList.value = classList.value;
    });

    // /**
    //  * 查询学校班级
    //  */
    // $store.dispatch("getClassList");
    // const classList = computed(() => $store.state.commonData.classList);

    /**
     *查询学校的所有场景
     */
    const queryAllScenes = (): void => {
      queryAllScene().then((res) => {
        if (res.code === 0) {
          sceneList.value = res.data;
        }
      });
    };
    queryAllScenes();

    /**
     * 通过名称查询数据
     */
    const handleSearchInfo = (): void => {
      // console.log(form.name);
      queryFrom();
    };

    let searchTime: number;
    watch(
      () => form.ipcName,
      () => {
        if (searchTime) {
          clearTimeout(searchTime);
        }
        searchTime = setTimeout(() => {
          queryFrom();
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
    const ysyShow = ref(false);
    const evPlay = ref("");
    /**
     * 打开视频详情
     */
    const openDetails = (item: VideoItem) => {
      // drawerStatus.value = true;
      if (+schoolInfo.value.cameraType !== 1) {
        if (!item.hlsUrl) {
          Message.warning("没有获取到视频链接");
          return;
        }

        videoPlayerShow.value = true;
        videoDetails = item;
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
        evPlay.value = "";
        if (!item.playbackAddress) {
          ysyShow.value = false;
          Message.warning("没有获取到视频链接");
          return;
        } else {
          ysyShow.value = true;
          evPlay.value = item.playbackAddress;
        }
      }
    };

    /**
     * 翻页
     * @param page
     */
    const pageChange = (page: number) => {
      pageForm.page = page;
      queryFrom();
    };

    /**
     * pageSize修改
     * @param pageSize
     */
    const pageSizeChange = (pageSize: number) => {
      pageForm.pageSize = pageSize;
      queryFrom();
    };
    const schoolData = $store.state.user.schoolId;
    const videoType = ref("0");
    const querySchool = () => {
      if (schoolData) {
        queryCameraType(schoolData).then((res) => {
          if (res.code === 0) {
            if (res.data) {
              videoType.value = res.data.cameraType ? res.data.cameraType : "0";
            }
            console.log("摄像头数据", res);
            queryFrom();
          }
        });
        console.log(schoolData, "0000000000000000");
      }
    };

    onMounted(() => {
      // querySchool();
      queryFrom();
      // window.addEventListener("resize", resizeFun);
      // setTimeout(resizeFun, 300);
    });

    /**
     * 查询数据
     */
    const queryFrom = () => {
      loading.value = true;
      console.log(schoolInfo.value);
      if (+schoolInfo.value.cameraType !== 1) {
        queryDevicePage({
          pageNo: pageForm.page,
          pageSize: pageForm.pageSize,
          sceneId: form.sceneId,
          ipcName: form.ipcName,
          clazzId: form.classId,
        }).then((res) => {
          if (res.code === 0) {
            console.log("摄像头数据", res);
            pageForm.total = res.data.page.totalNum;
            videoLIst.value = res.data.list;
            console.log(videoLIst.value);
            // num.value = pageForm.pageSize - res.data.list.length;
            // num.value = num.value > 0 ? num.value : 0;
            loading.value = false;
            // setTimeout(resizeFun, 300);
          }
        });
      } else {
        queryEvCamera({
          pageNo: pageForm.page,
          pageSize: pageForm.pageSize,
          sceneId: form.sceneId,
          ipcName: form.ipcName,
          clazzId: form.classId,
        }).then((res) => {
          if (res.code === 0) {
            console.log("摄像头数据", res);
            pageForm.total = res.data.page.totalNum;
            videoLIst.value = res.data.list;
            // num.value = pageForm.pageSize - res.data.list.length;
            // num.value = num.value > 0 ? num.value : 0;
            loading.value = false;
            // setTimeout(resizeFun, 300);
          }
        });
      }
    };

    let resizeFun = () => {
      if (videoLIst.value.length > 0) {
        const dom = document.getElementById(
          videoLIst.value[0].ipcId
        ) as HTMLElement;
        setTimeout(() => {
          const boxDom = document.querySelector(".listBox") as HTMLElement;
          const boxWidth = micell.dom.pageWidth(boxDom);
          const width = micell.dom.pageWidth(dom) + 10;
          const n: number = boxWidth / width;
          if (n > videoLIst.value.length) {
            num.value = n - videoLIst.value.length;
          } else {
            num.value = videoLIst.value.length % n;
          }
        }, 500);
      } else {
        num.value = 0;
      }
    };
    onMounted(() => {
      // window.addEventListener("resize", resizeFun);
      // setTimeout(resizeFun, 300);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", resizeFun);
    });

    return {
      loading,
      videoLIst,
      classSelectList,
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
      num,
      queryFrom,
      openDetails,
      pageChange,
      pageSizeChange,
      handleSearchInfo,
      evPlay,
      ysyShow,
      schoolInfo,
    };
  },
});
</script>

<style lang="less">
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
  iframe {
    width: 100%;
    height: 100%;
  }
}
.videoList {
  .fromBox {
    display: flex;
    padding: 20px 0 15px 0;
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
      //margin-bottom: 10px;
      .el-input {
        height: 32px;
        line-height: 32px;
      }
      &:last-child {
        margin-right: 0;
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
    grid-template-columns: repeat(auto-fill, minmax(260px, 370px));
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    > div {
      //margin-bottom: 20px;
      //margin-right: 14px;
      width: 100%;
      //height: 100%;
      //width: 19vw;
      //max-height: 208px;
      height: calc(370px / 1.777);
      //min-height: 164px;
      //min-width: 260px;
      //min-height: calc(260px / 1.7788);
      &:nth-child(4n + 0) {
        //margin-right: 0;
      }
    }
    .videoItem {
      background: #f7f7f7;
      border: 1px solid #d9d9d9;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #bfbfbf;
      box-sizing: border-box;
    }
  }
}
.videoDrawerBox {
  width: 960px !important;

  .videoDetailsBox {
    position: relative;
    padding: 40px;
    box-sizing: border-box;
    width: 960px;
  }
  .closeBtn {
    width: 16px;
    height: 16px;
    cursor: pointer;
    position: absolute;
    right: 18px;
    top: 18px;
    fill: #999999;
  }
  .detailsHead {
    height: 340px;
    display: flex;
    //justify-content: space-between;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 4px;
    .headVideoBox {
      width: 600px;
      height: 340px;
      .ysVideo {
        width: 100%;
        height: 100%;
      }
    }
    > div {
      &:first-child {
        width: 600px;
        height: 340px;
        box-sizing: border-box;
      }
    }
    .videoInfoBox {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div {
        &:first-child {
          p {
            color: #222222;
            font-size: 24px;
            display: flex;
            align-items: center;
            .icon {
              width: 16px;
              height: 16px;
              opacity: 1;
              fill: #9a9a9a;
              margin-left: 16px;
              cursor: pointer;
            }
          }
          span {
            margin-top: 6px;
            display: block;
            color: #999999;
            font-size: 14px;
          }
        }
        &:last-child {
          width: 260px;
          height: 158px;
          background: #fafafa;
          border-radius: 8px;
          padding: 20px;
          box-sizing: border-box;
          display: grid;
          grid-template-rows: 70px 70px;
          grid-template-columns: 100px 100px;
          grid-row-gap: 0px;
          grid-column-gap: 0px;
          p {
            font-weight: 700;
            font-size: 20px;
            color: #222222;
          }
          span {
            color: #999999;
            font-weight: 400;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
