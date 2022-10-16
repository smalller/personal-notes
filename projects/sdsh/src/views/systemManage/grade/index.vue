<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="年级名称：">
          <el-input v-model="QueryObj.gradeName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="success" @click="show = true">新增年级</el-button>
        <el-button type="success" @click="handleDownloadTem">下载模板</el-button>
        <el-button type="success" @click="importStudent">数据导入</el-button>
      </div>
      <el-table :data="tableList" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="gradeName" label="年级" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="handleUpdateGrade(row)">修改</el-button>
            <el-button type="text" @click="deleteGrade(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <roleList ref="roleListCom"></roleList>
    <el-dialog v-model="show" title="新增年级">
      <el-form>
        <el-form-item label="年级名称" :label-width="150">
          <el-input v-model="gradeName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="handleSureEdit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import { QueryObj, TableListItem } from "./data";
import { statusList } from "./static";
import roleList from "./components/roleList.vue";
import { ElMessage } from "element-plus";
import { gradeList, delGrade, addGrade, updateGrade, importGrade } from "./api";
import { exportFile } from '@/common/api'

export default defineComponent({
  name: "",
  components: {
    roleList,
  },
  setup() {
    const QueryObj = reactive<any>({
      gradeName: "",
    });
    const gradeName = ref("");
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const applyRefundCom = ref<unknown>(null);
    const roleListCom = ref<unknown>(null);
    const show = ref<boolean>(false);
    const flag = ref(1)
    const targetId = ref(-1)

    async function getList(): Promise<void> {
      const { code, data } = await gradeList(
        Object.assign(
          {},
          {
            ...QueryObj,
          }
        )
      );
      if (+code === 1000) {
        tableList.value = data;
      }
    }
    getList();

    async function deleteGrade(res: any) {
      const { code } = await delGrade(res.gradeId);
      if (+code === 1000) {
        getList();
        ElMessage.success("删除成功");
      }
    }

    function initData() {
      getList();
      show.value = false
      ElMessage.success("操作成功");
    }

    async function handleSureEdit() {
      if (flag.value === 1) {
        const { code } = await addGrade(gradeName.value);
        if (+code === 1000) {
          initData()
        }
      } else {
        const { code } = await updateGrade(gradeName.value, targetId.value);
        if (+code === 1000) {
          initData()
        }
      }

    }

    function handleUpdateGrade(res: any) {
      flag.value = 2
      targetId.value = res.gradeId
      gradeName.value = res.gradeName
      show.value = true
    }

    // 下载年级模板
    async function handleDownloadTem() {
      await exportFile(`/pay-merchant/template/downGradeTemp`, {
      }, '年级模板')
    }

    // 导入年级
    function importStudent() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = ".xls";
      input.onchange = async () => {
        if (input.files) {
          const file = input.files[0];
          const { code } = await importGrade(file)
          if (+code === 1000) {
            ElMessage.success('导入成功')
            getList();
          }
        }
      }
      input.click();
    }

    return {
      QueryObj,
      tableList,
      getList,
      applyRefundCom,
      statusList,
      roleListCom,
      show,
      gradeName,
      deleteGrade,
      handleSureEdit,
      handleUpdateGrade,
      handleDownloadTem,
      importStudent
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
