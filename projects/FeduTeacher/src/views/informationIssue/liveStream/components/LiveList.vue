<template>
  <ui-modal
    v-model:visible="modalStatus"
    @ok="handleSure"
    :title="modalTitle"
    width="420"
    :tips="false"
  >
    <div class="body-text-box">{{ modalSlot }}</div>
  </ui-modal>
  <div class="live-list-box">
    <ul v-if="dataList.length > 0">
      <li v-for="(item, index) in dataList" :key="item.id">
        <el-checkbox
          @change="checkChange"
          v-model="checkList[index]"
        ></el-checkbox>
        <div class="li-content-box">
          <div class="img-box">
            <img
              :src="item.coverImg || require('@/assets/staff-avatar.png')"
              alt=""
            />
          </div>
          <div class="right-content flex-col-1">
            <ul class="flex-col-1">
              <li>
                <div class="live-title">
                  <span class="live-name">{{ item.liveName }}</span>
                  <span
                    :class="['live-status', getLiveStatusBg(item.liveStatus)]"
                    >{{ getLiveStatusStr(item.liveStatus) }}</span
                  >
                </div>
                <div class="live-time f-14-999">
                  {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}
                </div>
              </li>
              <li>
                <div class="live-info">
                  <ul>
                    <li>主播 {{ item.publishUserName }}</li>
                    <li>
                      预计开播
                      {{ dayjs(item.publishTime).format("YYYY-MM-DD HH:mm") }}
                    </li>
                    <li>
                      时长 {{ `${item.liveDuration / 3600}小时` || "0小时" }}
                    </li>
                    <li
                      class="flow-box"
                      v-if="current === 2 && +item.liveStatus === 2"
                    >
                      推流&nbsp;
                      <span id="flow"> {{ item.pushUrl }}</span>
                      <ui-button
                        type="text-blue"
                        @click="copyFlow(item.pushUrl)"
                        >复制</ui-button
                      >
                      <div class="url-box">
                        <span>{{ item.pushUrl }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="issuer f-14-999">{{ item.createUserName }}</div>
              </li>
              <li>
                <div class="live-data">
                  <ul class="f-14-999">
                    <li>观看 {{ 0 }}</li>
                    <li>分享 {{ 0 }}</li>
                    <li>评论 {{ 0 }}</li>
                    <li>点赞 {{ 0 }}</li>
                    <li>
                      发布范围：{{ getReleaseScopeStr(item.releaseScope) }}
                    </li>
                  </ul>
                </div>
                <div class="hanlde-box">
                  <ui-button
                    @click="startLive(item.liveId)"
                    type="text-blue"
                    v-if="+item.liveStatus === 0"
                    >开始直播</ui-button
                  >
                  <ui-button
                    @click="editLive(item.liveId)"
                    type="text-blue"
                    v-if="+item.liveStatus === 0"
                    >编辑</ui-button
                  >
                  <ui-button
                    @click="endLive(item.liveId)"
                    type="text-blue"
                    v-if="+item.liveStatus === 2"
                    >结束直播</ui-button
                  >
                  <ui-button
                    type="text-blue"
                    @click="handlepreviewLive(item.liveId)"
                    >查看详情</ui-button
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="empty-data">没有查询到数据</p>
  </div>
  <LiveDetail ref="liveDetailCom"></LiveDetail>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import Message from "@/themes/message";
import { getLiveStatusStr, getLiveStatusBg } from "../index";
import micell from "micell";
import { describeLive, startCmsLive, stopCmsLive } from "@/api/liveStream";
import LiveDetail from "./LiveDetail.vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    LiveDetail,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    currentType: {
      type: Number,
    },
  },
  emits: ["handleLive", "checkChange"],
  setup(props, { emit }) {
    const router = useRouter();
    const dataList = computed(() => props.data as Array<any>);
    const current = computed(() => props.currentType);
    const modalStatus = ref(false);
    const checkList = ref([] as Array<boolean>);
    const liveDetailCom = ref(null);
    const handleLiveStatus = ref(-1); //0-开始直播，1-结束直播
    const modalTitle = ref("");
    const modalSlot = ref("");
    const MODAL_TITLE = [
      "确定开始直播吗？",
      "确定结束直播吗？",
    ] as Array<string>;
    const MODAL_SLOT = [
      "点击“确认”将开始直播",
      "结束后不能恢复，请谨慎操作",
    ] as Array<string>;
    const liveId = ref(""); //当前要操作的直播ID

    // 重置勾选的行
    watch(
      () => props.data,
      (newVal: Array<any>) => {
        newVal.forEach((item, index) => {
          checkList.value[index] = false;
        });
      }
    );

    // 复制推流地址
    async function copyFlow(flow: string) {
      try {
        await navigator.clipboard.writeText(flow);
        Message.success("复制成功");
      } catch (err) {
        Message.error("复制失败");
      }
    }

    // 获取发布范围
    function getReleaseScopeStr(row: any) {
      return Object.values(row).join("、");
    }

    // 勾选行事件
    function checkChange() {
      const arr: Array<any> = dataList.value.filter(
        (item, index) => checkList.value[index]
      );
      emit("checkChange", arr);
    }

    // 获取直播详情数据
    async function getLiveDetail(liveId: string) {
      const { code, data } = await describeLive(liveId);
      if (+code === 0) {
        (liveDetailCom.value as any).handleOpen(data, 2);
      }
    }

    // 查看详情
    function handlepreviewLive(liveId: string) {
      getLiveDetail(liveId);
    }

    // 编辑直播
    function editLive(liveId: string) {
      let routeUrl = router.resolve({
        path: "/recipeDetail/EditLive",
        query: {
          liveId,
        },
      });
      window.open(routeUrl.href, "_blank");
    }

    // 获取modal相关信息
    function gethandleLiveModalInfo(status: number, id: string) {
      handleLiveStatus.value = status;
      modalTitle.value = MODAL_TITLE[status];
      modalSlot.value = MODAL_SLOT[status];
      modalStatus.value = true;
      liveId.value = id;
    }

    // 开始直播
    function startLive(liveId: string) {
      gethandleLiveModalInfo(0, liveId);
    }

    // 结束直播
    function endLive(liveId: string) {
      gethandleLiveModalInfo(1, liveId);
    }

    // 开始/结束直播请求
    async function handleSure() {
      if (handleLiveStatus.value === 0) {
        const { code } = await startCmsLive(liveId.value);
        if (+code === 0) {
          emit("handleLive");
          Message.success("已开始直播");
          modalStatus.value = false;
        }
      } else {
        const { code } = await stopCmsLive(liveId.value);
        if (+code === 0) {
          emit("handleLive");
          Message.success("已结束直播");
          modalStatus.value = false;
        }
      }
    }

    return {
      current,
      dataList,
      modalStatus,
      handleSure,
      getLiveStatusBg,
      getLiveStatusStr,
      copyFlow,
      checkChange,
      micell,
      checkList,
      getReleaseScopeStr,
      handlepreviewLive,
      liveDetailCom,
      editLive,
      useRouter,
      startLive,
      endLive,
      handleLiveStatus,
      modalTitle,
      modalSlot,
      dayjs,
    };
  },
});
</script>
<style lang="less" scoped>
.body-text-box {
  margin: 28px 0 40px 0;
  font-size: 14px;
  color: #f56060;
}

