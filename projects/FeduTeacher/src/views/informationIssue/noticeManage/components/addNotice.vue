<template>
  <div class="addNotice">
    <div class="content">
      <div class="notice-box">
        <ui-input
          v-model="ruleForm.title"
          maxlength="50"
          class="notice-title"
          placeholder="输入通知标题（3-50个字）"
        ></ui-input>
        <ui-input
          v-model="ruleForm.content"
          class="notice-text"
          width="750"
          type="textarea"
          placeholder="输入通知正文"
        ></ui-input>
        <div class="notice-img">
          <div v-for="(item, index) in noticeImg" :key="index">
            <div class="img-list">
              <div class="del-box">
                <ui-icon class="del-icon" icon="icon-a-zu238"></ui-icon>
              </div>
              <img class="add-img" :src="item" alt />
            </div>
          </div>

          <div class="add-img" @click="openCropper">
            <ui-icon class="add-icon" icon="icon-a-81"></ui-icon>
          </div>
        </div>
        <div class="notice-select">
          <ui-form ref="formCheck" :model="ruleForm" label-width="82">
            <ui-form-item label="发布范围" prop="clazzIds">
              <ui-select
                @change="changeCheckclazzIds"
                v-model="ruleForm.clazzIds"
                multiple
                placeholder="请选择发布范围"
                style="width: 100%"
              >
                <ui-select-option
                  v-for="item in classList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></ui-select-option>
              </ui-select>
            </ui-form-item>
          </ui-form>
        </div>
        <cms-upload ref="upload"></cms-upload>
      </div>
    </div>
    <div class="list">
      <span class="list-title">选择样式</span>
      <div class="list-img">
        <div
          :class="imgIndex == index ? 'img' : 'imgs'"
          v-for="(item, index) in yearsList"
          :key="index"
          @click="getImgIndex(index)"
        >
          <img :src="item.background" alt />
          <span>{{ item.templateName }}</span>
        </div>
      </div>
    </div>
    <logoutIdentity ref="logoutIdentityCom" @handleSure="init">
      <p style="font-size: 14px; color: #f56060">撤销后将还原到初始效果</p>
    </logoutIdentity>
    <el-drawer class="notice-pre" v-model="showPre" size="45%">
      <div class="notice-info">
        <div>
          <img
            style="width: 675px; height: 410px"
            :src="themeInfo.background"
            alt
          />
          <div class="notice-box" :style="{ background: themeInfo.shading }">
            <div
              class="notice-text"
              :style="{ border: '20px solid' + themeInfo.edge }"
            >
              <span class="notice-title">{{ ruleForm.title }}</span>
              <p class="notice-data" v-html="ruleForm.content"></p>
              <img
                v-for="(item, index) in noticeImg"
                :key="index"
                class="notice-img"
                :src="item"
              />
              <span class="notice-name">来自：{{ ruleForm.username }}</span>
              <span class="notice-time">{{ ruleForm.createTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import CmsUpload from "@/base/cmsUpload.vue";
import { getTempList, addNotice } from "@/api/noticeManage";
import bus from "@/Layout/bus";
import Message from "@/themes/message";
import { ElDrawer } from "element-plus";
import { useStore } from "vuex";
import logoutIdentity from "@/components/logoutIdentity.vue";
interface themeDemo {
  id: number | string;
  background: string;
  shading: string;
  edge: string;
  templateName: string;
}
export default defineComponent({
  components: { CmsUpload, ElDrawer, logoutIdentity },
  setup() {
    const store = useStore();
    const route = useRoute();
    const { schoolId, token, userId } = store.state.user;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("schoolId", schoolId);
    sessionStorage.setItem("userId", userId);
    const tableIndex = ref(0);
    const showPre = ref(false);
    const upload = ref(null);
    const yearsList = ref([] as Array<themeDemo>);
    const classList = JSON.parse(
      JSON.stringify(store.state.commonData.classList)
    ); // 班级列表
    classList.unshift({ id: "all", name: "全部班级" });
    //页面状态控制
    const modeStatus = ref({
      showView: false,
      addClassList: false,
      editClass: false,
      showManage: false,
    });
    const ruleForm = ref({
      clazzIds: ["all"] as any,
      images: [] as any,
      title: "",
      content: "",
      schoolId: "",
      userId: "",
      themeId: "",
      username: "",
      noticeType: "",
      msgType: "COMMON",
      createTime: "",
    });
    // 选择发布范围
    function changeCheckclazzIds(res: Array<string>) {
      // 当选择全部班级时，就变成只选择全部班级选项，否则就是多选状态
      if (res[0] === "all" && ruleForm.value.clazzIds.length > 1) {
        ruleForm.value.clazzIds.splice(0, 1);
      } else if (res.includes("all")) {
        ruleForm.value.clazzIds = ["all"];
      }
    }
    const noticeImg = ref([] as any);
    //调用截图工具
    const openCropper = () => {
      if (upload?.value) {
        (upload.value as any).upload("image/*").then((res: any) => {
          if (res.length) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].url) {
                ruleForm.value.images.push(res[i].data);
                noticeImg.value.push(res[i].attach);
              }
            }
          }
        });
      }
    };
    const theme = ref("" as string | number);
    const getTempLists = async () => {
      let { code, data } = await getTempList();
      if (code == 0) {
        yearsList.value = [...data];
        theme.value = yearsList.value[0].id;
        themeInfo.value = yearsList.value[0];
      }
    };
    const imgIndex = ref(0);
    const themeInfo = ref({} as themeDemo);
    //切换封面
    const getImgIndex = (index: number) => {
      imgIndex.value = index;
      theme.value = yearsList.value[+imgIndex.value].id;
      themeInfo.value = yearsList.value[+imgIndex.value];
    };
    const setData = () => {
      if (ruleForm.value.title) {
        ruleForm.value.schoolId = store.state.user.schoolId;
        ruleForm.value.themeId = theme.value as string;
        ruleForm.value.userId = store.state.user.userInfo.userId;
        ruleForm.value.username = store.state.user.userInfo.username;
      }
    };
    const saveNotice = () => {
      if (ruleForm.value.title && ruleForm.value.content) {
        setData();
        let data = { ...ruleForm.value };
        if (data.clazzIds[0] == "all") {
          delete data.clazzIds;
          data.noticeType = "SCHOOL";
        } else {
          data.noticeType = "CLAZZ";
        }
        addNotice(data).then((res) => {
          if (+res.code === 0) {
            Message.success("发布成功，即将关闭当前页面!");
            // showPre.value = true;
            window.opener.postMessage("updateNotice", location.origin);
            setTimeout(() => {
              window.opener = null;
              window.open("", "_self");
              window.close();
            }, 3000);
          } else {
            Message.error("发布失败");
          }
        });
      } else if (ruleForm.value.title == "") {
        Message.warning("请填写通知标题!");
      } else if (ruleForm.value.content == "") {
        Message.warning("请填写通知正文!");
      }
    };
    onMounted(() => {
      getTempLists();
    });
    //预览页面
    const show = () => {
      modeStatus.value.showView = true;
    };
    const logoutIdentityCom = ref(null);
    const init = () => {
      noticeImg.value.length = 0;
      ruleForm.value = {
        clazzIds: ["all"],
        images: [],
        title: "",
        content: "",
        schoolId: "",
        userId: "",
        themeId: "",
        username: "",
        noticeType: "",
        msgType: "COMMON",
        createTime: "",
      };
      Message.success("撤销编辑成功");
    };
    onMounted(() => {
      // createInitCover();
      bus.$on("noticeSavePreview", () => {
        saveNotice();
        // save("pre");
      });

      bus.$on("noticePreview", () => {
        setData();
        showPre.value = !showPre.value;
      });
      bus.$on("noticeBack", () => {
        (logoutIdentityCom.value as any).handleOpen("确认要撤销本次的编辑吗？");
      });
    });
    onUnmounted(() => {
      bus.$off("noticeSavePreview");
      bus.$off("noticePreview");
      bus.$off("noticeBack");
    });
    return {
      route,
      changeCheckclazzIds,
      tableIndex,
      getImgIndex,
      yearsList,
      modeStatus,
      classList,
      ruleForm,
      show,
      imgIndex,
      openCropper,
      upload,
      noticeImg,
      showPre,
      themeInfo,
      init,
      logoutIdentityCom,
    };
  },
});
</script>
<style lang="less" scoped>
.addNotice {
  max-width: 1920px;
  max-height: 918px;
  background: #79e3eb;
  box-sizing: border-box;
  display: flex;
  .content {
    width: 1730px;
    height: 918px;
    background: #eef2f8;
    .notice-box {
      margin: auto;
      width: 880px;
      min-height: 800px;
      background: #ffffff;
      box-shadow: 0px 0px 8px 0px undefined;
      //   .ui-inputinput {
      //     height: 70px;
      //   }
      .notice-title {
        width: 760px;
        background: #ffffff;
        margin-left: 60px;
        border-bottom: 2px solid #eeeeee;
        /deep/ input {
          height: 70px;
          border: none;
          margin-top: 30px;
          font-size: 24px;
          font-weight: 700;
          text-align: left;
          color: #222222;
          line-height: 35px;
        }
        /deep/ input::-webkit-input-placeholder {
          font-size: 24px;
        }
        /deep/ .ui-input-icon-box {
          top: 50px;
        }
      }
      .notice-text {
        margin-top: 20px;
        margin-left: 60px;
        resize: none;
        /deep/ textarea {
          resize: none;
          border: none;
        }
        /deep/ input::-webkit-input-placeholder {
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          color: #999999;
        }
      }
      .notice-img {
        width: 760px;
        background: #ffffff;
        margin-left: 60px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 2px solid #e8e8e8;
        .add-img {
          width: 94px;
          height: 94px;
          background: #fafafa;
          border: 1px dashed #d9d9d9;
          border-radius: 4px;
          margin-right: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          .add-icon {
            width: 16px;
            height: 16px;
            margin-left: 40px;
            margin-top: 40px;
          }
        }
        .img-list {
          width: 94px;
          height: 94px;
          background: #fafafa;
          border: 1px dashed #d9d9d9;
          border-radius: 4px;
          margin-right: 10px;
          margin-bottom: 10px;
          .del-box {
            display: none;
          }
        }
        .img-list:hover {
          .del-box {
            display: block;
            width: 16px;
            height: 16px;
            position: absolute;
            margin-left: 75px;
            margin-top: 3px;
            opacity: 0.5;
            background: #000000;
            border-radius: 4px;
            .del-icon {
              width: 10px;
              height: 10px;
              opacity: 1;
              margin-top: 3px;
              margin-left: 3px;
              color: #ffffff;
              position: absolute;
              cursor: pointer;
            }
          }
        }
      }
      .notice-select {
        width: 760px;
        margin-left: 60px;
        margin-top: 30px;
      }
    }
  }
  .list {
    width: 190px;
    height: 918px;
    background: #ffffff;
    box-shadow: 0px 4px 8px 0px undefined;
    .list-title {
      display: block;
      margin-left: 15px;
      margin-top: 20px;
      width: 56px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #222222;
    }
    .list-img {
      margin-top: 10px;
      .img {
        width: 190px;
        height: 143px;
        margin: auto;
        background: #f7f7f7;
        text-align: center;
        cursor: pointer;
        img {
          margin-top: 10px;
          width: 98px;
          height: 98px;
          border: 2px solid #ff9900;
        }
        span {
          display: block;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 400;
          color: #ff9900;
        }
      }
      .imgs {
        width: 190px;
        height: 143px;
        margin: auto;
        background: #ffffff;
        text-align: center;
        cursor: pointer;
        border-bottom: 1px solid #f2f2f2;

        img {
          margin-top: 10px;
          width: 98px;
          height: 98px;
        }
        span {
          display: block;
          margin: auto;
          margin-top: 8px;
          font-size: 12px;
          color: #666666;
        }
      }
    }
  }
  .notice-pre {
    width: 45% !important;
  }
  .notice-info {
    width: 676px;
    border: 1px solid undefined;
    margin: auto;
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
</style>
