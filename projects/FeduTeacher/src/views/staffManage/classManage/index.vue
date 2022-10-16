<template>
  <div class="manage">
    <el-drawer
      v-model="modeStatus.showManage"
      :size="960"
      @close="handleSearchInfo"
    >
      <manage :classStatus="tableIndex" :classData="selectClassInfo"></manage>
    </el-drawer>
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <addClass ref="addClassmodel" @update="getClassLists()"></addClass>
    <!-- <editClass
      v-if="modeStatus.editClass"
      :type="1"
    ></editClass> -->
    <addClassList
      ref="addClassListModel"
      @update="getClassLists()"
    ></addClassList>
    <class-manage
      ref="manageClassModel"
      @update="getClassLists()"
    ></class-manage>
    <div class="add-class"></div>
    <div style="margin-top: 20px">
      <ui-card class="chartBox">
        <div class="bin">
          <ChartsTitle title="班级分布" tips="现有班级分布"></ChartsTitle>
          <ui-echarts-pie
            v-if="pieLists.data.length"
            :option="pieLists"
          ></ui-echarts-pie>
        </div>
        <div class="line">
          <class-line></class-line>
          <!-- <ChartsTitle title="班级数量趋势"></ChartsTitle>
          <ui-echarts-line :option="lineMap"></ui-echarts-line> -->
        </div>
      </ui-card>
    </div>
    <div class="tableBox">
      <ui-card>
        <ui-tab
          style="width: 15%"
          v-model:index="tableIndex"
          @click="getTableIndex"
          :list="['现有班级', '毕业班级']"
        ></ui-tab>
        <div class="fromBox">
          <div>
            <div class="fromBoxItem">
              <SelectPostOrClass
                title="年级"
                placeholder="全部"
                width="120"
                :list="gradeListInfo"
                @handleSelect="handleSelect"
              ></SelectPostOrClass>
            </div>
            <!-- <div class="fromBoxItem">
              <DateFilter
                @handleSelectDate="handleSelectDate"
                :changeTabStatus="tableIndex"
                style="margin-left: 5px"
              ></DateFilter>
            </div> -->
            <div class="fromBoxItem">
              <ui-input
                icon="icon-a-101"
                v-model="searchInfo"
                placeholder="请输入班级名称"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
              ></ui-input>
            </div>
          </div>
          <div>
            <div class="right-box">
              <p class="check-box" v-if="checkRowInfo.length">
                已选 <span>{{ checkRowInfo.length }}</span
                >项
              </p>
              <ul v-if="tableIndex === 0">
                <li v-for="(item, index) in topHandleList" :key="index">
                  <ui-button
                    :class="item.name === '删除' ? 'is-dimission' : ''"
                    :type="item.type ? item.type : 'default'"
                    :icon="item.icon ? item.icon : 'default'"
                    @click="item.onClick"
                    >{{ item.name }}</ui-button
                  >
                  <div
                    v-if="isCheck.isStudent && item.name === '删除'"
                    :class="[
                      'is-empty-data',
                      isCheck.isEmpt ? 'is-empty' : 'is-student',
                    ]"
                  >
                    <span class="del-info" v-if="isCheck.isEmpt"
                      >请至少选择一项</span
                    >
                    <span v-if="isCheck.isStudent"
                      >1.现班级里有幼儿不能删除班级</span
                    >
                    <span v-if="isCheck.isStudent"
                      >2.如果要删除班级，请先到“班级详情”页将幼儿转班</span
                    >
                  </div>

                  <div
                    v-if="isCheck.isEmpt && item.name === '删除'"
                    class="is-empty"
                  >
                    <span class="del-info">请至少选择一项</span>
                  </div>
                </li>
              </ul>
              <!-- <ui-button icon="icon-a-31" type="text" v-if="tableIndex === 1"
                >导出Excel</ui-button
              > -->
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <ui-table
            :data="classList"
            v-if="+tableIndex === 0"
            class="tableBoxItem"
            :checkbox="true"
            @selectChange="chooseClass"
          >
            <ui-table-column
              prop="name"
              label="班级名称"
              align="left"
              width="160"
            >
              <template #default="{ row }">
                <div class="itemNameBox">
                  <img :src="row.clazzImg" alt="" v-if="row.clazzImg" />
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="年级"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column prop="teachersName" label="教师" align="left">
              <template #default="{ row }">
                <div class="itemNameBoxs">
                  <el-tooltip placement="top-start" effect="light">
                    <template #content>
                      <span
                        style="margin-left: 5px"
                        v-for="(item, index) in row.teachersName"
                        :key="index"
                        >{{ item }}
                        {{ index === row.teachersName.length - 1 ? "" : "、" }}
                      </span>
                    </template>
                    <span>
                      <span
                        style="margin-left: 5px"
                        v-for="(item, index) in row.teachersName"
                        :key="index"
                        >{{ item }}
                        {{ index === row.teachersName.length - 1 ? "" : "、" }}
                      </span>
                    </span>
                  </el-tooltip>
                  <!-- <span>{{ row.status }}</span> -->
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="studentNum"
              label="幼儿人数"
              align="right"
              width="90"
            >
              <template #default="{ row }">
                <span>{{ row.studentNum ? row.studentNum : "0" }}</span>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="studentAttendance"
              label="幼儿出勤率"
              align="right"
              width="90"
            >
              <template #default="{ row }">
                <span>{{
                  row.studentAttendance ? row.studentAttendance : "0%"
                }}</span>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="inApp"
              label="幼儿入驻App"
              align="right"
              tips=""
              width="110"
            >
              <template #default="{ row }">
                <ui-tag
                  :type="+row.stuUnsettleNum === 0 ? 'success' : 'danger'"
                  v-if="row.studentNum !== 0"
                >
                  {{
                    +row.stuUnsettleNum === 0
                      ? "都已入驻"
                      : `未入驻 : ${row.stuUnsettleNum}`
                  }}
                </ui-tag>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="createClazzTime"
              label="建班时间"
              align="right"
              width="90"
            >
              <!-- <template #default="{ row }">
              <span :style="{ color: row.id > 0 ? '#FF9900' : '' }">{{
                row.id
              }}</span>
            </template> -->
            </ui-table-column>
            <ui-table-column prop="id" label="操作" align="right" width="200">
              <template #default="{ row }">
                <ul class="handle-box">
                  <li>
                    <ui-button type="text-blue" @click="editClass(row)"
                      >编辑</ui-button
                    >
                  </li>
                  <li>
                    <ui-button type="text-blue" @click="edit(row)"
                      >班级详情</ui-button
                    >
                  </li>
                  <li>
                    <ui-button type="text-blue" @click="graduate(row)"
                      >毕业</ui-button
                    >
                  </li>
                  <li v-if="+row.grade !== 4">
                    <ui-button type="text-blue" @click="upClass(row)"
                      >升班</ui-button
                    >
                  </li>
                </ul>
              </template>
            </ui-table-column>
          </ui-table>

          <ui-table
            :data="classOverList"
            v-if="+tableIndex === 1"
            class="tableBoxItem"
          >
            <ui-table-column prop="className" label="班级名称" align="left">
              <template #default="{ row }">
                <div class="itemNameBox">
                  <img :src="row.clazzImg" alt="" v-if="row.clazzImg" />
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column prop="gradeLabel" label="年级" align="center">
            </ui-table-column>
            <ui-table-column prop="teacher" label="教师" align="center">
              <template #default="{ row }">
                <div class="itemNameBoxs">
                  <el-tooltip placement="top-start" effect="center">
                    <template #content>
                      <span
                        style="margin-left: 5px"
                        v-for="(item, index) in row.teachersName"
                        :key="index"
                        >{{ item }}
                      </span>
                    </template>
                    <span>
                      <span
                        style="margin-left: 5px"
                        v-for="(item, index) in row.teachersName"
                        :key="index"
                        >{{ item }}
                      </span>
                    </span>
                  </el-tooltip>
                  <!-- <span>{{ row.status }}</span> -->
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="studentNum"
              label="幼儿人数"
              align="center"
            ></ui-table-column>
            <ui-table-column
              prop="studentAttendance"
              label="幼儿出勤率"
              align="center"
            >
              <template #default="{ row }">
                <span>{{
                  row.studentAttendance ? row.studentAttendance : "-"
                }}</span>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="inApp"
              label="幼儿入驻App"
              align="center"
              tips=""
            >
              <template #default="{ row }">
                <ui-tag
                  :type="+row.stuUnsettleNum === 0 ? 'success' : 'danger'"
                >
                  {{
                    +row.stuUnsettleNum === 0
                      ? "都已入驻"
                      : `未入驻 : ${row.stuUnsettleNum}`
                  }}
                </ui-tag>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="createClazzTime"
              label="建班时间"
              align="center"
            >
            </ui-table-column>
            <ui-table-column
              prop="graduatingTime"
              label="毕业时间"
              align="center"
            >
            </ui-table-column>
            <ui-table-column prop="id" label="操作" align="right">
              <template #default="{ row }">
                <ul class="handle-box">
                  <li>
                    <ui-button type="text-blue" @click="edit(row)"
                      >班级详情</ui-button
                    >
                  </li>
                </ul>
              </template>
            </ui-table-column>
          </ui-table>
        </div>
        <ui-pagination
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalNum"
        ></ui-pagination>
      </ui-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import ChartsTitle from "@/components/ChartsTitle.vue";
