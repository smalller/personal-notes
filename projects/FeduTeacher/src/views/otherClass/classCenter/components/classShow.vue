<template>
  <ui-modal
    v-model:visible="modalStatus"
    @ok="handleSureDelete"
    :title="`确定要删除《${courseInfo.courseName}》课程吗？`"
    width="420"
    style="z-index: 9999"
    :tips="false"
  >
    <div style="color: #f56060">点击“确定”将删除本课程，请慎重！</div>
  </ui-modal>
  <el-drawer
    v-model="isShow"
    :with-header="false"
    size="960px"
    class="show-box"
    :before-close="closed"
  >
    <div
      class="show-box"
      v-show="isShow"
    >
      <div class="classShow">
        <div class="class-title">
          <!-- <span>页面预览</span>? -->
          <ui-icon
            icon="icon-a-zu238"
            class="icon"
            @click="closed"
          ></ui-icon>
        </div>
        <div style="margin: auto; width: 676px">
          <div class="class-box">
            <img
              class="img-info"
              :src="courseInfo.pic"
            />
            <div></div>
            <div class="class-info">
              <p>{{ courseInfo.courseName }}</p>
              <div class="action-info">
                <span>课节 {{ courseInfo.sectionNums }}</span>
                <div
                  class="action-btn"
                  v-if="+props.type === 1"
                >
                  <ui-button
                    class="button"
                    type="text"
                    @click="goToAdd"
                  >编辑</ui-button>
                  <ui-button
                    class="button"
                    style="color: #bfbfbf"
                    type="text"
                    @click="modalStatus = true"
                  >删除</ui-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="class-show">
          <ui-tab
            class="test"
            v-model:index="tableIndex"
            :list="+props.type === 2 ? ['课程简介'] : ['课程简介', '课程章节']"
          ></ui-tab>
          <div class="show-box">
            <div
              v-if="tableIndex === 0"
              v-html="courseInfo.content"
            ></div>
            <div v-if="tableIndex === 1">
              <chapterList
                :id="props.id"
                :info="props.info"
                :type="props.type"
                @chapterNum="getChapter"
              ></chapterList>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from "vue";
import "@/base/commonStyle.less";
import chapterList from "./chapterList.vue";
import { ElDrawer } from "element-plus";
import { delSubject, getSubject } from "@/api/subjectManage";
import Message from "@/themes/message";
import { useRoute, useRouter } from "vue-router";

interface ListItem {
  name: string;
  value?: string;
}

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    type: {
      type: [String, Number],
      default: () => {
        return "0";
      },
    },
    info: {
      type: Object,
      required: true,
    },
    highLight: Boolean,
  },
  emits: {
    close: null,
  },
  components: {
    chapterList,
    ElDrawer,
  },
  setup(props, ctx) {
    //已选tab
    const router = useRouter();
    const tableIndex = ref(0);
    const courseInfo = ref({} as any);
    const isShow = computed(() => props.show);
    const modalStatus = ref(false);
    async function handleSureDelete() {
      if (props.info) {
        console.log(props);
        let { code } = await delSubject(props.id);
        if (code === 0) {
          Message.success("课程删除成功!");
          modalStatus.value = false;
          closed();
        }
      }
    }
    async function getSubjectInfo() {
      courseInfo.value = {};
      if (props.info) {
        let { data, code } = await getSubject(props.id);
        if (code === 0) {
          courseInfo.value = Object.assign({}, data);
        }
      }
    }
    watch(
      props,
      () => {
        if (props.id) {
          getSubjectInfo();
        } else {
          courseInfo.value = Object.assign({}, props.info);
        }
      },
      { immediate: true, deep: true }
    );
    // onMounted(() => {
    //   getSubjectInfo();
    // });
    const closed = () => {
      ctx.emit("close");
      tableIndex.value = 0;
    };
    const getChapter = (data: number) => {
      if (data) {
        courseInfo.value.sectionNums = data;
      }
    };
    // 编辑课程
    function goToAdd() {
      let routeUrl = router.resolve({
        path: `/recipeDetail/EditCourse`,
        query: { id: props.id },
      });

      console.log(routeUrl);
      window.open(routeUrl.href, "_blank");
    }
    return {
      courseInfo,
      closed,
      tableIndex,
      isShow,
      props,
      modalStatus,
      handleSureDelete,
      getChapter,
      goToAdd,
    };
  },
});
</script>
<style lang="less" scoped>
.classShow {
  width: 100%;
  height: 100%;
  margin: auto;
  .class-title {
    margin: auto;
    padding-top: 30px;
    padding-left: 40px;
    .icon {
      float: right;
      margin-right: 20px;
      margin-top: -10px;
      font-size: 15px;
      color: #d9d9d9;
      cursor: pointer;
    }
    span {
      width: 80px;
      height: 28px;
      font-size: 20px;
      font-weight: 400;
      text-align: left;
    }
  }
  .class-box {
    display: flex;
    height: 110px;
    width: 676px;
    border-bottom: 1px solid #e8e8e8;
    .img-info {
      width: 170px;
      height: 96px;
    }
    .class-info {
      width: 500px;
      height: 96px;
      float: right;
      p {
        margin-left: 20px;
        font-size: 24px;
        height: 80px;
        font-weight: 400;
        color: #222222;
        opacity: 1;
      }
      .action-info {
        width: 480px;
        margin-left: 20px;
        span {
          width: 100px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
        }
        .action-btn {
          display: flex;
          // margin-top: 10px;
          float: right;
          .button {
            font-weight: 400;
            line-height: 0px;
            color: #4fa8f9;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .class-show {
    width: 676px;
    margin: auto;
    margin-top: 15px;
    .show-box {
      margin-top: 20px;
    }
  }
}
</style>
