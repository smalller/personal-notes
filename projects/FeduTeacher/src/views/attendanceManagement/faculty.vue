<template>
  <div class="toddler">
    <div class="title">
      <span>{{ route.name }}</span>
      <div class="settingBox">
        <span>上班时间:</span>
        <span>每天 08:00 ~ 18:00</span>
        <span @click="modalVisible = true">编辑</span>
      </div>
    </div>
    <div>
      <ui-card class="chartBox">
        <div class="bin">
          <div class="chartTitle">
            教职工考勤率
            <el-tooltip
              content="当前考勤的统计"
              placement="bottom-start"
              effect="light"
            >
              <span>
                <ui-icon icon="icon-a-71"></ui-icon>
              </span>
            </el-tooltip>
          </div>
          <ui-echarts-pie :option="map"></ui-echarts-pie>
        </div>
        <div class="line">
          <div class="chartTitle">考勤趋势</div>
          <ui-echarts-line :option="map"></ui-echarts-line>
        </div>
      </ui-card>
    </div>
    <div class="tableBox">
      <ui-card>
        <div class="fromBox">
          <div>
            <div class="fromBoxItem">
              <span>职位</span>
              <ui-select v-model="form.project" style="width: 140px">
                <ui-select-option label="1" value="1"></ui-select-option>
                <ui-select-option label="2" value="2"></ui-select-option>
                <ui-select-option label="3" value="3"></ui-select-option>
              </ui-select>
            </div>
            <div class="fromBoxItem">
              <ui-date-picker
                type="daterange"
                range-separator="~"
                style="width: 240px"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></ui-date-picker>
            </div>
            <div class="fromBoxItem">
              <ui-input icon="icon-a-101" placeholder="输入姓名"></ui-input>
            </div>
          </div>
          <div>
            <div class="fromBoxItem">
              <ui-button type="text" icon="icon-a-31">导出Excel</ui-button>
            </div>
          </div>
        </div>
        <ui-table :data="data" class="tableBoxItem">
          <ui-table-column prop="id" label="教职工姓名" align="center">
            <template #default="{ row }">
              <div class="itemNameBox">
                <span>{{ row.id }}</span>
                <img :src="row.id" alt="" />
                <span>{{ row.status }}</span>
              </div>
            </template>
          </ui-table-column>
          <ui-table-column
            prop="id"
            label="称谓"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="考勤日期"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="进园打卡"
            align="left"
          ></ui-table-column>
          <ui-table-column prop="id" label="离园打卡" align="left">
            <template #default="{ row }">
              <span :style="{ color: getStatusText(row.status).color }">{{
                getStatusText(row.status).text
              }}</span>
            </template>
          </ui-table-column>
          <ui-table-column prop="id" label="操作" align="center">
            <template #default="{ row }">
              <ui-button
                type="text"
                style="color: #4fa8f9"
                @click="openItem(row.id)"
                >{{ activeId === row.id ? "收起" : "记录" }}</ui-button
              >
            </template>
          </ui-table-column>
          <template #details="{ row }">
            <div class="itemDetails" v-if="activeId === row.id">
              <div class="itemDetailsItem">
                <img :src="row.id" alt="" />
                <div class="infoBox">
                  <span class="time">进园打卡：09:30:21</span>
                  <span>代签：李晓梅老师</span>
                  <span>考勤卡号：685623548562575</span>
                </div>
              </div>
            </div>
          </template>
        </ui-table>
        <ui-pagination></ui-pagination>
      </ui-card>
    </div>
  </div>
  <ui-modal
    v-model:visible="modalVisible"
    title="编辑上班时间"
    width="700"
    class="toddlerModelBox"
    okText="保存"
  >
    <ui-form :data="schoolTimeForm" class="toddlerModelForm">
      <ui-form-item label="上班日期" prop="times">
        <ui-checkbox-group v-model="schoolTimeForm.times">
          <ui-checkbox>周一</ui-checkbox>
          <ui-checkbox>周二</ui-checkbox>
          <ui-checkbox>周三</ui-checkbox>
          <ui-checkbox>周四</ui-checkbox>
          <ui-checkbox>周五</ui-checkbox>
          <ui-checkbox>周六</ui-checkbox>
          <ui-checkbox>周末</ui-checkbox>
          <ui-checkbox>全部</ui-checkbox>
        </ui-checkbox-group>
      </ui-form-item>
      <ui-form-item label="上班时间" prop="time">
        <ui-date-picker></ui-date-picker>
      </ui-form-item>
    </ui-form>
  </ui-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";

