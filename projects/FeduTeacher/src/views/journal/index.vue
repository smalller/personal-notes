<template>
  <div class="journal">
    <ui-card>
      <div class="fromBox" v-show="false">
        <div>
          <div class="fromBoxItem">
            <span>操作人</span>
            <ui-input
              icon="icon-a-101"
              placeholder="操作人"
              @keydown.enter="operationUserSearch"
              @iconClick="operationUserSearch"
            />
          </div>
          <div class="fromBoxItem">
            <span>操作</span>
            <ui-input
              icon="icon-a-101"
              placeholder="操作"
              @keydown.enter="operationSearch"
              @iconClick="operationSearch"
            />
          </div>
          <div class="fromBoxItem">
            <span>时间</span>
            <ui-select
              @change="timeSelectChange"
              v-model="selectTimesValue"
              style="width: 140px"
            >
              <ui-select-option
                v-for="item in selectTimes"
                :label="item.text"
                :key="item.text"
                :value="item.value"
              ></ui-select-option>
              <ui-select-option label="全部时间" value=""></ui-select-option>
            </ui-select>
          </div>
          <div class="fromBoxItem">
            <ui-date-picker
              v-model="form.time"
              type="daterange"
              range-separator="~"
              style="width: 260px !important"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
            ></ui-date-picker>
          </div>
        </div>
      </div>
      <ui-table :data="list">
        <ui-table-column
          prop="createTime"
          label="时间"
          align="left"
        ></ui-table-column>
        <ui-table-column
          prop="empName"
          label="操作人"
          align="center"
        ></ui-table-column>
        <ui-table-column
          prop="id"
          label="账户号"
          align="left"
        ></ui-table-column>
        <ui-table-column
          prop="type"
          label="操作"
          align="left"
        ></ui-table-column>
      </ui-table>
      <!--      <ui-pagination-->
      <!--        :total="pageForm.total"-->
      <!--        :currentPage="pageForm.page"-->
      <!--        :pageSize="pageForm.pageSize"-->
      <!--        @handleCurrentChange="pageChange"-->
      <!--        @handleSizeChange="pageSizeChange"-->
      <!--      >-->
      <!--      </ui-pagination>-->
    </ui-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import dayjs from "dayjs";
import { getJournal } from "@/api/journal";

export default defineComponent({
  name: "journal",
  setup() {
    const selectTimes = reactive([
      {
        text: "今天",
        value: dayjs().toDate(),
      },
      {
        text: "昨天",
        value: (() => {
          const date = dayjs().toDate();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        })(),
      },
      {
        text: "三天内",
        value: (() => {
          const date = dayjs().toDate();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
          return date;
        })(),
      },
      {
        text: "七天内",
        value: (() => {
          const date = dayjs().toDate();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return date;
        })(),
      },
    ]);
    const pageForm = reactive({
      total: 0,
      page: 1,
      pageSize: 20,
    });

    const form = reactive({
      time: ["", ""],
      classId: "",
      name: "",
    });

    const selectTimesValue = ref("");

    const list = ref([]);

    const pageChange = (page: number) => {
      pageForm.page = page;
    };
    const pageSizeChange = (pageSize: number) => {
      pageForm.pageSize = pageSize;
    };

    /**
     * 快捷选择时间
     * @param time
     */
    const timeSelectChange = (time: string): void => {
      // selectTimesValue.value = time;
      if (time) {
        form.time[0] = time;
        form.time[1] = dayjs().toDate().toDateString();
      } else {
        form.time = ["", ""];
      }
      queryFrom();
    };

    const timeChange = (e: any) => {
      if (!e) {
        selectTimesValue.value = "";
        timeSelectChange(e);
      }
    };

    /**
     * 通过操作查询数据
     */
    const operationSearch = () => {
      queryFrom();
    };

    /**
     * 通过操作人查询数据
     */
    const operationUserSearch = () => {
      queryFrom();
    };

    const queryFrom = () => {
      console.log("11");
      getJournal({
        pageNo: pageForm.page,
        pageSize: pageForm.pageSize,
      }).then((res) => {
        list.value = res.data;
      });
    };
    queryFrom();

    return {
      pageForm,
      selectTimesValue,
      selectTimes,
      form,
      list,
      pageChange,
      pageSizeChange,
      timeSelectChange,
      queryFrom,
      timeChange,
      operationSearch,
      operationUserSearch,
    };
  },
});
</script>

<style scoped lang="less">
.journal {
  .fromBox {
    display: flex;
    padding: 22px 0 15px 0;
    justify-content: space-between;

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
}
</style>
