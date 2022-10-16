<template>
  <div class="left-echarts" v-loading="loading">
    <div class="people-num">
      幼儿总数
      <p>{{ total }}</p>
    </div>
    <div class="charts-box">
      <ui-echarts-student
        v-if="femaleObj.rate"
        style="width: 181px; height: 204px"
        :option="{
          value: femaleObj.rate,
          type: 1,
        }"
      ></ui-echarts-student>
      <ui-echarts-student
        v-else
        style="width: 181px; height: 204px"
        :option="{
          value: '0%',
          type: 1,
        }"
      ></ui-echarts-student>
    </div>
    <div class="right-data-box">
      <div class="top-box">
        <p>男生：{{ maleObj.num || 0 }}人</p>
        <p>占比：{{ maleObj.rate || 0 }}</p>
      </div>
      <div class="botom-box">
        <p>女生：{{ femaleObj.num || 0 }}人</p>
        <p>占比：{{ femaleObj.rate || 0 }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onUnmounted, onMounted } from "vue";
import { getSchoolProportion } from "@/api/infantManage";
import { InfantNumChartData } from "../util";
import bus from "@/Layout/bus";

export default defineComponent({
  name: "",
  setup() {
    const loading = ref(true);
    const maleObj = ref({}); //男生统计数据
    const femaleObj = ref({}); //女生统计数据
    const total = ref(0); //总数

    // 获取在职幼儿统计数据
    const getNowTeachPieData = async (): Promise<void> => {
      loading.value = true;
      maleObj.value = {};
      femaleObj.value = {};
      const { code, data } = await getSchoolProportion();
      if (+code === 0) {
        if (data.length !== 0) {
          total.value = data[0].total;
          data.forEach((item: InfantNumChartData) => {
            if (+item.sex === 1) {
              maleObj.value = item;
            }
            if (+item.sex === 0) {
              femaleObj.value = item;
            }
          });
        } else {
          maleObj.value = {};
          femaleObj.value = {};
          total.value = 0;
        }
      }
      loading.value = false;
    };
    getNowTeachPieData();

    onMounted(() => {
      // 更新图表数据
      bus.$on("updateInfantNumData", (res: boolean) => {
        res && getNowTeachPieData();
      });
    });

    onUnmounted(() => {
      bus.$off("updateInfantNumData");
    });

    return {
      maleObj,
      femaleObj,
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
    margin-left: 12px;
    padding-top: 50px;
    font-size: 14px;
    color: #656565;

    .top-box {
      margin-bottom: 40px;
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
