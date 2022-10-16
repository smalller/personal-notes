<template>
  <el-drawer
    custom-class="live-detail-drawer-box"
    v-model="drawerStatus"
    :before-close="handleClose"
    destroy-on-close
    z-index="99"
  >
    <div class="container">
      <div class="top-box">
        <template v-if="whenceIndex === 1">
          <div class="cover-img upload-cover" v-if="liveInfo.uploadAvatarUrl">
            <img :src="liveInfo.uploadAvatarUrl" alt="" />
          </div>
          <!-- <div
            id="img-box"
            class="cover-img"
            v-else-if="liveInfo.liveTeacherAvatar"
          >
            <img :src="liveInfo.liveTeacherAvatar" alt="" />
            <span>{{ liveInfo.publishUserName || "老师" }}的直播</span>
          </div> -->
        </template>
        <template v-else>
          <div class="cover-img upload-cover" v-if="liveInfo.coverImg">
            <img :src="liveInfo.coverImg" alt="" />
          </div>
        </template>
        <div class="live-info">
          <div class="title">
            <span class="live-name">{{ liveInfo.liveName }}</span>
            <span
              v-if="whenceIndex === 2"
              :class="['live-status', getLiveStatusBg(liveInfo.liveStatus)]"
              >{{ getLiveStatusStr(liveInfo.liveStatus) }}</span
            >
          </div>
          <div class="middle-info">
            <span>主播 {{ liveInfo.publishUserName }}</span>
            <span
              >预计开播
              {{ dayjs(liveInfo.publishTime).format("YYYY-MM-DD HH:mm") }}</span
            >
            <span v-if="whenceIndex === 1"
              >时长 {{ `${liveInfo.liveDuration}小时` || "0小时" }}</span
            >
            <span v-else
              >时长 {{ `${liveInfo.liveDuration / 3600}小时` || "0小时" }}</span
            >
          </div>
          <div class="issue-scope">发布范围：{{ getReleaseScope() }}</div>
        </div>
      </div>
      <template v-if="whenceIndex === 1">
        <div class="html-content">
          <p class="live-detail">直播详情</p>
          <div v-if="liveInfo.description" v-html="liveInfo.description"></div>
          <div v-else>暂无直播详情</div>
        </div>
      </template>
      <template v-else>
        <TopType
          :topTypeList="topTypeList"
          @changeTopType="changeTopType"
        ></TopType>
        <div class="html-content" v-if="currentType === 1">
          <div v-if="liveInfo.description" v-html="liveInfo.description"></div>
          <div v-else>暂无直播详情</div>
        </div>
        <ReviewList
          v-else-if="currentType === 2"
          :liveId="liveInfo.liveId"
          @getTotalNum="getTotalNum($event, 2)"
        ></ReviewList>
        <WatchList
          v-else-if="currentType === 3"
          :liveId="liveInfo.liveId"
          @getTotalNum="getTotalNum($event, 3)"
        ></WatchList>
        <DynamicGiveLikeList
          v-else-if="currentType === 4"
          :relatedId="liveInfo.liveId"
          :isLive="true"
          @getTotalNum="getTotalNum($event, 4)"
        ></DynamicGiveLikeList>
        <ShareList
          v-else-if="currentType === 5"
          :liveId="liveInfo.liveId"
          @getTotalNum="getTotalNum($event, 5)"
        ></ShareList>
      </template>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import TopType from "@/components/TopType.vue";
