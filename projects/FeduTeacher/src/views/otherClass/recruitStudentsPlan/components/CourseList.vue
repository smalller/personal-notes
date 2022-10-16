<template>
  <ui-modal
    v-model:visible="modalStatus"
    @ok="handleSureDelete"
    :title="`确定要移除《${modalTitle}》课程吗？`"
    width="420"
    :tips="false"
  >
    <div class="body-text-box">点击“确定”将从计划中移除本课程，请慎重！</div>
  </ui-modal>
  <div class="live-list-box">
    <ul v-if="dataList.length > 0">
      <li v-for="item in dataList" :key="item.id">
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
                <div class="live-title">
                  <span class="live-name">{{ item.courseName }}</span>
                  <span v-if="+item.courseStatus === 0" class="forbid-course"
                    >课程已禁用，请移除</span
                  >
                </div>
              </li>
              <li>
                <div class="live-info">
                  <ul>
                    <li>
                      {{ item.teacherName }}
                    </li>
                    <li>时间：{{ item.content }}</li>
                  </ul>
                </div>
                <div class="issuer">
                  {{ item.price ? "￥" + item.price : "免费" }}
                </div>
              </li>
              <li>
                <div class="live-data">
                  <ul class="f-14-999">
                    <li>课节 {{ item.sectionNums }}</li>
                    <!-- <li>报名 {{ 0 }}</li> -->
                  </ul>
                </div>
                <div class="hanlde-box">
                  <ui-button
                    @click="handleViewCourseDetail(item)"
                    type="text-blue"
                    >课程详情</ui-button
                  >
                  <ui-button @click="viewSignUpStudents(item)" type="text-blue"
                    >查看报名</ui-button
                  >
                  <ui-button @click="handleEdit(item)" type="text-blue"
                    >编辑</ui-button
                  >
                  <ui-button type="text-info" @click="handleDelete(item)"
                    >移除</ui-button
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
  <editCoursePlan ref="editCoursePlanCom"></editCoursePlan>
  <classShow
    v-if="courseItem"
    :id="courseItem.courseId"
    :info="courseItem"
    @close="drawerModalStatus = false"
    :show="drawerModalStatus"
  ></classShow>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Message from "@/themes/message";
import { getLiveStatusStr, getLiveStatusBg, ListRow } from "../index";
import micell from "micell";
import { useRouter } from "vue-router";
import editCoursePlan from "@/components/EditCoursePlan.vue";
import classShow from "@/views/otherClass/classCenter/components/classShow.vue";
import { deleteAdsCourse } from "@/api/recruitStudentsPlan";

export default defineComponent({
  components: {
    editCoursePlan,
    classShow,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  emits: ["editCourseComplete", "setPageInfo"],
  setup(props, { emit }) {
    const router = useRouter();
    const dataList = computed(() => props.data as Array<ListRow>);
    const modalStatus = ref(false);
    const modalTitle = ref("");
    const editCoursePlanCom = ref(null);
    const drawerModalStatus = ref(false);
    const courseItem = ref(); // 当前要查看的课程信息

    // 课程详情
    function handleViewCourseDetail(row: ListRow) {
      courseItem.value = row;
      drawerModalStatus.value = true;
    }

    // 查看报名
    function viewSignUpStudents(row: ListRow) {
      // 存储跳转前的页码信息等
      emit("setPageInfo");
      router.push({
        path: "/outClass/signUpDetail",
        query: {
          flag: 2,
          planId: row.planId,
          courseId: row.id,
        },
      });
    }

    // 编辑课程
    function handleEdit(row: ListRow) {
      (editCoursePlanCom.value as any).handleOpen(1, row);
    }

    // 移出课程
    function handleDelete(row: ListRow) {
      courseItem.value = row;
      modalTitle.value = row.courseName;
      modalStatus.value = true;
    }

    // 确认移出课程
    async function handleSureDelete() {
      const { code } = await deleteAdsCourse(courseItem.value.id);
      if (+code === 0) {
        modalStatus.value = false;
        Message.success("移除成功");
        emit("editCourseComplete", true);
      }
    }

    return {
      dataList,
      modalStatus,
      getLiveStatusBg,
      getLiveStatusStr,
      micell,
      useRouter,
      modalTitle,
      editCoursePlanCom,
      handleSureDelete,
      handleDelete,
      handleViewCourseDetail,
      viewSignUpStudents,
      handleEdit,
      drawerModalStatus,
      courseItem,
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

.live-list-box {
  > ul > li {
    padding: 20px 0;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;

    .li-content-box {
      flex-grow: 1;
      margin-left: 15px;
      display: flex;
      .img-box {
        width: 140px;
        height: 80px;
        margin-right: 20px;

        > img {
          width: 140px;
          height: 80px;
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

              .forbid-course {
                font-size: 12px;
                color: #ffffff;
                padding: 3px 8px;
                border-radius: 3px;
                background-color: #f56060;
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
              color: #f56060;
              font-size: 16px;
            }

            .live-time {
              min-width: 120px;
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
