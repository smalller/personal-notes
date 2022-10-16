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
  <div class="dynamic-detail-review">
    <ReviewTextarea
      style="margin-bottom: 20px"
      placeholder="写评论..."
      @handleReview="handleReview"
    ></ReviewTextarea>
    <div v-loading="loading">
      <div class="dynamic-list-box">
        <ul v-if="dataList.length > 0">
          <li
            v-for="item in dataList"
            :key="item.uuid"
            :style="{
              'border-bottom-color':
                item.uuid === targetReply ? '#FF9900' : '#e8e8e8',
            }"
          >
            <div class="avatar">
              <img :src="item.userPortait" alt="" />
            </div>
            <div class="content-box">
              <div class="top-content">
                <span>{{ item.sysUserName }}</span>
              </div>
              <div class="body-content">
                <span>{{ item.comment }}</span>
              </div>
              <div class="botm-content">
                <div class="left-info">
                  <template v-if="item.uuid">
                    <ui-button
                      v-if="targetReply !== item.uuid"
                      style="padding: 0"
                      class="reply-btn"
                      type="text"
                      @click="handleReply(item.uuid)"
                      >回复</ui-button
                    >
                    <ui-button
                      v-else
                      style="padding: 0"
                      class="reply-btn"
                      type="text"
                      @click="handleCancelReply"
                      >取消回复</ui-button
                    >
                    <span class="dot">·</span>
                  </template>
                  <span class="time">{{
                    getDateDiff(getDateTimeStamp(item.createTime))
                  }}</span>
                </div>
                <ui-button
                  v-if="item.uuid"
                  style="padding: 0"
                  type="text-info"
                  @click="handleDelete(item.uuid)"
                  >删除</ui-button
                >
              </div>
              <ReviewTextarea
                v-show="targetReply === item.uuid"
                style="margin-top: 15px"
                placeholder="说点什么..."
                @handleReview="handleReplyReview"
              ></ReviewTextarea>
              <div
                v-if="
                  item.recComments.length > 0 &&
                  !targetShowMoreReplyList.includes(item.uuid)
                "
                class="show-more-reply"
                @click="showMoreReply(item.uuid)"
              >
                <span>展开全部 {{ item.recComments.length }} 条回复</span>
                <ui-icon class="icon" icon="icon-a-9"></ui-icon>
              </div>
              <div
                class="review-reply-list"
                v-show="targetShowMoreReplyList.includes(item.uuid)"
              >
                <ul>
                  <li v-for="it in item.recComments" :key="it.uuid">
                    <div class="avatar">
                      <img :src="it.userPortait" alt="" />
                    </div>
                    <div class="content-box">
                      <div class="top-content">
                        <span>{{ it.sysUserName }}</span>
                      </div>
                      <div class="body-content">
                        <span>{{ it.comment }}</span>
                      </div>
                      <div class="botm-content">
                        <div class="left-info">
                          <span class="time">{{
                            getDateDiff(getDateTimeStamp(it.createTime))
                          }}</span>
                        </div>
                        <ui-button
                          v-if="it.uuid"
                          style="padding: 0"
                          type="text-info"
                          @click="handleDelete(it.uuid)"
                          >删除</ui-button
                        >
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <p v-else-if="dataList.length === 0 && !loading" class="empty-data">
          没有查询到数据
        </p>
      </div>
      <ui-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalNum"
      ></ui-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import ReviewTextarea from "@/components/ReviewTextarea.vue";
