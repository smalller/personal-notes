<template>
  <div class="toddler">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="tableBox">
      <ui-card>
        <ui-tab
          v-model:index="tableIndex"
          :list="['设备列表', '轮播通知', '轮播广告']"
        ></ui-tab>
        <div class="fromBox">
          <div>
            <div class="fromBoxItem" v-if="tableIndex === 1">
              <span>类型</span>
              <ui-select v-model="form.project" style="width: 140px">
                <ui-select-option label="1" value="1"></ui-select-option>
                <ui-select-option label="2" value="2"></ui-select-option>
                <ui-select-option label="3" value="3"></ui-select-option>
              </ui-select>
            </div>
            <div class="fromBoxItem">
              <span>时间</span>
              <ui-select v-model="form.project" style="width: 96px">
                <ui-select-option label="今天" value="1"></ui-select-option>
                <ui-select-option label="昨天" value="2"></ui-select-option>
                <ui-select-option label="三天内" value="3"></ui-select-option>
                <ui-select-option label="七天内" value="4"></ui-select-option>
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
            <div class="fromBoxItem" v-if="tableIndex === 0">
              <ui-button icon="icon-a-zu1698">刷新设备</ui-button>
            </div>
            <div class="fromBoxItem" v-if="tableIndex === 1">
              <ui-button>删除</ui-button>
            </div>
            <div class="fromBoxItem" v-if="tableIndex === 1">
              <ui-button
                @click="notifyVisible = true"
                type="primary"
                icon="icon-a-81"
                class="primary"
                >新增通知</ui-button
              >
            </div>
            <div class="fromBoxItem" v-if="tableIndex === 2">
              <ui-button>删除</ui-button>
            </div>
            <div class="fromBoxItem" v-if="tableIndex === 2">
              <ui-button
                @click="advertiseVisible = true"
                type="primary"
                icon="icon-a-81"
                class="primary"
                >新增广告</ui-button
              >
            </div>
          </div>
        </div>
        <ui-table :data="data" v-show="tableIndex === 0" class="tableBoxItem">
          <ui-table-column
            prop="id"
            label="使用场景"
            align="center"
            width="240"
          >
            <template #default="{ row }">
              <span>{{ row.id }}</span>
            </template>
          </ui-table-column>
          <ui-table-column
            prop="id"
            label="考勤机类型"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="硬件型号"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="系统版本"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="绑定时间"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="最近离线时间"
            align="left"
          ></ui-table-column>
          <ui-table-column prop="id" label="状态" align="center">
            <template #default="{ row }">
              <span :style="{ color: row.id > 0 ? '#F56060' : '' }"
                >{{ row.id }}%</span
              >
            </template>
          </ui-table-column>
          <ui-table-column prop="id" label="操作" align="center">
            <template #default>
              <ui-button type="text">编辑</ui-button>
            </template>
          </ui-table-column>
        </ui-table>
        <ui-table
          :data="data"
          checkbox
          v-show="tableIndex === 1"
          class="tableBoxItem"
        >
          <ui-table-column
            prop="id"
            label="通知标题"
            align="center"
            width="120"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="通知正文"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="播放时间"
            align="left"
            width="120"
          ></ui-table-column>
          <ui-table-column prop="id" label="开启状态" align="left" width="80">
            <template #default="{ row }">
              <span :style="{ color: getStatusText(row.status).color }">{{
                getStatusText(row.status).text
              }}</span>
            </template>
          </ui-table-column>
          <ui-table-column prop="id" label="操作" align="center" width="80">
            <template #default="{ row }">
              <ui-button
                type="text"
                style="color: #4fa8f9"
                @click="openItem(row.id)"
                >{{ activeId === row.id ? "收起" : "记录" }}</ui-button
              >
            </template>
          </ui-table-column>
        </ui-table>
        <ui-table
          :data="data"
          checkbox
          v-show="tableIndex === 2"
          class="tableBoxItem"
        >
          <ui-table-column
            prop="id"
            label="通知标题"
            align="center"
            width="320"
          >
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
            label="类型"
            align="left"
          ></ui-table-column>
          <ui-table-column
            prop="id"
            label="播放 时间"
            align="left"
            width="120"
          ></ui-table-column>
          <ui-table-column prop="id" label="开启状态" align="left" width="80">
            <template #default="{ row }">
              <span :style="{ color: getStatusText(row.status).color }">{{
                getStatusText(row.status).text
              }}</span>
            </template>
          </ui-table-column>
          <ui-table-column prop="id" label="操作" align="center" width="80">
            <template #default="{ row }">
              <ui-button
                type="text-primary"
                style="color: #4fa8f9"
                @click="openItem(row.id)"
                >编辑</ui-button
              >
            </template>
          </ui-table-column>
        </ui-table>
        <ui-pagination></ui-pagination>
      </ui-card>
    </div>
  </div>
  <ui-modal
    v-model:visible="notifyVisible"
    title="新增通知"
    width="645"
    class="toddlerModelBox"
    okText="保存"
  >
    <ui-form :data="schoolTimeForm" class="toddlerModelForm">
      <ui-form-item label="通知标题" prop="times">
        <ui-input v-model="schoolTimeForm.times"></ui-input>
      </ui-form-item>
      <ui-form-item label="播放时间" prop="time">
        <ui-date-picker></ui-date-picker>
      </ui-form-item>
      <ui-form-item label="通知正文">
        <ui-input type="textarea"></ui-input>
      </ui-form-item>
    </ui-form>
  </ui-modal>
  <ui-modal
    v-model:visible="placeVisible"
    title="编辑设备场景名称"
    width="498"
    class="toddlerModelBox"
    okText="保存"
  >
    <ui-form :data="schoolTimeForm" class="toddlerModelForm">
      <ui-form-item label="使用场景">
        <ui-input></ui-input>
      </ui-form-item>
    </ui-form>
  </ui-modal>
  <ui-modal
    v-model:visible="advertiseVisible"
    title="新增广告"
    width="645    "
    class="toddlerModelBox"
    okText="保存"
  >
    <ui-form :data="schoolTimeForm" class="toddlerModelForm">
      <ui-form-item label="广告标题" prop="times">
        <ui-input v-model="schoolTimeForm.times"></ui-input>
      </ui-form-item>
      <ui-form-item label="播放时间" prop="time">
        <ui-date-picker></ui-date-picker>
      </ui-form-item>
      <ui-form-item label="上传内容">
        <div>
          <ui-button @click="upload">选择上传广告</ui-button>
          <span style="font-size: 12px; color: #f56060; margin-left: 20px"
            >可上传10张图片或1个视频（宽1010像素 高374像素)</span
          >
        </div>
        <cms-upload ref="cmsUpload"></cms-upload>
      </ui-form-item>
    </ui-form>
  </ui-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import CmsUpload from "@/base/cmsUpload.vue";

type Toddler = {
  id: string;
  status: number;
};

export default defineComponent({
  components: { CmsUpload },

  setup() {
    const cmsUpload = ref(null);
    // 新增通知model状态
    const notifyVisible = ref(false);
    // 设备场景名称修改弹窗状态
    const placeVisible = ref(false);
    // 新增广告弹窗状态
    const advertiseVisible = ref(false);
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
    ];
    const route = useRoute();
    const activeId = ref("2");

    const upload = () => {
      if (cmsUpload?.value) {
        (cmsUpload.value as any).upload();
      }
    };

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
      notifyVisible,
      placeVisible,
      advertiseVisible,
      schoolTimeForm,
      map,
      cmsUpload,
      getStatusText,
      openItem,
      upload,
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
    .bin {
      width: 468px;
    }
    .line {
      flex: 1;
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
        &:last-child {
          margin-right: 0;
        }
        .el-input {
          height: 32px;
          line-height: 32px;
        }
        .primary {
          span {
            color: #ffffff;
          }
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
