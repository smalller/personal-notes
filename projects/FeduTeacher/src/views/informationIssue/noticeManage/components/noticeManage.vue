<template>
  <div class="manage-class">
    <el-scrollbar height="900px" v-loading="loading">
      <div class="manage-header">
        <div class="student-info">
          <p>{{ noticeInfo.title }}</p>
          <span>{{ noticeInfo.username }}</span>
          <span>发布时间：{{ noticeInfo.createTime }}</span>
        </div>
      </div>
      <div class="manage-bar">
        <div class="manage-data">
          <p>{{ noticeInfo.estReceiver ? noticeInfo.estReceiver : "0" }}</p>
          <span>应读人数</span>
        </div>
        <div class="manage-data">
          <p>{{ noticeInfo.countReader ? noticeInfo.countReader : "0" }}</p>
          <span>已读人数</span>
        </div>
        <div class="manage-data">
          <p>
            {{ noticeInfo.countNoReader ? noticeInfo.countNoReader : "0" }}
          </p>
          <span>未读人数</span>
        </div>
        <div class="manage-data">
          <p>
            {{
              +noticeInfo.countNoReader !== 0
                ? (
                    (+noticeInfo.countReader / +noticeInfo.estReceiver) *
                    100
                  ).toFixed(0) + "%"
                : "0%"
            }}
          </p>
          <span>已读率</span>
        </div>
        <div class="manage-data">
          <p>{{ noticeInfo.shareCount ? noticeInfo.shareCount : "0" }}</p>
          <span>分享次数</span>
        </div>
      </div>
      <div class="manage-table">
        <ui-tab
          class="test"
          v-model:index="tableIndex"
          :list="[
            '通知详情',
            `未读 ${noticeInfo.countNoReader}`,
            `已读 ${noticeInfo.countReader}`,
          ]"
        ></ui-tab>
        <div style="margin-top: 15px">
          <div class="notice-info" v-if="tableIndex === 0">
            <div>
              <img
                style="width: 675px; height: 410px"
                :src="noticeThem.background"
                alt=""
              />
              <div
                class="notice-box"
                :style="{ background: noticeThem.shading }"
              >
                <div
                  class="notice-text"
                  :style="{ border: '20px solid' + noticeThem.edge }"
                >
                  <span class="notice-title">{{ noticeInfo.title }}</span>
                  <p class="notice-data" v-html="noticeInfo.content"></p>
                  <img
                    v-for="(item, index) in noticeInfo.images"
                    :key="index"
                    class="notice-img"
                    :src="item"
                  />
                  <span class="notice-name"
                    >来自：{{ noticeInfo.username }}</span
                  >
                  <span class="notice-time">{{ noticeInfo.createTime }}</span>
                </div>
              </div>
            </div>
          </div>
          <unRead :id="props.dataInfo" v-if="tableIndex === 1"></unRead>
          <read :id="props.dataInfo" v-if="tableIndex === 2"></read>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import img from "@/assets/video.jpg";
