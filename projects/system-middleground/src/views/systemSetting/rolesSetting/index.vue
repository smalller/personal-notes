<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="角色名称：">
          <el-input v-model="QueryObj.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRoles">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handleDeleteSysRoleByBatchId">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableList" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="settingRoles(row)">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <addStaff ref="addStaffCom"></addStaff>
    <el-dialog v-model="dialogVisible" title="新增角色" width="30%">
      <ul class="add-roles-box">
        <li>
          <span class="label-title">角色名称：</span>
          <el-input v-model="roleName"></el-input>
        </li>
        <li class="botom-btn-box">
          <el-button type="primary" @click="addRole">新增</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue';
import { QueryObj, TableListItem, RoleItem } from './data';
import bankCardInfo from '@/components/merchant/bankCardInfo.vue';
import basicInfo from '@/components/merchant/basicInfo.vue';
import idCardInfo from '@/components/merchant/idCardInfo.vue';
import { statusList } from './static';
import { KeyValue } from '@/common/data';
import addStaff, { Setup as AddStaffSetup } from './components/addStaff.vue';
import { roleList, addUser, deleteSysRoleByBatchId } from './api';
import { ElMessage } from 'element-plus';

interface Setup {
  QueryObj: any;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  addStaffCom: Ref<unknown>;
  settingRoles: (res: any) => void;
  selectedDate: Ref<Date[] | string>;
  statusList: KeyValue[];
  addRoles: () => void;
  addRole: () => void;
  dialogVisible: Ref<boolean>;
  roleName: Ref<string>;
  getRoleList: any;
  handleDeleteSysRoleByBatchId: any;
  handleSelectionChange: any
}

export default defineComponent({
  name: '',
  components: {
    bankCardInfo,
    basicInfo,
    idCardInfo,
    addStaff,
  },
  setup(): Setup {
    const QueryObj = reactive<any>({
      name: '',
    });
    const selectedDate = ref([] as Date[] | '');
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const addStaffCom = ref<unknown>(null);
    const dialogVisible = ref<boolean>(false);
    const roleName = ref<string>('');
    const selectList = ref<any>([])

    async function getRoleList(): Promise<void> {
      const { code, data } = await roleList(QueryObj.name);
      if (+code === 1000) {
        tableList.value = data;
        totalNum.value = data.length;
      }
    }
    getRoleList();

    function handleSelectionChange(res: any) {
      selectList.value = res
    }


    async function handleDeleteSysRoleByBatchId() {
      const ids = selectList.value.map(item => item.id)
      const { code } = await deleteSysRoleByBatchId(ids)
      if (+code === 1000) {
        ElMessage.success('删除成功')
        getRoleList();
      }
    }

    async function addRole() {
      let info = {
        name: roleName.value,
      };
      const { code, data } = await addUser(info);
      if (+code === 1000) {
        dialogVisible.value = false;
        getRoleList();
      }
    }

    const settingRoles = (data: any): void => {
      (addStaffCom.value as AddStaffSetup).handleOpen(data);
    };

    const addRoles = (): void => {
      dialogVisible.value = true;
    };

    return {
      roleName,
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      addStaffCom,
      settingRoles,
      selectedDate,
      statusList,
      addRoles,
      dialogVisible,
      addRole,
      getRoleList,
      handleDeleteSysRoleByBatchId,
      handleSelectionChange
    };
  },
});
</script>
<style lang='scss' scoped>
.filter-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .el-form-item {
    margin-right: 20px;
  }
}

.add-roles-box {
  >li {
    display: flex;
    align-items: center;

    >span {
      width: 90px;
    }
  }

  .botom-btn-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>