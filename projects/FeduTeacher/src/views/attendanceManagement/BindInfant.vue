<template>
  <div class="bind-infant">
    <ui-modal
      v-model:visible="modalStatus"
      @close="handleClose"
      @ok="handleSure"
      title="绑定人脸照片"
      width="890"
      :okText="modalOkText"
      :tips="false"
    >
      <div class="bind-infant-box">
        <div class="left-box">
          <div class="img-box">
            <img
              :src="
                receiveObj.snapImage
                  ? `data:image/png;base64,${receiveObj.snapImage}`
                  : require('@/assets/staff-avatar.png')
              "
              alt=""
            />
          </div>
          <span>{{ receiveObj.createTime }}</span>
        </div>
        <div class="right-box">
          <div class="top-filter-box">
            <SelectPostOrClass
              title="班级"
              placeholder="全部班级"
              width="140"
              :list="classList"
              @handleSelect="handleSelect"
              style="margin-right: 16px"
            ></SelectPostOrClass>
            <ui-input
              maxlength="40"
              style="width: 200px"
              v-model="searchInfo"
              placeholder="输入姓名或手机号"
              icon="icon-a-101"
              @keydown.enter="handleSearchInfo"
              @iconClick="handleSearchInfo"
            ></ui-input>
          </div>
          <div class="botom-table">
            <div v-loading="loading" class="table-box">
              <InfantTable
                :data="tableData"
                @getCheckedRow="getCheckedRow"
              ></InfantTable>
            </div>
            <ui-pagination
              style="margin-top: 20px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="totalNum"
            ></ui-pagination>
          </div>
        </div>
      </div>
    </ui-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { RowItem } from "./stranger.vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import { useStore } from "vuex";
import { InfantTableList, ClassList } from "../staffManage/infantManage/util";
import { getTableList } from "@/api/infantManage";
import { throttle } from "@/utils/common";
import InfantTable from "./InfantTable.vue";
import { SaveFaceFeature, GetUserFaceStatus } from "@/api/common";
import Message from "@/themes/message";

export default defineComponent({
  components: {
    SelectPostOrClass,
    InfantTable,
  },
  setup() {
    const $store = useStore();
    $store.dispatch("getClassList");
    const modalStatus = ref(false);
    let classList = JSON.parse(
      JSON.stringify($store.state.commonData.classList)
    ); // 班级列表
    classList.unshift({ id: "", name: "全部班级" });
    const loading = ref(true);
    const modalOkText = ref("绑定");
    const isBinding = ref(false); //是否正在绑定中
    const receiveObj = ref({} as RowItem); //传过来的值
    const tableData = ref([] as Array<InfantTableList>); // 表格数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const classQuery = ref(""); // 班级筛选值
    const checkedInfantRowInfo = ref(); //表格中选中的行信息

    // 班级筛选表格
    const handleSelect = (res: ClassList): void => {
      if (res) {
        classQuery.value = res.id;
      } else {
        classQuery.value = "";
      }
      getInfantList();
    };

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
            stuStatus: 1,
            name: searchInfo.value,
          }
        )
      );
      if (+code === 0) {
        tableData.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getInfantList();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getInfantList();
        }, 500);
      }
    );

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

    // 打开模态框
    const handleOpen = (res: RowItem) => {
      receiveObj.value = res;
      getInfantList();
      modalStatus.value = true;
    };

    // 关闭弹窗后初始化数据
    function closeModalInitInfo() {
      modalStatus.value = false;
      checkedInfantRowInfo.value = undefined;
      currentPage.value = 1;
      pageSize.value = 20;
      totalNum.value = 0;
      searchInfo.value = "";
      classQuery.value = "";
    }

    // 取消按钮
    const handleClose = () => {
      closeModalInitInfo();
    };

    // 获取表格里选择的行信息
    function getCheckedRow(res: InfantTableList) {
      checkedInfantRowInfo.value = res;
    }

    const queryUserFaceStatus = (id: string) => {
      let i = 5;
      const timer = setInterval(() => {
        GetUserFaceStatus(id).then((res) => {
          console.log(id);
          if (res.data.cardStatus) {
            clearInterval(timer);
            Message.success("绑定成功");
            modalOkText.value = "绑定";
            isBinding.value = false;
            closeModalInitInfo();
          }
        });
        i--;
        if (i <= 0) {
          clearInterval(timer);
          Message.error("照片不合规，请重新绑定");
          modalOkText.value = "绑定";
          isBinding.value = false;
        }
      }, 1000);
    };

    // 绑定人脸照片
    async function bindInfantInfo() {
      if (isBinding.value) {
        return;
      }

      if (!receiveObj.value.imageId) {
        Message.error("绑定失败");
        return;
      }

      isBinding.value = true;
      modalOkText.value = "绑定中...";

      const { clazzId, clazzName, id, name } = checkedInfantRowInfo.value;
      const { code, data } = await SaveFaceFeature({
        identity: "2",
        clazzId,
        clazzName,
        images: [receiveObj.value.imageId],
        studentId: id,
        studentName: name,
      });

      if (+code === 0) {
        queryUserFaceStatus(data.id);
      }
    }

    // 确认按钮
    const handleSure = () => {
      if (checkedInfantRowInfo.value === undefined) {
        return;
      }
      bindInfantInfo();
    };

    return {
      modalStatus,
      handleClose,
      handleSure,
      handleOpen,
      classList,
      handleSelect,
      searchInfo,
      handleSearchInfo,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      receiveObj,
      loading,
      tableData,
      getCheckedRow,
      modalOkText,
    };
  },
});
</script>
<style lang="less">
.bind-infant {
  .bind-infant-box {
    display: flex;

    .left-box {
      padding-right: 24px;
      margin-right: 25px;
      border-right: 1px solid #e8e8e8;

      > span {
        font-size: 12px;
        color: #999;
      }
      .img-box {
        width: 180px;
        height: 240px;
        margin-bottom: 10px;

        > img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }

    .right-box {
      flex-grow: 1;

      .top-filter-box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 15px;
      }

      .table-box {
        height: 403px;
        overflow: auto;

        &::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 8px;
          position: absolute;
          right: 0;
        }
        &::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          width: 6px;
          height: 90px;
          background-color: #bfbfbf;
          border-radius: 4px;
        }
        &::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          // -webkit-box-shadow: inset 0 0 5px rgba(0, 34, 68, 0.01);
          border-radius: 4px;
          background: rgba(0, 34, 68, 0);
        }
      }
    }
  }
}
</style>
