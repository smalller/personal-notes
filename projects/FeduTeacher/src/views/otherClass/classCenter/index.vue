<template>
  <div class="schoolEnrollment">
    <classShow
      :id="selectId"
      :info="chooseCourse"
      @close="closePre"
      :type="tableIndex"
      :show="modeStatus.showView"
      v-if="subjectData.length"
    ></classShow>
    <ui-modal
      v-model:visible="modeStatus.del"
      @ok="handleSureDelete"
      :title="`确定要删除《${chooseCourse.courseName}》课程吗？`"
      width="420"
      style="z-index: 9999"
      :tips="false"
    >
      <div style="color: #f56060">点击“确定”将删除本课程，请慎重！</div>
    </ui-modal>
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="school-table">
      <ui-card>
        <ui-tab
          v-model:index="tableIndex"
          style="width: 15%"
          @click="getTableIndex"
          :list="['课程资源', '自定义课程']"
        ></ui-tab>
        <div class="select-list" v-if="tableIndex === 0">
          <div>
            <div class="select-title">
              <span>大类：</span>
              <ul class="select-name">
                <li
                  v-for="(item, index) in subjectList"
                  :key="index"
                  @click="selectType(item, index)"
                  :class="+subjectIndex === index ? 'is-select' : ''"
                >
                  {{ item.subjectName }}
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div class="select-title">
              <span>类别：</span>
              <ul class="select-name">
                <li
                  v-for="(item, index) in typeList"
                  :key="index"
                  @click="selectType(item, index)"
                  :class="+typeIndex === index ? 'is-select' : ''"
                >
                  {{ item.subjectName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="fromBox">
          <div>
            <div class="from-item">
              <ui-input
                maxlength="40"
                style="width: 240px"
                v-model="searchInfo"
                placeholder="输入课程名称"
                icon="icon-a-101"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
              ></ui-input>
            </div>
            <div class="from-item" style="float: right" v-if="tableIndex === 1">
              <ui-button
                type="primary"
                icon="icon-a-81"
                class="button"
                @click="goToAdd"
                >新增课程</ui-button
              >
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <div class="class-show">
            <div
              class="class-box"
              v-for="(item, index) in subjectData"
              :key="index"
            >
              <div>
                <img class="show-boxs" :src="item.pic" />
                <div class="action-box">
                  <ui-button class="action-button" @click="handleEdit(item)"
                    >选择课程</ui-button
                  >
                  <ui-button class="action-buttons" @click="showClass(item)"
                    >课程详情</ui-button
                  >
                </div>
              </div>
              <span>{{ item.courseName }}</span>
              <div style="width: 100%; display: flex">
                <p>课节 {{ item.sectionNums }}</p>
                <div class="action-edit" v-if="tableIndex === 1">
                  <ui-button
                    class="button"
                    type="text"
                    style="color: #4fa8f9; margin-right: 8px"
                    @click="goToEdit(item)"
                    >编辑</ui-button
                  >
                  <ui-button
                    class="button"
                    style="color: #bfbfbf"
                    type="text"
                    @click="delClass(item)"
                    >删除</ui-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <span>已经到底，没有更多内容</span>
        </div>
      </ui-card>
      <editCoursePlan ref="editCoursePlanCom"></editCoursePlan>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from "vue-router";
import { defineComponent, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { throttle } from "@/utils/common";
import classShow from "./components/classShow.vue";
import {
  getSubjectList,
  getSubjectInfo,
  delSubject,
} from "@/api/subjectManage";
import editCoursePlan from "@/components/EditCoursePlan.vue";
import Message from "@/themes/message";

interface choose {
  id: string;
  courseName: string;
}
export default defineComponent({
  components: {
    classShow,
    editCoursePlan,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const $store = useStore();
    const tableIndex = ref(0);
    const schoolInfo = sessionStorage.getItem("schoolId");
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(18); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); //检索信息
    const selectId = ref(""); //选择的招生ID
    const selectInfo = ref({}); //选择的数据
    const checkInfo = ref([] as Array<any>);
    const editCoursePlanCom = ref(null);
    const planId = route.query.id;
    //页面状态控制
    const modeStatus = ref({
      showView: false,
      addClassList: false,
      editClass: false,
      showManage: false,
      del: false,
    });
    const chooseCourse = ref({} as choose);
    //预览页面
    const showClass = (item: any) => {
      if (item) {
        modeStatus.value.showView = true;
        chooseCourse.value = { ...item };
        selectId.value = item.id;
      }
    };
    const delClass = (item: any) => {
      if (item) {
        chooseCourse.value = Object.assign({}, item);
        modeStatus.value.del = true;
      }
    };
    async function handleSureDelete() {
      if (chooseCourse.value) {
        let { code } = await delSubject(chooseCourse.value.id);
        if (code === 0) {
          Message.success("课程删除成功!");
          subjectData.value = [];
          getSubjectData();
          modeStatus.value.del = false;
        }
      }
    }
    const loading = ref(true);
    const studentList = ref([]);
    let enrollmentList = ref([] as Array<any>);
    //获取选择数据
    const chooseClass = (data: any) => {
      if (data) {
        checkInfo.value = [...data];
      }
    };
    //切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      // getSubjectData();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      // getSubjectData();
    };
    const handleSearchInfo = (): void => {
      subjectData.value = [];
      getSubjectData();
    };
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getSubjectData();
        }, 500);
      }
    );
    const closePre = () => {
      modeStatus.value.showView = false;
    };
    const subjectList = ref([] as any); //类型
    const typeList = ref([] as any); //类别
    const typeInfoList = ref([] as any); //类别
    const subjectIndex = ref(0); //类型index
    const typeIndex = ref(0); //类别Index
    const subjectInfo = ref({} as any); //类型Info
    const typeInfo = ref({} as any); //类别Info
    const subjectData = ref([] as any); //课程信息

    //获取课程类别信息
    const setclassList = () => {
      getSubjectList().then((res) => {
        subjectList.value = [{ subjectName: "全部" }];
        typeList.value = [{ subjectName: "全部", pid: "1111" }];
        typeInfoList.value = [{ subjectName: "全部", pid: "1111" }];

        if (+res.code === 0) {
          subjectList.value = subjectList.value.concat(res.data);
          for (let i = 0; i < subjectList.value.length; i++) {
            if (res.data[i]?.children.length) {
              typeList.value = typeList.value.concat(res.data[i].children);
              typeInfoList.value = typeInfoList.value.concat(
                res.data[i].children
              );
            }
          }
        }
      });
    };
    //获取筛选信息
    const selectType = (data: any, index: any) => {
      if (data.pid) {
        //筛选类别
        typeIndex.value = index;
        typeInfo.value = data;
        if (data.id) {
          subjectIndex.value = subjectList.value.findIndex(
            (item: any) => item.id == data.pid
          );
        }
      } else {
        //筛选大类
        typeIndex.value = 0;
        subjectIndex.value = index;
        subjectInfo.value = data;
        typeInfo.value = {};
        if (data.children && data.id) {
          typeList.value = [{ subjectName: "全部", pid: "1111" }];
          typeList.value = typeList.value.concat(...data.children);
        } else if (!data.id) {
          typeList.value = typeInfoList.value;
        }
      }
    };
    const getTableIndex = () => {
      pageSize.value = 18;
      currentPage.value = 1;
      subjectInfo.value = "";
      typeInfo.value = "";
      subjectIndex.value = 0;
      typeIndex.value = 0;
      typeList.value = typeInfoList.value;
      subjectData.value.length = 0;
      getSubjectData();
    };
    //获取课程信息
    const getSubjectData = async (): Promise<any> => {
      // subjectData.value.length = 0;
      loading.value = true;
      let { code, data } = await getSubjectInfo(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            courseType: tableIndex.value === 0 ? "1" : "2",
            subjectId: subjectInfo.value.id,
            courseSubjectId: typeInfo.value.id,
            courseName: searchInfo.value,
            publishStatus: tableIndex.value === 0 ? "1" : "",
          }
        )
      );
      if (+code === 0) {
        subjectData.value = subjectData.value.concat(data.list);
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    //获取课程数据
    onMounted(() => {
      setclassList();
      // getSubjectData();
    });
    //获取筛选数据
    // 只要监听到值改变就初始化值
    watch(
      () => [subjectInfo, typeInfo],
      () => {
        if ((searchInfo.value, typeInfo.value)) {
          subjectData.value.length = 0;
          currentPage.value = 1;
          getSubjectData();
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );
    // 新增课程
    function goToAdd() {
      let routeUrl = router.resolve({
        path: "/recipeDetail/EditCourse",
      });
      window.open(routeUrl.href, "_blank");
    }
    // 编辑课程
    function goToEdit(item: choose) {
      if (item) {
        let routeUrl = router.resolve({
          path: "/recipeDetail/EditCourse",
          query: { id: item.id },
        });
        window.open(routeUrl.href, "_blank");
      }
    }
    // 选择课程
    function handleEdit(item: any) {
      (editCoursePlanCom.value as any).handleOpen(2, item, planId);
    }
    onMounted(() => {
      window.addEventListener("message", (e) => {
        if (e.origin === location.origin) {
          switch (e.data) {
            case "updateCourse":
              subjectData.value = [];
              getSubjectData();
              break;
          }
        }
      });
    });
    // 监听是否允许下拉加载更多
    watch(
      () => $store.state.commonData.touchBottomFlag,
      (newVal) => {
        // 如果当前列表布局是网格布局的情况下，才允许下拉加载更多
        if ($store.state.commonData.isStudentsListGrid) {
          // num.value += 100;
          currentPage.value++;
          getSubjectData();
        }
      }
    );
    return {
      route,
      tableIndex,
      modeStatus,
      showClass,
      loading,
      enrollmentList,
      currentPage,
      pageSize,
      totalNum,
      studentList,
      chooseClass,
      selectId,
      selectInfo,
      handleSizeChange,
      handleCurrentChange,
      searchInfo,
      schoolInfo,
      closePre,
      typeList,
      subjectList,
      selectType,
      subjectIndex,
      typeIndex,
      subjectData,
      chooseCourse,
      goToAdd,
      editCoursePlanCom,
      handleEdit,
      handleSearchInfo,
      getTableIndex,
      goToEdit,
      delClass,
      handleSureDelete,
    };
  },
});
</script>
<style lang="less" scoped>
.schoolEnrollment {
  padding: 24px 40px;
  // box-sizing: border-box;
  // .show-box {
  //   width: 960px;
  //   height: 100%;
  //   box-shadow: 0px 2px 8px 0px undefined;
  // }
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .chartBox {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;
    .bin {
      width: 400px;
      margin-bottom: 10px;
      margin-right: 80px;
      //   height: 260px;
      .school-img {
        margin-top: 10px;
        // margin-left: 25px;
        img {
          width: 400px;
        }
      }
      .top-button {
        display: flex;
        justify-content: center;
        width: 400px;
        .show-button {
          margin-top: 10px;
        }
      }
    }
    .line {
      flex-grow: 1;
      height: 300px;
      width: 300px;
    }
  }
  .school-table {
    margin-top: 24px;
    .select-list {
      // margin-top: 25px;
      .select-title {
        // margin-bottom: 20px;
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #222222;
        display: inline-flex;
        align-items: center;
      }
      .select-name {
        display: flex;
        font-size: 14px;
        font-weight: 400;
        color: #222222;
        li {
          margin-left: 4px;
          cursor: pointer;
          text-align: center;
          min-width: 48px;
          box-sizing: border-box;
          padding: 0 10px;
          height: 28px;
          display: flex;
          align-items: center;
        }
        .is-select {
          // min-width: 48px;
          background: #ff9900;
          opacity: 1;
          border-radius: 4px;
          color: #ffffff;
          font-weight: 400;
          text-align: center;
        }
      }
    }
    .fromBox {
      margin-top: 20px;
      display: flex;
      //   padding: 22px 0 15px 0;
      flex-wrap: wrap !important;
      justify-content: space-between;
      > div {
        display: contents;
        // flex-wrap: wrap;
      }
      .from-item {
        // margin-right: 15px;
        margin-bottom: 10px;
        display: flex;
        white-space: nowrap;
        align-items: center;
      }
      .from-items {
        display: flex;
        flex-wrap: wrap;
        .button {
          width: 64px;
          height: 32px;
          padding: 0px;
          margin-left: 15px;
        }
      }
    }
    .class-show {
      width: 100%;
      display: grid;
      grid-template-rows: repeat(auto-fill, 191px);
      grid-template-columns: repeat(auto-fill, 244px);
      grid-row-gap: 32px;
      grid-column-gap: 15px;
      .action-box {
        display: none;
      }
      .action-edit {
        display: none;
      }
      .class-box {
        &:hover .action-edit {
          display: block;
          width: 80%;
          text-align: right;
          height: 20px;
          margin-top: -2px;
          align-items: center;
        }
        &:hover .action-box {
          display: grid;
          width: 244px;
          height: 137px;
          border-radius: 3px;
          margin-top: -140px;
          position: absolute;
          background: rgba(0, 0, 0, 0.7);
          .action-button {
            width: 99px;
            height: 32px;
            background: #ff9900;
            border-radius: 3px;
            margin: auto;
            font-size: 14px;
            font-weight: 400;
            line-height: 0px;
            color: #ffffff;
            border: none;
          }
          .action-buttons {
            width: 99px;
            height: 32px;
            background: #4fa8f9;
            border-radius: 3px;
            margin: auto;
            font-size: 14px;
            font-weight: 400;
            line-height: 0px;
            color: #ffffff;
            border: none;
          }
        }
        .show-boxs {
          width: 244px;
          height: 137px;
          border-radius: 3px;
        }

        span {
          display: block;
          margin-top: 8px;
          font-size: 16px;
          font-weight: 400;
          width: 244px;
          text-overflow: ellipsis;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 20px;
          color: #222222;
          opacity: 1;
          height: 22px;
        }
        p {
          display: block;
          font-size: 14px;
          font-weight: 400;
          color: #bfbfbf;
          opacity: 1;
          height: 20px;
          margin-top: 4px;
        }
      }
    }
    .footer {
      color: #999999;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
