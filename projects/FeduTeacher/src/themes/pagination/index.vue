<template>
  <!--  <div class="ui-pagination"></div>-->
  <el-pagination
    class="ui-pagination"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page.currentPage"
    :page-sizes="pageSizes"
    :page-size="page.pageSize"
    :pager-count="pagerCount"
    layout="total, sizes, prev, pager, next, jumper"
    :total="page.total"
  >
  </el-pagination>
</template>

<script lang="ts">
import { ElPagination } from "element-plus";
import { defineComponent, reactive, watch } from "vue";

export default defineComponent({
  name: "ui-pagination",
  components: {
    ElPagination,
  },
  props: {
    pageSize: {
      type: Number || String,
      default: 20,
    },
    total: {
      type: Number || String,
      default: 200,
    },
    currentPage: {
      type: Number || String,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [20, 50, 100, 200];
      },
    },
    pagerCount: {
      type: Number,
      default: 7,
    },
  },
  emits: {
    handleSizeChange: null,
    handleCurrentChange: null,
  },
  setup(props, context) {
    const page = reactive({
      currentPage: props.currentPage,
      pageSize: props.pageSize,
      total: props.total,
    });
    watch(
      () => props.total,
      (newValue: number) => {
        page.total = newValue;
        page.currentPage = props.currentPage;
        page.pageSize = props.pageSize;
      }
    );

    watch(
      () => props.pageSize,
      () => {
        page.total = props.total;
        page.currentPage = props.currentPage;
        page.pageSize = props.pageSize;
      }
    );

    /**
     * 每页条数修改
     * @param val
     */
    const handleSizeChange = (val: number) => {
      page.pageSize = val;
      context.emit("handleSizeChange", val);
    };
    /**
     * 翻页
     * @param val
     */
    const handleCurrentChange = (val: number) => {
      page.currentPage = val;
      context.emit("handleCurrentChange", val);
    };

    return {
      page,
      handleSizeChange,
      handleCurrentChange,
    };
  },
});
</script>

<style lang="less">
.ui-pagination {
  display: flex;
  justify-content: flex-end;
  position: relative;
  align-items: center;
  margin-top: 18px;
  .btn-prev,
  .btn-next {
    background: rgba(255, 255, 255, 0) !important;
    border: 1px solid #d8d8d8 !important;
    border-radius: 3px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      color: #999999 !important;
    }
    &:hover {
      i {
        color: #666666 !important;
      }
    }
  }
  .el-pager {
    .number {
      background: rgba(255, 255, 255, 0) !important;
      &:hover {
        color: #222222 !important;
        background: #f1f1f1 !important;
      }
    }
    .active {
      background-color: #ff9900 !important;
      &:hover {
        background-color: #ff9900 !important;
        color: #ffffff !important;
      }
    }
  }
  .el-pagination__total {
    position: absolute;
    left: 0;
    font-size: 14px !important;
    height: 32px !important;
    display: flex !important;
    align-items: center;
  }
  .el-pagination__sizes {
    position: absolute;
    left: 60px;
  }
  .el-pagination__jump {
    display: flex !important;
    align-items: center !important;
    .el-pagination__editor {
      .el-input__inner {
        height: 100% !important;
      }
    }
  }
}
</style>
