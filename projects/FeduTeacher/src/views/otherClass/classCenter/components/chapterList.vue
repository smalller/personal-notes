<template>
  <div class="chapterShow">
    <ui-modal
      v-model:visible="modalStatus"
      @ok="handleSureDelete"
      :title="`确定要删除《${modalTitle}》课节吗？`"
      width="420"
      :tips="false"
    >
      <div class="body-text-box">点击“确定”将删除本课节，请慎重！</div>
    </ui-modal>
    <div class="title">
      <span class="name">课节名称</span>
      <span class="time">时间</span>
    </div>
    <div class="chapter-list">
      <ul class="list-box">
        <li
          v-for="(item,index) in chapterList"
          :key="index"
          @click="setSelect(item,index)"
          class="is-select"
        >
          <div class="list-info is-select">
            <div class="list-name">
              <span>{{item.sectionName}}</span>
            </div>
            <div class="list-time">
              <span class="act-time">{{item.videoDuration}}</span>
              <div class="act-btn">
                <ui-button
                  class="button"
                  type="text"
                  style="color:#4FA8F9 "
                  @click="showVideo(item)"
                >预览</ui-button>
                <ui-button
                  class="button"
                  style="color:#4FA8F9 "
                  type="text"
                  v-if="+props.type === 1"
                  @click="editSection(item)"
                >编辑</ui-button>
                <ui-button
                  class="button"
                  style="color:#BFBFBF"
                  type="text"
                  v-if="+props.type === 1"
                  @click="deleteSection(item)"
                >删除</ui-button>
              </div>
            </div>
          </div>
        </li>
        <div
          class="add-button"
          v-if="+props.type === 1"
        >
          <ui-button
            type="primary"
            icon="icon-a-81"
            @click="handleAdd()"
          >添加课节
          </ui-button>
        </div>

      </ul>
    </div>
    <ui-video
      v-model:visible="videoPlayerShow"
      ref="videoPlayer"
    ></ui-video>
    <addCourse ref="addCourse"></addCourse>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { getSubjectChapter, delSection } from "@/api/subjectManage";
import { VideoPlayer } from "@/base/interface";
import Message from "@/themes/message/index";
import addCourse from "./addCourse.vue";
import bus from "@/Layout/bus";

export default defineComponent({
  components: {
    addCourse,
  },
  props: {
    id: {
      type: String,
      default: () => {
        return "";
      },
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
    highLight: Boolean,
  },
  emits: {
    close: null,
    chapterNum: null,
  },
  setup(props, ctx) {
    const modalStatus = ref(false); //展示弹窗
    const modalTitle = ref(""); //删除名称
    const modelId = ref("");
    const chapterList = ref([] as any);
    const getChapter = async () => {
      chapterList.value.length = 0;
      let { code, data } = await getSubjectChapter(props.id);
      if (code === 0) {
        chapterList.value = [...data.list];
        ctx.emit("chapterNum", chapterList.value.length);
      }
    };
    onMounted(() => {
      getChapter();
    });
    const selectIndex = ref(0);
    const setSelect = (item: any, index: any) => {
      if (index !== undefined) {
        selectIndex.value = +index;
      }
    };
    const addCourse = ref(null);
    // 新增/修改招生计划
    function handleAdd() {
      (addCourse.value as any).handleOpen(1, props.info);
    }
    watch(
      () => props.id,
      () => {
        if (props.id) {
          getChapter();
        }
      }
    );
    const videoPlayer = ref(null);
    const videoPlayerShow = ref(false);
    /**
     * 打开视频详情
     */
    const showVideo = (item: any) => {
      if (!item.videoPath) {
        Message.warning("没有获取到视频链接");
        return;
      }
      // drawerStatus.value = true;
      videoPlayerShow.value = true;
      const dp = (videoPlayer.value as unknown as VideoPlayer).init(
        item.videoPath,
        {
          autoPlay: true,
        }
      );
      dp.volume(0.7, true, true);
    };
    function editSection(item: any) {
      if (item) {
        (addCourse.value as any).handleOpen(2, props.info, item);
      }
    }
    function deleteSection(item: any) {
      modalTitle.value = "";
      modalStatus.value = false;
      modelId.value = "";
      if (item.id) {
        modalStatus.value = true;
        modalTitle.value = item.sectionName;
        modelId.value = item.id;
      }
    }
    async function handleSureDelete() {
      if (modelId.value) {
        let { code } = await delSection(modelId.value);
        if (code === 0) {
          Message.success("课节删除成功");
          modalStatus.value = false;
          getChapter();
        }
      }
    }
    onMounted(() => {
      bus.$on("editSectionComplete", (res: boolean) => {
        res && getChapter();
      });
    });

    onUnmounted(() => {
      bus.$off("editSectionComplete");
    });
    return {
      chapterList,
      selectIndex,
      setSelect,
      videoPlayerShow,
      videoPlayer,
      showVideo,
      handleAdd,
      addCourse,
      editSection,
      props,
      deleteSection,
      modalStatus,
      modalTitle,
      handleSureDelete,
    };
  },
});
</script>
<style lang="less" scoped>
.chapterShow {
  width: 100%;
  height: 100%;
  margin: auto;
  .body-text-box {
    margin: 28px 0 40px 0;
    font-size: 14px;
    color: #f56060;
  }
  .title {
    width: 676px;
    height: 52px;
    background: #fafafa;
    opacity: 1;
    border-radius: 0px;
    span {
      width: 56px;
      height: 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 0px;
      color: #222222;
    }
    .name {
      float: left;
      display: block;
      margin-left: 24px;
      margin-top: 24px;
    }
    .time {
      float: right;
      margin-top: 24px;
    }
  }
  .chapter-list {
    width: 676px;
    height: 52px;
    .list-box {
      height: 700px;
      overflow-y: auto;
      .add-button {
        margin: auto;
        margin-top: 40px;
        width: 116px;
        height: 32px;
        background: #ff9900;
        border-radius: 3px;
      }
      .list-info {
        width: 676px;
        height: 54px;
        cursor: pointer;
        border-bottom: 1px solid #e8e8e8;
        opacity: 1;
        border-radius: 0px;
        align-items: center;
        display: flex;
        .list-name {
          width: 100%;
          span {
            display: block;
            margin-left: 24px;
            font-size: 14px;
            font-weight: 400;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 80%;
          }
        }
        .list-time {
          float: right;
          span {
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            margin-right: 24px;
            align-items: center;
          }
          //   .act-time{
          //       display: block;
          //   }
          .act-btn {
            display: none;
            .button {
              margin-right: 16px;
            }
          }
        }
        &:hover {
          background-color: #e8e8e8;
          .act-btn {
            display: flex;
            .button {
              margin-right: 16px;
            }
          }
          .act-time {
            display: none;
          }
        }
      }
    }
  }
}
</style>

