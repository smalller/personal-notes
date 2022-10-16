<template>
  <div class="tripManagement">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <div class="formBox">
        <div class="left">
          <ui-input
            placeholder="输入行程名称"
            class="input"
            icon="icon-a-101"
            @keydown.enter="searchTrip"
            @iconClick="searchTrip"
            v-model="formData.name"
          />
        </div>
        <div class="right">
          <ui-button
            :disabled="selectTrips.length === 0"
            @click="delSelectTrip"
          >
            删除
          </ui-button>
          <ui-button
            icon="icon-a-81"
            type="primary"
            @click="openAddTrip"
            style="margin-left: 16px"
          >
            新增行程
          </ui-button>
        </div>
      </div>
      <ui-table
        checkbox
        :data="list"
        style="margin-top: 20px"
        @selectChange="selectTrip"
      >
        <ui-table-column prop="name" label="行程名称"></ui-table-column>
        <ui-table-column label="行程说明" prop="description"></ui-table-column>
        <ui-table-column label="行程学生人数" prop="stuNums"></ui-table-column>
        <ui-table-column label="操作" width="110">
          <template #default="{ row }">
            <ui-button
              type="text-primary"
              style="margin-right: 10px"
              @click="openStudentList(row)"
            >
              学生列表
            </ui-button>
            <ui-button
              type="text-primary"
              style="margin-right: 10px"
              @click="openEditTrip(row)"
            >
              编辑
            </ui-button>
          </template>
        </ui-table-column>
      </ui-table>
      <div class="pageBox">
        <ui-pagination
          style="margin-top: 20px"
          @size-change="pageSizeChange"
          @current-change="pageChange"
          :current-page="pageForm.pageNo"
          :page-size="pageForm.pageSize"
          :total="pageForm.totalNum"
        ></ui-pagination>
      </div>
    </ui-card>
  </div>
  <student-list ref="studentList" @close="searchTrip" />
  <add-or-edit-trip ref="addOrEditTrip" @success="searchTrip" />
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { PageForm } from "@/api/interface";
import { deleteTripList, queryTripList } from "@/api/bus";
import { QueryTripListParams } from "@/views/bus/tripManagement/interface";
import StudentList from "@/views/bus/tripManagement/components/studentList.vue";
import AddOrEditTrip from "@/views/bus/tripManagement/components/addOrEditTrip.vue";
import { ElMessage } from "element-plus";

const route = useRoute();

const formData = reactive<QueryTripListParams>({
  name: "",
});
const pageForm = reactive<PageForm>({
  pageNo: 1,
  pageSize: 20,
  totalNum: 0,
});

const pageChange = (page: number) => {
  pageForm.pageNo = page;
  getTripList();
};
const pageSizeChange = (pageSize: number) => {
  pageForm.pageSize = pageSize;
  getTripList();
};
const searchTrip = () => {
  pageForm.pageNo = 1;
  getTripList();
};
const list = ref([]);
const getTripList = () => {
  queryTripList(Object.assign(pageForm, formData)).then((res) => {
    if (+res.code === 0) {
      list.value = res.data.list;
      pageForm.pageNo = res.data.page.pageNo;
      pageForm.pageSize = res.data.page.pageSize;
      pageForm.totalNum = res.data.page.totalNum;
    }
  });
};
getTripList();

const studentList = ref(null);
const openStudentList = (row: any) => {
  (studentList.value as any).open(row);
};

const addOrEditTrip = ref(null);
const openAddTrip = () => {
  (addOrEditTrip.value as any).open();
};
const openEditTrip = (row: any) => {
  (addOrEditTrip.value as any).open(row);
};

const selectTrips = ref<string[]>([]);
const selectTrip = (res: any[]) => {
  selectTrips.value = res.map((item) => item.id);
};

const delSelectTrip = () => {
  deleteTripList(selectTrips.value).then((res) => {
    if (+res.code === 0) {
      searchTrip();
      ElMessage.success("删除行程成功");
      selectTrips.value = [];
    } else {
      ElMessage.warning(res.msg);
    }
  });
};
</script>

<style lang="less">
.tripManagement {
  //background: #0ec2ee;
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    padding-bottom: 20px;
  }
  .formBox {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    .label {
      color: #999999;
      font-size: 14px;
      margin-right: 6px;
    }
    .selectBox {
      width: 140px;
      margin-right: 16px;
    }
    .input {
      width: 200px;
    }
  }
}
</style>
