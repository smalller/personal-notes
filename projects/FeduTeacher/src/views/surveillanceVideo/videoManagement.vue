<template>
  <div class="videoManagement">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div style="margin-top: 20px" v-show="false" class="">
      <ui-card class="chartBox">
        <div class="bin">
          <div class="chartTitle">
            视频开启率
            <el-tooltip
              content="当前视频的统计"
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
          <div class="chartTitle">摄像头开启趋势</div>
          <ui-echarts-line :option="tt"></ui-echarts-line>
        </div>
      </ui-card>
    </div>
    <div class="tableBox">
      <ui-card>
        <ui-tab
          v-model:index="tableIndex"
          :list="['视频列表', '场景列表']"
        ></ui-tab>
        <video-list v-if="tableIndex === 0"></video-list>
        <site-management v-if="tableIndex === 1"></site-management>
      </ui-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import VideoList from "@/views/surveillanceVideo/videoList.vue";
import SiteManagement from "@/views/surveillanceVideo/siteManagement.vue";
import { ElTooltip } from "element-plus";

type Toddler = {
  id: string;
  status: number;
};

export default defineComponent({
  components: { SiteManagement, VideoList, ElTooltip },
  setup() {
    const modalVisible = ref(false);
    const tableIndex = ref(0);
    const map = reactive({
      titleValue: "55",
      title: "已开启",
      value: 60,
      data: [
        {
          value: 70,
          name: "已开启",
          color: "#FFB73B",
        },
        {
          value: 30,
          name: "未开启",
          color: "#F5F5F5",
        },
      ],
    });
    const tt = reactive({
      title: "已开启",
      name: ["太阳班", "太阳班1", "太阳班2", "太阳班3", "太阳班4", "太阳班5"],
      data: [100, 200, 400, 450, 500, 600],
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
      tt,
      getStatusText,
      openItem,
    };
  },
});
</script>

<style lang="less">
.videoManagement {
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
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
    margin-top: 20px;
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
