<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="角色名称：">
          <el-input v-model="QueryObj.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="success" @click="show = true">新增角色</el-button>
        <el-button type="success" @click="deleteRoles">删除选中角色</el-button>
      </div>
      <el-table
        :data="tableList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="setting(row)">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="totalNum"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <roleList ref="roleListCom"></roleList>
    <el-dialog v-model="show" title="添加角色">
      <el-form>
        <el-form-item label="角色名称" :label-width="150">
          <el-input v-model="addName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="addNewName">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import { QueryObj, TableListItem } from "./data";
import { statusList } from "./static";
import { KeyValue } from "@/common/types";
import roleList from "./components/roleList.vue";
import { ElMessage } from "element-plus";
import { userList, updateName, delRoles } from "./api";
interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getList: () => Promise<void>;
  setting: (any) => void;
  handleCurrentChange: (number) => void;
  applyRefundCom: Ref<unknown>;
  roleListCom: Ref<unknown>;
  // selectedDate: Ref<Date[] | string>;
  selectedDate: Ref<any>;
  statusList: KeyValue[];
  addNewName: () => void;
  show: Ref<boolean>;
  addName: Ref<string>;
  handleSelectionChange: (res) => void;
  deleteRoles: () => void;
}

export default defineComponent({
  name: "",
  components: {
    roleList,
  },
  setup(): Setup {
    const QueryObj = reactive<QueryObj>({
      name: "",
    });
    const addName = ref("");
    const selectedDate = ref([] as Date[] | "");
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const applyRefundCom = ref<unknown>(null);
    const roleListCom = ref<unknown>(null);
    const show = ref<boolean>(false);
    async function getList(): Promise<void> {
      const { code, data } = await userList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            ...QueryObj,
          }
        )
      );
      if (+code === 1000) {
        tableList.value = data.list;
        totalNum.value = data.total;
      }
    }
    getList();
    const addNewName = async () => {
      let params = {
        name: addName.value,
      };
      const { code } = await updateName(params);
      if (+code === 1000) {
        ElMessage.success("保存成功");
        show.value = false;
        getList();
      }
    };
    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getList();
    };
    // 翻页
    const setting = (data: any): void => {
      (roleListCom.value as any).handleOpen(data);
    };
    const applyRefund = (): void => {
      (applyRefundCom.value as any).handleOpen(1);
    };

    let willDelRolesList = [];
    function handleSelectionChange(res: any) {
      willDelRolesList = res.map((item) => item.id);
    }

    async function deleteRoles() {
      const { code } = await delRoles(willDelRolesList);
      if (+code === 1000) {
        getList();
        ElMessage.success("删除成功");
      }
    }

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getList,
      handleCurrentChange,
      applyRefundCom,
      selectedDate,
      statusList,
      setting,
      roleListCom,
      show,
      addName,
      addNewName,
      handleSelectionChange,
      deleteRoles,
    };
  },
});
</script>
<style lang="scss" scoped>
.filter-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-form-item {
    margin-right: 20px;
  }
}
</style>
