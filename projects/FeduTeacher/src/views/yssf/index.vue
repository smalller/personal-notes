<template>
  <div class="yssf">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="content">
      <ui-card class="formBox">
        <div class="title">基本信息</div>
        <div class="formDataBox">
          <ui-form
            ref="formEl"
            label-width="160px"
            :model="formData"
            :rules="rules"
          >
            <div style="display: flex">
              <ui-form-item style="height: 42px" label="商户名称" prop="mName">
                <ui-input v-model="formData.mName" />
              </ui-form-item>
              <ui-form-item
                style="margin-left: 50px; height: 42px"
                label="商户经营地联系地址"
                prop="contactAddr"
              >
                <ui-input validate-event v-model="formData.contactAddr" />
              </ui-form-item>
            </div>
            <div style="display: flex">
              <ui-form-item
                style="height: 42px"
                label="申请人手机号"
                prop="contactPhone"
              >
                <ui-input v-model="formData.contactPhone" type="tel" />
              </ui-form-item>
              <ui-form-item
                style="margin-left: 50px; height: 42px"
                prop="contactEmail"
                label="申请人邮箱"
              >
                <ui-input
                  validate-event
                  type="email"
                  v-model="formData.contactEmail"
                />
              </ui-form-item>
            </div>
            <ui-form-item label="营业执照照片" prop="businessLicenseImg">
              <div class="photo" @click="uploadImg">
                <img
                  :src="formData.businessLicenseImg"
                  v-show="formData.businessLicenseImg"
                  alt=""
                />
                <ui-icon
                  v-show="!formData.businessLicenseImg"
                  icon="icon-a-81"
                />
              </div>
            </ui-form-item>
          </ui-form>
          <div class="btnBox" style="margin-top: 20px">
            <ui-button type="primary" @click="submit">提交申请</ui-button>
          </div>
        </div>
      </ui-card>
      <ui-card class="userList">
        <div class="nameBox">销售代表</div>
        <div class="userListBox">
          <div class="item" v-for="(item, index) in userList" :key="index">
            <div class="left">
              <div class="pic">
                <img :src="item.pic" alt="" />
              </div>
              <div class="userName">{{ item.name }}</div>
            </div>
            <div class="itemBtn" @click="openUserDetails(item)">详情</div>
          </div>
        </div>
      </ui-card>
    </div>
    <ui-modal
      v-model:visible="visible"
      @close="closeUserInfo"
      @ok="closeUserInfo"
      title="销售代表"
      :showClose="false"
      :tips="false"
      okText="关闭"
      width="340"
    >
      <div class="modelBox">
        <div class="headBox"></div>
        <div class="userInfoBox">
          <div class="pic">
            <img :src="activeUserInfo.pic" alt="" />
          </div>
          <div class="name">{{ activeUserInfo.name }}</div>
          <div class="title">{{ activeUserInfo.title }}</div>
        </div>
        <div class="messageBox">
          <div class="msgItem">
            <span>电话</span>
            <p>{{ activeUserInfo.phone }}</p>
          </div>
          <div class="msgItem">
            <span>邮箱</span>
            <p class="tel" @click="openEmail(activeUserInfo.email)">
              {{ activeUserInfo.email }}
            </p>
          </div>
          <div class="msgItem qrCode">
            <span>微信</span>
            <!--            <p class="tel" @click="openWeChat(activeUserInfo.wechat)">-->
            <!--              {{ activeUserInfo.name }}-->
            <!--            </p>-->
            <canvas
              v-if="activeUserInfo.wechat"
              class="qr"
              ref="qrcodeEl"
            ></canvas>
          </div>
        </div>
      </div>
    </ui-modal>
  </div>
  <ui-image-clip title="上传营业执照照片" ref="imgClip" />
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { ImgResponse } from "@/base/interface";
import md5 from "js-md5";
import QRCode from "qrcode";
import { ElMessage } from "element-plus";
import { merchantApply, MerchantApplyParams } from "@/api/yssf";
import userList, { SalesRepresentative } from "@/utils/SalesRepresentative";
const route = useRoute();
const imgClip = ref(null);

const formData = reactive<MerchantApplyParams>({
  mName: "",
  contactPhone: "",
  contactAddr: "",
  contactEmail: "",
  businessLicenseImg: "",
  mPassword: "",
});

const rules = reactive({
  mName: [{ required: true, message: "请输入商户名称", trigger: "blur" }],
  contactPhone: [
    { required: true, message: "请输入申请人手机号", trigger: "blur" },
  ],
  contactAddr: [{ required: true, message: "请输入联系地址", trigger: "blur" }],
  contactEmail: [
    { required: true, message: "请输入申请人邮箱", trigger: "blur" },
  ],
  businessLicenseImg: [
    { required: true, message: "请上传营业执照照片", trigger: "change" },
  ],
});
const formEl = ref(null);
//上传
const uploadImg = (): void => {
  // if (familyList.value === 0) {
  //   Message.warning("暂无数据可导出");
  // }
  (imgClip.value as any)
    .init({
      width: 1460,
      height: 1100,
    })
    .then((res: ImgResponse) => {
      (imgClip.value as any).close();
      formData.businessLicenseImg = res.url;
      if (!formEl.value) return;
      (formEl.value as any).validateField("businessLicenseImg", () => null);
    });
};

