<template>
  <div class="schoolEnrollment">
    <el-drawer
      v-model="modeStatus.showView"
      size="960px"
      class="show-box"
    >
      <div class="show-box">
        <studentInfo></studentInfo>
      </div>
    </el-drawer>
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="school-info">
      <ui-card class="chartBox">
        <div class="bin">
          <ChartsTitle
            title="报名人数"
            tips="当前报名幼儿的统计"
          ></ChartsTitle>
          <studentPie></studentPie>
        </div>
        <div class="line">
          <studentLine></studentLine>
        </div>
      </ui-card>
    </div>
    <div class="school-table">
      <ui-card>
        <ui-tab
          v-model:index="tableIndex"
          @click="getTableIndex"
          :list="['报名幼儿']"
        ></ui-tab>
        <div class="fromBox">
          <div>
            <div class="from-item">
              <SelectPostOrClass
                title="进度"
                placeholder="全部进度"
                width="120"
                :list="gradeListInfo"
                @handleSelect="handleSelect"
                :changeTabStatus="tableIndex"
              ></SelectPostOrClass>
            </div>
            <div class="from-item">
              <DateFilter
                @handleSelectDate="handleSelectDate"
                :changeTabStatus="changeTabStatus"
              ></DateFilter>
            </div>
            <div class="from-item">
              <ui-input
                maxlength="40"
                style="width: 240px"
                v-model="searchInfo"
                placeholder="输入姓名或手机号"
                icon="icon-a-101"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
              ></ui-input>
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
              label="幼儿姓名"
              align="left"
              width="160"
            >
              <template #default="{ row }">
                <div class="itemNameBox">
                  <img
                    :src="row.clazzImg"
                    alt=""
                    v-if="row.clazzImg"
                  />
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="性别"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="年龄"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="家长电话"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="来源"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="报名时间"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="最近回访"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="回访进度"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="gradeLabel"
              label="家长意向"
              align="left"
              width="100"
            >
            </ui-table-column>
            <ui-table-column
              prop="id"
              label="操作"
              align="right"
              width="150"
            >
              <template #default="{ row }">
                <ul class="handle-box">
                  <li>
                    <ui-button
                      type="text-blue"
                      @click="editClass(row)"
                    >编辑</ui-button>
                  </li>
                  <li>
                    <ui-button
                      type="text-blue"
                      @click="record(row)"
                    >回访记录</ui-button>
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
import { useRoute } from "vue-router";
import { defineComponent, ref, reactive } from "vue";
import { ElDrawer } from "element-plus";
import DateFilter from "@/components/DateFilter.vue";
import studentLine from "./components/studentLine.vue";
import studentPie from "./components/studentPie.vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import studentInfo from "./components/studentInfo.vue";

export default defineComponent({
  components: {
    DateFilter,
    ElDrawer,
    studentLine,
    studentPie,
    SelectPostOrClass,
    studentInfo,
  },
  setup() {
    const route = useRoute();
    const tableIndex = ref(0);
    const classList = reactive([
      {
        name: "春招样式-2021-08-10",
      },
    ]);
    //页面状态控制
    const modeStatus = ref({
      showView: false,
      addClassList: false,
      editClass: false,
      showManage: false,
    });
    //预览页面
    const show = () => {
      modeStatus.value.showView = true;
    };
    //切换表单
    const getTableIndex = () => {
      //   searchInfo.value = ""; // 输入框搜索值
      //   titleGrade.value = ""; // 年级筛选值
      //   startTime.value = ""; // 筛选开始时间
      //   endTime.value = ""; // 筛选结束时间
      //   if (+tableIndex.value === 0) {
      //     getClassLists();
      //   } else {
      //     getClassListOver();
      //   }
    };
    const record = (data: any) => {
      if (data) {
        modeStatus.value.showView = true;
        console.log("1");
      }
    };
    return {
      route,
      tableIndex,
      getTableIndex,
      classList,
      modeStatus,
      show,
      record,
    };
  },
});
</script>
<style lang="less" scoped>
.schoolEnrollment {
  padding: 24px 40px;
  box-sizing: border-box;
  .show-box {
    width: 960px;
    height: 100%;
  }
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
      width: 468px;
      height: 260px;
      // margin-bottom: 10px;
    }
    .line {
      flex-grow: 1;
      height: 300px;
      width: 260px;
    }
  }
  .school-table {
    margin-top: 24px;
    .fromBox {
      display: flex;
      padding: 22px 0 15px 0;
      justify-content: space-between;
      > div {
        display: flex;
        flex-wrap: wrap;
      }
      .from-item {
        margin-right: 15px;
        margin-bottom: 10px;
        display: flex;
        white-space: nowrap;
        align-items: center;
      }
    }
    .handle-box {
      // margin-left: 30px;
      display: inline-flex;
      //   align-items: right;
      > li {
        margin-left: 10px;
      }
    }
  }
}
</style>
