<template>
  <div class="left-echarts" v-loading="loading">
    <div class="people-num">
      教职工总数
      <p>{{ total }}</p>
    </div>
    <div class="charts-box">
      <ui-echarts-student
        v-if="otherObj.proportion"
        style="width: 181px; height: 204px"
        :option="{
          value: otherObj.proportion,
          type: 2,
        }"
      ></ui-echarts-student>
      <ui-echarts-student
        v-else
        style="width: 181px; height: 204px"
        :option="{
          value: '0%',
          type: 2,
        }"
      ></ui-echarts-student>
    </div>
    <div class="right-data-box">
      <div class="top-box">
        <p>老师：{{ teachObj.roleNum || 0 }}人</p>
        <p>占比：{{ teachObj.proportion || 0 }}</p>
      </div>
      <div class="botom-box">
        <p>其他员工：{{ otherObj.roleNum || 0 }}人</p>
        <p>占比：{{ otherObj.proportion || 0 }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { getSchoolProportion } from "@/api/teachingManage";
import { TeachNumChartData } from "../util";
import bus from "@/Layout/bus";

export default defineComponent({
  name: "",
  setup() {
    const loading = ref(true);
    const teachObj = ref({}); //老师统计数据
    const otherObj = ref({}); //其他教职工统计数据
    const total = ref(0); //总数

    // 获取在职教职工统计数据
    const getNowTeachPieData = async (): Promise<void> => {
      loading.value = true;
      teachObj.value = {};
      otherObj.value = {};
      const { code, data } = await getSchoolProportion();
      if (+code === 0) {
        if (data.length !== 0) {
          total.value = data[0].totalNum;
          data.forEach((item: TeachNumChartData) => {
            if (item.roleName === "教师") {
              teachObj.value = item;
            }
            if (item.roleName === "其他员工") {
              otherObj.value = item;
            }
          });
        } else {
          teachObj.value = {};
          otherObj.value = {};
          total.value = 0;
        }
      }
      loading.value = false;
    };
    getNowTeachPieData();

    onMounted(() => {
      // 更新图表数据
      bus.$on("updateTeachNumData", (res: boolean) => {
        res && getNowTeachPieData();
      });
    });

    onUnmounted(() => {
      bus.$off("updateTeachNumData");
    });

    return {
      teachObj,
      otherObj,
      total,
      loading,
    };
  },
});
</script>
<style lang="less" scoped>
.left-echarts {
  width: 460px;
  height: 260px;
  margin-top: 10px;
  display: flex;

  .people-num {
    padding: 34px 0 0 20px;
    color: #676767;
    font-size: 18px;
    > p {
      font-size: 40px;
      color: #222222;
    }
  }

  .right-data-box {
    margin-left: 24px;
    padding-top: 50px;
    font-size: 14px;
    color: #656565;

    .top-box {
      margin-bottom: 60px;
      position: relative;

      &::before {
        display: block;
        content: "";
        width: 30px;
        height: 1px;
        position: absolute;
        top: 20px;
        left: -36px;
        background-color: #bfbfbf;
        transform: rotate(-12deg);
      }
    }

    .botom-box {
      position: relative;

      &::before {
        display: block;
        content: "";
        width: 30px;
        height: 1px;
        position: absolute;
        top: 20px;
        left: -36px;
        background-color: #bfbfbf;
        transform: rotate(-12deg);
      }
    }
  }
}
</style>
