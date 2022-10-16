<template>
  <div class="bugManagement">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <div class="formBox">
        <div class="left">
          <span class="label">车牌号</span>
          <ui-input
            placeholder="输入车牌号"
            class="input"
            style="margin-right: 20px"
            icon="icon-a-101"
            @keydown.enter="searchList"
            @iconClick="searchList"
            v-model="formData.plateNumber"
          />
          <!-- <ui-select
            class="selectBox"
            v-model="formData.enableStatus"
            @select="searchList"
          >
            <ui-select-option value="" label="全部"></ui-select-option>
            <ui-select-option value="1" label="启用"></ui-select-option>
            <ui-select-option value="2" label="维护"></ui-select-option>
          </ui-select> -->
          <span class="label">出发类型</span>
          <ui-select
            class="selectBox"
            v-model="formData.type"
            @change="searchList"
          >
            <ui-select-option value="" label="全部"></ui-select-option>
            <ui-select-option value="0" label="放学"></ui-select-option>
            <ui-select-option value="1" label="上学"></ui-select-option>
          </ui-select>
          <span class="label">运行状态</span>
          <ui-select
            class="selectBox"
            v-model="formData.status"
            @change="searchList"
          >
            <ui-select-option value="" label="全部"></ui-select-option>
            <ui-select-option value="3" label="行驶中"></ui-select-option>
            <ui-select-option value="1" label="已结束"></ui-select-option>
          </ui-select>
          <ui-input
            placeholder="输入司机或管理员姓名"
            class="input"
            icon="icon-a-101"
            @keydown.enter="searchList"
            @iconClick="searchList"
            v-model="formData.userName"
          />
          <ui-date-picker
            style="margin-left: 20px"
            v-model="times"
            type="daterange"
            @change="dateChange"
            :start-placeholder="dayjs().format('YYYY-MM-DD')"
            :end-placeholder="dayjs().format('YYYY-MM-DD')"
          />
        </div>
        <div class="right"></div>
      </div>
      <ui-table v-loadings="loading" :data="list" style="margin-top: 20px">
        <ui-table-column prop="plateNumber" label="车牌号"></ui-table-column>
        <ui-table-column label="校车编号" prop="busNo"></ui-table-column>
        <ui-table-column label="核载人数" prop="maxPerson"></ui-table-column>
        <ui-table-column label="实载人数" prop="actualNums"></ui-table-column>
        <ui-table-column label="司机" prop="driverName"></ui-table-column>
        <ui-table-column label="跟车老师" prop="userName"></ui-table-column>
        <ui-table-column label="出发类型" prop="type">
          <template #default="{ row }">
            <ui-tag type="text" style="color: #ff9900" v-if="+row.type === 0">
              放学
            </ui-tag>
            <ui-tag type="text" v-if="+row.type === 1">上学</ui-tag>
          </template>
        </ui-table-column>
        <ui-table-column label="行程名称" prop="tripName"></ui-table-column>
        <ui-table-column label="开始时间" prop="startTime"></ui-table-column>
        <ui-table-column label="结束时间" prop="endTime"></ui-table-column>
        <ui-table-column label="行程时间" prop="rideTime"></ui-table-column>
        <ui-table-column label="运行状态">
          <template #default="{ row }">
            <ui-tag v-if="+row.enableStatus === 3">行驶中</ui-tag>
            <ui-tag type="success" v-if="+row.enableStatus === 1">
              已结束
            </ui-tag>
          </template>
        </ui-table-column>
        <ui-table-column label="行程备注" prop="remark"></ui-table-column>
        <ui-table-column label="操作">
          <template #default="{}">
            <ui-button type="text-primary" style="margin-right: 10px">
              详情
            </ui-button>
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
  <CarFollowDetails />
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { PageForm } from "@/api/interface";
import dayjs from "dayjs";
import CarFollowDetails from "./components/carFollowDetails.vue";
import { queryBusRecord } from "@/api/bus";
import { QueryCarFollowParams } from "./interface";
const route = useRoute();

const pageData = reactive<PageForm>({
  pageNo: 1,
  pageSize: 20,
  totalNum: 0,
});
const times = ref([]);
const formData = reactive<QueryCarFollowParams>({
  plateNumber: "",
  type: "",
  status: "",
  userName: "",
  startTime: "",
  endTime: "",
});

const list = ref([]);

const searchList = () => {
  pageData.pageNo = 1;
  queryList();
};

const loading = ref(false);

const queryList = () => {
  loading.value = true;
  queryBusRecord(Object.assign(pageData, formData))
    .then((res) => {
      if (+res.code === 0) {
        list.value = res.data.list;
        pageData.pageNo = res.data.page.pageNo;
        pageData.pageSize = res.data.page.pageSize;
        pageData.totalNum = res.data.page.totalNum;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
queryList();

const dateChange = () => {
  console.log(times.value);
  if (times.value.length === 2) {
    formData.startTime = dayjs(times.value[0]).format("YYYY-MM-DD");
    formData.endTime = dayjs(times.value[1]).format("YYYY-MM-DD");
  } else {
    formData.startTime = "";
    formData.endTime = "";
  }
  searchList();
};

// const makeRange = (start: number, end: number) => {
//   const result = [];
//   for (let i = start; i <= end; i++) {
//     result.push(i);
//   }
//   return result;
// };

const handleSizeChange = (size: number) => {
  pageData.pageSize = size;
  queryList();
};

const handleCurrentChange = (page: number) => {
  pageData.pageNo = page;
  queryList();
};
</script>

<style scoped lang="less">
@import "index";
</style>
