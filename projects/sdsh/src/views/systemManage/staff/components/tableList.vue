<template>
  <el-table :data="tableList" border style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="userName" label="姓名" />
    <el-table-column prop="account" label="手机" />
    <el-table-column label="角色">
      <template #default="{ row }">
        <span v-for="(item, index) in row.roleList" :key="index">{{
            item.name
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="viewDetail(row)">修改</el-button>
        <el-button type="text" @click="delStaff(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <editStaff ref="editStaffCom" @updateComplete="editStaffComplete"></editStaff>
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
import { delMerStaff } from "../api";
import { ElMessage } from "element-plus";
import editStaff from "./editStaff.vue";

export default defineComponent({
  name: "",
  props: {
    data: {
      type: Array as PropType<TableListItem[]>,
      required: true,
    },
  },
  components: {
    editStaff,
  },
  setup(props, { emit }) {
    const tableList = computed<TableListItem[]>(() => props.data);
    const editStaffCom = ref<unknown>(null);

    function viewDetail(res: any): void {
      (editStaffCom.value as any).handleOpen(2, res.id);
    }

    function editStaffComplete() {
      emit("updateComplete");
    }

    async function delStaff(res: any) {
      const { code } = await delMerStaff([res.id]);
      if (+code === 1000) {
        ElMessage.success("删除成功");
        editStaffComplete()
      }
    }

    function handleSelectionChange(res: any) {
      emit("selectChange", res);
    }

    return {
      tableList,
      viewDetail,
      editStaffCom,
      delStaff,
      editStaffComplete,
      handleSelectionChange
    };
  },
});
</script>
<style lang="scss" scoped>
</style>
