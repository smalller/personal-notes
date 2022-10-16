<template>
  <div class="edit-course">
    <classShow
      :info="showData"
      :show="show"
      :type="2"
      @close="closed"
    ></classShow>
    <ui-card class="card" v-loading="loading">
      <div class="form-box">
        <ui-form
          ref="formCheck"
          :model="ruleForm"
          :rules="staticData.rules"
          label-width="82"
        >
          <ui-form-item label="课程名称" prop="courseName">
            <ui-input
              v-model="ruleForm.courseName"
              placeholder="请输入课程名称"
            ></ui-input>
          </ui-form-item>
          <ui-form-item label="课程封面" prop="pic">
            <div class="cover-img-box">
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
                <p>建议分辨率不低于 1920*1080</p>
              </div>
            </div>
          </ui-form-item>
          <ui-form-item label="课程详情" prop="content" class="content">
            <WangEditor
              @getWangEditorValue="getWangEditorValue"
              :initValue="initValue"
              ref="editor"
            ></WangEditor>
          </ui-form-item>
        </ui-form>
      </div>
    </ui-card>
    <ui-image-clip ref="imgClip" @getData="getCoverData"></ui-image-clip>
    <cms-upload ref="cmsUpload" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { staticData } from ".././index";
import { addSubject, getSubject } from "@/api/subjectManage";
import CmsUpload from "@/base/cmsUpload.vue";
import WangEditor from "@/components/wangEditor/index.vue";
import bus from "@/Layout/bus";
import Message from "@/themes/message";
import classShow from "./classShow.vue";
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

interface CourseData {
  [key: string]: any;
}

export default defineComponent({
  components: { CmsUpload, WangEditor, classShow },
  setup() {
    const store = useStore();
    const route = useRoute();
    const queryLiveId = route.query.id;
    console.log(queryLiveId, "222222222222");
    const loading = ref(false);
    const formCheck = ref(null);
    const { schoolId, token, userId, userInfo } = store.state.user;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("schoolId", schoolId);
    sessionStorage.setItem("userId", userId);
    const schoolDetails = computed(() => {
      return store.state.user.schoolList.find((item: CourseData) => {
        if (schoolId === item.schoolId) {
          return item;
        }
      });
    });
    const imgClip = ref(null);
    const cmsUpload = ref(null);
    const liveDetailCom = ref(null);
    const uploadAvatarUrl = ref(""); //自己上传的封面
    let initValue = ref(""); //编辑器里的内容
    const ruleForm = ref<CourseData>({
      courseName: "",
      pic: "",
      content: "",
      courseType: 2,
      id: "",
    });

    // 修改课程
    async function updateCourse() {
      const newRuleForm = Object.assign({}, ruleForm.value);
      const { courseName, content, pic, id } = newRuleForm;
      let objList = {
        courseName,
        content,
        pic,
        id,
      } as CourseData;
      const { code } = await addSubject(objList);
      if (+code === 0) {
        closeTargetLabel("修改成功，即将关闭当前页面");
      }
    }

    // 保存课程
    async function createCourse() {
      const newRuleForm = Object.assign({}, ruleForm.value);
      const { code } = await addSubject(newRuleForm);
      if (+code === 0) {
        closeTargetLabel("新增成功，即将关闭当前页面");
      }
    }

    // 关闭当前标签页
    function closeTargetLabel(msg: string) {
      // 向父页面发送消息，让其刷新课程列表
      window.opener.postMessage("updateCourse", location.origin);
      Message.success(msg);
      setTimeout(() => {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }, 3000);
    }

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log(ruleForm.value, "222333333333333");
        }
        if (valid) {
          if (queryLiveId) {
            updateCourse();
          } else {
            createCourse();
          }
        } else {
          Message.error("请完整填写相关信息");
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
          ruleForm.value.pic = res.data;
          uploadAvatarUrl.value = res.attach;
          (imgClip.value as any).close();
        });
    };

    // 获取编辑器里的内容
    const getWangEditorValue = (str: string) => {
      ruleForm.value.content = str;
    };

    //初始化相关内容
    function initData() {
      initValue.value = "";
    }
    if (!queryLiveId) {
      initData();
    }
    onMounted(async () => {
      if (queryLiveId) {
        let { data, code } = await getSubject(queryLiveId as string);
        if (code === 0) {
          console.log(data);
          ruleForm.value = Object.assign({}, data);
          uploadAvatarUrl.value = data.pic;
          ruleForm.value.pic = data.picId;
          initValue.value = ruleForm.value.content;
        }
      }
    });
    const show = ref(false);
    const showData = ref({} as any);
    //打开预览直播详情抽屉
    function openPreviewLive() {
      if (ruleForm.value.courseName) {
        showData.value = Object.assign({}, ruleForm.value);
        showData.value.pic = uploadAvatarUrl.value;
        show.value = true;
      } else {
        Message.warning("请先填写课程名称");
      }
    }
    function closed() {
      show.value = false;
    }
    onMounted(() => {
      bus.$on("coursePre", () => {
        // 预览
        openPreviewLive();
      });
      bus.$on("courseSave", () => {
        handleSure();
      });
    });

    onUnmounted(() => {
      bus.$off("coursePre");
      bus.$off("courseSave");
    });

    return {
      ruleForm,
      schoolDetails,
      formCheck,
      handleSure,
      userInfo,
      uploadCover,
      imgClip,
      getCoverData,
      cmsUpload,
      uploadAvatarUrl,
      getWangEditorValue,
      initValue,
      liveDetailCom,
      loading,
      queryLiveId,
      staticData,
      show,
      closed,
      showData,
    };
  },
});
</script>
<style lang="less">
.edit-course {
  max-width: 880px;
  margin: 0 auto;
  .card {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    padding: 30px 60px;
    box-sizing: border-box;
    min-height: 800px;
    .form-box {
      padding-top: 20px;
      .ui-form-item-label {
        min-width: 80px;
      }
    }
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
          margin-top: 10px;
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
