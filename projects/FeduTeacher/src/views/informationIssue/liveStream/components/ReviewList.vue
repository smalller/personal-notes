<template>
  <ui-modal
    v-model:visible="modalStatus"
    @ok="handleSure"
    title="确定删除此评论？"
    width="420"
    :tips="false"
  >
    <div class="body-text-box">删除后评论将不可恢复，请谨慎操作</div>
  </ui-modal>
  <div id="dynamic-detail-review" @scroll="scrollEvent">
    <ReviewTextarea
      style="margin-bottom: 20px"
      placeholder="写评论..."
      @handleReview="handleReview"
    ></ReviewTextarea>
    <div v-loading="loading">
      <div class="dynamic-list-box">
        <ul v-if="dataList.length > 0">
          <li v-for="item in dataList" :key="item.msgId">
            <div class="avatar">
              <img
                :src="
                  item.msgFromUserPortrait ||
                  require('@/assets/staff-avatar.png')
                "
                alt=""
              />
            </div>
            <div class="content-box">
              <div class="top-content">
                <span>{{ item.msgFromUser }}</span>
              </div>
              <div class="body-content">
                <span>{{ item.msgContent }}</span>
              </div>
              <div class="botm-content">
                <div class="left-info">
                  <span class="time">{{
                    getDateDiff(getDateTimeStamp(item.createTime))
                  }}</span>
                </div>
                <ui-button
                  style="padding: 0"
                  type="text-info"
                  @click="handleDelete(item.msgId)"
                  >删除</ui-button
                >
              </div>
            </div>
          </li>
        </ul>
        <p v-else-if="dataList.length === 0 && !loading" class="empty-data">
          没有查询到数据
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onUnmounted, onMounted } from "vue";
import ReviewTextarea from "@/components/ReviewTextarea.vue";
import Message from "@/themes/message";
import { getDateTimeStamp, getDateDiff } from "@/utils/common";
import { getChatList, sendChat, delChat } from "@/api/liveStream";
import { useStore } from "vuex";
import { EventSourcePolyfill } from "event-source-polyfill";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    ReviewTextarea,
  },
  props: {
    liveId: {
      type: String,
    },
  },
  emits: ["getTotalNum"],
  setup(props, { emit }) {
    const $store = useStore();
    const userInfo = computed(() => $store.state.user.userInfo);
    const schoolDetails = computed(() => {
      return $store.state.user.schoolList.find((item: any) => {
        if ($store.state.user.schoolId === item.schoolId) {
          return item;
        }
      });
    });

    const loading = ref(true);
    const modalStatus = ref(false);
    const targetDelId = ref(""); //当前要删除的id

    let dataList = ref([] as Array<any>);
    const liveId = computed(() => props.liveId);

    let currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const allPage = ref(1); //总页数
    const allNum = ref(0); //总条数

    const url = `${process.env.VUE_APP_BASE_LIVE_API}/play/${liveId.value}`;

    const source = new EventSourcePolyfill(url, {
      withCredentials: false,
      headers: {
        schoolId: sessionStorage.getItem("schoolId") as string,
        token: sessionStorage.getItem("token") as string,
        userId: sessionStorage.getItem("userId") as string,
      },
    });
    source.onopen = (ev) => {
      return ev;
    };
    source.onmessage = (ev) => {
      const data = ev.data ? JSON.parse(ev.data) : ev.data;
      switch (data?.action) {
        case "stopLive":
          console.log("直播结束");
          break;
        case "heartbeat":
          console.log("心跳");
          break;
        case "chat":
          {
            const createTime = dayjs().toDate().getTime();
            const newDate = data;
            newDate["createTime"] = createTime;
            dataList.value.unshift(newDate);
            // emit("getTotalNum", dataList.value.length);
            emit("getTotalNum", ++allNum.value);
          }
          break;
        default:
          break;
      }
    };
    source.onerror = (err) => {
      console.error(err);
    };

    onUnmounted(() => {
      source.close();
    });

    function scrollEvent() {
      const box = document.getElementById(
        "dynamic-detail-review"
      ) as HTMLDivElement;

      // 如果元素的可见高度 + 元素的滚动条的垂直位置 >= 元素内容高度，则触底
      if (box?.clientHeight + box?.scrollTop >= box?.scrollHeight) {
        if (currentPage.value < allPage.value) {
          currentPage.value++;

          getList();
          console.log("触底了");
          console.log(currentPage.value);
        }
      }
    }

    async function getList() {
      const { code, data } = await getChatList(
        currentPage.value,
        pageSize.value,
        {
          liveId: liveId.value,
        }
      );
      if (+code === 0) {
        dataList.value = dataList.value.concat(data.list);
        allPage.value = data.page.totalPage;
        allNum.value = data.page.totalNum;
        // emit("getTotalNum", dataList.value.length); //告诉tab标签当前有多少条评论
        emit("getTotalNum", allNum.value); //告诉tab标签当前有多少条评论（如果展示所有的话，就得重新去请求列表一次）
      }
      loading.value = false;
    }
    getList();

    // 删除按钮
    function handleDelete(id: string) {
      targetDelId.value = id;
      modalStatus.value = true;
    }

    // 确定删除
    async function handleSure() {
      const { code } = await delChat({
        liveId: liveId.value,
        msgId: String(targetDelId.value),
      });
      if (+code === 0) {
        Message.success("删除成功");
        modalStatus.value = false;

        dataList.value.forEach((item, index) => {
          if (item.msgId === targetDelId.value) {
            dataList.value.splice(index, 1);
            // emit("getTotalNum", dataList.value.length); //告诉tab标签当前有多少条评论
            emit("getTotalNum", --allNum.value); //告诉tab标签当前有多少条评论
          }
        });
      }
    }

    // 评论/回复评论接口
    async function reviewRequest(msgContent: string) {
      const { code } = await sendChat({
        liveId: liveId.value,
        msgFromUser: schoolDetails.value.name,
        msgToId: liveId.value,
        msgToIdType: "group",
        msgType: "txt",
        msgContent,
        msgFromUserPortrait: userInfo.value.userPortait,
      });
      if (+code === 0) {
        Message.success("评论成功");
      }
    }

    // 评论操作
    function handleReview(res: string) {
      reviewRequest(res);
    }

    return {
      handleReview,
      handleDelete,
      modalStatus,
      handleSure,
      dataList,
      getDateTimeStamp,
      getDateDiff,
      loading,
      scrollEvent,
    };
  },
});
</script>
<style lang="less" scoped>
#dynamic-detail-review {
  margin-top: 20px;
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

  .dynamic-list-box,
  .review-reply-list {
    > ul {
      > li {
        padding: 20px 0;
        border-bottom: 1px solid #e8e8e8;
        display: flex;

        .avatar {
          margin-right: 12px;
          > img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
          }
        }

        .content-box {
          flex-grow: 1;
          .top-content {
            font-size: 14px;

            > span {
              color: #222;
            }
          }

          .body-content {
            font-size: 15px;
            color: #222;
            margin: 10px 0;

            .show-more {
              color: #ff9900;
              margin-left: 6px;
              cursor: pointer;
            }
          }

          .botm-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;

            .left-info {
              display: flex;
              align-items: center;

              .dot {
                display: block;
                margin: 0 12px;
                color: #999;
              }

              .time {
                color: #999;
              }
            }

            > span {
              color: #999;
              font-size: 14px;
            }
          }

          .show-more-reply {
            margin-top: 6px;
            cursor: pointer;
            > span {
              font-size: 14px;
              color: #4fa8f9;
              margin-right: 4px;
            }

            .icon {
              font-size: 8px;
              color: #666666;
              vertical-align: middle;
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

  .review-reply-list {
    > ul > li {
      padding: 10px 0;

      .avatar {
        margin-right: 12px;
        > img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
