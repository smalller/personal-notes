<template>
  <el-drawer custom-class="projectInfo" v-model="visible">
    <el-descriptions title="" border :column="1" direction="horizontal">
      <el-descriptions-item label="项目名称">{{ projectInfo.projectName }}</el-descriptions-item>
      <el-descriptions-item label="名单对象">{{ projectInfo.codeType }}</el-descriptions-item>
      <el-descriptions-item label="名单列表">{{ projectInfo.relationIdsStr }}</el-descriptions-item>
      <el-descriptions-item label="金额选项">
        <el-table :data="projectInfo.nameProjectItemDtos">
          <el-table-column label="收费项目名称" prop="itemName" />
          <el-table-column label="收费方式" prop="chargeType" />
          <el-table-column label="收费金额" prop="chargeMoney" />
          <el-table-column label="是否必交" prop="required" />
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item label="收费时间">{{ dayjs(projectInfo.beginTime).format('YYYY-MM-DD HH:mm:ss') }} -
        {{ dayjs(projectInfo.endTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">{{ projectInfo.remark }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>

</template>

<script lang="ts" setup>

import dayjs from "dayjs";
import { defineExpose, ref } from "vue";
import { queryProjectInfo } from "@/views/incomeList/list/api";

const visible = ref(false);
const projectInfo = ref({
  itemList: []
})

const open = (id: number): void => {
  visible.value = true;
  getInfo(id);
}

const close = (): void => {
  visible.value = false;
}

const getInfo = (id: number) => {
  queryProjectInfo(id).then(res => {
    if (+res.code === 1000) {
      projectInfo.value = res.data;
    }
  })
}
// getInfo(17)
defineExpose({
  open
})

</script>

<style lang="scss">
.projectInfo {
  width: 50vw !important;
}
</style>
