<template>
  <el-table :data="tableList" border style="width: 100%">
    <el-table-column prop="userName" label="姓名" />
    <el-table-column prop="account" label="手机" />
    <!-- <el-table-column
      prop="contactsName"
      label="角色"
    /> -->
    <el-table-column label="角色">
      <template #default="{ row }">
        <div v-if="row.roleList.length"> <span v-for="(item, index) in row.roleList" :key="index"> {{ item.name
        }}</span>
        </div>

      </template>
    </el-table-column>
    <el-table-column prop="account" label="登录账号" />
    <el-table-column label="状态">
      <template #default="{ row }">
        <div> <span> {{ row.status == 0 ? '正常' : "禁用" }}</span></div>

      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="fix(row)">修改</el-button>
        <el-button type="text" @click="freeze(row)">{{ row.status == 0 ? '冻结' : "解冻" }}</el-button>
      </template>

    </el-table-column>
  </el-table>
  <addStaff ref="addStaffCom" @editComplete="editComplete"></addStaff>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue';
import { TableListItem } from '../data';
import addStaff, { Setup as AddStaffSetup } from './addStaff.vue';
import { roleList, addUser, freUser } from '../api';
import { ElMessage } from 'element-plus';
import { emit } from 'process';

interface Setup {
  tableList: ComputedRef<TableListItem[]>;
  fix: (TableListItem) => void;
  freeze: (TableListItem) => void;
  merchantDetailCom: Ref<unknown>;
  addStaffCom: Ref<unknown>;
  editComplete: () => void
}

export default defineComponent({
  name: '',
  props: {
    data: {
      type: Array as PropType<TableListItem[]>,
      required: true,
    },
  },
  components: { addStaff },
  setup(props, { emit }): Setup {
    const tableList = computed<TableListItem[]>(() => props.data);
    const merchantDetailCom = ref<unknown>(null);
    const addStaffCom = ref<unknown>(null);
    //修改信息
    function fix(row: TableListItem): void {
      console.log(row);
      (addStaffCom.value as AddStaffSetup).handleOpen(row);
      // (merchantDetailCom.value as MerSetup).handleOpen(row);
    }
    //冻结用户
    async function freeze(row: TableListItem): void {
      row.status = row.status == 0 ? 1 : 0;
      let params = {
        id: row.id,
        status: row.status,
      };
      const { code, data } = await freUser(params);
      if (+code === 1000) {
        ElMessage.success('修改成功');
      }
    }

    function editComplete() {
      emit('editComplete')
    }

    return {
      tableList,
      merchantDetailCom,
      fix,
      addStaffCom,
      freeze,
      editComplete
    };
  },
});
</script>
<style lang='scss' scoped>
</style>