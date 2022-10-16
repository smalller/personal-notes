<template>
  <el-table :data="tableList" border style="width: 100%">
    <el-table-column prop="gradeName" label="年级" />
    <el-table-column prop="className" label="班级名称" />
    <el-table-column prop="classAliasName" label="班级别名" />
    <el-table-column prop="staffName" label="带班老师" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="viewDetail(row)">修改</el-button>
        <el-button type="text" @click="delClass(row)">删除</el-button>
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
import add from "./add.vue";
import { delmerClass } from "../api";
import { ElMessage } from "element-plus";

interface Setup {
  tableList: ComputedRef<TableListItem[]>;
  viewDetail: (TableListItem) => void;
  applyRefundCom: Ref<unknown>;
  updateComplete: () => void;
  delClass: (res: any) => Promise<void>;
}

export default defineComponent({
  name: "",
  props: {
    data: {
      type: Array as PropType<TableListItem[]>,
      required: true,
    },
  },
  components: {
    add,
  },
  setup(props, { emit }): Setup {
    const tableList = computed<TableListItem[]>(() => props.data);
    const applyRefundCom = ref<unknown>(null);

    function viewDetail(row: TableListItem): void {
      (applyRefundCom.value as any).handleOpen(2, row);
    }

    function updateComplete() {
      emit("updateComplete");
    }

    async function delClass(res: any) {
      const { code } = await delmerClass(res.id);
      if (+code === 1000) {
        ElMessage.success("删除成功");
        emit("updateComplete");
      }
    }

    return {
      tableList,
      viewDetail,
      applyRefundCom,
      updateComplete,
      delClass,
    };
  },
});
</script>
<style lang="scss" scoped></style>
