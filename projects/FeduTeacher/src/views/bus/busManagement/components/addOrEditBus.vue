<template>
  <ui-modal
    v-model:visible="visible"
    okText="保存"
    :tips="false"
    :title="isEdit ? '编辑车辆' : '新增车辆'"
    @close="close"
    @ok="addOrEditBus"
    width="580"
  >
    <div class="content">
      <div class="left">
        <ui-form ref="formEl" label-width="86" :model="formData" :rules="rules">
          <ui-form-item label="车牌号" prop="plateNumber">
            <ui-input
              placeholder="输入车牌号"
              maxlength="30"
              v-model="formData.plateNumber"
            />
          </ui-form-item>
          <ui-form-item label="车辆编号">
            <ui-input
              maxlength="30"
              placeholder="输入车辆编号"
              v-model="formData.busNo"
            />
          </ui-form-item>
          <ui-form-item label="默认司机" align="line">
            <ui-input
              readonly
              v-model="formData.driverName"
              placeholder="选择默认司机"
            />
            <ui-button style="margin-left: 10px" @click="openSelectDriver"
              >选择</ui-button
            >
          </ui-form-item>
          <ui-form-item label="管理员" align="line">
            <ui-input
              v-model="formData.adminName"
              readonly
              placeholder="选择管理员"
            />
            <ui-button style="margin-left: 10px" @click="openSelectAdmin"
              >选择</ui-button
            >
          </ui-form-item>
          <ui-form-item label="核载人数" align="line" prop="maxPerson">
            <ui-input
              style="width: 180px"
              placeholder="输入核载人数"
              v-model="formData.maxPerson"
              :max="100"
              :min="0"
            />
            <el-tooltip
              content="核载人数最大值为0到100人"
              placement="right-start"
              effect="light"
              :append-to-body="false"
            >
              <ui-icon
                style="margin-left: 10px; color: #bababa"
                icon="icon-a-71"
                class="icon-info"
              />
            </el-tooltip>
          </ui-form-item>
          <ui-form-item label="车辆状态">
            <ui-radio-group v-model="formData.enableStatus">
              <ui-radio :label="1">正常</ui-radio>
              <ui-radio :label="2">维护中</ui-radio>
            </ui-radio-group>
          </ui-form-item>
        </ui-form>
      </div>
      <div class="right">
        <div class="selectImgBtn" v-if="!formData.busLogo" @click="selectImg">
          <h3>+</h3>
          <span>校车图片</span>
        </div>
        <div class="imgBox" v-else>
          <img :src="carImg" alt="" />
          <div class="clearBtn" @click="clearImg">
            <img src="@/assets/images/clearBtn.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </ui-modal>
  <ui-image-clip
    title="选择车辆照片"
    ref="imgClip"
    @getData="getClipImg"
  ></ui-image-clip>
  <cms-upload ref="cmsUpload" />
  <select-user ref="selectUser" :title="title" />
</template>

<script lang="ts" setup>
import SelectUser from "@/views/bus/busManagement/components/selectUser.vue";

interface UploadResponse {
  data: string;
  type: string;
  url: string;
  attach: string;
}
interface ImgResponse {
  url: string;
  blob: Blob;
}

import { defineEmits, defineExpose, reactive, ref, watch } from "vue";
import CmsUpload from "@/base/cmsUpload.vue";
import { CreateOrEditBusParams } from "@/views/bus/busManagement/interface";
import { createOrEditBus } from "@/api/bus";
import { ElMessage } from "element-plus";
import { validateMoneyDuration } from "@/utils/regular";

const visible = ref(false);
const isEdit = ref(false);
const carImg = ref("");
const carImgId = ref("");

const title = ref("");

const $emit = defineEmits(["success"]);

const rules = reactive({
  plateNumber: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
  maxPerson: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (+value >= 0 && +value <= 100) {
          callback();
        } else {
          callback(new Error("核载人数最大值为0到100人"));
        }
      },
      trigger: "change",
    },
  ],
});

