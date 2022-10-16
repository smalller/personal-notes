<template>
  <SchoolDynamicDetail ref="schoolDynamicCom"></SchoolDynamicDetail>
  <ui-modal
    v-model:visible="modalStatus"
    @ok="handleSure"
    title="确定删除此评论？"
    width="420"
    :tips="false"
  >
    <div class="body-text-box">删除后评论将不可恢复，请谨慎操作</div>
  </ui-modal>
  <div class="dynamic-list-box">
    <ul v-if="dataList.length > 0">
      <li v-for="item in dataList" :key="item.uuid">
        <div class="avatar">
          <img :src="item.userPortait" alt="" />
        </div>
        <div class="content-box">
          <div class="top-content">
            <span :style="{ 'margin-right': '6px' }">{{
              item.sysUserName
            }}</span>
            <div class="review-target-box">
              <span
                v-if="current === 1"
                class="review-target"
                @click="viewDynamicDetai(item, 'school')"
                >{{
                  item.content ? `评论了动态【${item.content}】` : "评论了动态"
                }}
              </span>
              <span
                v-else-if="current === 2"
                class="review-target"
                @click="viewDynamicDetai(item, 'recipe')"
                >{{
                  item.title ? `评论了动态【${item.title}】` : "评论了动态"
                }}</span
              >
            </div>
          </div>
          <div class="body-content">
            <span v-if="item.comment.length <= 180">{{ item.comment }}</span>
            <span v-else>
              <span v-if="targetShowContentList.includes(item.uuid)">{{
                item.comment
              }}</span>
              <span v-else>{{ item.comment.slice(0, 180) }}</span>
            </span>
            <span
              v-if="
                item.comment.length > 180 &&
                !targetShowContentList.includes(item.uuid)
              "
            >
              ...</span
            >
            <span
              v-if="
                item.comment.length > 180 &&
                !targetShowContentList.includes(item.uuid)
              "
              @click="showMore(item.uuid)"
              class="show-more"
              >展开</span
            >
          </div>
          <div class="botm-content">
            <span v-if="item.createTime">{{
              getDateDiff(getDateTimeStamp(item.createTime))
            }}</span>
            <ui-button type="text-info" @click="handleDelete(item.uuid)"
              >删除</ui-button
            >
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="empty-data">没有查询到数据</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import SchoolDynamicDetail from "@/components/SchoolDynamicDetail.vue";
import Message from "@/themes/message";
import { delComment } from "@/api/reviewManage";
import { ReviewItem } from "../index";
import { getDateTimeStamp, getDateDiff } from "@/utils/common";

export default defineComponent({
  components: {
    SchoolDynamicDetail,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    currentType: {
      type: Number,
      required: true,
    },
  },
  emits: ["deletedComment"],
  setup(props, { emit }) {
    const dataList = computed(() => props.data as Array<ReviewItem>);
    const modalStatus = ref(false);
    const current = ref(1);
    const schoolDynamicCom = ref(null);
    const targetShowContentList = ref([] as Array<string>); //当前已经展开全部文本的对象列表
    const targetId = ref(""); //当前要操作的评论id

    watch(
      () => props.currentType,
      (newVal) => {
        current.value = newVal;
        targetShowContentList.value = [];
      }
    );

    // 展开全部内容
    function showMore(uuid: string) {
      targetShowContentList.value.push(uuid);
    }

    // 删除操作
    function handleDelete(uuid: string) {
      targetId.value = uuid;
      modalStatus.value = true;
    }

    // 确定删除
    async function handleSure() {
      const { code } = await delComment(targetId.value);
      if (+code === 0) {
        emit("deletedComment");
        Message.success("删除成功");
        modalStatus.value = false;
      }
    }

    // 查看动态详情
    const viewDynamicDetai = (item: ReviewItem, current: string): void => {
      (schoolDynamicCom.value as any).handleOpen(item, current);
    };

    return {
      dataList,
      showMore,
      modalStatus,
      handleDelete,
      handleSure,
      current,
      schoolDynamicCom,
      viewDynamicDetai,
      targetShowContentList,
      getDateTimeStamp,
      getDateDiff,
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

.dynamic-list-box {
  ul > li {
    padding: 20px 0;
    border-top: 1px solid #e8e8e8;
    display: flex;

    &:last-child {
      border-bottom: 1px solid #e8e8e8;
    }

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

        .review-target-box {
          display: inline-block;
          cursor: pointer;

          .review-target {
            color: #999;

            &:hover {
              color: #222;
            }
            &:active {
              color: #999;
            }
          }
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

        > span {
          color: #999;
          font-size: 14px;
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
}
</style>
