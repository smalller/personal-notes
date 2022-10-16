<template>
  <div class="manage-class">
    <addClass
      ref="addClassmodel"
      @update="getClassInfos()"
    ></addClass>
    <el-scrollbar height="900px">
      <div class="manage-header">
        <img
          :src="classInfo.clazzImg"
          v-if="classInfo.clazzImg"
        />
        <div
          class="form-imgs"
          v-if="!classInfo.clazzImg"
        >
          <ui-icon
            icon="icon-a-1"
            class="form-icon"
          ></ui-icon>
        </div>
        <div class="manage-class">
          <p>
            {{ classInfo.name }}
            <ui-icon
              icon="icon-a-52"
              style="
                color: #9a9a9a;
                margin-left: 10px;
                width: 16px;
                cursor: pointer;
              "
              @click="editClass"
            ></ui-icon>
          </p>

          <span>{{ classInfo.gradeLabel }} &nbsp;&nbsp;</span><span>建班时间：{{ classInfo.createTime }}</span>
        </div>
      </div>
      <div class="manage-bar">
        <div class="manage-data">
          <p>{{ classInfo.teachers ? classInfo.teachers : "0" }}</p>
          <span>老师数</span>
        </div>
        <div class="manage-data">
          <p>{{ classInfo.studentNum ? classInfo.studentNum : "0" }}</p>
          <span v-show="+classStatus === 0">幼儿数</span>
          <span v-show="+classStatus === 1">毕业幼儿数</span>
        </div>
        <div class="manage-data">
          <p>{{ classInfo.attdanceNum ? classInfo.attdanceNum : "0%" }}</p>
          <span v-show="+classStatus === 0">今日出勤率</span>
          <span v-show="+classStatus === 1">毕业率</span>
        </div>
        <div class="manage-data">
          <p>
            {{ classInfo.createTime ? setTime(classInfo.createTime) : "0" }}
          </p>
          <span>建班时间</span>
        </div>
        <div class="manage-data">
          <p>{{ classInfo.active ? classInfo.active : "0" }}</p>
          <span>班级活跃值</span>
        </div>
      </div>
      <div class="manage-table">
        <ui-tab
          class="test"
          v-model:index="tableIndex"
          :list="
            classStatus === 0
              ? ['班级老师', '班级幼儿', '班级视频']
              : ['班级老师', '毕业幼儿']
          "
        ></ui-tab>
        <div style="margin-top: 15px">
          <teacher
            :classId="props.classData"
            :type="classStatus"
            v-if="tableIndex === 0"
          ></teacher>
          <student
            :classId="props.classData"
            :type="classStatus"
            v-if="tableIndex === 1"
          ></student>
          <!-- <attendance v-if="tableIndex === 2"></attendance> -->
          <videos
            :classId="props.classData"
            v-if="tableIndex === 2 && +classStatus === 0"
          ></videos>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import img from "@/assets/video.jpg";
import { ElScrollbar } from "element-plus";
import { defineComponent, onMounted, ref, watch } from "vue";
import teacher from "./classTeacher.vue";
import student from "./classStudent.vue";
import videos from "./classCamer.vue";
import { getClassInfo } from "@/api/classManage";
import addClass from "./addClass.vue";
import dayjs from "dayjs";

export default defineComponent({
  props: {
    classStatus: {
      type: [Number, String],
      default: 0,
    },
    classData: {
      type: [Number, String],
      default: "",
    },
  },
  components: {
    teacher,
    ElScrollbar,
    student,
    // attendance,
    videos,
    addClass,
  },
  setup(props) {
    //已选tab
    const tableIndex = ref(0);
    onMounted(() => {
      tableIndex.value = 0;
    });
    //班级基本信息
    const classInfo = ref({});
    //获取班级基本信息
    const getClassInfos = async (): Promise<any> => {
      let id = props.classData as string | number;
      if (id) {
        let { code, data } = await getClassInfo(id);
        if (+code === 0) {
          classInfo.value = data;
        }
      }
    };
    watch(props, () => {
      classInfo.value = {};
      getClassInfos();
      tableIndex.value = 0;
    });

    onMounted(() => {
      getClassInfos();
    });
    //初始化修改班级信息
    const addClassmodel = ref(null);
    //修改班级信息
    const editClass = () => {
      (addClassmodel.value as any).handleOpen("edit", classInfo.value);
    };
    const setTime = (time: Date) => {
      console.log(time);
      let startTime = dayjs(time).toDate(); // 开始时间
      let endTime = dayjs().toDate(); // 结束时间
      let usedTime = +endTime - +startTime; // 相差的毫秒数
      let months = Math.floor(usedTime / (24 * 3600 * 1000)) / 30; // 计算出天数
      console.log(months);
      if (months > 12) {
        return months / 10 + "年";
      } else {
        return months.toFixed(1) + "月";
      }
    };
    return {
      img,
      classInfo,
      tableIndex,
      props,
      addClassmodel,
      editClass,
      getClassInfos,
      setTime,
    };
  },
});
</script>
<style lang="less" scoped>
.manage-class {
  width: 100%;
  .manage-header {
    margin-left: 40px;
    display: flex;
    > img {
      width: 60px;
      // height: 60px;
      background: rgba(0, 0, 0, 0);
      // background-color: #999999;
      border-radius: 8px;
    }
    .form-imgs {
      width: 60px;
      height: 60px;
      background: #fafafa;
      border-radius: 4px;
      // margin-bottom: -30px;
      // cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0.1);
      .form-icon {
        width: 30px;
        // cursor: pointer;
        margin: 20px 0px 0px 15px;
      }
    }
    .manage-class {
      margin-left: 10px;
      margin-top: -5px;
      > p {
        display: block;
        margin-bottom: 10px;
        height: 33px;
        font-size: 24px;
        font-weight: 400;
        color: #222222;
      }
      > span {
        width: 201px;
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #999999;
        opacity: 1;
      }
    }
  }

  .manage-bar {
    width: calc(100% - 80px);
    margin: 20px 40px 0 40px;
    height: 120px;
    display: inline-flex;
    background: #fafafa;
    .manage-data {
      width: 20%;
      height: 120px;
      margin-top: 30px;
      text-align: center;
      > p {
        font-size: 24px;
        font-weight: bold;
        line-height: 33px;
        color: #222222;
      }
      > span {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #999999;
      }
    }
  }
  .manage-table {
    width: calc(100% - 80px);
    margin: 20px 0 20px 40px;
    .ui-tab {
      > div {
        font-size: 16px !important;
      }
    }
  }
}
.el-drawer__header {
  margin-bottom: 0px;
}
</style>
