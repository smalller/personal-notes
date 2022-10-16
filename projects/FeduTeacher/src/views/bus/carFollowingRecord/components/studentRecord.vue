<template>
  <ui-table>
    <ui-table-column label="学生姓名"></ui-table-column>
    <ui-table-column label="电话"></ui-table-column>
    <ui-table-column label="班级"></ui-table-column>
    <ui-table-column label="乘车状态"></ui-table-column>
    <ui-table-column label="备注"></ui-table-column>
    <ui-table-column label="操作">
      <template #default="{ row }">
        <ui-button
          type="text"
          style="color: #4fa8f9"
          @click="showDetails(row.id)"
          >详情</ui-button
        >
      </template>
    </ui-table-column>
    <template #details="{ row }">
      <div class="itemDetails" v-if="activeId === row.id"></div>
    </template>
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
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { PageForm } from "@/api/interface";

const pageData = reactive<PageForm>({
  pageNo: 1,
  pageSize: 20,
  totalNum: 0,
});
const activeId = ref("");
const list = ref([]);

const showDetails = (id: string) => {
  activeId.value = activeId.value === id ? "" : id;
};

const handleSizeChange = (size: number) => {
  pageData.pageSize = size;
};

const handleCurrentChange = (page: number) => {
  pageData.pageNo = page;
};
</script>

<style scoped></style>