type Toddler = {
  id: string;
  status: number;
};

export default defineComponent({
  setup() {
    const modalVisible = ref(false);
    const tableIndex = ref(0);
    const map = reactive({
      titleValue: "55",
      title: "今日出勤率",
      isHome: false,
      data: [
        {
          value: 70,
          name: "缺勤",
          color: "#4FA8F9",
        },
        {
          value: 30,
          name: "请假",
          color: "#42C7C6",
        },
        {
          value: 40,
          name: "已出勤",
          color: "#FFB73B",
        },
      ],
    });
    const form = reactive({
      page: 0,
      pageSize: 20,
      count: 100,
      project: "",
      userName: "",
    });
    const schoolTimeForm = reactive({
      times: [],
    });
    const data = ref([] as Array<Toddler>);
    data.value = [
      {
        id: "2",
        status: 0,
      },
      {
        id: "3",
        status: 1,
      },
      {
        id: "4",
        status: 2,
      },
      {
        id: "5",
        status: 3,
      },
      {
        id: "6",
        status: 4,
      },
      {
        id: "4",
        status: 2,
      },
      {
        id: "5",
        status: 3,
      },
      {
        id: "6",
        status: 4,
      },
      {
        id: "4",
        status: 2,
      },
      {
        id: "5",
        status: 3,
      },
      {
        id: "6",
        status: 4,
      },
      {
        id: "4",
        status: 2,
      },
      {
        id: "5",
        status: 3,
      },
      {
        id: "6",
        status: 4,
      },
    ];
    const route = useRoute();
    const activeId = ref("2");

    /**
     * 获取考勤状态文字和颜色
     * @param status
     */
    const getStatusText = (status: number) => {
      const statusList = ["迟到", "缺卡", "事假", "代签", "正常"];
      const statusColorList = [
        "#7673C1",
        "#F56060",
        "#FF9900",
        "#42C7C6",
        "#222222",
      ];

      return {
        text: statusList[status],
        color: statusColorList[status],
      };
    };

    /**
     * 显示考勤详情
     * @param id
     */
    const openItem = (id: string) => {
      activeId.value = activeId.value === id ? "" : id;
    };

    return {
      route,
      tableIndex,
      data,
      activeId,
      form,
      modalVisible,
      schoolTimeForm,
      map,
      getStatusText,
      openItem,
    };
  },
});
</script>

<style lang="less">
.toddler {
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    .settingBox {
      display: flex;
      height: 36px;
      align-items: center;
      padding: 0 12px;
      margin-left: 40px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      opacity: 1;
      border-radius: 3px;
      span {
        font-size: 14px;
        &:nth-child(1) {
        }
        &:nth-child(2) {
          color: #ff9900;
          margin-left: 4px;
        }
        &:nth-child(3) {
          cursor: pointer;
          color: #bfbfbf;
          margin-left: 32px;
          user-select: none;
          &:hover {
            color: #61b4ff;
          }
          &:active {
            color: #bfbfbf;
          }
        }
      }
    }
  }
  .chartBox {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .bin {
      flex: 29;
      height: 260px;
      min-width: 460px;
      margin-bottom: 24px;
    }
    .line {
      flex: 68;
      height: 260px;
      min-width: 460px;
    }
    .chartTitle {
      color: #222222;
      font-size: 20px;
      display: flex;
      align-items: center;
      .icon {
        margin-left: 5px;
        width: 15px;
        height: 15px;
        fill: #bfbfbf;
      }
      > span {
        display: flex;
        align-items: center;
      }
    }
  }
  .tableBox {
    margin-top: 24px;
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
        display: flex;
        white-space: nowrap;
        align-items: center;
        margin-bottom: 10px;
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
}
.toddlerModelBox {
  .el-checkbox {
    margin-right: 16px;
  }
  .toddlerModelForm {
    margin-top: 20px;
    margin-bottom: 48px;
  }
}
</style>
