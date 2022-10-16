<template>
  <div class="edit-live-wrap">
    <ui-card class="card" v-loading="loading">
      <div class="form-box">
        <ui-form
          ref="formCheck"
          :model="ruleForm"
          :rules="staticData.rules"
          label-width="82"
        >
          <ui-form-item label="直播主题" prop="liveName">
            <ui-input
              v-model="ruleForm.liveName"
              placeholder="请输入直播主题"
            ></ui-input>
          </ui-form-item>
          <ui-form-item label="发布范围" prop="releaseScope">
            <ui-select
              @change="changeCheckReleaseScope"
              multiple
              v-model="ruleForm.releaseScope"
              placeholder="请选择发布范围"
              style="width: 100%"
            >
              <ui-select-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </ui-select-option>
            </ui-select>
          </ui-form-item>
          <ui-form-item label="主播老师" prop="publishUserId">
            <ui-select
              filterable
              v-model="ruleForm.publishUserId"
              placeholder="请选择主播老师"
              style="width: 210px"
              @change="changePublishUserName"
            >
              <ui-select-option
                v-for="item in teachersList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </ui-select-option>
            </ui-select>
          </ui-form-item>
          <ui-form-item label="直播模式" prop="liveType">
            <!-- <ui-radio
              :disabled="queryLiveId"
              v-model="ruleForm.liveType"
              label="app"
              >手机直播</ui-radio
            > -->
            <ui-radio
              :disabled="queryLiveId"
              v-model="ruleForm.liveType"
              label="cms"
              >专业推流直播</ui-radio
            >
          </ui-form-item>
          <ui-form-item label="封面" prop="coverImg">
            <div class="cover-img-box">
              <!-- <div id="img-box" v-if="!isUploadCover && !queryLiveId"> -->
              <!-- 提测前要将这里取消注释 -->
              <!-- <img
                  :src="
                    liveTeacherAvatar || require('@/assets/staff-avatar.png')
                  "
                  alt=""
                /> -->
              <!-- <img :src="require('@/assets/staff-avatar.png')" alt="" />
                <span>{{ ruleForm.publishUserName || "老师" }}的直播</span>
              </div> -->
              <!-- <div class="upload-img-box" v-else>
                <img :src="uploadAvatarUrl" alt="" />
              </div> -->

              <div class="upload-box">
                <div class="upload-area" @click="uploadCover">
                  <div class="not-upload" v-if="!uploadAvatarUrl">
                    <ui-icon icon="icon-a-81"></ui-icon>
                    <span>上传封面</span>
                  </div>
                  <template v-else>
                    <img :src="uploadAvatarUrl" alt="" />
                  </template>
                </div>
                <p>建议分辨率不低于 1920*1080（大小不超过 10M）</p>
              </div>
            </div>
          </ui-form-item>
          <ui-form-item label="预计开播" prop="publishTime">
            <el-date-picker
              :disabled="queryLiveId"
              format="YYYY-MM-DD HH:mm"
              v-model="ruleForm.publishTime"
              type="datetime"
              placeholder="请选择入预计开播时间"
            >
            </el-date-picker>
          </ui-form-item>
          <ui-form-item label="预计时长" prop="liveDuration">
            <ui-input
              :readonly="queryLiveId"
              style="width: 70px; margin-right: 5px"
              v-model="ruleForm.liveDuration"
            ></ui-input
            ><span style="font-size: 14px; color: #666">小时</span>
          </ui-form-item>
          <ui-form-item label="直播详情" prop="description" class="description">
            <WangEditor
              @getWangEditorValue="getWangEditorValue"
              :initValue="initValue"
            ></WangEditor>
          </ui-form-item>
        </ui-form>
      </div>
    </ui-card>
    <ui-image-clip ref="imgClip" @getData="getCoverData"></ui-image-clip>
    <cms-upload ref="cmsUpload" />
    <LiveDetail ref="liveDetailCom"></LiveDetail>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { staticData } from "../index";
import dayjs from "dayjs";
import {
  getSchoolTeacher,
  createCmsLive,
  updateCmsLive,
} from "@/api/liveStream";
import micell from "micell";
import CmsUpload from "@/base/cmsUpload.vue";
import WangEditor from "@/components/wangEditor/index.vue";
import bus from "@/Layout/bus";
import LiveDetail from "./LiveDetail.vue";
import Message from "@/themes/message";
import { describeLive } from "@/api/liveStream";

interface ImgResponse {
  url: string;
  blob: Blob;
}

interface UploadRespon {
  data: string;
  type: string;
  url: string;
  attach: string;
}

interface LiveData {
  [key: string]: any;
}

