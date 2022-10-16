<template>
  <div class="login" :ui-loading="true">
    <div class="loginHead">
      <a href="https://www.jinshuy.com">
        <img src="@/assets/logo.png" alt="" />
      </a>
      <p>园所后管</p>
    </div>
    <!--    <div class="textBox">极其简单 极致好用</div>-->

    <div class="loginFormBox">
      <div class="titleBox">
        <div>
          <!--          <img src="@/assets/logo.png" alt="" />-->
          <!--          <h1>教师端</h1>-->
        </div>
        <span></span>
      </div>
      <ui-form
        ref="form"
        :model="formData"
        class="FormBox"
        label-width="100px"
        :rules="rules"
      >
        <div class="footer">Copyright @ 幼儿园管理系统 2021 FLTD</div>
        <div class="titleBox">
          <div>
            <!--            <img src="@/assets/logo.png" alt="" />-->
            <!--            <h1>教师端</h1>-->
            <span>登录</span>
          </div>
          <span></span>
        </div>
        <ui-form-item prop="mobile">
          <ui-input
            placeholder="输入手机号"
            v-model="formData.mobile"
            @keyup.enter="submit"
          ></ui-input>
        </ui-form-item>
        <ui-form-item prop="password">
          <ui-input
            placeholder="输入密码"
            v-model="formData.password"
            type="password"
            @keyup.enter="submit"
          ></ui-input>
        </ui-form-item>
        <ui-form-item prop="captcha">
          <div class="captchaBox">
            <ui-input
              placeholder="验证码"
              v-model="formData.captcha"
              @keyup.enter="submit"
            ></ui-input>
            <img @click="getCaptcha" :src="url + urlTime" alt="" />
          </div>
        </ui-form-item>
        <ui-from-item>
          <ui-button type="primary" @click.enter="submit">登录</ui-button>
        </ui-from-item>
        <div class="agreement">
          <el-checkbox v-model="agreement"></el-checkbox>
          <span @click="jumpAgreement">用户协议</span>
        </div>
        <div class="agreement" style="left: 130px">
          <el-checkbox v-model="passwordStatus"></el-checkbox>
          <span @click="changePassWordStatus">记住密码</span>
        </div>
      </ui-form>
    </div>
  </div>
</template>

