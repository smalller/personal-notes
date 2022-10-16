<template>
  <div class="bugManagement">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <div class="formBox">
        <div class="left">
          <span class="label">状态</span>
          <ui-select
            class="selectBox"
            v-model="formData.status"
            @change="searchBus"
          >
            <ui-select-option value="" label="全部"></ui-select-option>
            <ui-select-option value="1" label="启用"></ui-select-option>
            <ui-select-option value="2" label="维护"></ui-select-option>
          </ui-select>
          <ui-input
            placeholder="输入司机或管理员姓名"
            class="input"
            icon="icon-a-101"
            @keydown.enter="searchBus"
            @iconClick="searchBus"
            v-model="formData.driverName"
          />
        </div>
        <div class="right">
          <!--          <ui-button>删除</ui-button>-->
          <ui-button
            @click="openAddBUs"
            icon="icon-a-81"
            type="primary"
            style="margin-left: 16px"
          >
            新增车辆</ui-button
          >
        </div>
      </div>
      <ui-table :data="list" style="margin-top: 20px">
        <ui-table-column prop="plateNumber" label="车牌号"></ui-table-column>
        <ui-table-column label="校车编号" prop="busNo"></ui-table-column>
        <ui-table-column label="核载人数" prop="maxPerson"></ui-table-column>
        <ui-table-column label="司机" prop="driverName"></ui-table-column>
        <ui-table-column label="司机电话" prop="driverMobile"></ui-table-column>
        <ui-table-column label="管理员" prop="adminName"></ui-table-column>
        <ui-table-column
          label="管理员电话"
          prop="adminMobile"
        ></ui-table-column>
        <ui-table-column label="车辆状态">
          <template #default="{ row }">
            <ui-tag v-if="+row.enableStatus === 1">正常</ui-tag>
            <ui-tag v-if="+row.enableStatus === 2">维护中</ui-tag>
            <ui-tag v-if="+row.enableStatus === 9">已删除</ui-tag>
          </template>
        </ui-table-column>
        <ui-table-column label="操作">
          <template #default="{ row }">
            <ui-button
              type="text-primary"
              style="margin-right: 10px"
              @click="openEditBUs(row)"
              >编辑</ui-button
            >
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              title="确定删除车辆吗？"
              @confirm="deleteBug(row)"
            >
              <template #reference>
                <ui-button type="text-info"> 删除 </ui-button>
              </template>
            </el-popconfirm>
          </template>
        </ui-table-column>
      </ui-table>
      <div class="pageBox">
        <ui-pagination
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.pageNo"
          :page-size="pageData.pageSize"
          :total="pageData.totalNum"
        ></ui-pagination>
      </div>
    </ui-card>
  </div>
  <add-or-edit-bus ref="addOrEditBus" @success="searchBus" />
  <!--  <bus-map />-->
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { PageForm } from "@/api/interface";
import AddOrEditBus from "@/views/bus/busManagement/components/addOrEditBus.vue";
import { delBus, getBusList } from "@/api/bus";
import { ElMessage } from "element-plus";
const route = useRoute();

const pageData = reactive<PageForm>({
  pageNo: 1,
  pageSize: 20,
  totalNum: 0,
});
const formData = reactive({
  status: "",
  driverName: "",
});

const list = ref([]);

const searchBus = () => {
  pageData.pageNo = 1;
  queryBusList();
};

const queryBusList = () => {
  getBusList(Object.assign(pageData, formData)).then((res) => {
    if (+res.code === 0) {
      list.value = res.data.list;
      pageData.pageNo = res.data.page.pageNo;
      pageData.pageSize = res.data.page.pageSize;
      pageData.totalNum = res.data.page.totalNum;
    }
  });
};
queryBusList();

const deleteBug = (row: any) => {
  delBus(row.id).then((res) => {
    if (+res.code === 0) {
      ElMessage.success("删除成功");
      queryBusList();
    } else {
      // ElMessage.warning(res.msg);
    }
  });
};

const handleSizeChange = (size: number) => {
  pageData.pageSize = size;
  queryBusList();
};

const handleCurrentChange = (page: number) => {
  pageData.pageNo = page;
  queryBusList();
};

const addOrEditBus = ref(null);
const openAddBUs = () => {
  (addOrEditBus.value as any).open();
};
const openEditBUs = (row: any) => {
  (addOrEditBus.value as any).open(row);
};
</script>

<style scoped lang="less">
@import "index";
</style>
