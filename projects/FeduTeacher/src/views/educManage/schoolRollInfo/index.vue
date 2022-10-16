<template>
  <div class="wrap">
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <TopType
        :topTypeList="staticData.topTypeList"
        @changeTopType="changeTopType"
      ></TopType>
      <div class="top-handle-box">
        <div class="left-box">
          <SelectPostOrClass
            title="班级"
            placeholder="全部班级"
            width="140"
            :list="classList"
            @handleSelect="handleSelect"
            :changeTabStatus="changeTabStatus"
          ></SelectPostOrClass>
          <DateFilter
            @handleSelectDate="handleSelectDate"
            :changeTabStatus="changeTabStatus"
          ></DateFilter>
          <ui-input
            maxlength="40"
            style="width: 240px; margin-bottom: 15px"
            v-model="searchInfo"
            placeholder="输入姓名或手机号"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
          <SelectPostOrClass
            title="学籍"
            placeholder="全部"
            width="96"
            :list="staticData.schoolRollFilterList"
            @handleSelect="handleSelectSchoolRoll"
            :changeTabStatus="changeTabStatus"
          ></SelectPostOrClass>
        </div>
        <div class="right-box">
          <ul>
            <li v-if="currentType === 1">
              <ui-button type="default" @click="handleCopeUrl"
                >学籍填写链接</ui-button
              >
            </li>
            <li v-if="currentType === 1">
              <ui-button icon="icon-a-24" type="primary" @click="handleRemind"
                >一键短信提醒</ui-button
              >
              <div v-if="isSelectEmptyData" class="is-empty-data">
                <span>请至少选择一项</span>
              </div>
            </li>
            <li style="height: 32px">
              <ExportExcel
                :uploadProps="uploadProps"
                :tableData="tableData"
                :checkRowInfo="checkRowInfo"
              ></ExportExcel>
            </li>
          </ul>
        </div>
      </div>
      <div v-loading="loading">
        <AtSchoolInfantTable
          v-if="currentType === 1"
          :data="tableData"
          @selectChange="checkBoxChange"
          @updateList="getInfantList"
        ></AtSchoolInfantTable>
        <GraduateInfantTable
          v-else-if="currentType === 2"
          :data="tableData"
          @selectChange="checkBoxChange"
        ></GraduateInfantTable>
        <DropOutInfantTable
          v-else-if="currentType === 3"
          :data="tableData"
          @selectChange="checkBoxChange"
        ></DropOutInfantTable>
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
    <logoutIdentity
      ref="logoutIdentityCom"
      @handleSure="handleSure"
      :width="420"
    >
      <p class="body-text">1.{{ modalTxt }}</p>
      <p
        class="body-text"
        v-if="
          canSendInfoParentList.length !== 0 &&
          canSendInfoParentList.length <= 50
        "
      >
        2.每位家长当天只能发送1次短信且不能撤销，请慎重！
      </p>
    </logoutIdentity>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import TopType from "@/components/TopType.vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import DateFilter from "@/components/DateFilter.vue";
import { staticData, InfantTableList, ClassList, SelectOption } from "./index";
import { TopTypeListItem } from "@/utils/common";
import AtSchoolInfantTable from "./components/AtSchoolInfantTable.vue";
import GraduateInfantTable from "./components/GraduateInfantTable.vue";
import DropOutInfantTable from "./components/DropOutInfantTable.vue";
import { throttle } from "@/utils/common";
import micell from "micell";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { getTableList } from "@/api/infantManage";
import Message from "@/themes/message";
import ExportExcel from "./components/ExportExcel.vue";
import { remindOne } from "@/api/schoolRollInfo";
import logoutIdentity from "@/components/logoutIdentity.vue";
import bus from "@/Layout/bus";