import { ElDrawer, ElTooltip } from "element-plus";
import { useRoute } from "vue-router";
import addClass from "./components/addClass.vue";
// import editClass from "./components/editClass.vue";
import addClassList from "./components/addClassList.vue";
import manage from "./components/manage.vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
// import DateFilter from "@/components/DateFilter.vue";
import classManage from "./components/classManage.vue";
import { useStore } from "vuex";
import { throttle } from "@/utils/common";
import { setTableData } from "@/utils/common";
import { gradeColors, classItem, isChecked, pieList, pieItem } from "./index";

import { getClassListPie } from "@/api/classManage";
import ClassLine from "./components/classLine.vue";
import dayjs from "dayjs";

interface gradeDemo {
  codeInfoName: string;
  codeInfoValue: string;
}
export default defineComponent({
  components: {
    addClass,
    ElDrawer,
    manage,
    // editClass,
    addClassList,
    ChartsTitle,
    SelectPostOrClass,
    // DateFilter,
    ElTooltip,
    classManage,
    ClassLine,
  },
  setup() {
    const $store = useStore();
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const titleGrade = ref(""); // 年级筛选值
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间
    const tableIndex = ref(0);
    const loading = ref(true);
    const classList = ref([] as Array<classItem>);
    const getClassLists = async (): Promise<any> => {
      pieLists.data.length = 0;
      getClassPieData();
      let url = "/schools/api/clazz/query";
      checkRowInfo.value.length = 0;
      loading.value = true;
      let { code, data } = await setTableData(
        url,
        currentPage.value,
        pageSize.value,
        // headers : {
        //   version: "1.2.0",
        // },
        Object.assign(
          {},
          {
            grade: titleGrade.value,
            isGraduating: 0,
            startTime: startTime.value,
            endTime: endTime.value,
            name: searchInfo.value,
          }
        )
      );
      if (+code === 0) {
        classList.value = data.list;
        $store.dispatch("getClassList");
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    // 年级筛选
    const handleSelect = (res: any): void => {
      titleGrade.value = res ? res.codeInfoValue : "";
      +tableIndex.value === 0 ? getClassLists() : getClassListOver();
    };
    onMounted(() => {
      getClassLists();
    });

    const route = useRoute();
    const activeId = ref("2");
    const isCheck: isChecked = reactive({
      isEmpt: false,
      isStudent: false,
    });

    // 离职，如果勾选的数据为空，就展示相关tips样式
    const checkEmptyData = (type: string) => {
      if (type === "empt") {
        isCheck.isEmpt = true;
      } else if (type === "student") {
        isCheck.isStudent = true;
      }
      let timer = null;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        isCheck.isStudent = false;
        isCheck.isEmpt = false;
      }, 2000);
    };
    const modeStatus = ref({
      addClass: false,
      addClassList: false,
      editClass: false,
      showManage: false,
    });
    //初始化添加班级
    const addClassmodel = ref(null);
    //初始化批量添加班级
    const addClassListModel = ref(null);
    //管理模块
    const manageClassModel = ref(null);
    // 顶部操作按钮
    const topHandleList = ref([
      {
        name: "删除",
        onClick: () => {
          if (checkRowInfo.value.length) {
            let status = ref(true);
            for (let item of checkRowInfo.value) {
              if (item.studentNum) {
                checkEmptyData("student");
                status.value = false;
                return;
              }
            }
            if (status.value) {
              (manageClassModel.value as any).handleOpen(
                "del",
                checkRowInfo.value
              );
            }
          } else {
            checkEmptyData("empt");
            return;
          }
        },
      },
      {
        name: "批量新增",
        icon: "icon-a-81",
        onClick: () => {
          (addClassListModel.value as any).handleOpen();
        },
      },
      {
        name: "新增班级",
        icon: "icon-a-81",
        type: "primary",
        onClick: () => {
          (addClassmodel.value as any).handleOpen("add");
        },
      },
    ]);
    // 已勾选班级数据
    let checkRowInfo = ref<any[]>([]);
    //获取表单选择数据
    const chooseClass = (data: any) => {
      checkRowInfo.value = data;
    };
    //班级毕业
    const graduate = (data: classItem) => {
      if (data.id) {
        (manageClassModel.value as any).handleOpen("graduate", data);
      }
    };

    //查看班级详细信息
    const selectClassInfo = ref("");
    const edit = (data: any) => {
      if (data) {
        selectClassInfo.value = data.id;
        modeStatus.value.showManage = true;
      }
    };
    // const editClassInfo = ref({} as classItem);
    //修改班级信息
    const editClass = (data: classItem) => {
      if (data) {
        (addClassmodel.value as any).handleOpen("edit", data);
      }
    };
    //班级升班
    const upClass = (data: classItem) => {
      if (data) {
        (addClassmodel.value as any).handleOpen("", data);
      }
    };
    //切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      +tableIndex.value === 0 ? getClassLists() : getClassListOver();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      +tableIndex.value === 0 ? getClassLists() : getClassListOver();
    };

    const pieLists = reactive({
      titleValue: 0,
      title: "班级总数",
      isHome: false,
      data: [] as Array<pieItem>,
    });
    const gradeList = ref($store.state.commonData.gradeList); // 年级列表
    const gradeListInfo = ref([] as Array<gradeDemo>);
    gradeListInfo.value = [...gradeList.value];
    gradeListInfo.value.unshift({ codeInfoName: "全部", codeInfoValue: "" });
    const year = dayjs().toDate().getFullYear() as string | number; //当前年份

    // 获取班级统计信息
    const getClassPieData = async () => {
      if (year) {
        let { code, data } = await getClassListPie(year);
        if (+code === 0 && data.length > 0) {
          pieLists.titleValue = 0;
          data.forEach((listItem: pieList) => {
            pieLists.titleValue += listItem.clazzNum;
            let item = {
              value: listItem.clazzNum,
              name: gradeList.value[listItem.grade].codeInfoName,
              color: gradeColors[listItem.grade].color,
            } as pieItem;
            pieLists.data.push(item);
          });
        }
      }
    };
    // onMounted(() => {
    //   getClassPieData();
    // });
    //标签切换
    const getTableIndex = () => {
      searchInfo.value = ""; // 输入框搜索值
      titleGrade.value = ""; // 年级筛选值
      startTime.value = ""; // 筛选开始时间
      endTime.value = ""; // 筛选结束时间
      if (+tableIndex.value === 0) {
        getClassLists();
      } else {
        getClassListOver();
      }
    };
    const classOverList = ref([] as Array<classItem>);
    //获取毕业班级信息
    const getClassListOver = async (): Promise<any> => {
      let url = "/schools/api/clazz/query";
      loading.value = true;
      let { code, data } = await setTableData(
        url,
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            grade: titleGrade.value,
            startTime: startTime.value,
            endTime: endTime.value,
            name: searchInfo.value,
            isGraduating: 1,
          }
        )
      );
      if (+code === 0) {
        classOverList.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    // 日期筛选
    // const handleSelectDate = (res: string): void => {
    //   if (res) {
    //     startTime.value = micell.date.format(res[0], "YYYY-MM-DD");
    //     endTime.value = micell.date.format(res[1], "YYYY-MM-DD");
    //   } else {
    //     startTime.value = "";
    //     endTime.value = "";
    //   }
    //   +tableIndex.value === 0 ? getClassLists() : getClassListOver();
    // };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      +tableIndex.value === 0 ? getClassLists() : getClassListOver();
    };
    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          +tableIndex.value === 0 ? getClassLists() : getClassListOver();
        }, 500);
      }
    );
    return {
      route,
      tableIndex,
      classList,
      activeId,
      topHandleList,
      chooseClass,
      checkRowInfo,
      isCheck,
      modeStatus,
      edit,
      pieLists,
      editClass,
      selectClassInfo,
      gradeList,
      handleSelect,
      addClassmodel,
      addClassListModel,
      handleSizeChange,
      handleCurrentChange,
      totalNum,
      getClassLists,
      manageClassModel,
      getTableIndex,
      graduate,
      classOverList,
      // handleSelectDate,
      handleSearchInfo,
      searchInfo,
      upClass,
      loading,
      gradeListInfo,
      currentPage,
      pageSize,
    };
  },
});
</script>