import { ElScrollbar } from "element-plus";
import { defineComponent, onMounted, ref, watch } from "vue";
import { getNoticeInfo } from "@/api/reviewManage";
import read from "./read.vue";
import unRead from "./unRead.vue";
import "@/base/commonStyle.less";
interface noticeDemo {
  title: string;
  username: string;
  createTime: string;
  estReceiver: string;
  countReader: string;
  countNoReader: string;
  shareCount: string;
  content: string;
  images: any;
}
interface themeDemo {
  id: number | string;
  background: string;
  shading: string;
  edge: string;
  templateName: string;
}
export default defineComponent({
  props: {
    classStatus: {
      type: [Number, String],
      default: 0,
    },
    dataInfo: {
      type: [Number, String],
      default: "",
    },
  },
  components: {
    read,
    unRead,
    ElScrollbar,
  },
  setup(props) {
    onMounted(() => {
      console.log(props.dataInfo);
    });
    //已选tab
    const tableIndex = ref(0);
    const loading = ref(true);
    //班级基本信息
    const noticeInfo = ref({} as noticeDemo);
    const noticeThem = ref({} as themeDemo);
    //获取班级基本信息
    const getNoticeInfos = async (): Promise<any> => {
      loading.value = true;
      let id = props.dataInfo as string | number;
      if (id) {
        let { code, data } = await getNoticeInfo(id);
        if (+code === 0) {
          noticeInfo.value = { ...data };
          noticeThem.value = { ...data.noticeTempVo };
          loading.value = false;
        }
      }
    };
    onMounted(() => {
      getNoticeInfos();
    });
    watch(props, () => {
      noticeInfo.value = {} as noticeDemo;
      getNoticeInfos();
      tableIndex.value = 0;
    });

    //初始化修改班级信息
    const addClassmodel = ref(null);
    //修改班级信息
    const editClass = () => {
      (addClassmodel.value as any).handleOpen("edit", noticeInfo.value);
    };
    return {
      img,
      noticeInfo,
      tableIndex,
      props,
      addClassmodel,
      editClass,
      loading,
      noticeThem,
    };
  },
});
</script>
<style lang="less" scoped>
.manage-class {
  width: 100%;
  .manage-header {
    margin-left: 40px;
    display: flex;
    > img {
      width: 60px;
      // height: 60px;
      background: rgba(0, 0, 0, 0);
      // background-color: #999999;
      border-radius: 8px;
    }
    .form-imgs {
      width: 60px;
      height: 60px;
      background: #fafafa;
      border-radius: 4px;
      // margin-bottom: -30px;
      // cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0.1);
      .form-icon {
        width: 30px;
        // cursor: pointer;
        margin: 20px 0px 0px 15px;
      }
    }
    .manage-class {
      margin-left: 10px;
      margin-top: -5px;
      > p {
        display: block;
        margin-bottom: 10px;
        height: 33px;
        font-size: 24px;
        font-weight: 400;
        color: #222222;
      }
      > span {
        width: 201px;
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #999999;
        opacity: 1;
      }
    }
  }

  .manage-bar {
    width: calc(100% - 80px);
    margin: 20px 40px 0 40px;
    height: 120px;
    display: inline-flex;
    background: #fafafa;
    .manage-data {
      width: 20%;
      height: 120px;
      margin-top: 30px;
      text-align: center;
      > p {
        font-size: 24px;
        font-weight: bold;
        line-height: 33px;
        color: #222222;
      }
      > span {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #999999;
      }
    }
  }
  .manage-table {
    width: calc(100% - 80px);
    margin: 20px 0 20px 40px;
    .ui-tab {
      > div {
        font-size: 16px !important;
      }
    }
    .notice-info {
      width: 676px;
      //TODO 陷入了疑惑
      border: 1px solid undefined;
      border-radius: 4px;
      .notice-box {
        width: 675px;
        min-height: 300px;
        margin-top: -5px;
        background: #86dbc5;
        padding-bottom: 100px;
        .notice-text {
          width: 585px;
          margin: auto;
          min-height: 400px;
          opacity: 1;
          // background: #48b196;
          background: #f1f0e6;
          // border: 20px solid rgb(72, 177, 150);
          border-radius: 32px;
          .notice-title {
            display: block;
            width: 100%;
            height: 44px;
            font-size: 31px;
            font-weight: 400;
            text-align: center;
            color: #1c1c1c;
            letter-spacing: 1px;
            margin-top: 50px;
          }
          .notice-data {
            margin-top: 40px;
            padding-left: 20px;
            padding-right: 20px;
            font-size: 24px;
            font-weight: 400;
            text-align: left;
            color: #6a6a6a;
            line-height: 41px;
          }
          .notice-img {
            width: 532px;
            height: 280px;
            display: block;
            margin: auto;
            border-radius: 12px;
            margin-bottom: 5px;
          }
          .notice-name {
            display: block;
            text-align: right;
            margin-right: 30px;
            margin-top: 50px;
            font-size: 24px;
            font-weight: 400;
            text-align: right;
            color: #6a6a6a;
            letter-spacing: 1px;
          }
          .notice-time {
            display: block;
            text-align: right;
            margin-right: 30px;
            margin-top: 10px;
            font-size: 24px;
            font-weight: 400;
            text-align: right;
            color: #6a6a6a;
            letter-spacing: 1px;
          }
        }
      }
    }
  }
}
.el-drawer__header {
  margin-bottom: 0px;
}
.student-info {
  margin-left: 10px;
  margin-top: -5px;
  > p {
    display: block;
    margin-bottom: 10px;
    height: 33px;
    font-size: 24px;
    font-weight: 400;
    color: #222222;
  }
  > span {
    width: 201px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #999999;
    opacity: 1;
    margin-right: 20px;
  }
}
</style>
