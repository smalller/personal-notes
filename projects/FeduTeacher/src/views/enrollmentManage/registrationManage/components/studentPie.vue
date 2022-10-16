<template>
  <div class="pie-box">
    <ChartsTitle
      title="报名幼儿"
      tips="当前报名幼儿统计"
    ></ChartsTitle>
    <ui-echarts-pie
      :option="mapData"
      style="height: 100%; width: 100%"
    ></ui-echarts-pie>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ChartsTitle from "@/components/ChartsTitle.vue";
// import YearsSelect from "@/components/YearsSelect.vue";
// import { getClassListLine } from "@/api/classManage";
import { useStore } from "vuex";
import bus from "@/Layout/bus";
import dayjs from "dayjs";
import { createYears, monthDateArg } from "@/utils/common";

export default defineComponent({
  components: {
    ChartsTitle,
  },
  setup() {
    const $store = useStore();
    let mapData = reactive({
      titleValue: "1205", // 百分值
      title: "报名人数", //标题
      isHome: false, //是否为首页图表
      type: "人",
      data: [
        {
          value: 70, //数值
          name: "已缴费", //名称
          color: "#4FA8F9", //颜色
        },
        {
          value: 30,
          name: "已放弃",
          color: "#42C7C6",
        },
        {
          value: 40,
          name: "待回访",
          color: "#F43B",
        },
        {
          value: 40,
          name: "回访中",
          color: "#FFB73B",
        },
      ],
    });

    const yearsList = createYears(); // 近五年选项
    const highLight = ref(true); //选择年份是否高亮
    const typeIndex = ref(1); //日期筛选类型索引：1-月度，2-年度，3-年份
    const monthInfo = ref(0); //月份
    const yearInfo = ref(0); //年份
    const gradeList = ref($store.state.commonData.gradeList); // 年级列表
    const date = dayjs().toDate();
    monthInfo.value = +date.getMonth() + 1;
    yearInfo.value = +date.getFullYear();

    onMounted(() => {
      // 更新图表数据
      bus.$on("editClass", (res: boolean) => {
        if (res) {
          // 默认展示月度数据
          typeIndex.value = 1;
          highLight.value = false;
          //   getLineReportData(monthInfo.value, yearInfo.value);
        }
      });
    });

    onUnmounted(() => {
      bus.$off("editClass");
    });
    return {
      mapData,
      typeIndex,
      yearsList,
      highLight,
      createYears,
      monthDateArg,
    };
  },
});
</script>
<style lang="less" scoped>
.pie-box {
  width: 100%;
  height: 100%;
}
</style>
