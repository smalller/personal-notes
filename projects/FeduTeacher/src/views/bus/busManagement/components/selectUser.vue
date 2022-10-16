<template>
  <ui-modal
    v-model:visible="visible"
    :title="title"
    width="750"
    @close="close"
    :buttonShow="false"
  >
    <div class="searchBox">
      <ui-input
        icon="icon-a-101"
        style="width: 200px"
        v-model="userName"
        @keydown.enter="searchUser"
        @iconClick="searchUser"
      />
    </div>

    <div
      class="tableBox scroll"
      style="
        height: 400px;
        overflow-y: auto;
        margin-top: 15px;
        margin-bottom: 20px;
      "
    >
      <ui-table :data="userList" v-loadings="loading">
        <ui-table-column
          label="员工姓名"
          prop="name"
          width="150"
        ></ui-table-column>
        <ui-table-column
          label="电话"
          prop="mobile"
          width="120"
        ></ui-table-column>
        <ui-table-column
          label="称谓"
          prop="title"
          width="120"
        ></ui-table-column>
        <ui-table-column label="操作">
          <template #default="{ row }">
            <ui-button type="primary" @click="selectUser(row)">选择</ui-button>
          </template>
        </ui-table-column>
      </ui-table>
    </div>

    <template #tips>
      <div style="width: 570px">
        <ui-pagination
          style="margin-top: 20px"
          :pagerCount="3"
          @size-change="pageSizeChange"
          @current-change="pageChange"
          :current-page="pageForm.pageNo"
          :page-size="pageForm.pageSize"
          :total="pageForm.totalNum"
        ></ui-pagination>
      </div>
    </template>
  </ui-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineExpose, defineProps, reactive, ref } from "vue";
import { getEmpList } from "@/api/bus";
import { PageForm } from "@/api/interface";

const props = defineProps({
  title: String,
});

const emit = defineEmits(["select"]);

const pageForm = reactive<PageForm>({
  pageNo: 1,
  pageSize: 15,
  totalNum: 0,
});

const userName = ref("");

const visible = ref(false);
const userList = ref<any[]>([]);
let resolves: any;

const open = (list: any[]) =>
  new Promise((resolve) => {
    visible.value = true;
    userList.value = list;
    resolves = resolve;
    getUserList();
  });
const close = () => {
  visible.value = false;
  reset();
};
const reset = () => {
  pageForm.pageNo = 1;
  userName.value = "";
};

const searchUser = () => {
  pageForm.pageNo = 1;
  getUserList();
};

const pageSizeChange = (size: number) => {
  pageForm.pageSize = size;
  getUserList();
};

const pageChange = (page: number) => {
  pageForm.pageNo = page;
  getUserList();
};

const loading = ref(false);
const getUserList = () => {
  loading.value = true;
  getEmpList(
    Object.assign(pageForm, {
      name: userName.value,
    })
  )
    .then((res) => {
      if (+res.code === 0) {
        userList.value = res.data.list;
        pageForm.pageNo = res.data.page.pageNo;
        pageForm.pageSize = res.data.page.pageSize;
        pageForm.totalNum = res.data.page.totalNum;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const selectUser = (row: any) => {
  // emit("select", row);
  close();
  resolves(row);
};

defineExpose({
  open,
});
</script>

<style scoped></style>
