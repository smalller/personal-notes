<template>
  <el-dialog
    v-model="dialogVisible"
    title="收支流水"
    width="70%"
  >
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
        <el-button
          type="primary"
          @click="handleSearch"
        >查询</el-button>
      </li>
      <li>
        <el-button
          type="primary"
          @click="handleSearch"
        >导出Excel</el-button>
      </li>
    </ul>
    <el-table
      :data="tableList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop
        label="收款方式"
      />
      <el-table-column
        prop
        label="收款笔数"
      />
      <el-table-column
        prop
        label="收款总额"
      />
      <el-table-column
        prop
        label="退款笔数"
      />
      <el-table-column
        prop
        label="退款总额"
      />
      <el-table-column label="操作"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  ComputedRef,
  PropType,
} from "vue";
import { paywayList } from "../static";
import { KeyValue } from "@/common/types";

export interface Setup {
  dialogVisible: Ref<boolean>;
  handleOpen: (any) => void;
  selectedDate: Ref<string>;
  payType: Ref<number>;
  paywayList: KeyValue[];
  handleSearch: () => void;
  tableList: Ref<any[]>;
}

export default defineComponent({
  name: "",
  setup(props): Setup {
    const dialogVisible = ref<boolean>(false);
    const selectedDate = ref("");
    const payType = ref<number>(4);
    const tableList = ref<any[]>([]);

    // 打开抽屉
    const handleOpen = (res: any): void => {
      dialogVisible.value = true;
    };

    const handleSearch = (): void => {
      console.log(selectedDate.value);
    };

    return {
      dialogVisible,
      handleOpen,
      selectedDate,
      payType,
      paywayList,
      handleSearch,
      tableList,
    };
  },
});
</script>
<style lang='scss' scoped>
ul {
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
</style>
