<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    width="560"
    :okText="okText"
    :tips="false"
  >
    <div class="body-text-box">
      <div class="form-box">
        <div class="left-form">
          <ui-form
            :model="ruleForm"
            :rules="staticData.rules"
            ref="formCheck"
            label-width="110"
          >
            <ui-form-item label="计划名称" prop="name">
              <ui-input
                v-model="ruleForm.name"
                placeholder="请输入计划名称"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="报名截止日期" prop="endTime">
              <ui-date-picker
                style="width: 210px"
                v-model="ruleForm.endTime"
                type="date"
                placeholder="请选择报名截止日期"
              >
              </ui-date-picker>
            </ui-form-item>
            <ui-form-item label="封面" prop="pic">
              <div class="cover-img-box">
                <div class="upload-box">
                  <div class="upload-area" @click="uploadCover">
                    <div class="not-upload" v-if="!coverImgUrl">
                      <ui-icon icon="icon-a-81"></ui-icon>
                      <span>上传封面</span>
                    </div>
                    <template v-else>
                      <img :src="coverImgUrl" alt="" />
                    </template>
                  </div>
                  <p>建议分辨率不低于 1920*1080（大小不超过 10M）</p>
                </div>
              </div>
            </ui-form-item>
            <ui-form-item label="简介" prop="introduction">
              <ui-input
                width="100%"
                height="154"
                type="textarea"
                placeholder="请输入招生计划简介"
                v-model="ruleForm.introduction"
                textareaMaxlength="200"
              ></ui-input>
            </ui-form-item>
          </ui-form>
        </div>
      </div>
    </div>
  </ui-modal>
  <ui-image-clip ref="imgClip" @getData="getCoverData"></ui-image-clip>
  <cms-upload ref="cmsUpload" />
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { staticData } from "../index";
import micell from "micell";
import Message from "@/themes/message";
import CmsUpload from "@/base/cmsUpload.vue";
import { addPlan } from "@/api/recruitStudentsPlan";
import { useRouter } from "vue-router";
import bus from "@/Layout/bus";

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
  emits: ["editPlanComplete"],
  setup(props, cxt) {
    const router = useRouter();
    const formCheck = ref(null);
    const cmsUpload = ref(null);
    const imgClip = ref(null);
    const modalStatus = ref(false);
    const title = ref("");
    const editFlag = ref(1); //1-新增操作，2-修改操作

    let ruleForm = ref({
      name: "",
      endTime: "" as Date | string,
      pic: "",
      introduction: "",
    });

    const coverImgUrl = ref("");
    const successTxt = ref("");
    const okText = ref("");

    // 打开模态框
    const handleOpen = (index: number, res?: any) => {
      if (index === 1) {
        okText.value = "下一步";
        title.value = "新建招生";
        successTxt.value = "新增成功";
        editFlag.value = 1;
      } else {
        okText.value = "确定";
        title.value = "编辑招生";
        successTxt.value = "修改成功";
        editFlag.value = 2;

        const { id, name, endTime, pic, picId, introduction } = Object.assign(
          {},
          res
        );
        ruleForm.value = {
          id,
          name,
          endTime,
          pic: picId,
          introduction,
        } as any;
        coverImgUrl.value = pic;
      }
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 上传封面
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
          coverImgUrl.value = res.attach;
          (imgClip.value as any).close();
        });
    };

    // 转换时间格式
    const selectDate = () => {
      if (ruleForm.value.endTime) {
        ruleForm.value.endTime = micell.date.format(
          ruleForm.value.endTime as Date | string,
          "YYYY-MM-DD"
        );
      }
    };

    // 新增/修改操作
    async function editPlan() {
      const { code, data } = await addPlan(ruleForm.value);
      if (+code === 0) {
        modalStatus.value = false;
        Message.success(successTxt.value);
        bus.$emit("editPlanComplete", true);
        if (editFlag.value === 1) {
          router.push(`/outClass?id=${data}`);
          // router.push(`/outClass`);
        }
      }
    }

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log("验证通过");
          selectDate();
          editPlan();
        } else {
          console.log("验证失败");
        }
      });
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
      getCoverData,
      imgClip,
      cmsUpload,
      coverImgUrl,
      okText,
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
            width: 209px;
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
    }
  }
}
</style>
