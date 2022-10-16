<template>
  <div class="indexlayout-main-conent">
    <el-card
      shadow="never"
      class="cus-card"
      style="margin-bottom: 15px;height:80px;"
      :body-style="{ 'padding-bottom': '0' }"
    >
      <el-button @click="typeNum = 0">发布商品</el-button>
      <el-button @click="typeNum = 1">订单明细</el-button>

    </el-card>
    <list v-if="typeNum === 0"></list>
    <detail v-if="typeNum === 1"></detail>

  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  ComputedRef,
  Ref,
} from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage, ElForm } from "element-plus";
// import IconSvg from "@/components/IconSvg/index";
// import CreateForm from "./components/CreateForm.vue";
// import UpdateForm from "./components/UpdateForm.vue";
// import TypeSelect from "./components/TypeSelect.vue";
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from "./data";
import list from "./list/index.vue";
import detail from "./detail/index.vue";

interface ListSearchTablePageSetupData {
  list: ComputedRef<TableListItem[]>;
  pagination: ComputedRef<PaginationConfig>;
  loading: Ref<boolean>;
  getList: (current: number) => Promise<void>;
  createFormVisible: Ref<boolean>;
  setCreateFormVisible: (val: boolean) => void;
  createSubmitLoading: Ref<boolean>;
  createSubmit: (
    values: Omit<TableListItem, "id">,
    resetFields: () => void
  ) => Promise<void>;
  detailUpdateLoading: Ref<number[]>;
  detailUpdateData: (id: number) => Promise<void>;
  updateData: ComputedRef<Partial<TableListItem>>;
  updateFormVisible: Ref<boolean>;
  updataFormCancel: () => void;
  updateSubmitLoading: Ref<boolean>;
  updateSubmit: (
    values: TableListItem,
    resetFields: () => void
  ) => Promise<void>;
  deleteLoading: Ref<number[]>;
  deleteTableData: (id: number) => void;
  tabVal: Ref<string>;
  searchOpen: Ref<boolean>;
  setSearchOpen: () => void;
  searchModelRef: Omit<TableListItem, "id">;
  searchFormRef: Ref<typeof ElForm | undefined>;
  searchResetFields: () => void;
  searchFormSubmit: () => Promise<void>;
  typeNum: Ref<number | string>;
}

export default defineComponent({
  name: "ListSearchTablePage",
  components: {
    // CreateForm,
    // UpdateForm,
    // TypeSelect,
    list,
    detail,
  },
  setup(): ListSearchTablePageSetupData {
    const store = useStore<{ ListSearchTable: ListStateType }>();

    // // 列表数据
    const list = computed<TableListItem[]>(() => [
      {
        id: 1,
        name: "45",
        desc: "65",
        href: "564",
        type: "14235",
      },
    ]);
    // const list = [];
    // 列表分页
    const pagination = computed<PaginationConfig>(
      () => store.state.ListSearchTable.tableData.pagination
    );

    // 获取数据
    const loading = ref<boolean>(true);
    const getList = async (current: number): Promise<void> => {
      loading.value = true;
      await store.dispatch("ListSearchTable/queryTableData", {
        per: pagination.value.pageSize,
        page: current,
      });
      loading.value = false;
    };

    // 新增弹框 - visible
    const createFormVisible = ref<boolean>(false);
    const setCreateFormVisible = (val: boolean) => {
      createFormVisible.value = val;
    };
    // 新增弹框 - 提交 loading
    const createSubmitLoading = ref<boolean>(false);
    // 新增弹框 - 提交
    const createSubmit = async (
      values: Omit<TableListItem, "id">,
      resetFields: () => void
    ) => {
      createSubmitLoading.value = true;
      const res: boolean = await store.dispatch(
        "ListSearchTable/createTableData",
        values
      );
      if (res === true) {
        resetFields();
        setCreateFormVisible(false);
        ElMessage.success("新增成功！");
        getList(1);
      }
      createSubmitLoading.value = false;
    };

    // 编辑弹框 - visible
    const updateFormVisible = ref<boolean>(false);
    const setUpdateFormVisible = (val: boolean) => {
      updateFormVisible.value = val;
    };
    const updataFormCancel = () => {
      setUpdateFormVisible(false);
      store.commit("ListSearchTable/setUpdateData", {});
    };
    // 编辑弹框 - 提交 loading
    const updateSubmitLoading = ref<boolean>(false);
    // 编辑弹框 - 提交
    const updateSubmit = async (
      values: TableListItem,
      resetFields: () => void
    ) => {
      updateSubmitLoading.value = true;
      const res: boolean = await store.dispatch(
        "ListSearchTable/updateTableData",
        values
      );
      if (res === true) {
        updataFormCancel();
        ElMessage.success("编辑成功！");
        getList(pagination.value.current);
      }
      updateSubmitLoading.value = false;
    };

    // 编辑弹框 data
    const updateData = computed<Partial<TableListItem>>(
      () => store.state.ListSearchTable.updateData
    );
    const detailUpdateLoading = ref<number[]>([]);
    const detailUpdateData = async (id: number) => {
      detailUpdateLoading.value = [id];
      const res: boolean = await store.dispatch(
        "ListSearchTable/queryUpdateData",
        id
      );
      if (res === true) {
        setUpdateFormVisible(true);
      }
      detailUpdateLoading.value = [];
    };

    // 删除 loading
    const deleteLoading = ref<number[]>([]);
    // 删除
    const deleteTableData = (id: number) => {
      ElMessageBox.confirm("确定删除吗？", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          deleteLoading.value = [id];
          const res: boolean = await store.dispatch(
            "ListSearchTable/deleteTableData",
            id
          );
          if (res === true) {
            ElMessage.success("删除成功！");
            getList(pagination.value.current);
          }
          deleteLoading.value = [];
        })
        .catch((error: any) => {
          console.log(error);
        });
    };

    const tabVal = ref<string>("all");

    // 搜索
    const searchOpen = ref<boolean>(false);
    const setSearchOpen = (): void => {
      searchOpen.value = !searchOpen.value;
    };
    // 表单值
    const searchModelRef = reactive<Omit<TableListItem, "id">>({
      name: "",
      desc: "",
      href: "",
      type: "",
    });
    // search form
    const searchFormRef = ref<typeof ElForm>();
    // 重置
    const searchResetFields = () => {
      searchFormRef.value?.resetFields();
      searchModelRef.name = "";
      searchModelRef.desc = "";
      searchModelRef.href = "";
      searchModelRef.type = "";
    };
    // 搜索
    const searchFormSubmit = async () => {
      try {
        console.log("search", searchModelRef);
        ElMessage.warning("进行了搜索!");
      } catch (error: any) {
        ElMessage.warning(error);
      }
    };
    const typeNum = ref<number>(0);

    onMounted(() => {
      getList(1);
    });

    return {
      typeNum,
      list,
      pagination,
      loading,
      getList,
      createFormVisible,
      setCreateFormVisible,
      createSubmitLoading,
      createSubmit,
      detailUpdateLoading,
      detailUpdateData,
      updateData,
      updateFormVisible,
      updataFormCancel,
      updateSubmitLoading,
      updateSubmit,
      deleteLoading,
      deleteTableData,
      tabVal,
      searchOpen,
      setSearchOpen,
      searchModelRef,
      searchFormRef,
      searchResetFields,
      searchFormSubmit,
    };
  },
});
</script>
