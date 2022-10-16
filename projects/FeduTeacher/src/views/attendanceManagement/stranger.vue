<template>
  <BindInfant ref="bindInfantCom"></BindInfant>
  <div class="stranger">
    <div class="fromBox">
      <DateFilter @handleSelectDate="handleSelectDate"></DateFilter>
    </div>
    <div class="tableBox">
      <ui-table :data="data">
        <ui-table-column label="人脸信息">
          <template #default="{ row }">
            <img
              class="userImg"
              :src="`data:image/png;base64,${row.snapImage}`"
              alt=""
            />
          </template>
        </ui-table-column>
        <ui-table-column label="访问时间" prop="createTime"></ui-table-column>
        <ui-table-column label="操作" align="right">
          <template #default="{ row }">
            <el-button :data="row" type="text" @click="handleBindInfant(row)"
              >绑定幼儿</el-button
            >
          </template>
        </ui-table-column>
      </ui-table>
      <ui-pagination
        :total="pageForm.total"
        :currentPage="pageForm.page"
        :pageSize="pageForm.pageSize"
        @handleCurrentChange="pageChange"
        @handleSizeChange="pageSizeChange"
      >
      </ui-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { AnonyuserList } from "@/api/common";
import DateFilter from "@/components/DateFilter.vue";
import micell from "micell";
import BindInfant from "./BindInfant.vue";

export interface RowItem {
  snapImage: string;
  createTime: string;
  [key: string]: any;
}

export default defineComponent({
  components: {
    DateFilter,
    BindInfant,
  },

  setup() {
    const pageForm = reactive({
      page: 1,
      pageSize: 20,
      total: 0,
    });
    const data = ref<RowItem[]>([]);
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间
    const bindInfantCom = ref(null);

    function handleBindInfant(res: RowItem) {
      (bindInfantCom.value as any).handleOpen(res);
    }

    // 日期筛选
    const handleSelectDate = (res: string): void => {
      if (res) {
        startTime.value =
          micell.date.format(res[0], "YYYY-MM-DD") + " 00:00:00";
        endTime.value = micell.date.format(res[1], "YYYY-MM-DD") + " 23:59:59";
      } else {
        startTime.value = "";
        endTime.value = "";
      }
      queryFrom();
    };

    /**
     * 翻页
     * @param page
     */
    const pageChange = (page: number) => {
      pageForm.page = page;
      queryFrom();
    };

    /**
     * pageSize修改
     * @param pageSize
     */
    const pageSizeChange = (pageSize: number) => {
      pageForm.pageSize = pageSize;
      queryFrom();
    };

    /**
     * 查询数据
     */
    const queryFrom = () => {
      const params = {
        pageNo: pageForm.page,
        pageSize: pageForm.pageSize,
        startDate: startTime.value,
        endDate: endTime.value,
      };

      AnonyuserList(params).then((res) => {
        console.log(res);
        if (res.code === 0) {
          //data:image/png;base64,
          pageForm.total = res.data.page.totalNum;
          data.value = res.data.list;
        }
      });
    };
    queryFrom();

    return {
      data,
      pageForm,
      queryFrom,
      pageChange,
      pageSizeChange,
      handleSelectDate,
      handleBindInfant,
      bindInfantCom,
    };
  },
});
</script>
<style lang="less" scoped>
.stranger {
  .fromBox {
    display: flex;
    padding: 22px 0 15px 0;
    // justify-content: space-between;

    > div {
      display: flex;
      flex-wrap: wrap;
    }
    .fromBoxItem {
      margin-right: 16px;
      margin-bottom: 12px;
      display: flex;
      white-space: nowrap;
      align-items: center;
      .el-input {
        height: 32px;
        line-height: 32px;
      }
    }
    span {
      font-size: 14px;
      color: #999999;
      margin-right: 6px;
    }
  }

  .tableBox {
    .userImg {
      padding: 12px 0;
      width: 80px;
      height: 80px;
      border-radius: 14px;
      box-sizing: content-box;
    }
  }
}
</style>