import Message from "@/themes/message";
import { getDynamic } from "@/api/reviewManage";
import { ReviewItem } from "@/views/informationIssue/reviewManage/index";
import { getDateTimeStamp, getDateDiff } from "@/utils/common";
import { delComment, addComment } from "@/api/reviewManage";
import { useStore } from "vuex";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    ReviewTextarea,
  },
  props: {
    relatedId: {
      type: String,
    },
    dynamicCurrent: {
      type: String,
    },
  },
  emits: ["getTotalNum"],
  setup(props, { emit }) {
    const $store = useStore();
    const schoolDetails = computed(() => {
      return $store.state.user.schoolList.find((item: any) => {
        if ($store.state.user.schoolId === item.schoolId) {
          return item;
        }
      });
    });

    const loading = ref(true);
    const modalStatus = ref(false);
    const targetReply = ref(""); //当前要回复的对象
    const targetDelId = ref(""); //当前要删除的id
    const targetShowMoreReplyList = ref([] as Array<string>); //当前已经展开全部回复的对象列表

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const dataList = ref([] as Array<ReviewItem>);

    const relatedId = computed(() => props.relatedId);
    const dynamicCurrent = computed(() => props.dynamicCurrent);

    async function getList() {
      const { code, data } = await getDynamic(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            relatedId: relatedId.value,
            hasRec: true,
          }
        )
      );
      if (+code === 0) {
        dataList.value = data.list;
        totalNum.value = data.page.totalNum;
        emit("getTotalNum", data.page.totalNum); //告诉tab标签当前有多少条评论
      }
      loading.value = false;
    }
    getList();

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getList();
    };

    // 删除按钮
    function handleDelete(id: string) {
      targetDelId.value = id;
      modalStatus.value = true;
    }

    // 确定删除
    async function handleSure() {
      const { code } = await delComment(targetDelId.value);
      if (+code === 0) {
        getList();
        Message.success("删除成功");
        modalStatus.value = false;
      }
    }

    // 评论/回复评论接口
    async function reviewRequest(data: any) {
      const { code } = await addComment({
        commentType: dynamicCurrent.value === "school" ? "Ablum" : "Recipes",
        relatedId: relatedId.value,
        sysUserId: schoolDetails.value.userId,
        sysUserName: schoolDetails.value.name + schoolDetails.value.title,
        schoolId: sessionStorage.getItem("schoolId"),
        ...data,
      });
      return Promise.resolve(code);
    }

    // 评论操作
    function handleReview(res: string) {
      reviewRequest({
        comment: res,
      }).then((code) => {
        if (+code === 0) {
          dataList.value.unshift(localData(res));
          emit("getTotalNum", dataList.value.length); //告诉tab标签当前有多少条评论
          Message.success("评论成功");
        }
      });
    }

    // 回复别人评论操作
    function handleReplyReview(res: string) {
      reviewRequest({
        comment: res,
        recCommentId: targetReply.value,
      }).then((code) => {
        if (+code === 0) {
          dataList.value.forEach((item) => {
            if (item.uuid === targetReply.value) {
              item.recComments.unshift(localData(res));
            }
          });
          targetReply.value = "";
          Message.success("回复成功");
        }
      });
    }

    // 本地临时渲染评论数据
    function localData(comment: string): any {
      return {
        userPortait:
          "https://yjbfiles.oss-cn-shenzhen.aliyuncs.com/6lN/eA/6lNnbzDSILz1EvulYw8GeA.png?w=255&h=255",
        sysUserName: schoolDetails.value.name + schoolDetails.value.title,
        comment,
        createTime: dayjs().toDate().getTime(),
        roleType: 1,
        recComments: [],
      };
    }

    // 回复按钮
    function handleReply(id: string) {
      targetReply.value = id;
    }

    // 取消回复按钮
    function handleCancelReply() {
      targetReply.value = "";
    }

    // 展开全部回复
    function showMoreReply(id: string) {
      targetShowMoreReplyList.value.push(id);
    }

    return {
      handleReview,
      handleReplyReview,
      handleCancelReply,
      handleDelete,
      handleReply,
      targetReply,
      modalStatus,
      handleSure,
      showMoreReply,
      targetShowMoreReplyList,
      pageSize,
      currentPage,
      totalNum,
      handleSizeChange,
      handleCurrentChange,
      dataList,
      getDateTimeStamp,
      getDateDiff,
      loading,
    };
  },
});
</script>
<style lang="less" scoped>
.dynamic-detail-review {
  margin-top: 20px;
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

              .reply-btn {
                color: #666;
                &:hover {
                  color: #222;
                }
                &:active {
                  color: #666;
                }
              }

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