export default defineComponent({
  components: { CmsUpload, WangEditor, LiveDetail },
  setup() {
    const store = useStore();
    const route = useRoute();
    const queryLiveId = route.query.liveId;
    const loading = ref(false);
    const formCheck = ref(null);
    const { schoolId, token, userId, userInfo } = store.state.user;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("schoolId", schoolId);
    sessionStorage.setItem("userId", userId);
    let classList = JSON.parse(
      JSON.stringify(store.state.commonData.classList)
    ); // 班级列表
    classList.unshift({ id: "all", name: "全园" });
    const schoolDetails = computed(() => {
      return store.state.user.schoolList.find((item: LiveData) => {
        if (schoolId === item.schoolId) {
          return item;
        }
      });
    });

    const imgClip = ref(null);
    const cmsUpload = ref(null);
    const liveDetailCom = ref(null);
    // const isUploadCover = ref(false); //是否自己上传了封面
    // let liveTeacherAvatar = ref(""); //封面里的头像
    const uploadAvatarUrl = ref(""); //自己上传的封面
    let initValue = ref(""); //编辑器里的内容

    const ruleForm = ref<LiveData>({
      createUserName: schoolDetails.value.name,
      liveName: `${schoolDetails.value.name}老师的直播`,
      releaseScope: ["all"],
      publishUserName: schoolDetails.value.name,
      publishUserId: schoolDetails.value.employeeId,
      liveType: "cms",
      coverImg: "",
      publishTime: dayjs().toDate() as Date | string,
      liveDuration: "1",
      description: "",
    });

    if (queryLiveId) {
      loading.value = true;
      getLiveDetail(queryLiveId as string);
    }

    // 获取直播详情数据
    async function getLiveDetail(liveId: string) {
      const { code, data } = await describeLive(liveId);
      if (+code === 0) {
        ruleForm.value = data;
        ruleForm.value.releaseScope = Object.keys(ruleForm.value.releaseScope);
        ruleForm.value.liveDuration = String(
          ruleForm.value.liveDuration / 3600
        );
        uploadAvatarUrl.value = ruleForm.value.coverImg;
        initValue.value = ruleForm.value.description;

        setTimeout(() => {
          loading.value = false;
        }, 300);
      }
    }

    // 选择发布范围
    function changeCheckReleaseScope(res: Array<string>) {
      // 当选择全部班级时，就变成只选择全部班级选项，否则就是多选状态
      if (res[0] === "all" && ruleForm.value.releaseScope.length > 1) {
        ruleForm.value.releaseScope.splice(0, 1);
      } else if (res.includes("all")) {
        ruleForm.value.releaseScope = ["all"];
      }
    }

    // 获取主播老师列表
    const teachersList = ref<LiveData[]>([]);
    async function getCurrentSchoolTeacher() {
      const { code, data } = await getSchoolTeacher();
      if (+code === 0) {
        teachersList.value = data.list;
      }
    }
    getCurrentSchoolTeacher();

    // 选择主播老师后的操作
    function changePublishUserName(res: string) {
      teachersList.value.forEach((item: LiveData) => {
        if (item.id === res) {
          ruleForm.value.publishUserName = item.name;
          ruleForm.value.liveName = `${item.name}老师的直播`;
          // liveTeacherAvatar.value = item.headPortraitUrl;
          // createInitCover();
        }
      });
    }

    // 处理表单的部分数据
    function setRuleForm() {
      let newRuleForm = Object.assign({}, ruleForm.value);
      newRuleForm.liveDuration = +(newRuleForm.liveDuration * 3600).toFixed();
      if (newRuleForm.releaseScope[0] === "all") {
        let newClassList = JSON.parse(JSON.stringify(classList));
        newClassList.shift();
        newRuleForm.releaseScope = newClassList.map(
          (item: LiveData) => item.id
        );
      } else {
        newRuleForm.releaseScope = ruleForm.value.releaseScope;
      }
      return newRuleForm;
    }

    // 修改直播
    async function updateLive() {
      const newRuleForm = setRuleForm();

      const {
        liveId,
        createUserName,
        liveName,
        releaseScope,
        publishUserName,
        publishUserId,
        liveType,
        publishTime,
        liveDuration,
        description,
        coverImg,
      } = newRuleForm;

      let objList = {
        createUserName,
        liveName,
        releaseScope,
        publishUserName,
        publishUserId,
        liveType,
        publishTime,
        liveDuration,
        description,
        liveId,
      } as LiveData;

      // 如果它更新了封面才上传封面字段
      if (newRuleForm.coverImg.indexOf("http") === -1) {
        objList.coverImg = coverImg;
      }

      const { code } = await updateCmsLive(objList);
      if (+code === 0) {
        closeTargetLabel("修改成功，即将关闭当前页面");
      }
    }

    // 发布直播
    async function createLive() {
      const newRuleForm = setRuleForm();
      const { code } = await createCmsLive(newRuleForm);
      if (+code === 0) {
        closeTargetLabel("发布成功，即将关闭当前页面");
      }
    }

    // 关闭当前标签页
    function closeTargetLabel(msg: string) {
      // 向父页面发送消息，让其刷新直播列表
      window.opener.postMessage("updateLiveList", location.origin);
      Message.success(msg);
      setTimeout(() => {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }, 3000);
    }

    // 转换相关字段格式
    const changeDataForamt = () => {
      if (ruleForm.value.publishTime) {
        ruleForm.value.publishTime = micell.date.format(
          ruleForm.value.publishTime as Date | string,
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        changeDataForamt();
        if (valid) {
          console.log("验证通过");
          if (queryLiveId) {
            updateLive();
          } else {
            createLive();
          }
        } else {
          Message.error("请完整填写相关信息");
          console.log("验证失败");
        }
      });
    };

    // 修改封面
    function uploadCover() {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = () => {
        if (input.files) {
          const file = input.files[0];

          //选择好文件后调用图片剪切工具
          (imgClip.value as any)
            .init({
              width: 1920,
              height: 1080,
            })
            .then(() => {
              // 将选择的文件传入剪辑工具
              (imgClip.value as any).setImg(file);
            });
        }
      };
      input.click();
    }

    // 剪切完后的回调函数
    function getCoverData(res: ImgResponse) {
      uploadImg(res.blob);
    }

    //上传
    const uploadImg = (res: Blob): void => {
      const file = new File([res], "1.png", {
        type: res.type,
      });
      (cmsUpload.value as any)
        .uploadImageFile(file)
        .then((res: UploadRespon) => {
          ruleForm.value.coverImg = res.data;
          uploadAvatarUrl.value = res.attach;
          (imgClip.value as any).close();
          // isUploadCover.value = true;
          // liveTeacherAvatar.value = "";
        });
    };

    // 初始化封面
    // function createInitCover() {
    //   if (!queryLiveId) {
    //     (window as any).domtoimage
    //       .toBlob(document.querySelector("#img-box"))
    //       .then((res: Blob) => {
    //         const file = new File([res], "2.png", {
    //           type: res.type,
    //         });
    //         (cmsUpload.value as any)
    //           .uploadImageFile(file)
    //           .then((res: UploadRespon) => {
    //             ruleForm.value.coverImg = res.data;
    //           });
    //       });
    //   }
    // }

    // 获取编辑器里的内容
    const getWangEditorValue = (str: string) => {
      ruleForm.value.description = str;
    };

    //初始化相关内容
    function initData() {
      // liveTeacherAvatar.value = userInfo.userPortait;
      initValue.value = `<p>欢迎大家来到直播间！</p>`;
    }
    if (!queryLiveId) {
      initData();
    }

    //打开预览直播详情抽屉
    function openPreviewLive() {
      (liveDetailCom.value as any).handleOpen(
        {
          ...ruleForm.value,
          // liveTeacherAvatar: liveTeacherAvatar.value,
          uploadAvatarUrl: uploadAvatarUrl.value,
        },
        1
      );
    }

    onMounted(() => {
      // createInitCover();

      bus.$on("previewLive", () => {
        // 预览
        openPreviewLive();
      });
      bus.$on("previewIssueLive", () => {
        //发布/修改直播
        handleSure();
      });
    });

    onUnmounted(() => {
      bus.$off("previewLive");
      bus.$off("previewIssueLive");
    });

    return {
      staticData,
      ruleForm,
      schoolDetails,
      formCheck,
      handleSure,
      teachersList,
      classList,
      changeCheckReleaseScope,
      userInfo,
      uploadCover,
      imgClip,
      getCoverData,
      cmsUpload,
      // isUploadCover,
      changePublishUserName,
      // liveTeacherAvatar,
      uploadAvatarUrl,
      getWangEditorValue,
      initValue,
      liveDetailCom,
      loading,
      queryLiveId,
    };
  },
});
</script>
<style lang="less">
.edit-live-wrap {
  max-width: 880px;
  margin: 0 auto;

  .card {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    padding: 30px 60px;
    box-sizing: border-box;

    .cover-img-box {
      display: flex;
      align-items: center;

      #img-box {
        position: relative;
        width: 210px;
        height: 120px;
        background: linear-gradient(135deg, #4fa4f9, #6c63ff);
        border-radius: 4px;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        > img {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
        }

        > span {
          color: #fff;
          font-size: 16px;
        }

        &::before {
          position: absolute;
          bottom: 0;
          left: 0;
          display: block;
          content: "";
          background: url("../../../../assets/live-cover-icon.png") no-repeat;
          height: 53px;
          width: 53px;
        }
      }

      .upload-img-box {
        width: 210px;
        height: 120px;
        border-radius: 4px;
        margin-right: 20px;

        > img {
          width: 210px;
          height: 120px;
          border: 1px solid undefined;
        }
      }

      .upload-box {
        .upload-area {
          width: 209px;
          height: 118px;
          cursor: pointer;

          .not-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 4px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 14px;
            background: #fafafa;
          }

          > img {
            border-radius: 4px;
            width: 100%;
            height: 100%;
          }
        }

        > p {
          color: #999;
          font-size: 12px;
        }
      }
    }

    .description {
      > label {
        min-width: 80px;
      }
    }
  }
}
</style>