const formData = reactive<CreateOrEditBusParams>({
  adminMobile: "",
  adminName: "",
  busLogo: "",
  busNo: "",
  driverMobile: "",
  driverName: "",
  maxPerson: "",
  plateNumber: "",
  enableStatus: "",
  carStatus: "",
});

watch(
  () => formData.maxPerson,
  () => {
    if (!Number.isInteger(+formData.maxPerson)) {
      formData.maxPerson = parseInt(formData.maxPerson).toString();
    }
  }
);

const open = (data: any) => {
  isEdit.value = false;
  if (data) {
    isEdit.value = true;
    formData.adminName = data.adminName;
    formData.adminMobile = data.adminMobile;
    formData.busLogo = data.busLogo;
    formData.busNo = data.busNo;
    formData.driverMobile = data.driverMobile;
    formData.driverName = data.driverName;
    formData.maxPerson = data.maxPerson;
    formData.plateNumber = data.plateNumber;
    formData.enableStatus = data.enableStatus;
    formData.carStatus = data.carStatus;
    formData.id = data.id;
    carImg.value = data.busLogoUrl;
  }
  visible.value = true;
};

const close = () => {
  visible.value = false;
  reset();
};

const formEl = ref(null);

const addOrEditBus = () => {
  (formEl.value as any)?.validate((valid: boolean) => {
    if (valid) {
      if (!isEdit.value) {
        formData.carStatus = formData.enableStatus;
      }
      createOrEditBus(formData).then((res) => {
        if (+res.code === 0) {
          ElMessage.success("保存成功！");
          close();
          $emit("success");
        }
      });
    }
  });
};

const reset = () => {
  formData.adminName = "";
  formData.adminMobile = "";
  formData.busLogo = "";
  formData.busNo = "";
  formData.driverMobile = "";
  formData.driverName = "";
  formData.maxPerson = "";
  formData.plateNumber = "";
  formData.enableStatus = "";
  delete formData.id;
};

const clearImg = () => {
  carImg.value = "";
  carImgId.value = "";
  formData.busLogo = "";
};

const imgClip = ref(null);
const selectImg = () => {
  (imgClip.value as any).init(
    {
      width: 888,
      height: 720,
    },
    {}
  );
};

const selectUser = ref(null);
//选择管理员
const openSelectAdmin = () => {
  title.value = "选择管理员";
  (selectUser.value as any).open().then((res: any) => {
    console.log(res);
    formData.adminMobile = res.mobile;
    formData.adminName = res.name;
  });
};
//选择司机
const openSelectDriver = () => {
  title.value = "选择默认司机";
  (selectUser.value as any).open().then((res: any) => {
    console.log(res);
    formData.driverMobile = res.mobile;
    formData.driverName = res.name;
  });
};

//获取截取好的图片
const getClipImg = (e: ImgResponse) => {
  uploadImg(e.blob);
};

const cmsUpload = ref(null);
//上传
const uploadImg = (res: Blob): void => {
  const file = new File([res], "1.png", {
    type: res.type,
  });
  (cmsUpload.value as any).uploadImageFile(file).then((res: UploadResponse) => {
    console.log(res);
    formData.busLogo = res.data;
    carImg.value = res.attach;
    (imgClip.value as any).close();
    // isUploadCover.value = true;
    // liveTeacherAvatar.value = "";
  });
};

defineExpose({
  open,
});
</script>

<style scoped lang="less">
.content {
  display: flex;
  justify-content: space-between;
  .left {
    margin-right: 20px;
  }
  .right {
    width: 148px;
    .selectImgBtn {
      width: 148px;
      height: 120px;
      box-sizing: border-box;
      background: #fafafa;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      h3 {
        color: #bfbfbf;
        font-size: 18px;
      }
      span {
        //margin-top: 6px;
        color: #999999;
        font-size: 14px;
      }
    }
    .imgBox {
      width: 148px;
      height: 120px;
      box-sizing: border-box;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .clearBtn {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        width: 16px;
        height: 16px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