.live-list-box {
  > ul > li {
    padding: 20px 0;
    border-top: 1px solid #e8e8e8;
    display: flex;
    align-items: center;

    &:last-child {
      border-bottom: 1px solid #e8e8e8;
    }

    .li-content-box {
      flex-grow: 1;
      margin-left: 15px;
      display: flex;
      .img-box {
        width: 170px;
        height: 96px;
        margin-right: 20px;

        > img {
          width: 170px;
          height: 96px;
          border-radius: 4px;
          object-fit: cover;
        }
      }

      .right-content {
        > ul {
          > li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // flex-wrap: wrap;

            ul {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
            }

            .live-title {
              font-size: 16px;
              color: #222222;
              display: flex;
              flex-wrap: wrap;
              align-items: center;

              .live-name {
                margin-right: 10px;
              }

              .live-status {
                font-size: 12px;
                color: #ffffff;
                padding: 3px 8px;
                border-radius: 3px;
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

            .live-info {
              font-size: 14px;
              color: #666666;

              > ul > li {
                margin-right: 16px;
              }

              .flow-box {
                display: flex;
                align-items: center;
                position: relative;

                &:hover .url-box {
                  display: block;
                }

                #flow {
                  width: 200px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .url-box {
                  display: none;
                  position: absolute;
                  top: -74px;
                  left: 0;
                  padding: 10px;
                  box-sizing: border-box;
                  width: 410px;
                  font-size: 14px;
                  color: #222222;
                  word-break: break-all;
                  background-color: #ffffff;
                  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
                  border-radius: 3px;

                  > span {
                    position: relative;
                    display: block;
                    width: 100%;
                    height: 100%;

                    &::before {
                      display: block;
                      content: "";
                      width: 0;
                      position: absolute;
                      bottom: -28px;
                      left: 140px;
                      margin-left: -10px;
                      border: 10px solid transparent;
                      border-top: 10px solid #fff;
                    }
                  }
                }
              }
            }

            .live-data {
              > ul {
                > li {
                  margin-right: 16px;
                }
              }
            }

            .issuer {
              min-width: 50px;
              text-align: right;
            }

            .live-time {
              min-width: 140px;
            }

            .hanlde-box {
              text-align: right;
              > button {
                margin-left: 16px;
                padding: 0;

                &:first-child {
                  margin-left: 0;
                }
              }
            }
          }
        }
      }
    }
  }

  .empty-data {
    text-align: center;
    color: #666666;
    font-size: 14px;
    padding: 30px 0;
  }

  .flex-col-1 {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .f-14-999 {
    font-size: 14px;
    color: #999999;
  }
}
</style>
