<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleAdd"
    :title="`添加学员 【${title}】`"
    width="920"
    :tips="false"
  >
    <div class="body-text-box">
      <div class="filter-box">
        <SelectPostOrClass
          title="班级"
          placeholder="全部班级"
          width="140"
          :list="classList"
          @handleSelect="handleSelect"
        >
        </SelectPostOrClass>
        <ui-input
          style="width: 240px; margin-left: 16px"
          v-model="searchInfo"
          placeholder="输入姓名或电话"
          icon="icon-a-101"
          @keydown.enter="handleSearchInfo"
          @iconClick="handleSearchInfo"
        ></ui-input>
      </div>
      <div class="table-wrap">
        <div class="table-box">
          <ui-table
            ref="tableCom"
            :data="tableData"
            :checkbox="true"
            v-loading="loading"
            @selectChange="selectChange"
          >
            <ui-table-column label="学员姓名">
              <template #default="{ row }">
                <div class="name-box">
                  <img
                    class="avatar"
                    :src="
                      row.headerImgUrl
                        ? row.headerImgUrl
                        : require('@/assets/infant-avatar.png')
                    "
                    alt=""
                  />
                  <span>{{ row.name || "-" }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column prop="contacts" label="家长电话">
            </ui-table-column>
            <ui-table-column label="性别/年龄">
              <template #default="{ row }">
                <div class="sex-age">
                  <ui-icon
                    class="icon-avatar"
                    :icon="row.sex === 1 ? 'icon-a-zu7652' : 'icon-a-zu7653'"
                  ></ui-icon>
                  <span>{{ getAge(row.birthTime) }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column prop="clazzName" label="班级"></ui-table-column>
            <ui-table-column prop="" label="状态">
              <template #default="{ row }">
                <span
                  :style="{ color: +row.courseStatus === 1 ? '#42C7C6' : '' }"
                  >{{ +row.courseStatus === 1 ? "已报名" : "未报名" }}</span
                >
              </template>
            </ui-table-column>
          </ui-table>
        </div>
        <div class="table-box" style="width: 300px">
          <ui-table :data="selectStudentList">
            <ui-table-column label="已选中">
              <template #default="{ row }">
                <div class="name-box">
                  <img
                    class="avatar"
                    :src="
                      row.headerImgUrl
                        ? row.headerImgUrl
                        : require('@/assets/infant-avatar.png')
                    "
                    alt=""
                  />
                  <span>{{ row.name || "-" }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column label="">
              <template #default="{ row }">
                <ui-button type="text-info" @click="handleDelete(row)"
                  >删除</ui-button
                >
              </template>
            </ui-table-column>
          </ui-table>
        </div>
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
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import { useStore } from "vuex";
import { ClassList, ListRow } from "../index";
import { getTableList } from "@/api/infantManage";
import { throttle } from "@/utils/common";
import { courseSign } from "@/api/recruitStudentsPlan";
import Message from "@/themes/message";
import dayjs from "dayjs";
import { getAge } from "@/utils/common";
import bus from "@/Layout/bus";

export default defineComponent({
  components: {
    SelectPostOrClass,
  },
  setup() {
    const loading = ref(false);
    const $store = useStore();
    $store.dispatch("getClassList");
    let classList = JSON.parse(
      JSON.stringify($store.state.commonData.classList)
    ); // 班级列表
    classList.unshift({ id: "", name: "全部班级" });
    const courseInfo = ref() as any; // 当前的课程信息
    const tableData = ref([] as Array<ListRow>); // 表格数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const classQuery = ref(""); // 班级筛选值
    const searchInfo = ref(""); // 输入框搜索值

    const modalStatus = ref(false);
    const title = ref("");

    const selectStudentList = ref<any>([]);
    let list: any[] = []; //当前选中的数据容器
    const tableCom = ref(null);

    // 初始化筛选数据
    const initQueryData = (): void => {
      currentPage.value = 1;
      searchInfo.value = "";
      classQuery.value = "";
    };

    // 关闭抽屉回调
    const handleClose = (): void => {
      initQueryData();
      modalStatus.value = false;
    };

    // 打开抽屉
    const handleOpen = (res: ListRow): void => {
      console.log(res);
      title.value = res.courseName;
      courseInfo.value = res;
      getStudentsList();
      modalStatus.value = true;
    };

    // 获取表格内容
    const getStudentsList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await getTableList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            clazzId: classQuery.value,
            name: searchInfo.value,
            courseId: courseInfo.value.id,
          }
        )
      );
      if (+code === 0) {
        tableData.value = data.list.map((item: any) => {
          item.checkboxDisabled = !!+item.courseStatus;
          return item;
        });
        totalNum.value = data.page.totalNum;
        loading.value = false;

        setTimeout(() => {
          showSelectedData();
        }, 200);
      }
    };

    // 班级筛选表格
    const handleSelect = (res: ClassList): void => {
      if (res) {
        classQuery.value = res.id;
      } else {
        classQuery.value = "";
      }
      getStudentsList();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getStudentsList();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getStudentsList();
        }, 500);
      }
    );

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getStudentsList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getStudentsList();
      list = [];
    };

    // 添加学员到课程
    async function handleAdd() {
      let data = {
        planId: courseInfo.value.planId,
        courseId: courseInfo.value.courseId,
        studentList: [],
      } as any;

      selectStudentList.value.forEach((item: any) => {
        data.studentList.push({
          studentId: item.id,
        });
      });

      const { code } = await courseSign(data);
      if (+code === 0) {
        // getStudentsList();
        bus.$emit("updateAddStuComplete");
        modalStatus.value = false;
        Message.success("添加成功");
      }
    }

    // 勾选行事件
    const selectChange = (res: any): void => {
      // 找到取消勾选的那条数据
      list.forEach((item) => {
        const row = res.find((d: any) => d.id === item.id);
        if (!row) {
          // 从已选中列表中删除取消勾选的数据
          selectStudentList.value = selectStudentList.value.filter(
            (j: any) => j.id !== item.id
          );
        }
      });

      // 勾选中的数据
      res.forEach((item: any) => {
        const flag = selectStudentList.value.find((i: any) => i.id === item.id);
        if (!flag) {
          selectStudentList.value.push(item);
        }
      });

      list = res; // 记录当前选中的数据
    };

    // 回显已经勾选了的学生
    function showSelectedData() {
      selectStudentList.value.forEach((item: any) => {
        (tableCom.value as any).toggleRowSelection(item);
      });
    }

    // 删除已选中学生
    function handleDelete(item: any) {
      selectStudentList.value = selectStudentList.value.filter(
        (j: any) => j.id !== item.id
      );
      (tableCom.value as any).removeRowSelection(item);
    }

    return {
      handleClose,
      handleOpen,
      modalStatus,
      classList,
      handleSelect,
      searchInfo,
      handleSearchInfo,
      tableData,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      handleAdd,
      loading,
      dayjs,
      getAge,
      courseInfo,
      title,
      selectChange,
      selectStudentList,
      tableCom,
      handleDelete,
    };
  },
});
</script>
<style lang="less" scoped>
.body-text-box {
  .filter-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .name-box {
    display: flex;
    align-items: center;

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }

  .table-wrap {
    display: flex;
    justify-content: space-between;

    .table-box {
      border: 1px solid #e8e8e8;
      border-radius: 3px;
      height: 400px;
      overflow: auto;

      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 6px;
        /*高宽分别对应横竖滚动条的尺寸*/
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
</style>
