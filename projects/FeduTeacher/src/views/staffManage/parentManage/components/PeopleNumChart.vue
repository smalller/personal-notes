<template>
  <div class="left-echarts" v-loading="loading">
    <div class="people-num">
      家长总数
      <p>{{ total }}</p>
    </div>
    <div class="charts-box">
      <ui-echarts-student
        v-if="closeMonObj.proportion"
        style="width: 181px; height: 204px"
        :option="{
          value: closeMonObj.proportion,
          type: 0,
        }"
      ></ui-echarts-student>
      <ui-echarts-student
        v-else
        style="width: 181px; height: 204px"
        :option="{
          value: '0%',
          type: 0,
        }"
      ></ui-echarts-student>
    </div>
    <div class="right-data-box">
      <div class="top-box">
        <p>开通监控：{{ openMonObj.onNum || 0 }}人</p>
        <p>占比：{{ openMonObj.proportion || 0 }}</p>
      </div>
      <div class="botom-box">
        <p>关闭监控：{{ closeMonObj.offNum || 0 }}人</p>
        <p>占比：{{ closeMonObj.proportion || 0 }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { getStatisticsNow } from "@/api/parentManage";
import bus from "@/Layout/bus";

export default defineComponent({
  name: "",
  setup() {
    const loading = ref(true);
    const openMonObj = ref({}); //开通监控统计数据
    const closeMonObj = ref({}); //关闭监控统计数据
    const total = ref(0); //总数

    // 获取统计数据
    const getNowTeachPieData = async (): Promise<void> => {
      loading.value = true;
      openMonObj.value = {};
      closeMonObj.value = {};
      const { code, data } = await getStatisticsNow();
      if (+code === 0) {
        if (data.length !== 0) {
          total.value = data[0].totalNum;
          for (let key of data) {
            if (key["onNum"]) {
              openMonObj.value = key;
            }
            if (key["offNum"]) {
              closeMonObj.value = key;
            }
          }
        } else {
          openMonObj.value = {};
          closeMonObj.value = {};
          total.value = 0;
        }
      }
      loading.value = false;
    };
    getNowTeachPieData();

    onMounted(() => {
      // 更新图表数据
      bus.$on("updateParentNumData", (res: boolean) => {
        res && getNowTeachPieData();
      });
    });

    onUnmounted(() => {
      bus.$off("updateParentNumData");
    });

    return {
      openMonObj,
      closeMonObj,
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
