<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    width="560"
    okText="保存"
    :tips="false"
  >
    <div class="body-text-box">
      <div class="form-box">
        <div class="left-form">
          <ui-form
            :model="ruleForm"
            :rules="staticData.section"
            ref="formCheck"
            label-width="100"
          >
            <ui-form-item
              label="课节名称"
              prop="sectionName"
            >
              <ui-input
                v-model="ruleForm.sectionName"
                placeholder="请输入课节名称"
              ></ui-input>
            </ui-form-item>
            <ui-form-item
              label="上传视频"
              prop="videoPath"
            >
              <div class="cover-img-box">
                <div class="upload-box">
                  <div
                    class="upload-area"
                    @click="uploadCover"
                  >
                    <div
                      v-if="!videoUrl"
                      class="not-upload"
                      v-loading="loading"
                    >
                      <ui-icon icon="icon-a-81"></ui-icon>
                      <span>上传视频</span>
                    </div>
                    <template v-else>
                      <video
                        :src="videoUrl"
                        alt=""
                        class="not-play"
                      />
                      <img
                        class="play-icon"
                        src="@/assets/play.png"
                      />
                      <i
                        class="el-icon-close"
                        @click.stop="delVideo"
                      ></i>
                    </template>
                  </div>
                  <cms-upload ref="cmsUpload" />
                  <p>建议分辨率不低于 1920*1080</p>
                </div>
              </div>
            </ui-form-item>
          </ui-form>
        </div>
      </div>
    </div>
  </ui-modal>
  <ui-video
    v-model:visible="videoPlayerShow"
    ref="videoPlayer"
  ></ui-video>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { staticData } from "../index";
import bus from "@/Layout/bus";
import Message from "@/themes/message";
import CmsUpload from "@/base/cmsUpload.vue";
import { VideoPlayer } from "@/base/interface";
import { addCourseSection } from "@/api/subjectManage";
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

export default defineComponent({
  components: {
    CmsUpload,
  },
  setup() {
    const formCheck = ref(null);
    const cmsUpload = ref(null);
    const imgClip = ref(null);
    const modalStatus = ref(false);
    const editPlanCom = ref(null);
    const title = ref("");
    const editFlag = ref(1); //1-新增操作，2-修改操作
    const courseInfo = ref({});
    const loading = ref(false);
    let ruleForm = ref({
      courseId: "",
      id: "",
      sectionName: "",
      videoDuration: "",
      videoPath: "",
    });
    const videoUrl = ref("");
    // 打开模态框
    const handleOpen = (index: number, data: any, res?: any) => {
      courseInfo.value = {};
      initData();
      if (index === 1) {
        title.value = "新建课节";
        editFlag.value = 1;
      } else {
        title.value = "编辑课节";
        editFlag.value = 2;
        ruleForm.value = Object.assign({}, res);
        videoUrl.value = res.videoPath;
      }
      courseInfo.value = Object.assign({}, data);
      ruleForm.value.courseId = data.id;
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 上传封面
    function uploadCover() {
      if (videoUrl.value) {
        showVideo();
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = () => {
          if (input.files) {
            const file = input.files[0];
            uploadVideo(file);
          }
        };
        input.click();
      }
    }

    //上传
    const uploadVideo = (res: any): void => {
      loading.value = true;
      let file = res;
      if (res.name) {
        videoUrl.value = "";
        let fileurl = URL.createObjectURL(file);
        let video = document.createElement("video");
        video.src = fileurl;
        video.addEventListener("loadedmetadata", function (e2) {
          let result = video.duration;
          let minute =
            Math.floor((result / 60) % 60) < 10
              ? "0" + Math.floor((result / 60) % 60)
              : Math.floor((result / 60) % 60);
          let second =
            Math.floor(result % 60) < 10
              ? "0" + Math.floor(result % 60)
              : Math.floor(result % 60);
          ruleForm.value.videoDuration = minute + ":" + second;
        });
        const data = new File([res], file.name, {
          type: res.type,
        });

        (cmsUpload.value as any).splitUpload(data).then((res: UploadRespon) => {
          videoUrl.value = res.url;
          ruleForm.value.videoPath = res.data;
          loading.value = false;
        });
      }
    };
    // 初始化表单
    const initData = (): void => {
      ruleForm.value = {
        courseId: "",
        id: "",
        sectionName: "",
        videoDuration: "",
        videoPath: "",
      };
    };

    // 新增招生计划
    const addSection = async (params: any): Promise<void> => {
      const { code } = await addCourseSection(params);
      if (+code === 0) {
        bus.$emit("editSectionComplete", true); // 通知更新表格
        modalStatus.value = false;
        Message.success("新增成功");
        initData();
      }
    };

    // 修改招生计划
    const updateSection = async (params: any): Promise<void> => {
      const { code } = await addCourseSection(params);
      if (+code === 0) {
        bus.$emit("editSectionComplete", true); // 通知更新表格
        modalStatus.value = false;
        Message.success("修改成功");
      }
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          if (editFlag.value === 1) {
            addSection(ruleForm.value);
          } else {
            updateSection(ruleForm.value);
          }
        } else {
          console.log("验证失败");
        }
      });
    };
    const videoPlayer = ref(null);
    const videoPlayerShow = ref(false);
    /**
     * 打开视频详情
     */
    const showVideo = () => {
      console.log("111", videoUrl.value);
      if (!videoUrl.value) {
        Message.warning("没有获取到视频链接");
        return;
      }
      videoPlayerShow.value = true;
      const dp = (videoPlayer.value as unknown as VideoPlayer).init(
        videoUrl.value,
        {
          autoPlay: true,
        }
      );
      dp.volume(0.7, true, true);
    };
    const delVideo = () => {
      if (videoUrl.value) {
        videoUrl.value = "";
        ruleForm.value.videoPath = "";
      }
    };
    return {
      modalStatus,
      title,
      ruleForm,
      handleClose,
      handleSure,
      handleOpen,
      formCheck,
      staticData,
      uploadCover,
      imgClip,
      cmsUpload,
      videoUrl,
      videoPlayerShow,
      videoPlayer,
      delVideo,
      loading,
    };
  },
});
</script>

<style lang="less" scoped>
.body-text-box {
  font-size: 14px;
  margin: 20px 0 40px 0;

  .form-box {
    display: flex;
    justify-content: space-between;

    .left-form {
      flex-grow: 1;

      .cover-img-box {
        display: flex;
        align-items: center;

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
            width: 210px;
            height: 118px;
            margin-bottom: 10px;
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
            .not-play {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
            > img {
              border-radius: 4px;
              width: 100%;
              height: 100%;
            }
            .play-icon {
              width: 46px;
              height: 46px;
              position: absolute;
              top: 35px;
              left: 85px;
            }
            .el-icon-close {
              position: absolute;
              top: 4px;
              width: 10px;
              left: 194px;
              width: 16px;
              height: 16px;
              background: #000000;
              color: #ffffff;
              border-radius: 4px;
            }
          }

          > p {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
