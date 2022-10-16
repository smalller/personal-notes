<template>
  <ui-modal
    v-model:visible="modalStatus"
    @ok="handleSure"
    :title="`${modalTitle}招生计划`"
    width="420"
    :tips="false"
  >
    <div class="body-text-box">确认要{{ modalTitle }}该招生计划吗？</div>
  </ui-modal>
  <div class="plan-list-box">
    <ul v-if="dataList.length > 0">
      <li v-for="item in dataList" :key="item.id">
        <!-- <el-checkbox
          @change="checkChange"
          v-model="checkList[index]"
        ></el-checkbox> -->
        <div class="li-content-box">
          <div class="img-box">
            <img
              :src="item.pic || require('@/assets/staff-avatar.png')"
              alt=""
            />
          </div>
          <div class="right-content flex-col-1">
            <ul class="flex-col-1">
              <li>
                <div class="plan-title">
                  <span class="plan-name">{{ item.name }}</span>
                  <span
                    :class="[
                      'plan-status',
                      getLiveStatusBg(+item.publishStatus),
                    ]"
                    >{{ getLiveStatusStr(+item.publishStatus) }}</span
                  >
                </div>
                <div class="plan-time f-14-999">
                  {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm") }}
                </div>
              </li>
              <li>
                <div class="plan-info">
                  <ul>
                    <li>
                      报名截止日期
                      <!-- {{ micell.date.format(item.endTime, "YYYY-MM-DD") }} -->
                      {{ dayjs(item.endTime).format("YYYY-MM-DD") }}
                    </li>
                  </ul>
                </div>
                <div class="issuer f-14-999">{{ item.createUser }}</div>
              </li>
              <li>
                <div class="plan-data">
                  <ul class="f-14-999">
                    <li>课程 {{ item.courseNums }}</li>
                    <!-- <li>报名人次 {{ 0 }}</li> -->
                  </ul>
                </div>
                <div class="hanlde-box">
                  <ul>
                    <li>
                      <ui-button
                        @click="handleChangeStatus(item)"
                        type="text-blue"
                        >{{
                          +item.publishStatus === 0 ? "上架" : "下架"
                        }}</ui-button
                      >
                    </li>
                    <li>
                      <ui-button @click="editPlan(item)" type="text-blue"
                        >编辑</ui-button
                      >
                    </li>
                    <li>
                      <ui-button
                        @click="sharePlan(item)"
                        type="text-blue"
                        id="share-btn"
                        >分享</ui-button
                      >
                      <sharePlan
                        :text="item.shareUrl"
                        v-show="targetInfo?.id === item.id && showQr"
                      ></sharePlan>
                    </li>
                    <li>
                      <ui-button @click="viewCourse(item)" type="text-blue"
                        >查看课程</ui-button
                      >
                    </li>
                    <li>
                      <ui-button type="text-blue" @click="viewApplyDetail(item)"
                        >报名详情</ui-button
                      >
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="empty-data">没有查询到数据</p>
  </div>
  <editPlan ref="editPlanCom"></editPlan>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Message from "@/themes/message";
import { getLiveStatusStr, getLiveStatusBg, ListRow } from "../index";
import micell from "micell";
import { useRouter } from "vue-router";
import editPlan from "./EditPlan.vue";
import { upOrDownCourse } from "@/api/recruitStudentsPlan";
import sharePlan from "./SharePlan.vue";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    editPlan,
    sharePlan,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  emits: ["editPutawayStatusComplete", "checkChange", "setPageInfo"],
  setup(props, { emit }) {
    const router = useRouter();
    const dataList = computed(() => props.data as Array<ListRow>);
    const modalStatus = ref(false);
    // const checkList = ref([] as Array<boolean>);
    const modalTitle = ref("");
    const editPlanCom = ref(null);
    const targetInfo = ref(); // 当前要操作的计划

    const sharePlanCom = ref(null);
    const showQr = ref(false);

    // 分享
    function sharePlan(row: ListRow) {
      if (+row.publishStatus === 0) {
        Message.warning("未上架的招生计划不允许被分享");
        return;
      }
      targetInfo.value = row;
      showQr.value = true;
    }

    const classList = ["qr", "share-qr-box bottom", "share-qr-box top"];
    // 当点击分享二维码本身以外的地方时，就隐藏分享二维码
    document.onclick = function (e: Event) {
      const className = (e.target as HTMLDivElement).className;
      if (
        (e.target as any).parentElement.id !== "share-btn" &&
        !classList.includes(className)
      ) {
        showQr.value = false;
      }
    };

    // 报名详情
    function viewApplyDetail(row: ListRow) {
      if (+row.courseNums === 0) {
        Message.warning("暂无课程，无法查看报名详情");
        return;
      }
      // 存储跳转前的页码信息等
      emit("setPageInfo");
      router.push({
        path: "/outClass/signUpDetail",
        query: {
          flag: 1,
          planId: row.id,
        },
      });
    }

    // 编辑
    function editPlan(row: ListRow) {
      (editPlanCom.value as any).handleOpen(2, row);
    }

    // 查看课程
    function viewCourse(row: ListRow) {
      // 存储跳转前的页码信息等
      emit("setPageInfo");
      const { id } = row;
      router.push({
        path: `/outClass/viewCourse`,
        query: {
          id,
        },
      });
    }

    // 上架/下架
    function handleChangeStatus(row: ListRow) {
      if (+row.courseNums === 0) {
        Message.warning("请至少添加一个课程");
        return;
      }
      targetInfo.value = row;
      modalTitle.value = +row.publishStatus === 0 ? "上架" : "下架";
      modalStatus.value = true;
    }

    // 确认上下架
    async function handleSure() {
      const obj = {
        id: targetInfo.value.id,
        publishStatus: +targetInfo.value.publishStatus === 1 ? 0 : 1,
      };
      const { code } = await upOrDownCourse(obj);
      if (+code === 0) {
        modalStatus.value = false;
        Message.success("操作成功");
        emit("editPutawayStatusComplete", true);
      }
    }

    return {
      dataList,
      modalStatus,
      handleSure,
      getLiveStatusBg,
      getLiveStatusStr,
      // checkChange,
      // checkList,
      micell,
      viewApplyDetail,
      editPlan,
      useRouter,
      handleChangeStatus,
      viewCourse,
      modalTitle,
      editPlanCom,
      sharePlan,
      targetInfo,
      showQr,
      dayjs,
      sharePlanCom,
    };
  },
});
</script>
<style lang="less" scoped>
.ui-button {
  height: auto;
}

.body-text-box {
  margin: 28px 0 40px 0;
  font-size: 14px;
  color: #f56060;
}

.plan-list-box {
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

            .plan-title {
              font-size: 16px;
              color: #222222;
              display: flex;
              flex-wrap: wrap;
              align-items: center;

              .plan-name {
                margin-right: 10px;
              }

              .plan-status {
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

            .plan-info {
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

            .plan-data {
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

            .plan-time {
              min-width: 120px;
            }

            .hanlde-box {
              text-align: right;

              li {
                margin-left: 16px;
                position: relative;

                > button {
                  padding: 0;
                }

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
