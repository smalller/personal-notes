<template>
  <div class="student-class">
    <addClass ref="addClassmodel" @update="getClassInfos()"></addClass>
    <el-scrollbar height="900px">
      <div class="manage-header">
        <!-- <div class="form-imgs" v-if="!classInfo.clazzImg">
          <ui-icon icon="icon-a-1" class="form-icon"></ui-icon>
        </div> -->
        <div class="student-info">
          <p>
            李晓明
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
          <span>来源：校园官网</span>
          <span>报名日期：2021-10-12 16:30</span>
        </div>
      </div>
      <div class="manage-bar">
        <div class="manage-data">
          <p>性别：</p>
          <span>男</span>
        </div>
        <div class="manage-data">
          <p>家长关系：</p>
          <span>妈妈</span>
        </div>
        <div class="manage-data">
          <p>推荐人：</p>
          <span>张梅的爷爷</span>
        </div>
        <div class="manage-data">
          <p>年龄：</p>
          <span>2岁5个月</span>
        </div>
        <div class="manage-data">
          <p>家长电话：</p>
          <span>17784596512</span>
        </div>
        <div class="manage-data">
          <p>推荐人电话：</p>
          <span>156895468542</span>
        </div>
      </div>
      <div class="fromBox">
        <div class="from-item">
          <ColorSelect
            title="回访进度"
            placeholder="全部进度"
            width="120"
            :list="backProgress"
            @handleSelect="handleSelect"
            :changeTabStatus="tableIndex"
          ></ColorSelect>
        </div>
        <div class="from-item">
          <ColorSelect
            title="家长意向"
            placeholder="全部印象"
            width="120"
            :list="parentCode"
            @handleSelect="handleSelect"
            :changeTabStatus="tableIndex"
          ></ColorSelect>
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
          <!-- <teacher
            :classId="props.classData"
            :type="classStatus"
            v-if="tableIndex === 0"
          ></teacher>
          <student
            :classId="props.classData"
            :type="classStatus"
            v-if="tableIndex === 1"
          ></student>
           <attendance v-if="tableIndex === 2"></attendance>
          <videos
            :classId="props.classData"
            v-if="tableIndex === 2 && +classStatus === 0"
          ></videos> -->
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import img from "@/assets/video.jpg";
import { defineComponent, onMounted, ref, watch } from "vue";
// import teacher from "./classTeacher.vue";
// import student from "./classStudent.vue";
// import videos from "./classCamer.vue";
import { getClassInfo } from "@/api/classManage";
import ColorSelect from "./colorSelect.vue";
import { backProgress, parentCode } from "../index";
// import addClass from "./addClass.vue";
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
    // teacher,
    ColorSelect,
    // student,
    // attendance,
    // videos,
    // addClass,
  },
  setup(props) {
    onMounted(() => {
      console.log(props.classData);
    });

    //已选tab
    const tableIndex = ref(0);

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
      backProgress,
      parentCode,
    };
  },
});
</script>
<style lang="less" scoped>
.student-class {
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
    .student-info {
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
        margin-right: 20px;
      }
    }
  }

  .manage-bar {
    width: calc(100% - 80px);
    margin: 20px 40px 0 50px;
    padding-top: 10px;
    padding-bottom: 20px;
    flex: wrap;
    background: #fafafa;
    .manage-data {
      width: 270px;
      margin-top: 10px;
      margin-left: 20px;
      display: inline-flex;
      > p {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #999999;
      }
      > span {
        font-size: 14px;
        font-weight: 400;
        color: #222222;
      }
    }
  }
  .fromBox {
    display: flex;
    padding: 25px 0px 5px 50px;
    > div {
      display: flex;
      flex-wrap: wrap;
    }
    .from-item {
      margin-right: 15px;
      margin-bottom: 10px;
      display: flex;
      white-space: nowrap;
      align-items: center;
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
