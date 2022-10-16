<template>
  <ui-card class="personnelTrends">
    <div class="titleBox">
      <div class="title">人员趋势</div>
      <div class="typeBox">
        <span
          :class="{ active: queryType === 'month' }"
          @click="setType('month')"
          >月度</span
        >
        <span :class="{ active: queryType === 'year' }" @click="setType('year')"
          >年度</span
        >
        <ui-select
          :class="{ active: queryType === '' }"
          v-model="year"
          @change="setType('')"
          :popper-append-to-body="false"
        >
          <ui-select-option
            v-for="item in 30"
            :key="item"
            :value="years - item + 1"
            :label="years - item + 1 + '年'"
          ></ui-select-option>
        </ui-select>
      </div>
    </div>
    <div class="chartBox" v-loadings="loading">
      <ui-echarts-line :option="mapData"></ui-echarts-line>
    </div>
  </ui-card>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, ref } from "vue";
import { getHomePageReport } from "@/api/home";
import micell from "micell";
import bus from "@/Layout/bus";
import dayjs from "dayjs";

export default defineComponent({
  name: "personnelTrends",
  setup() {
    console.log(dayjs().toDate());
    const loading = ref(true);
    const queryType = ref("month");
    const year = ref(dayjs().toDate().getFullYear());
    const years = ref(dayjs().toDate().getFullYear());
    const mapData = reactive({
      date: [] as string[],
      data: [
        {
          name: "班级", //单项名称
          color: "#FFB73A", //颜色
          num: [] as number[], //数据
        },
        {
          name: "教职工",
          color: "#A79FE1",
          num: [] as number[],
        },
        {
          name: "幼儿",
          color: "#4EA7F8",
          num: [] as number[],
        },
      ],
    });

    const setType = (type: string) => {
      queryType.value = type;
      queryForm();
    };

    bus.$on("schoolChanged", () => {
      queryForm();
    });
    onUnmounted(() => {
      bus.$off("schoolChanged");
    });

    const initMapData = () => {
      mapData.date = [];
      mapData.data = [
        {
          name: "班级", //单项名称
          color: "#FFB73A", //颜色
          num: [] as number[], //数据
        },
        {
          name: "教职工",
          color: "#A79FE1",
          num: [] as number[],
        },
        {
          name: "幼儿",
          color: "#4EA7F8",
          num: [] as number[],
        },
      ];
    };
    interface PersonnelTrends {
      reportType?: string;
      startDay?: string;
      endDay?: string;
    }
    const queryForm = () => {
      initMapData();
      const params: PersonnelTrends = {};
      if (queryType.value === "") {
        params.startDay = `${year.value}-01`;
        params.endDay = `${year.value}-12`;
      } else if (queryType.value === "year") {
        params.reportType = queryType.value;
      } else {
        params.startDay = `${
          dayjs().toDate().getFullYear() - 1
        }-${micell.date.format(dayjs().toDate(), "MM-DD")}`;
        params.endDay = micell.date.format(dayjs().toDate(), "YYYY-MM-DD");
      }

      getHomePageReport(params).then((res) => {
        if (res.code === 0) {
          const arr = res.data;
          if (queryType.value === "month") {
            for (let i = 1; i <= dayjs().toDate().getMonth() + 1; i++) {
              let date = micell.date.format(
                dayjs(years.value + "-" + i).toDate(),
                "YYYY-MM"
              );
              mapData.date.push(date);
              const item = arr?.find((item: any) => item.reportDate === date);
              if (item) {
                mapData.data[0].num.push(item.claNum);
                mapData.data[1].num.push(item.empNum);
                mapData.data[2].num.push(item.stuNum);
              } else {
                mapData.data[0].num.push(0);
                mapData.data[1].num.push(0);
                mapData.data[2].num.push(0);
              }
            }
          }
          if (queryType.value === "year") {
            for (
              let i = dayjs().toDate().getFullYear();
              i > dayjs().toDate().getFullYear() - 6;
              i--
            ) {
              mapData.date.unshift(i.toString());
              const item = arr?.find((item: any) => +item.reportDate === +i);
              if (item) {
                mapData.data[0].num.unshift(item.claNum);
                mapData.data[1].num.unshift(item.empNum);
                mapData.data[2].num.unshift(item.stuNum);
              } else {
                mapData.data[0].num.unshift(0);
                mapData.data[1].num.unshift(0);
                mapData.data[2].num.unshift(0);
              }
            }
          }
          if (queryType.value === "") {
            for (let i = 1; i <= 12; i++) {
              let date = micell.date.format(
                dayjs(year.value + "-" + i).toDate(),
                "YYYY-MM"
              );
              mapData.date.push(date);
              const item = arr?.find((item: any) => item.reportDate === date);
              if (item) {
                mapData.data[0].num.push(item.claNum);
                mapData.data[1].num.push(item.empNum);
                mapData.data[2].num.push(item.stuNum);
              } else {
                mapData.data[0].num.push(0);
                mapData.data[1].num.push(0);
                mapData.data[2].num.push(0);
              }
            }
          }
          loading.value = false;
        }
      });
    };
    queryForm();

    return {
      queryType,
      loading,
      year,
      years,
      setType,
      queryForm,
      mapData,
    };
  },
});
</script>

<style lang="less">
.personnelTrends {
  width: 100%;
  box-sizing: border-box;
  //.el-select-dropdown {
  //  min-width: 116px !important;
  //}
  .titleBox {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 20px;
      font-weight: 400;
      text-align: left;
      color: #222222;
    }
  }
  .typeBox {
    > span {
      font-size: 14px;
      color: #222222;
      margin-left: 24px;
      cursor: pointer;
      &.active {
        color: #ff9900;
      }
    }
    .el-select {
      margin-left: 14px;
      width: 116px;
      .el-select__popper {
        width: 100% !important;
        .el-select-dropdown__item {
          padding: 0 4px !important;
          text-align: center;
        }
      }
      &.active {
        .el-input {
          input {
            color: #ff9900 !important;
          }
        }
      }
    }
    input {
      border: none !important;
    }
  }
  .chartBox {
    width: 100%;
    height: 345px;
  }
}
</style>
