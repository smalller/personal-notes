<template>
  <div class="recipe-table" v-loading="loading">
    <div>
      <el-table :data="tableData" border style="width: 100%" stripe>
        <el-table-column
          prop="recipesDateStr"
          label="日期"
          width="60"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ row.week }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zaocan" label="早餐" align="center">
          <template #default="{ row }">
            <TableRepicTd :rowData="row.zaocan"></TableRepicTd>
          </template>
        </el-table-column>
        <el-table-column prop="wucan" label="午餐" align="center">
          <template #default="{ row }">
            <TableRepicTd :rowData="row.wucan"></TableRepicTd>
          </template>
        </el-table-column>
        <el-table-column prop="jiacan" label="加餐" align="center">
          <template #default="{ row }">
            <TableRepicTd :rowData="row.jiacan"></TableRepicTd>
          </template>
        </el-table-column>
        <el-table-column prop="wancan" label="晚餐" align="center">
          <template #default="{ row }">
            <TableRepicTd :rowData="row.wancan"></TableRepicTd>
          </template>
        </el-table-column>
        <el-table-column prop="yexiao" label="夜宵" align="center">
          <template #default="{ row }">
            <TableRepicTd :rowData="row.yexiao"></TableRepicTd>
          </template>
        </el-table-column>
        <el-table-column prop="qita" label="其他" align="center">
          <template #default="{ row }">
            <TableRepicTd :rowData="row.qita"></TableRepicTd>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import TableRepicTd from "./TableRepicTd.vue";
import dayjs from "dayjs";

interface DataItem {
  [key: string]: any;
}

export default defineComponent({
  props: {
    dataList: {
      type: Array,
    },
  },
  components: {
    TableRepicTd,
  },
  setup(props) {
    const loading = ref(true);
    let tableData = ref([] as Array<DataItem>);
    const weeksMap: string[] = [
      "周日",
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
    ];

    const dataList = computed(() => props.dataList);
    changeTableData(dataList.value as Array<DataItem>);

    // 转换表格数据结构
    function changeTableData(data: Array<DataItem>) {
      // 将日期转为星期几格式
      data = data.map((item: DataItem) => {
        item.week = weeksMap[dayjs(item.recipesDate).toDate().getDay()];
        return item;
      });
      weeksMap.forEach((item) => {
        const index = data.find((da: DataItem) => da.week === item);
        if (index) {
          tableData.value.push(index);
        } else {
          tableData.value.push({
            week: item,
          });
        }
      });
      tableData.value.push(tableData.value.shift() as Array<DataItem>);
      loading.value = false;
    }

    return {
      weeksMap,
      tableData,
      loading,
    };
  },
});
</script>
<style lang="less">
.recipe-table {
  .el-table thead {
    th {
      background-color: #ffc540 !important;
      border-color: #e4a20c;
      height: 52px;
      font-size: 14px !important;
      color: #222 !important;
      font-weight: 400 !important;

      // &:first-child {
      //   border-left: 1px solid #e4a20c;
      // }
      // &:last-child {
      //   border-right: 1px solid #e4a20c;
      // }
    }
  }

  .el-table {
    border-color: #d9d9d9;
    border-top-color: #e4a20c;
  }

  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #d9d9d9;
  }
  .el-table tbody td {
    border-color: #d9d9d9;
  }

  .el-table tbody tr {
    height: 75px !important;
  }

  .el-table td,
  .el-table th {
    vertical-align: top;
  }

  .el-image-viewer__actions {
    display: none;
  }
}
</style>

<!-- <template>
  <table class="recipe-table" cellpadding="0" cellspacing="0">
    <thead>
      <th>日期</th>
      <th>早餐</th>
      <th>早点</th>
      <th>午餐</th>
      <th>午点</th>
      <th>晚餐</th>
      <th>配图</th>
    </thead>
    <tbody>
      <tr v-for="(item, index) in 7" :key="index">
        <td v-for="(item2, index2) in 7" :key="index2">周一</td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return;
  },
});
</script>
<style lang="less" scoped>
.recipe-table {
  width: 100%;

  th,
  td {
    border-width: 1px;
    border-style: solid;
    border-left: none;
  }

  > thead {
    background-color: #ffc540;

    > th {
      font-size: 14px;
      color: #222;
      font-weight: 400;
      border-color: #e4a20c;
      height: 52px;

      &:first-child {
        border-left: 1px solid #e4a20c;
        width: 47px;
      }
    }
  }

  > tbody {
    td {
      font-size: 12px;
      color: #222;
      border-color: #d9d9d9;
      border-top: none;
      height: 75px;
      vertical-align: top;
      padding: 15px 9px;
      box-sizing: border-box;

      &:first-child {
        border-left: 1px solid #d9d9d9;
      }
    }

    tr:nth-child(2n) {
      background-color: #fafafa;
    }
  }
}
</style> -->
