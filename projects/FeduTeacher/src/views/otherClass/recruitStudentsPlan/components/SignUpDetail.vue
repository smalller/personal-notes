<template>
  <div class="wrap">
    <div class="top-title">
      <span class="back-btn" @click="handleBack">
        <ui-icon icon="icon-a-zu2566"></ui-icon>
        返回
      </span>
      <span class="shu"></span>
      <span class="view-course">查看学员</span>
    </div>
    <div class="plan-list-box" v-loading="loading">
      <ul>
        <li
          :class="[targetCourse === item.id && 'target-plan']"
          v-for="item in courseList"
          :key="item.id"
          @click="handleChoosePlan(item)"
        >
          <img :src="item.pic || require('@/assets/staff-avatar.png')" alt="" />
          <span>{{ item.courseName }}</span>
        </li>
      </ul>
    </div>
    <ui-card>
      <TopType
        :topTypeList="staticData.topTypeList"
        @changeTopType="changeTopType"
      ></TopType>
      <studentsList
        v-if="courseInfo && targetTopType === 1"
        :courseInfo="courseInfo"
      ></studentsList>
      <classList
        v-if="courseInfo && targetTopType === 2"
        :courseInfo="courseInfo"
      ></classList>
    </ui-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import studentsList from "./StudentsList.vue";
import { queryCourses } from "@/api/recruitStudentsPlan";
import { staticData } from "../index";
import { TopTypeListItem } from "@/utils/common";
import TopType from "@/components/TopType.vue";
import classList from "./ClassList.vue";

interface CourseList {
  [key: string]: any;
}

export default defineComponent({
  components: {
    studentsList,
    TopType,
    classList,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const targetCourse = ref(0);
    const loading = ref(false);
    const courseList = ref<CourseList>([]);
    const courseInfo = ref(); // 计划id和课程id信息
    const targetTopType = ref(1);

    const planInfo = ref({
      flag: -1,
      planId: "",
      courseId: "",
    }) as any; //从计划列表中点击报名详情传过来的信息

    // 获取课程列表内容
    const getCourseList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await queryCourses(1, 9999, planInfo.value.planId);
      if (+code === 0) {
        courseList.value = data.list;

        // 如果是从计划列表页面跳转过来的，就默认展示第一个课程的报名信息
        if (+planInfo.value.flag === 1) {
          targetCourse.value = data.list[0].id;
          courseInfo.value = data.list[0];
        } else {
          // 如果是从课程进来的，就展示对应课程的报名信息
          courseList.value.forEach((item: CourseList) => {
            if (item.id === planInfo.value.courseId) {
              targetCourse.value = item.id;
              courseInfo.value = item;
            }
          });
        }
      }
      loading.value = false;
    };

    // 返回
    function handleBack() {
      // 返回到计划列表页面
      if (+planInfo.value.flag === 1) {
        router.push("/outClass/recruitStudentsPlan");
      } else {
        // 返回到课程列表页面
        const pageInfoSession = JSON.parse(
          sessionStorage.getItem("coursePageInfo") as string
        );
        if (pageInfoSession) {
          router.push(`/outClass/viewCourse?id=${pageInfoSession.planId}`);
        } else {
          router.push("/outClass/recruitStudentsPlan");
        }
      }
    }

    onMounted(() => {
      const { flag, planId, courseId } = route.query;
      planInfo.value = {
        flag,
        planId,
        courseId,
      };
      getCourseList();
    });

    // 切换课程查看报名
    function handleChoosePlan(item: CourseList) {
      targetCourse.value = item.id;
      courseInfo.value = item;
    }

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      // initQueryData();
      // currentType.value = res.value;
      // getInfantList();
      console.log(res);
      targetTopType.value = res.value;
    };

    return {
      handleBack,
      targetCourse,
      handleChoosePlan,
      loading,
      courseList,
      courseInfo,
      staticData,
      changeTopType,
      targetTopType,
    };
  },
});
</script>

<style lang="less" scoped>
.wrap {
  padding: 24px 40px;
  box-sizing: border-box;

  .top-title {
    font-size: 18px;
    color: #606266;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    .back-btn {
      font-size: 14px;
      cursor: pointer;

      &:hover {
        color: #999;
      }

      &:active {
        color: #606266;
      }
    }

    .shu {
      width: 1px;
      height: 16px;
      margin: 0 20px;
      border-right: 1px solid #c2c5cc;
    }
  }

  .plan-list-box {
    > ul {
      margin-bottom: 5px;
      padding-bottom: 18px;
      display: flex;
      align-items: center;
      overflow-y: auto;

      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 6px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 8px;
        position: absolute;
        right: 0;
      }

      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        width: 6px;
        height: 90px;
        background-color: #e4e4e4;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: #bfbfbf;
      }

      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        // -webkit-box-shadow: inset 0 0 5px rgba(0, 34, 68, 0.01);
        border-radius: 4px;
        background: rgba(0, 34, 68, 0);
      }

      > li {
        background-color: #fff;
        padding: 4px 6px 7px 6px;
        box-sizing: border-box;
        width: 122px;
        height: 116px;
        border: 1px solid rgba(0, 0, 0, 0.07);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 12px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        > img {
          width: 110px;
          height: 62px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          object-fit: cover;
          margin-bottom: 4px;
        }

        > span {
          font-size: 12px;
          color: #222;
          text-align: center;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .target-plan {
        background-color: #ffb73b;
        border-color: transparent;
        position: relative;

        &::after {
          position: absolute;
          bottom: -18px;
          left: 50%;
          margin-left: -6px;
          display: block;
          content: "";
          width: 0;
          border: 9px solid transparent;
          border-top: 9px solid #ffb73b;
        }

        > span {
          color: #fff;
        }
      }
    }
  }
}
</style>
