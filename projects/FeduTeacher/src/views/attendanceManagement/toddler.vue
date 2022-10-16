<template>
  <div class="toddler">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="tableBox">
      <ui-card>
        <ui-tab
          v-model:index="tableIndex"
          :list="['出勤记录', '陌生人记录']"
        ></ui-tab>
        <AttendanceRecords v-if="tableIndex === 0" />
        <Stranger v-if="tableIndex === 1" />
      </ui-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import AttendanceRecords from "./attendanceRecords.vue";
import Stranger from "./stranger.vue";

export default defineComponent({
  setup() {
    const modalVisible = ref(false);
    const tableIndex = ref(0);
    const map = reactive({
      titleValue: "55",
      title: "今日出勤率",
      isHome: false,
      data: [
        {
          value: 70,
          name: "缺勤",
          color: "#4FA8F9",
        },
        {
          value: 30,
          name: "请假",
          color: "#42C7C6",
        },
        {
          value: 40,
          name: "已出勤",
          color: "#FFB73B",
        },
      ],
    });
    const schoolTimeForm = reactive({
      times: [],
    });
    const route = useRoute();
    /**
     * 获取考勤状态文字和颜色
     * @param status
     */
    const getStatusText = (status: number) => {
      const statusList = ["迟到", "缺卡", "事假", "代签", "正常"];
      const statusColorList = [
        "#7673C1",
        "#F56060",
        "#FF9900",
        "#42C7C6",
        "#222222",
      ];
      return {
        text: statusList[status],
        color: statusColorList[status],
      };
    };
    return {
      route,
      tableIndex,
      modalVisible,
      schoolTimeForm,
      map,
      getStatusText,
    };
  },
  components: { AttendanceRecords, Stranger },
});
</script>

<style lang="less">
.toddler {
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    .settingBox {
      display: flex;
      height: 36px;
      align-items: center;
      padding: 0 12px;
      margin-left: 40px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      opacity: 1;
      border-radius: 3px;
      span {
        font-size: 14px;
        &:nth-child(1) {
        }
        &:nth-child(2) {
          color: #ff9900;
          margin-left: 4px;
        }
        &:nth-child(3) {
          cursor: pointer;
          color: #bfbfbf;
          margin-left: 32px;
          user-select: none;
          &:hover {
            color: #61b4ff;
          }
          &:active {
            color: #bfbfbf;
          }
        }
      }
    }
  }
  .chartBox {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .bin {
      flex: 29;
      height: 260px;
      min-width: 460px;
      margin-bottom: 24px;
    }
    .line {
      flex: 68;
      height: 260px;
      min-width: 460px;
    }
    .chartTitle {
      color: #222222;
      font-size: 20px;
      display: flex;
      align-items: center;
      .icon {
        margin-left: 5px;
        width: 15px;
        height: 15px;
        fill: #bfbfbf;
      }
      > span {
        display: flex;
        align-items: center;
      }
    }
  }
  .tableBox {
    margin-top: 20px;
  }
}
.toddlerModelBox {
  .el-checkbox {
    margin-right: 16px;
  }
  .toddlerModelForm {
    margin-top: 20px;
    margin-bottom: 48px;
  }
}
</style>