//提交开会申请
const submit = () => {
  const phoneNum = formData.contactPhone.substr(5);
  formData.mPassword = md5(phoneNum);

  (formEl.value as any)?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const { code, msg } = await merchantApply(formData);
        if (+code === 1000) {
          ElMessage.success(
            "提交成功，您的密码为手机号后6位，请去商户端登录完善剩余信息"
          );
        } else {
          ElMessage.warning(msg);
        }
      } catch (e) {}
    }
  });
};

const visible = ref(false);
const activeUserInfo = ref<SalesRepresentative>({
  pic: "",
  name: "",
  phone: "",
  email: "",
  wechat: "",
  title: "",
});
//显示销售代表详情
const openUserDetails = (item: SalesRepresentative) => {
  visible.value = true;
  activeUserInfo.value = item;
  setTimeout(() => {
    createQr(item.wechat);
  }, 500);
};
const closeUserInfo = () => {
  visible.value = false;
  activeUserInfo.value = {
    pic: "",
    name: "",
    phone: "",
    email: "",
    wechat: "",
    title: "",
  };
};
const qrcodeEl = ref(null);
const openWeChat = (url: string) => {
  console.log(url);
  window.open(url);
  // window.open(`wxwork://message?uin=${url}$map;source=100`);
};
const openEmail = (email: string) => {
  window.open(`mailto:${email}`);
};

function createQr(text: string) {
  const opts = {
    errorCorrectionLevel: "H", //容错级别
    type: "image/png", //生成的二维码类型
    quality: 0.3, //二维码质量
    margin: 0, //二维码留白边距
    width: 100, //宽
    height: 100, //高
    text: text, //二维码内容
    color: {
      dark: "#333333", //前景色
      light: "#fff", //背景色
    },
  };
  console.log(qrcodeEl.value);
  // 将获取到的数据（val）画到msg（canvas）上
  QRCode.toCanvas(qrcodeEl.value, text, opts, function (error: string) {
    return error;
  });
}
</script>

<style lang="less">
.yssf {
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    padding-bottom: 20px;
  }
  .content {
    display: flex;
    .formBox {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .photo {
        cursor: pointer;
        margin-right: 20px;
        width: 146px;
        height: 110px;
        border-radius: 4px;
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px #d9d9d9 solid;
        &:last-child {
          border: 1px #d9d9d9 dashed;
          display: flex;
          justify-content: center;
          flex-direction: column;
          //padding: 0 20px;
          > button {
            padding: 6px 10px;
            font-size: 12px;
            &:last-child {
              margin-top: 20px;
            }
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .icon {
          font-size: 36px;
          fill: #7e7d7d;
        }
        .closeBtn {
          width: 16px;
          height: 16px;
          background: #000000;
          opacity: 0.5;
          border-radius: 4px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
    .userList {
      width: 220px;
      margin-left: 24px;
      height: auto;
      .nameBox {
        font-size: 20px;
        font-weight: 400;
        color: #000000;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebeef5;
      }
      .userListBox {
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
          padding: 9px 8px;
          box-sizing: border-box;
          border-bottom: 1px solid #ebeef5;
          .left {
            display: flex;
            align-items: center;
            .pic {
              width: 36px;
              height: 36px;
              border: 1px solid rgba(0, 0, 0, 0.051);
              border-radius: 50%;
              overflow: hidden;
            }
            .userName {
              margin-left: 12px;
              font-size: 14px;
              font-weight: 400;
              color: #000000;
            }
          }

          .itemBtn {
            font-size: 14px;
            color: #1879ff;
            cursor: pointer;
            &:active {
              color: #0669f1;
            }
          }
        }
      }
    }
  }

  .modelBox {
    padding-top: 180px;
    .headBox {
      width: 340px;
      height: 115px;
      background: linear-gradient(91deg, #e6eeff 0%, #ebf4fb 50%, #fef8f9 100%);
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      border-radius: 4px 4px 0px 0px;
    }
    .userInfoBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 61px;
      left: 50%;
      transform: translateX(-50%);
      .pic {
        width: 108px;
        height: 108px;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      }
      .name {
        font-size: 24px;
        color: #1e1e1e;
        margin-top: 6px;
      }
      .title {
        font-size: 14px;
        color: #9a9a9a;
        margin-top: 5px;
      }
    }
    .messageBox {
      padding-top: 15px;
      box-sizing: border-box;
      border-top: 1px solid #ebedf1;
      .msgItem {
        display: flex;
        align-items: center;
        padding-bottom: 12px;
        span {
          font-size: 14px;
          color: #1e1e1e;
        }
        p {
          margin-left: 16px;
          font-size: 14px;
          color: #1e1e1e;
          &.tel {
            color: #4fa8f9;
            cursor: pointer;
          }
        }
        .qr {
          margin-left: 16px;
          width: 100px;
          height: 100px;
        }
        &.qrCode {
          align-items: flex-start;
        }
      }
    }
  }
}
</style>
