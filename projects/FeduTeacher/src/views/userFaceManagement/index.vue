<template>
  <div class="userFaceManagement">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <ui-tab
        class="test"
        v-model:index="tableIndex"
        :list="['家长', '老师']"
      ></ui-tab>
      <div class="formBox" style="margin-top: 20px">
        <div class="left">
          <span class="label" v-if="tableIndex === 0">年级</span>
          <ui-select
            v-if="tableIndex === 0"
            class="selectBox"
            @change="gradeChange"
            v-model="formData.gradeLabel"
          >
            <ui-select-option value="" label="全部"></ui-select-option>
            <ui-select-option
              v-for="item in gradeList"
              :key="item.codeInfoName"
              :value="item.codeInfoName"
              :label="item.codeInfoName"
            ></ui-select-option>
          </ui-select>

          <span class="label" v-if="tableIndex === 1">称谓</span>
          <ui-select
            v-if="tableIndex === 1"
            class="selectBox"
            @change="searchList"
            v-model="formData.title"
          >
            <ui-select-option value="" label="全部"></ui-select-option>
            <ui-select-option
              v-for="item in titleList"
              :key="item.codeInfoName"
              :value="item.codeInfoName"
              :label="item.codeInfoName"
            ></ui-select-option>
          </ui-select>

          <span class="label">班级</span>
          <ui-select
            @change="searchList"
            class="selectBox"
            v-model="formData.clazzId"
          >
            <ui-select-option value="" label="全部"></ui-select-option>
            <ui-select-option
              v-for="item in classList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></ui-select-option>
          </ui-select>
          <ui-input
            placeholder="输入姓名"
            class="input"
            style="margin-right: 20px"
            icon="icon-a-101"
            @keydown.enter="searchList"
            @iconClick="searchList"
            v-model="formData.name"
          />
        </div>
      </div>
      <ui-table
        v-loadings="loading"
        v-if="tableIndex === 0"
        :data="list"
        style="margin-top: 15px"
      >
        <ui-table-column label="年级" prop="gradeLabel"></ui-table-column>
        <ui-table-column label="班级" prop="clazzName"></ui-table-column>
        <ui-table-column label="家长姓名" prop="userName"></ui-table-column>
        <ui-table-column label="角色" prop="">
          <template #default="{ row }">
            <span>{{ row.familyRels.describe }}</span>
          </template>
        </ui-table-column>
        <ui-table-column label="学生姓名" prop="studentName"></ui-table-column>
        <ui-table-column label="录入情况" prop="faceStatus">
          <template #default="{ row }">
            <ui-tag v-if="+row.faceStatus === 0">未录入</ui-tag>
            <ui-tag type="success" v-if="+row.faceStatus === 1">已录入</ui-tag>
          </template>
        </ui-table-column>
        <ui-table-column label="修改时间" prop="entryTime"></ui-table-column>
        <ui-table-column label="操作" prop="" width="120">
          <template #default="{ row }">
            <ui-button
              :disabled="row.faceStatus === 0"
              type="text-primary"
              @click="openImg(row.faceImg)"
            >
              详情
            </ui-button>
          </template>
        </ui-table-column>
      </ui-table>
      <ui-table
        v-loadings="loading"
        v-if="tableIndex === 1"
        :data="list"
        style="margin-top: 15px"
      >
        <ui-table-column label="班级" prop="">
          <template #default="{ row }">
            <span
              v-for="(item, index) in getClassName(row.clazzes)"
              :key="index"
              v-show="index < 3"
            >
              {{ item }},
            </span>
            <span v-show="getClassName(row.clazzes).length > 2">...</span>
          </template>
        </ui-table-column>
        <ui-table-column label="老师姓名" prop="teacherName"></ui-table-column>
        <ui-table-column label="称谓" prop="title"></ui-table-column>
        <ui-table-column label="录入情况" prop="">
          <template #default="{ row }">
            <ui-tag v-if="+row.faceStatus === 0">未录入</ui-tag>
            <ui-tag type="success" v-if="+row.faceStatus === 1">已录入</ui-tag>
          </template></ui-table-column
        >
        <ui-table-column label="修改时间" prop="entryTime"></ui-table-column>
        <ui-table-column label="操作" prop="" width="120">
          <template #default="{ row }">
            <ui-button
              type="text-primary"
              :disabled="row.faceStatus === 0"
              @click="openImg(row.faceImg)"
            >
              详情
            </ui-button>
          </template>
        </ui-table-column>
      </ui-table>
      <ui-pagination
        :total="pageData.totalNum"
        :currentPage="pageData.pageNo"
        :pageSize="pageData.pageSize"
        @handleCurrentChange="pageChange"
        @handleSizeChange="pageSizeChange"
      >
      </ui-pagination>
    </ui-card>
  </div>
  <ui-modal
    v-model:visible="imgVisibility"
    @close="closeImg"
    title="人脸详情"
    :showClose="false"
    :tips="false"
    :buttonShow="false"
  >
    <img :src="activeImg" style="width: 100%" alt="" />
  </ui-modal>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { computed, reactive, ref, watch } from "vue";