<style lang="less" scoped>
.handle-box {
  // margin-left: 30px;
  display: inline-flex;
  //   align-items: right;
  > li {
    margin-left: 10px;
  }
}

.manage {
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    .settingBox {
      display: flex;
      height: 36px;
      align-items: center;
      padding: 0 12px;
      margin-left: 40px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      opacity: 1;
      border-radius: 3px;

      span {
        font-size: 14px;
        &:nth-child(1) {
        }
        &:nth-child(2) {
          color: #ff9900;
          margin-left: 4px;
        }
        &:nth-child(3) {
          cursor: pointer;
          color: #bfbfbf;
          margin-left: 32px;
          user-select: none;
          &:hover {
            color: #61b4ff;
          }
          &:active {
            color: #bfbfbf;
          }
        }
      }
    }
  }
  .chartBox {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;
    .bin {
      width: 468px;
      margin-bottom: 10px;
      height: 260px;
    }
    .line {
      flex-grow: 1;
      height: 260px;
      width: 300px;
    }
  }
  .tableBox {
    margin-top: 24px;
    .tableBoxItem {
      .itemNameBox {
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          // margin-left: 20px;
          margin-right: 10px;
          border-radius: 4px;
        }
        span {
          color: #222222;
          font-size: 14px;
        }
      }
      .itemNameBoxs {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          color: #222222;
          font-size: 14px;
        }
      }
    }

    .fromBox {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap !important;
      margin: 10px 0 10px 5px;
      > div {
        display: flex;
        flex-wrap: wrap;
      }
      .fromBoxItem {
        margin-right: 16px;
        margin-top: 10px;
        display: flex;
        white-space: nowrap;
        align-items: center;
        .el-input {
          height: 32px;
          line-height: 32px;
        }
      }
      .right-box {
        margin-top: 10px;
        display: inline-flex;
        .check-box {
          display: block;
          margin: 10px 0 0 0;
          color: #bfbfbf;
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          margin-right: 10px;
          span {
            color: #000000;
            font-size: 12px;
          }
        }
        > ul {
          display: flex;
          justify-content: flex-end;
          li {
            margin-right: 16px;
            position: relative;

            .is-dimission {
              width: 64px;
              height: 32px;
              padding: 0;
              box-sizing: border-box;
            }
            .is-empty {
              position: absolute;
              top: -60px;
              left: -32px;
              width: 128px;
              height: 45px;
              font-size: 14px;
              border-radius: 4px;
              text-align: center;
              line-height: 45px;
              background-color: #f56060;
              color: #fff;
              box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

              > span {
                position: relative;
                display: block;
                width: 100%;
                height: 100%;

                &::before {
                  display: block;
                  content: "";
                  width: 0;
                  position: absolute;
                  bottom: -20px;
                  left: 64px;
                  margin-left: -10px;
                  border: 10px solid transparent;
                  border-top: 10px solid #f56060;
                }
              }
            }
            .is-student {
              top: -75px;
              left: -40px;
              width: 350px;
              height: 55px;
            }
            .is-empty-data {
              padding: 5px;
              position: absolute;
              font-size: 14px;
              display: grid;
              border-radius: 4px;
              text-align: left;
              line-height: 30px;
              background-color: #f56060;
              color: #fff;
              box-shadow: 0px 2px 10px rgb(0 0 0 / 20%);
              > span {
                position: relative;
                display: block;
                width: 100%;
                height: 100%;
                &::before {
                  display: block;
                  content: "";
                  width: 0;
                  position: absolute;
                  bottom: -20px;
                  left: 64px;
                  margin-left: -10px;
                  border: 10px solid transparent;
                  border-top: 10px solid #f56060;
                }
              }
            }
          }
        }
      }
      span {
        font-size: 14px;
        margin-right: 6px;
      }
    }

    .itemDetails {
      background: #fafafa;
      border: 1px solid #e8e8e8;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      padding: 0 56px;
      &::after {
        content: "";
        position: absolute;
        top: -20px;
        right: 45px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 10px solid #fafafa;
      }
      .itemDetailsItem {
        display: flex;
        padding: 14px 0;
        img {
          width: 80px;
          height: 80px;
          border-radius: 4px;
        }
        .infoBox {
          margin-left: 16px;
          display: flex;
          flex-direction: column;
          .time {
            font-size: 14px;
            color: #222222;
            font-weight: 400;
          }
          span {
            font-size: 12px;
            color: #666666;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
}
</style>
