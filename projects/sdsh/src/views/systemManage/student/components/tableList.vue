<template>
  <el-table
    :data="tableList"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="studentName" label="学生名称" />
    <el-table-column prop="gradeName" label="年级" />
    <el-table-column prop="className" label="班级" />
    <el-table-column prop="parentName" label="家长姓名" />
    <el-table-column prop="parentPhone" label="手机号" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="fixed(row)">修改</el-button>
        <el-button type="text" @click="del(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <add ref="applyRefundCom" @updateComplete="updateComplete"></add>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ComputedRef,
  PropType,
  ref,
  Ref,
} from "vue";
import { TableListItem } from "../data";
import { delStu } from "../api";
import { ElMessage } from "element-plus";
import add, { Setup as MerSetup } from "./add.vue";

interface Setup {
  tableList: ComputedRef<TableListItem[]>;
  fixed: (TableListItem) => void;
  del: (TableListItem) => void;
  handleSelectionChange: (res) => void;
  applyRefundCom: Ref<unknown>;
  updateComplete: () => void;
}

export default defineComponent({
  name: "",
  props: {
    data: {
      type: Array as PropType<TableListItem[]>,
      required: true,
    },
  },
  components: { add },
  setup(props, { emit }): Setup {
    const tableList = computed<TableListItem[]>(() => props.data);
    const applyRefundCom = ref<unknown>(null);

    function fixed(row: TableListItem): void {
      (applyRefundCom.value as MerSetup).handleOpen(2, row);
    }

    async function del(row: any) {
      const { code } = await delStu(row.studentId);
      if (+code === 1000) {
        ElMessage.success("删除成功");
        emit("delComplete");
      }
    }

    function handleSelectionChange(res: any) {
      emit("selectChange", res);
    }

    function updateComplete() {
      emit("updateComplete");
    }

    return {
      tableList,
      applyRefundCom,
      fixed,
      del,
      handleSelectionChange,
      updateComplete,
    };
  },
});
</script>
<style lang="scss" scoped></style>