import { pageForm } from "@/api/interface";
import { useStore } from "vuex";
import {
  queryEmpFaces,
  QueryFacesParams,
  queryUserFaces,
} from "@/api/userFaceManagement";
const $store = useStore();

const route = useRoute();

const tableIndex = ref(0);

const imgVisibility = ref(false);
const activeImg = ref("");

const openImg = (img: string) => {
  imgVisibility.value = true;
  activeImg.value = img;
};
const closeImg = () => {
  imgVisibility.value = false;
  activeImg.value = "";
};

watch(tableIndex, () => {
  list.value = [];
  pageData.pageNo = 1;
  formData.gradeLabel = "";
  formData.clazzId = "";
  formData.name = "";
  formData.title = "";
  getList();
});

const pageData = reactive<pageForm>({
  pageNo: 1,
  pageSize: 20,
  totalNum: 0,
});

const formData = reactive<QueryFacesParams>({
  gradeLabel: "",
  clazzId: "",
  name: "",
  title: "",
});

const list = ref([]);
const loading = ref(false);

//查询家长人脸
const getUserFaces = () => {
  loading.value = true;
  queryUserFaces(Object.assign(pageData, formData))
    .then((res) => {
      if (+res.code === 0) {
        list.value = res.data.list;
        pageData.totalNum = res.data.page.totalNum;
        loading.value = false;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

//查询教师人脸
const getEmpFaces = () => {
  queryEmpFaces(Object.assign(pageData, formData))
    .then((res) => {
      if (+res.code === 0) {
        list.value = res.data.list;
        pageData.totalNum = res.data.page.totalNum;
        loading.value = false;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const getList = () => {
  switch (tableIndex.value) {
    case 0:
      getUserFaces();
      break;
    case 1:
      getEmpFaces();
      break;
    default:
      break;
  }
};
getList();

//初始化班级数据
$store.dispatch("getClassList");
$store.dispatch("getGradeList");

const titleList = computed(() => $store.state.commonData.titleList); // 称谓列表
const gradeList = computed(() => $store.state.commonData.gradeList); // 年级列表
const classList = computed(() => {
  if (!formData.gradeLabel) {
    return $store.state.commonData.classList;
  } else {
    const grade = $store.state.commonData.gradeList.find(
      (item: any) => item.codeInfoName === formData.gradeLabel
    );
    return $store.state.commonData.classList.filter(
      (item: any) => +item.grade === +grade.codeInfoValue
    );
  }
});

const searchList = () => {
  pageData.pageNo = 1;
  getList();
};

const pageChange = (page: number) => {
  pageData.pageNo = page;
  getList();
};
const pageSizeChange = (size: number) => {
  pageData.pageSize = size;
  getList();
};

const getClassName = (classList: any[]) => {
  if (Array.isArray(classList)) {
    return classList.map((item: any) => item.clazzName);
  } else {
    return [];
  }
};

const gradeChange = () => {
  formData.clazzId = "";
  searchList();
};
</script>

<style scoped lang="less">
.userFaceManagement {
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
