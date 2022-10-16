<template>
  <div class="container">
    <span class="label-title">时间</span>
    <ui-select
      class="select-time"
      v-model="selectedTime"
      @change="handleSelectTime"
      placeholder="全部"
    >
      <ui-select-option
        v-for="item in allTimeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></ui-select-option>
    </ui-select>
    <ui-date-picker
      v-model="selectedDate"
      unlink-panels
      type="daterange"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="handleSelectDate"
    ></ui-date-picker>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import dayjs from "dayjs";

interface Shortcuts {
  text: string;
  value: () => Array<Date>;
}

export default defineComponent({
  props: {
    changeTabStatus: Boolean,
  },
  emits: ["handleSelectTime", "handleSelectDate"],
  setup(props, ctx) {
    const selectedTime = ref(5);
    const selectedDate = ref([] as Array<Date> | "");
    const allTimeList = ref([
      {
        label: "今天",
        value: 0,
      },
      {
        label: "7天",
        value: 1,
      },
      {
        label: "14天",
        value: 2,
      },
      {
        label: "30天",
        value: 3,
      },
      {
        label: "3个月",
        value: 4,
      },
      {
        label: "全部",
        value: 5,
      },
    ]);

    const shortcuts: Array<Shortcuts> = [
      {
        text: "今天",
        value: () => {
          const end = dayjs().toDate();
          const start = dayjs().toDate();
          return [start, end];
        },
      },
      {
        text: "7天",
        value: () => {
          const end = dayjs().toDate();
          const start = dayjs().toDate();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end];
        },
      },
      {
        text: "14天",
        value: () => {
          const end = dayjs().toDate();
          const start = dayjs().toDate();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
          return [start, end];
        },
      },
      {
        text: "30天",
        value: () => {
          const end = dayjs().toDate();
          const start = dayjs().toDate();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return [start, end];
        },
      },
      {
        text: "3个月",
        value: () => {
          const end = dayjs().toDate();
          const start = dayjs().toDate();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          return [start, end];
        },
      },
    ];

    // 只要监听到值改变就初始化值
    watch(
      () => props.changeTabStatus,
      () => {
        selectedTime.value = 5;
        selectedDate.value = "";
      }
    );

    const handleSelectTime = () => {
      // 让选择的日期段与日期选择器进行联动
      if (selectedTime.value != 5) {
        selectedDate.value = shortcuts[selectedTime.value].value();
      } else {
        selectedDate.value = "";
      }
      ctx.emit("handleSelectDate", selectedDate.value);
    };

    const handleSelectDate = () => {
      selectedTime.value = 5;
      ctx.emit("handleSelectDate", selectedDate.value);
    };

    return {
      selectedTime,
      selectedDate,
      allTimeList,
      handleSelectTime,
      handleSelectDate,
    };
  },
});
</script>
<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;

  .label-title {
    min-width: 28px;
    color: #999;
    font-size: 14px;
    margin-right: 6px;
  }

  .select-time {
    width: 96px;
    margin-right: 16px;
  }
}
</style>