export default defineComponent({
  name: "",
  components: {
    TopType,
    SelectPostOrClass,
    DateFilter,
    AtSchoolInfantTable,
    GraduateInfantTable,
    DropOutInfantTable,
    ExportExcel,
    logoutIdentity,
  },
  setup() {
    const route = useRoute();
    const $store = useStore();
    $store.dispatch("getClassList");
    let classList = JSON.parse(
      JSON.stringify($store.state.commonData.classList)
    ); // 班级列表
    classList.unshift({ id: "", name: "全部班级" });

    const { schoolId } = $store.state.user;
    const logoutIdentityCom = ref(null);
    const loading = ref(true);
    const currentType = ref(1); // 标签页索引
    const changeTabStatus = ref(false); //是否切换了标签页
    let checkRowInfo = ref([] as Array<InfantTableList>); // 已勾选的行信息
    const tableData = ref([] as Array<InfantTableList>); // 表格数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const classQuery = ref(""); // 班级筛选值
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间
    const schoolRollQuery = ref(""); //学籍筛选值
    const isSelectEmptyData = ref(false);
    const modalTxt = ref("");
    const canSendInfoParentList = ref([] as Array<InfantTableList>);

    // 如果勾选的数据为空，就展示相关tips样式
    const checkIsEmptyData = (): void => {
      isSelectEmptyData.value = true;
      throttle(() => {
        isSelectEmptyData.value = false;
      }, 2000);
    };

    const uploadProps = ref({
      clazzId: classQuery.value,
      stuStatus: currentType.value,
      startTime: startTime.value,
      endTime: endTime.value,
      name: searchInfo.value,
      setSchoolRoll: schoolRollQuery.value,
    });

    // 获取表格内容
    const getInfantList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await getTableList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            clazzId: classQuery.value,
            stuStatus: currentType.value,
            startTime: startTime.value,
            endTime: endTime.value,
            name: searchInfo.value,
            setSchoolRoll: schoolRollQuery.value,
          }
        )
      );
      if (+code === 0) {
        checkRowInfo.value = [];
        tableData.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    getInfantList();

    // 表格勾选事件
    const checkBoxChange = (res: Array<InfantTableList>): void => {
      checkRowInfo.value = res;
    };

    // 一键短信提醒
    async function handleRemind() {
      modalTxt.value = "";
      if (checkRowInfo.value.length === 0) {
        checkIsEmptyData();
      } else {
        // 未提交学籍的列表并且没有发送过短信的列表
        canSendInfoParentList.value = checkRowInfo.value.filter((item) => {
          return +item.setSchoolRoll !== 1 && item.smsMessage !== "OK";
        });
        let txt = "";
        if (canSendInfoParentList.value.length === 0) {
          txt = "你选择的幼儿都不能发送短信";
          modalTxt.value = `选择的${checkRowInfo.value.length}位幼儿已提交学籍或当天已发短信不能再发`;
        } else if (canSendInfoParentList.value.length > 50) {
          txt = "批量短信提醒超过单次上限";
          modalTxt.value = `批量短信提醒单次上限为50条，请重新选择`;
        } else {
          txt = `确定向 ${canSendInfoParentList.value.length}位 幼儿家长发送短信吗？`;
          modalTxt.value = `选择的${checkRowInfo.value.length}位幼儿有${canSendInfoParentList.value.length}位未提交学籍且当天未发短信 `;
        }
        (logoutIdentityCom.value as any).handleOpen(txt);
      }
    }

    // 确定短信提醒操作
    const handleSure = async (): Promise<void> => {
      if (
        canSendInfoParentList.value.length === 0 ||
        canSendInfoParentList.value.length > 50
      ) {
        return;
      }
      const ids = canSendInfoParentList.value.map((item) => item.id);

      // 批量发送短信，显示发送中状态
      bus.$emit("updateSendStatus", ids);

      const { code } = await remindOne(
        canSendInfoParentList.value[0].schoolName,
        ids
      );
      if (+code === 0) {
        setTimeout(() => {
          // 恢复短信发送的正常状态
          bus.$emit("updateSendStatus", []);
          Message.success("提醒信息发送成功");
          getInfantList();
        }, 2000);
      }
    };

    // 初始化筛选数据
    const initQueryData = (): void => {
      changeTabStatus.value = !changeTabStatus.value; // 只要改变了值，就能让其他地方监听到值改变，然后做其他操作
      currentPage.value = 1;
      searchInfo.value = "";
      classQuery.value = "";
      startTime.value = "";
      endTime.value = "";
      schoolRollQuery.value = "";
      uploadProps.value = {
        clazzId: classQuery.value,
        stuStatus: currentType.value,
        startTime: startTime.value,
        endTime: endTime.value,
        name: searchInfo.value,
        setSchoolRoll: schoolRollQuery.value,
      };
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      initQueryData();
      currentType.value = res.value;
      uploadProps.value.stuStatus = res.value;
      getInfantList();
    };

    // 班级筛选表格
    const handleSelect = (res: ClassList): void => {
      if (res) {
        classQuery.value = res.id;
      } else {
        classQuery.value = "";
      }
      uploadProps.value.clazzId = classQuery.value;
      getInfantList();
    };

    // 学籍筛选表格
    const handleSelectSchoolRoll = (res: SelectOption): void => {
      if (res) {
        schoolRollQuery.value = res.value;
      } else {
        schoolRollQuery.value = "";
      }
      uploadProps.value.setSchoolRoll = schoolRollQuery.value;
      getInfantList();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getInfantList();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        uploadProps.value.name = searchInfo.value;
        throttle(() => {
          getInfantList();
        }, 500);
      }
    );

    // 日期筛选
    const handleSelectDate = (res: string): void => {
      if (res) {
        startTime.value = micell.date.format(res[0], "YYYY-MM-DD");
        endTime.value = micell.date.format(res[1], "YYYY-MM-DD");
      } else {
        startTime.value = "";
        endTime.value = "";
      }
      uploadProps.value.startTime = startTime.value;
      uploadProps.value.endTime = endTime.value;
      getInfantList();
    };

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getInfantList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getInfantList();
    };

    // 复制地址
    async function handleCopeUrl() {
      try {
        await navigator.clipboard.writeText(
          process.env.VUE_APP_H5_API + `/studentFile?schoolId=${schoolId}`
        );
        Message.success("复制成功");
      } catch (err) {
        console.log(err);
        Message.error("复制失败");
      }
    }

    return {
      changeTopType,
      handleSelect,
      handleSearchInfo,
      handleSelectDate,
      classList,
      tableData,
      checkBoxChange,
      staticData,
      currentType,
      route,
      searchInfo,
      getInfantList,
      changeTabStatus,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      classQuery,
      loading,
      handleSelectSchoolRoll,
      uploadProps,
      handleRemind,
      handleCopeUrl,
      checkIsEmptyData,
      isSelectEmptyData,
      logoutIdentityCom,
      handleSure,
      modalTxt,
      canSendInfoParentList,
      checkRowInfo,
    };
  },
});
</script>
<style lang="less" scoped>
.wrap {
  padding: 24px 40px;
  box-sizing: border-box;

  .top-charts-box {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;

    .left-map {
      width: 460px;
    }

    .right-map {
      flex-grow: 1;
    }
  }
}
.top-title {
  font-size: 24px;
  color: #222;
  margin-bottom: 20px;
}
.top-handle-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap !important;
  margin-top: 20px;

  .container {
    margin-bottom: 15px;
  }

  .left-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    > div {
      margin-right: 16px;
    }
  }
  .right-box {
    ul {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;

      li {
        margin: 0 0 15px 16px;
        position: relative;

        &:first-child {
          margin-left: 0;
        }

        .is-dimission {
          width: 64px;
          height: 32px;
          padding: 0;
          box-sizing: border-box;
        }

        .is-empty-data {
          position: absolute;
          top: -60px;
          left: 7px;
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
      }
    }
  }
}

.body-text {
  font-size: 14px;
  color: #f56060;
  margin-bottom: 10px;
}

.handle-box {
  display: flex;
  align-items: center;
  > li {
    margin-right: 16px;
  }
}
</style>