import { TopTypeListItem } from "@/utils/common";
import DynamicGiveLikeList from "@/components/DynamicGiveLikeList.vue";
import micell from "micell";
import { getLiveStatusStr, getLiveStatusBg } from "../index";
import { useStore } from "vuex";
import WatchList from "./WatchList.vue";
import ShareList from "./ShareList.vue";
import ReviewList from "./ReviewList.vue";
import { getChatList, getViewRecord, getShareRecord } from "@/api/liveStream";
import { queryPraises } from "@/api/reviewManage";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    TopType,
    DynamicGiveLikeList,
    WatchList,
    ShareList,
    ReviewList,
  },
  setup() {
    const store = useStore();
    let classList = JSON.parse(
      JSON.stringify(store.state.commonData.classList)
    );
    const drawerStatus = ref(false);
    const currentType = ref(1); // 标签页索引
    const liveInfo = ref({} as any); //打开抽屉传过来的数据
    const topTypeList = ref([
      {
        label: `直播详情`,
        value: 1,
      },
      {
        label: "评论",
        value: 2,
      },
      {
        label: `观看`,
        value: 3,
      },
      {
        label: "点赞",
        value: 4,
      },
      {
        label: `分享`,
        value: 5,
      },
    ]);
    const whenceIndex = ref(-1); //来处：1-预览/发布预览，2-查看详情

    // 关闭抽屉回调
    const handleClose = (): void => {
      topTypeList.value = [
        {
          label: `直播详情`,
          value: 1,
        },
        {
          label: "评论",
          value: 2,
        },
        {
          label: `观看`,
          value: 3,
        },
        {
          label: "点赞",
          value: 4,
        },
        {
          label: `分享`,
          value: 5,
        },
      ];
      currentType.value = 1;
      drawerStatus.value = false;
      whenceIndex.value = -1;
    };

    // 打开抽屉
    const handleOpen = (res: any, whence: number): void => {
      liveInfo.value = res;
      // liveInfo.value.liveId = "d3056c0441b845d2b612aa900e5c8844";
      whenceIndex.value = whence;
      getReveiwList();
      getWatchList();
      getGiveLikeList();
      getShareList();
      drawerStatus.value = true;
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      currentType.value = res.value;
    };

    // 获取评论条数
    async function getReveiwList() {
      const { code, data } = await getChatList(1, 20, {
        liveId: liveInfo.value.liveId,
      });
      if (+code === 0) {
        topTypeList.value[1].label = `评论 ${data.page.totalNum}`;
      }
    }

    // 获取观看列表条数
    async function getWatchList() {
      const { code, data } = await getViewRecord(
        1,
        20,
        Object.assign(
          {},
          {
            id: liveInfo.value.liveId,
          }
        )
      );
      if (+code === 0) {
        topTypeList.value[2].label = `观看 ${data.page.totalNum}`;
      }
    }

    // 获取点赞列表条数
    async function getGiveLikeList() {
      const { code, data } = await queryPraises(
        1,
        20,
        Object.assign(
          {},
          {
            relatedId: liveInfo.value.liveId,
          }
        )
      );
      if (+code === 0) {
        topTypeList.value[3].label = `点赞 ${data.page.totalNum}`;
      }
    }

    // 获取分享列表条数
    async function getShareList() {
      const { code, data } = await getShareRecord(
        1,
        20,
        Object.assign(
          {},
          {
            id: liveInfo.value.liveId,
          }
        )
      );
      if (+code === 0) {
        topTypeList.value[4].label = `分享 ${data.page.totalNum}`;
      }
    }

    // tab标签上显示对应的数量
    function getTotalNum(num: number, index: number) {
      switch (index) {
        case 2:
          topTypeList.value[1].label = `评论 ${num}`;
          break;
        case 3:
          topTypeList.value[2].label = `观看 ${num}`;
          break;
        case 4:
          topTypeList.value[3].label = `点赞 ${num}`;
          break;
        case 5:
          topTypeList.value[4].label = `分享 ${num}`;
          break;
      }
    }

    //获取发布范围
    function getReleaseScope() {
      if (liveInfo.value.releaseScope[0] === "all") {
        return "全园";
      } else {
        if (whenceIndex.value === 1) {
          let arr: string[] = [];
          liveInfo.value.releaseScope.forEach((item: any) => {
            classList.forEach((it: any) => {
              if (item === it.id) {
                arr.push(it.name);
              }
            });
          });
          return arr.join("、");
        } else {
          return Object.values(liveInfo.value.releaseScope).join("、");
        }
      }
    }

    return {
      drawerStatus,
      handleClose,
      handleOpen,
      liveInfo,
      topTypeList,
      changeTopType,
      currentType,
      micell,
      getLiveStatusBg,
      getLiveStatusStr,
      getReleaseScope,
      whenceIndex,
      getTotalNum,
      dayjs,
    };
  },
});
</script>
<style lang="less">
.live-detail-drawer-box {
  width: 960px !important;

  .el-drawer__body {
    overflow: hidden;
  }

  .body-text-box {
    margin: 28px 0 40px 0;
    font-size: 14px;
    color: #f56060;
  }

  .container {
    padding: 0 142px 73px;
    box-sizing: border-box;

    .top-box {
      display: flex;
      margin-bottom: 15px;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 10px;

      .live-info {
        flex: 1;
        .title {
          margin-bottom: 7px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;

          .live-name {
            color: #222;
            font-size: 24px;
            margin-right: 10px;
          }

          .live-status {
            font-size: 12px;
            color: #ffffff;
            padding: 3px 8px;
            border-radius: 3px;
            box-sizing: border-box;
            min-width: 52px;
          }

          .blue-bg {
            background-color: #4fa8f9;
          }
          .yellow-bg {
            background-color: #ff9900;
          }

          .gray-bg {
            background-color: #9aadbb;
          }
        }

        .middle-info {
          margin-bottom: 18px;
          > span {
            color: #666;
            font-size: 14px;
            margin-right: 16px;
          }
        }

        .issue-scope {
          font-size: 14px;
          color: #999;
        }
      }

      .cover-img {
        width: 170px;
        height: 96px;
        border-radius: 4px;
        margin-right: 20px;
      }

      .upload-cover {
        > img {
          width: 170px;
          height: 96px;
          border-radius: 4px;
          object-fit: cover;
          border: 1px solid undefined;
        }
      }

      #img-box {
        position: relative;
        background: linear-gradient(135deg, #4fa4f9, #6c63ff);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 170px;
        height: 96px;

        > img {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
        }

        > span {
          color: #fff;
          font-size: 16px;
        }

        &::before {
          position: absolute;
          bottom: 0;
          left: 0;
          display: block;
          content: "";
          background: url("../../../../assets/live-cover-icon.png") no-repeat;
          height: 53px;
          width: 53px;
        }
      }
    }

    .html-content {
      margin-top: 22px;
      overflow-y: auto;
      height: calc(100vh - 252px);

      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 8px;
        position: absolute;
        right: 0;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        width: 6px;
        height: 90px;
        background-color: #bfbfbf;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        // -webkit-box-shadow: inset 0 0 5px rgba(0, 34, 68, 0.01);
        border-radius: 4px;
        background: rgba(0, 34, 68, 0);
      }

      .live-detail {
        font-size: 16px;
        color: #ff9900;
        margin-bottom: 20px;
      }
    }

    .recipe-link {
      background: #fafafa;
      border-radius: 8px;
      padding: 13px 14px;
      box-sizing: border-box;
      margin: 20px 0;

      > img {
        width: 64px;
        height: 64px;
        vertical-align: middle;
        margin-right: 20px;
      }

      .router-link {
        vertical-align: middle;
        cursor: pointer;
        font-size: 14px;
        color: #222222;
        text-decoration: none;

        &:hover {
          color: #999999;
        }
        &:active {
          color: #222222;
        }
      }
    }
  }
}
</style>
