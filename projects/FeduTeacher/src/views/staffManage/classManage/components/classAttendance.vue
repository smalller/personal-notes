<template>
  <div class="manage-student">
    <span style="margin-left: 10px">时间</span>
    <ui-select v-model="time" style="width: 100px; margin-left: 10px">
      <ui-select-option label="今天" value="1"></ui-select-option>
      <ui-select-option label="昨天" value="2"></ui-select-option>
      <ui-select-option label="三天内" value="3"></ui-select-option>
      <ui-select-option label="七天内" value="4"></ui-select-option>
    </ui-select>
    <ui-date-picker
      type="daterange"
      range-separator="~"
      style="width: 240px; margin-left: 10px"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></ui-date-picker>
    <ui-input
      placeholder="输入姓名"
      style="width: 200px; margin-left: 10px"
      icon="icon-a-101"
    ></ui-input>
    <ui-table :data="data" style="margin-top: 15px">
      <ui-table-column prop="grade" label="幼儿姓名" align="center">
      </ui-table-column>
      <ui-table-column prop="teacher" label="班级" align="left">
      </ui-table-column>
      <ui-table-column
        prop="studentNum"
        label="考勤日期"
        align="right"
      ></ui-table-column>
      <ui-table-column prop="studentAttendance" label="进园打卡" align="right">
        <template #default="{ row }">
          <span :style="{ color: row.studentAttendance > 0 ? '#F56060' : '' }"
            >{{ row.studentAttendance }}%</span
          >
        </template>
      </ui-table-column>
      <ui-table-column prop="studentAttendance" label="离园打卡" align="right">
        <template #default="{ row }">
          <span :style="{ color: row.studentAttendance > 0 ? '#F56060' : '' }"
            >{{ row.studentAttendance }}%</span
          >
        </template>
      </ui-table-column>

      <ui-table-column prop="id" label="操作" align="right">
        <template #default="{ row }">
          <ul class="handle-box">
            <li>
              <ui-button
                type="text-blue"
                style="margin-right: 15px"
                @click="openItem(row.id)"
                >{{ activeId === row.id ? "收起" : "记录" }}</ui-button
              >
            </li>
          </ul>
        </template>
      </ui-table-column>
      <template #details="{ row }">
        <div class="itemDetails" v-if="activeId === row.id">
          <div v-for="(item, index) in 5" :key="index" class="student-item">
            <img :src="img" />
            <div class="student-info">
              <p>进园打卡：09:25:31</p>
              <span>正常</span>
              <!-- <span>入园时间：2021-02-05</span>
              <span>入驻App：未入驻</span>
              <span>所在班级：太阳班</span> -->
              <span>考勤卡号：2315165456464</span>
            </div>
          </div>
        </div>
      </template>
    </ui-table>
    <ui-pagination style="margin-top: 15px"></ui-pagination>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import img from "@/assets/people.png";

interface ruleForm {
  classIcon: string;
  className: string;
  classGrade: string;
  classTime: string;
}
interface addClass {
  title: string;
  width: string | number;
  open: boolean;
}
export default defineComponent({
  props: {
    className: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    type: {
      type: String,
    },
  },
  setup(props) {
    const data = ref([
      {
        id: 0,
        className: "太阳班",
        grade: "一年级",
        teacher: "111111111111",
        studentNum: 12,
        studentAttendance: 15,
        inApp: 15,
        time: "2012-2-25",
      },
      {
        id: 1,
        className: "太阳班",
        grade: "一年级",
        teacher: "111111111111",
        studentNum: 12,
        studentAttendance: 15,
        inApp: 15,
        time: "2012-2-25",
      },
      {
        id: 2,
        className: "太阳班",
        grade: "一年级",
        teacher: "111111111111",
        studentNum: 12,
        studentAttendance: 15,
        inApp: 15,
        time: "2012-2-25",
      },
      {
        id: 3,
        className: "太阳班",
        grade: "一年级",
        teacher: "111111111111",
        studentNum: 12,
        studentAttendance: 15,
        inApp: 15,
        time: "2012-2-25",
      },
      {
        id: 4,
        className: "太阳班",
        grade: "一年级",
        teacher: "111111111111",
        studentNum: 12,
        studentAttendance: 15,
        inApp: 15,
        time: "2012-2-25",
      },
    ]);
    const showClass = ref(false);
    const activeId = ref("1");
    const classMode = ref({
      className: props.className,
      width: props.width,
      type: props.type,
    });
    //初始化班级数据
    const ruleForm: ruleForm = {
      classIcon: "",
      className: "",
      classGrade: "",
      classTime: "",
    };
    //获取年级信息
    const classList = ref([
      {
        label: "大班",
        value: "1",
      },
      {
        label: "中班",
        value: "2",
      },
      {
        label: "小班",
        value: "3",
      },
    ]);
    //添加班级
    const addClass: addClass = {
      title: "新增班级",
      width: 600,
      open: true,
    };
    //显示学生详情
    const openItem = (id: string) => {
      activeId.value = activeId.value === id ? "" : id;
    };

    //关闭弹窗
    const handleClose = () => {
      console.log("1");
    };
    //确认添加班级
    const handleAdd = () => {
      console.log("1");
    };
    const time = ref(1);
    return {
      classMode,
      ruleForm,
      classList,
      addClass,
      handleClose,
      handleAdd,
      data,
      showClass,
      activeId,
      openItem,
      img,
      time,
    };
  },
});
</script>
<style lang="less" scoped>
.manage-student {
  //   overflow: scroll;
  .student-input {
    width: 200px;
    margin-bottom: 20px;
  }
  .itemDetails {
    background: #fafafa;
    border: 1px solid #e8e8e8;
    position: relative;
    display: inline-flex;
    flex-wrap: wrap;
    padding: 0 35px;
    &::after {
      content: "";
      position: absolute;
      top: -15px;
      right: 25px;
      width: 0;
      height: 0;
      border-top: 0px solid transparent;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 15px solid #eeee;
    }
    .student-item {
      width: 50%;
      margin-top: 10px;
      margin-bottom: 10px;
      // margin: auto;
      display: flex;
      img {
        width: 80px;
        height: 80px;
        background: rgba(0, 0, 0, 0);
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
      .student-info {
        width: 50%;
        margin-left: 15px;

        > p {
          font-size: 16px;
          color: #222222;
        }
        > span {
          display: block;
          font-size: 12px;
          margin-top: 5px;
          margin-bottom: 5px;
          color: #666666;
        }
      }
    }
  }
}
</style>
