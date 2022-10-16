<template>
  <div class="manage-student">
    <ui-input
      class="student-input"
      icon="icon-a-101"
      v-model="searchInfo"
      placeholder="输入姓名或手机号"
      @keydown.enter="handleSearchInfo"
      @iconClick="handleSearchInfo"
    ></ui-input>
    <div v-loading="loading">
      <ui-table :data="studentList" width="100%" class="table-box">
        <ui-table-column prop="name" label="幼儿姓名" align="left">
        </ui-table-column>
        <ui-table-column prop="contacts" label="家长电话" align="left">
        </ui-table-column>
        <ui-table-column
          prop="birthTime"
          label="出生年月"
          align="left"
        ></ui-table-column>
        <ui-table-column prop="settleApp" label="入驻App" align="center">
          <template #default="{ row }">
            <ui-tag :type="+row.settleApp === 1 ? 'success' : 'danger'">
              {{ +row.settleApp === 1 ? "已入驻" : "未入驻" }}
            </ui-tag>
          </template>
        </ui-table-column>
        <ui-table-column
          prop="createTime"
          label="入园时间"
          align="left"
        ></ui-table-column>
        <ui-table-column prop="id" label="操作" align="right">
          <template #default="{ row }">
            <ul class="handle-box">
              <li>
                <ui-button
                  type="text-blue"
                  style="margin-right: 15px"
                  @click="openItem(row.id)"
                  >{{ activeId === row.id ? "收起" : "详情" }}</ui-button
                >
                <ui-button type="text-blue" @click="changeClass(row)"
                  >转班</ui-button
                >
              </li>
            </ul>
          </template>
        </ui-table-column>
        <template #details="{ row }">
          <div class="itemDetails" v-if="activeId === row.id">
            <div class="student-item">
              <img :src="row.headerImgUrl" />
              <div class="student-info">
                <p>幼儿姓名：{{ row.name }}</p>
                <span>出生年月：{{ row.birthTime }}</span>
                <span>入园时间：{{ row.createTime }}</span>
                <span
                  >入驻App：{{
                    +row.settleApp === 0 ? " 未入驻" : "已入驻"
                  }}</span
                >
                <span>所在班级：{{ row.clazzName }}</span>
                <span
                  >考勤卡号：{{
                    row.outNumber.length ? row.outNumber[0] : "-"
                  }}</span
                >
              </div>
              <div class="parent-info" v-if="row.familyVoList.length">
                <p>联系人</p>
                <span v-for="(item, index) in row.familyVoList" :key="index"
                  >{{ item.familyRels.describe }}电话：{{ item.contacts }}</span
                >
              </div>
            </div>
          </div>
        </template>
      </ui-table>
    </div>

    <Nodata
      v-if="studentList.length === 0 && +type === 0 && !loading"
      :type="2"
    ></Nodata>
    <ClassChange ref="changeClassCom" width="519"></ClassChange>
    <ui-pagination
      v-if="studentList.length !== 0"
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalNum"
    ></ui-pagination>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch, onUnmounted } from "vue";
import img from "@/assets/people.png";
import { setTableData } from "@/utils/common";
import { throttle } from "@/utils/common";
import Nodata from "./noData.vue";
import bus from "@/Layout/bus";
import ClassChange from "@/views/staffManage/infantManage/components/ChangeClass.vue";
interface ruleForm {
  classIcon: string;
  className: string;
  classGrade: string;
  classTime: string;
}
export default defineComponent({
  props: {
    className: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    type: {
      type: String,
    },
    classId: {
      type: String,
      default: "",
    },
  },
  components: {
    Nodata,
    ClassChange,
  },
  setup(props) {
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const showClass = ref(false);
    const activeId = ref("1");
    const loading = ref(false);
    const classMode = ref({
      className: props.className,
      width: props.width,
      type: props.type,
    });
    //初始化班级数据
    const ruleForm: ruleForm = {
      classIcon: "",
      className: "",
      classGrade: "",
      classTime: "",
    };
    //显示学生详情
    const openItem = (id: string) => {
      activeId.value = activeId.value === id ? "" : id;
    };

    //获取学生详情
    const studentList = ref([] as Array<any>);
    const getStudentLists = async (): Promise<any> => {
      studentList.value.length = 0;
      let url = `/schools/api/student/getStudentList?clazzId=${props.classId}`;
      loading.value = true;
      let { code, data } = await setTableData(
        url,
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            name: searchInfo.value,
          }
        )
      );
      if (+code === 0) {
        studentList.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    onMounted(() => {
      getStudentLists();
    });

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getStudentLists();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getStudentLists();
    };
    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getStudentLists();
    };
    const changeClassCom = ref(null);
    // 转班操作
    const changeClass = (data: any): void => {
      let info = [data];
      (changeClassCom.value as any).handleOpen(info);
      console.log(data, "9999999999");
    };
    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getStudentLists();
        }, 500);
      }
    );
    onMounted(() => {
      // 更新表格
      bus.$on("editInfantComplete", (res: boolean) => {
        if (res) {
          getStudentLists();
        }
      });
    });

    onUnmounted(() => {
      bus.$off("editInfantComplete");
    });
    return {
      classMode,
      ruleForm,
      showClass,
      activeId,
      openItem,
      img,
      studentList,
      handleSizeChange,
      handleCurrentChange,
      totalNum,
      handleSearchInfo,
      changeClass,
      changeClassCom,
      getStudentLists,
      searchInfo,
      loading,
      currentPage,
    };
  },
});
</script>
<style lang="less" scoped>
.manage-student {
  //   overflow: scroll;
  width: 100%;
  .student-input {
    width: 200px;
    float: left;
    margin-bottom: 20px;
  }
  .table-box {
    width: 100%;
    .itemDetails {
      background: #fafafa;
      clear: both;
      border: 1px solid #e8e8e8;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      padding: 0 0px;
      &::after {
        content: "";
        position: absolute;
        top: -15px;
        right: 50px;
        width: 0;
        height: 0;
        border-top: 0px solid transparent;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 15px solid #eeee;
      }
      .student-item {
        width: 100%;
        margin: auto;
        display: flex;
        margin-left: 25px;
        img {
          width: 80px;
          height: 80px;
          margin-top: 25px;
          background: rgba(0, 0, 0, 0);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 50%;
        }
        .student-info {
          width: 30%;
          display: grid;
          margin-left: 25px;
          margin-top: 20px;
          margin-bottom: 20px;
          > p {
            font-size: 14px;
            font-weight: 400;
            display: block;
            color: #222223;
            margin-bottom: 5px;
          }
          > span {
            display: block;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            margin-bottom: 5px;
            color: #666666;
          }
        }

        .parent-info {
          width: 30%;
          margin-left: 5%;
          margin-top: 20px;
          margin-bottom: 20px;
          > p {
            display: block;
            font-size: 16px;
            margin-bottom: 5px;
            color: #222222;
            height: 20px;
          }
          > span {
            display: block;
            font-size: 12px;
            margin-bottom: 5px;
            color: #666666;
            height: 16px;
          }
        }
      }
    }
  }
}
</style>