<script lang="ts">
import { login } from "@/api/userServer";
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { FormTable } from "@/base/interface";
import { School } from "@/store/user/state";
import { ElMessage } from "element-plus";
import Message from "@/themes/message/index";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const $store = useStore();
    const look = ref(false);
    const agreement = ref(false);
    const passwordStatus = ref(false);
    agreement.value = !!localStorage.getItem("agreement");
    const url = ref(
      `${process.env.VUE_APP_BASE_API}/userserver/regLogin/captcha.jpg?uuid=`
    );
    const urlTime = ref(dayjs().toDate().getTime());

    const formData = reactive({
      mobile: "",
      password: "",
      loginType: "password",
      sysType: "cms",
      userType: "300402",
      captcha: "",
      uuid: urlTime.value,
    });
    const rules = reactive({
      mobile: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    });

    const router = useRouter();

    /**
     * 打开用户协议
     */
    const jumpAgreement = () => {
      const url = router.resolve({
        path: "/agreement",
      });
      // console.log(url);
      window.open(url.href);
    };

    /**
     * 刷新验证码
     */
    const getCaptcha = (): void => {
      urlTime.value = dayjs().toDate().getTime();
    };
    const form = ref(null as FormTable | null);
    /**
     * 修改记住密码状态
     */
    const changePassWordStatus = (): void => {
      passwordStatus.value = !passwordStatus.value;
    };
    if (localStorage.getItem("passwordStatus") === "on") {
      passwordStatus.value = true;
      formData.password = localStorage.getItem("password") as string;
      formData.mobile = localStorage.getItem("mobile") as string;
    }
    /**
     * 登录
     */
    const submit = (): void => {
      if (form.value !== null) {
        form.value.validate((valid: boolean) => {
          if (valid) {
            if (!agreement.value) {
              Message.warning("请勾选用户协议");
              return;
            }
            localStorage.setItem("agreement", JSON.stringify(agreement.value));
            formData.uuid = urlTime.value;
            look.value = true;
            login(formData)
              .then((res) => {
                if (+res.code === 0) {
                  $store.dispatch("setUserInfo", res.data);
                  $store.dispatch("setToken", res.data.token);
                  // $store.dispatch("setSchoolList", res.data.schoolInfos);
                  if ($store.state.user.token) {
                    $store.dispatch("getRoleList");
                    $store.dispatch("getTitleList");
                    $store.dispatch("getGradeList");
                    $store.dispatch("getNationList");
                  }
                  // getUserInfo();
                  $store
                    .dispatch("getUserDetails")
                    .then((schoolList: School[]) => {
                      if (schoolList.length > 0) {
                        const okSchoolList = schoolList.filter(
                          (school: School) =>
                            school.sysAllow.indexOf("cms") > -1
                        );
                        if (okSchoolList.length > 0) {
                          localStorage.setItem(
                            "password",
                            passwordStatus.value ? formData.password : ""
                          );
                          localStorage.setItem(
                            "mobile",
                            passwordStatus.value ? formData.mobile : ""
                          );
                          localStorage.setItem(
                            "passwordStatus",
                            passwordStatus.value ? "on" : "off"
                          );
                          $store.dispatch(
                            "setSchoolId",
                            okSchoolList[0].schoolId
                          );
                          router.push("/");
                        } else {
                          ElMessage.error("用户没有登录后管的权限");
                          $store.dispatch("loginOut");
                        }
                      } else {
                        getCaptcha();
                      }
                    })
                    .catch(() => {
                      getCaptcha();
                    })
                    .finally(() => {
                      look.value = false;
                    });
                } else {
                  getCaptcha();
                }
              })
              .finally(() => {
                getCaptcha();
              });
          }
        });
      }
    };

    return {
      getCaptcha,
      submit,
      jumpAgreement,
      changePassWordStatus,
      passwordStatus,
      formData,
      form,
      rules,
      url,
      urlTime,
      agreement,
    };
  },
});
</script>

<style lang="less">
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  //background-color: #2d3a4b;
  background-image: url("../../assets/images/login/body1.png");
  background-repeat: no-repeat;
  background-position: left;
  background-size: cover;
  .textBox {
    position: absolute;
    top: 13vh;
    left: 18vw;
    font-size: 56px;
    color: #a38722;
  }
  .footer {
    width: 100%;
    color: rgba(0, 0, 0, 0.8);
    position: absolute;
    left: 52px;
    bottom: -70px;
  }
  .loginHead {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 60px;
    //background: #ffffff;
    //box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    z-index: 2;
    display: flex;
    align-items: center;
    a {
      display: inline-block;
      box-sizing: border-box;
      height: 40px;
      margin-left: 40px;
    }
    img {
      box-sizing: border-box;
      height: 40px;
      margin-left: 40px;
    }
    p {
      font-size: 24px;
      color: #656565;
      margin-left: 24px;
    }
  }
  .titleBox {
    padding-top: 35px;
    > div {
      display: flex;
      //align-items: center;
      //justify-content: center;
      span {
        font-size: 24px;
        color: #222222;
      }
    }
    margin-bottom: 24px;
  }
  .loginFormBox {
    width: 740px;
    height: 100vh;
    position: absolute;
    right: 0;
    top: 0;
    //background: rgba(255, 170, 83, 0.91);
  }
  .FormBox {
    width: 410px;
    height: 378px;
    opacity: 1;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 100px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 50px;
    box-sizing: border-box;
    .captchaBox {
      display: flex;
      img {
        box-sizing: border-box;
        border: 1px solid #d9d9d9;
        width: 130px;
        height: 40px;
        border-radius: 4px;
        margin-left: 10px;
      }
    }
    .ui-input {
      input {
        height: 40px;
      }
    }
    .ui-button {
      width: 100%;
      height: 40px;
      font-size: 16px;
    }
    .agreement {
      position: absolute;
      bottom: 20px;
      display: flex;
      align-items: center;
      span {
        margin-left: 4px;
        cursor: pointer;
        color: #999999;
        font-size: 12px;
      }
    }
  }
}
</style>
