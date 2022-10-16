<template>
  <ui-date-picker
    style="width: 240px"
    v-model="selectedDate"
    type="week"
    :format="`YYYY-MM-DD 至 ${endDate}`"
    placeholder="请选择"
    @change="handleSelectDate"
  >
  </ui-date-picker>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import micell from "micell";
import dayjs from "dayjs";

export default defineComponent({
  emits: ["handleSelectDate"],
  setup(props, { emit }) {
    const selectedDate = ref();
    const endDate = ref();

    // 选择日期
    function handleSelectDate() {
      endDate.value = getEndDate();
      let start = "";
      if (selectedDate.value !== null) {
        start = micell.date.format(selectedDate.value, "YYYY-MM-DD");
      } else {
        start = "";
      }
      emit("handleSelectDate", [start, endDate.value]);
    }

    // 获取结束日期，因为该组件无法自动获取结束日期
    function getEndDate() {
      if (selectedDate.value !== null) {
        const end = dayjs().toDate();
        end.setTime(selectedDate.value.getTime() + 3600 * 1000 * 24 * 6);
        return micell.date.format(end, "YYYY-MM-DD");
      } else {
        return "";
      }
    }

    return {
      selectedDate,
      handleSelectDate,
      endDate,
    };
  },
});
</script>
<style lang="less" scoped></style>
