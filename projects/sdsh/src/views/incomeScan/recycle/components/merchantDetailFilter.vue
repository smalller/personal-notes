<template>
  <div class="merchant-detail-filter-select-box">
    <ul>
      <li>
        <span class="label-title">支付方式</span>
        <el-select
          v-model="payType"
          placeholder="全部"
        >
          <el-option
            v-for="item in paywayList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li>
        <span class="label-title">收费类型</span>
        <el-select
          v-model="projectType"
          placeholder="全部"
        >
          <el-option
            v-for="item in projectTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li>
        <span class="label-title">支付状态</span>
        <el-select
          v-model="payStatus"
          placeholder="全部"
        >
          <el-option
            v-for="item in payStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
    </ul>
    <ul>
      <li>
        <span class="label-title">交易时间</span>
        <el-date-picker
          v-model="selectedDate"
          unlink-panels
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </li>
      <li>
        <el-button
          type="primary"
          @click="handleSearch"
        >查询</el-button>
      </li>
    </ul>
    <ul>
      <li>
        <el-button type="primary">导出Excel</el-button>
      </li>
      <li>
        <el-button
          type="primary"
          @click="viewStatisData"
        >查看收支统计</el-button>
      </li>
      <li>
        <el-button
          type="primary"
          @click="viewCloseCountData"
        >查看已结算统计</el-button>
      </li>
    </ul>
  </div>
  <astatisData ref="astatisDataCom"></astatisData>
  <closeCountData ref="closeCountDataCom"></closeCountData>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { paywayList, projectTypeList, payStatusList } from "../static";
import { KeyValue } from "@/common/types";
import astatisData, { Setup as StatisDataSetup } from "./statisData.vue";
import closeCountData, {
  Setup as closeCountDataSetup,
} from "./closeCountData.vue";

interface Setup {
  paywayList: KeyValue[];
  projectTypeList: KeyValue[];
  payStatusList: KeyValue[];
  payType: Ref<number>;
  projectType: Ref<number>;
  payStatus: Ref<number | string>;
  selectedDate: Ref<string>;
  handleSearch: () => void;
  viewStatisData: () => void;
  viewCloseCountData: () => void;
  astatisDataCom: Ref<unknown>;
  closeCountDataCom: Ref<unknown>;
}

export default defineComponent({
  name: "",
  components: {
    astatisData,
    closeCountData,
  },
  setup(): Setup {
    const payType = ref<number>(4);
    const projectType = ref<number>(4);
    const payStatus = ref<number | string>("");
    const selectedDate = ref("");

    const astatisDataCom = ref<unknown>(null);
    const closeCountDataCom = ref<unknown>(null);

    const handleSearch = (): void => {
      console.log(selectedDate.value);
    };

    const viewStatisData = (): void => {
      (astatisDataCom.value as StatisDataSetup).handleOpen(1);
    };

    const viewCloseCountData = (): void => {
      (closeCountDataCom.value as closeCountDataSetup).handleOpen(1);
    };

    return {
      paywayList,
      projectTypeList,
      payStatusList,
      payType,
      projectType,
      payStatus,
      selectedDate,
      handleSearch,
      viewStatisData,
      astatisDataCom,
      viewCloseCountData,
      closeCountDataCom,
    };
  },
});
</script>
<style lang='scss'>
.merchant-detail-filter-select-box {
  > ul {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    > li {
      margin-right: 20px;
    }

    .el-select .el-input {
      width: 130px;
    }

    .label-title {
      margin-right: 10px;
    }
  }
}
</style>
