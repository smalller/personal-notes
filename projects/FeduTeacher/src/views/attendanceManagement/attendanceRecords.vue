<template>
  <div class="attendanceRecords">
    <div class="fromBox">
      <div>
        <div class="fromBoxItem">
          <span>班级</span>
          <ui-select
            v-model="form.classId"
            style="width: 140px"
            @change="classChange"
          >
            <ui-select-option label="全部班级" value=""></ui-select-option>
            <ui-select-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></ui-select-option>
          </ui-select>
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
        <div class="fromBoxItem">
          <ui-input
            v-model="form.name"
            icon="icon-a-101"
            placeholder="输入姓名"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
        </div>
      </div>
      <div></div>
    </div>
    <ui-table :data="data" class="tableBoxItem">
      <ui-table-column prop="id" label="幼儿姓名" align="center">
        <template #default="{ row }">
          <div class="itemNameBox">
            <span></span>
            <img :src="row.headerImg" alt="" />
            <span>{{ row.stuName }}</span>
          </div>
        </template>
      </ui-table-column>
      <ui-table-column
        prop="clazzName"
        label="班级"
        align="left"
      ></ui-table-column>
      <ui-table-column
        prop="attendanceDate"
        label="考勤日期"
        align="left"
      ></ui-table-column>
      <!--          <ui-table-column-->
      <!--            prop="attendanceDate"-->
      <!--            label="打卡日期"-->
      <!--            align="left"-->
      <!--          ></ui-table-column>-->
      <!--          <ui-table-column prop="id" label="离园打卡" align="left">-->
      <!--            <template #default="{ row }">-->
      <!--              <span :style="{ color: getStatusText(row.status).color }">{{-->
      <!--                getStatusText(row.status).text-->
      <!--              }}</span>-->
      <!--            </template>-->
      <!--          </ui-table-column>-->
      <ui-table-column prop="id" label="操作" align="center">
        <template #default="{ row }">
          <ui-button
            type="text"
            style="color: #4fa8f9"
            @click="openItem(row)"
            >{{ activeId === row.id ? "收起" : "记录" }}</ui-button
          >
        </template>
      </ui-table-column>
      <template #details="{ row }">
        <div class="itemDetails" v-if="activeId === row.id">
          <div
            class="itemDetailsItem"
            v-for="item in row.attendanceInfo"
            :key="item.id"
          >
            <img :src="item.images[0] || ''" alt="" />
            <div class="infoBox">
              <span class="time"
                >打卡时间：{{ formatDate(item.attendanceTime) }}</span
              >
              <span>代签：</span>
              <!--                  <span>考勤卡号：{{ item.id }}</span>-->
            </div>
          </div>
        </div>
      </template>
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
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import dayjs from "dayjs";
import { attendanceInfoQuery } from "@/api/attendanceManagement";
import { useStore } from "vuex";
import { getImgUrl } from "@/api/common";

type Toddler = {
  id: string;
  status: number;
};
export default defineComponent({
  name: "attendanceRecords",
  setup(props) {
    const $store = useStore();
    const form = reactive({
      time: ["", ""],
      classId: "",
      name: "",
    });
    const activeImg = ref("");
    const activeId = ref("2");
    const pageForm = reactive({
      page: 1,
      pageSize: 20,
      total: 0,
    });
    const selectTimesValue = ref("");

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

    const timeChange = (e: any) => {
      if (!e) {
        selectTimesValue.value = "";
        timeSelectChange(e);
      } else {
        queryFrom();
      }
      handleSearchInfo();
    };
    /**
     * 查询班级列表
     */
    $store.dispatch("getClassList");
    const classList = computed(() => $store.state.commonData.classList);

    const data = ref([] as Array<Toddler>);

    /**
     * 日期格式化
     * @param time
     */
    const formatDate = (time: string): string => {
      return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
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
     * 选择班级
     */
    const classChange = (): void => {
      queryFrom();
    };

    /**
     * 查询数据
     */
    const queryFrom = () => {
      const params = {
        identity: 2,
        pageNo: pageForm.page,
        pageSize: pageForm.pageSize,
        startDate: "",
        endDate: "",
        clazzId: form.classId,
        stuName: form.name,
      };
      if (form.time[0] && form.time[1]) {
        params.startDate = dayjs(form.time[0]).format("YYYY-MM-DD");
        params.endDate = dayjs(form.time[1]).format("YYYY-MM-DD");
      }
      attendanceInfoQuery(params).then((res) => {
        if (res.code === 0) {
          pageForm.total = res.data.page.totalNum;
          data.value = res.data.list;
        }
      });
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

    /**
     * 通过名称查询数据
     */
    const handleSearchInfo = (): void => {
      // console.log(form.name);
      queryFrom();
    };

    let searchTime: number;
    watch(
      () => form.name,
      () => {
        if (searchTime) {
          clearTimeout(searchTime);
        }
        searchTime = setTimeout(() => {
          queryFrom();
        }, 500);
      }
    );

    type Row = {
      id: string;
      images: string;
    };
    /**
     * 显示考勤详情
     * @param row
     */
    const openItem = (row: Row) => {
      activeImg.value = "";
      activeId.value = activeId.value === row.id ? "" : row.id;
      const imgs = row.images ? JSON.parse(row.images) : [];
      if (imgs.length > 0) {
        getImgUrl(imgs[0]).then((res) => {
          if (res.code === 0) {
            activeImg.value = res.data;
          }
        });
      }
    };
    queryFrom();
    return {
      form,
      pageForm,
      classList,
      selectTimesValue,
      selectTimes,
      data,
      activeId,
      pageChange,
      pageSizeChange,
      queryFrom,
      formatDate,
      classChange,
      timeSelectChange,
      handleSearchInfo,
      openItem,
      timeChange,
    };
  },
});
</script>
<style lang="less" scoped>
.attendanceRecords {
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
  .tableBoxItem {
    .itemNameBox {
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
        margin-left: 20px;
        margin-right: 10px;
        border-radius: 4px;
      }
      span {
        color: #222222;
        font-size: 14px;
      }
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
      width: 350px;
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
</style>
