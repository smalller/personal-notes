<template>
  <div class="main-login">
    <div class="login-box">
      <h1 class="title">商户端账户登录</h1>
      <el-form :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-form-item prop="account">
          <el-input v-model="modelRef.account" placeholder="账号" @keydown.enter="handleSubmit">
            <!-- <template #prefix>
            <i class="el-input__icon">
              <icon-svg type="user"></icon-svg>
            </i>
          </template> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="modelRef.password" type="password" placeholder="密码" @keydown.enter="handleSubmit">
            <!-- <template #prefix>
            <i class="el-input__icon">
              <icon-svg type="pwd"></icon-svg>
            </i>
          </template> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="merchantId">
          <el-select style="width: 100%" v-model="modelRef.merchantId" filterable placeholder="请选择商户">
            <el-option v-for="(item, index) in merchanOption" :key="index" :label="item.merchantName"
              :value="item.merchantId" />
          </el-select>
        </el-form-item>
        <div class="tip-box">
          <p class="tip">密码默认为手机号后6位</p>
          <p class="tip cur" @click="dialogVisible = true">忘记密码？</p>
        </div>
        <el-form-item>
          <el-button type="primary" class="submit" @click="handleSubmit" :loading="submitLoading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="botom-link">
      <div class="footer-links">
        <a href="http://help.jinshuy.com" target="_blank">
          帮助
        </a>
        <a href="http://help.jinshuy.com/ysxy.html" target="_blank">
          隐私
        </a>
        <a href="http://help.jinshuy.com/yhxy.html" target="_blank">
          条款
        </a>
      </div>
      <div class="botom-text">
        <p>本产品由中国民生银行提供金融支持</p>
        <p>copyright ©2022 成都在线支点教育科技出品 </p>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" width="30%" title="忘记密码">
    <el-form ref="infoRef" :model="dataObj" :rules="infoRules" label-width="90px" label-position="right">
      <el-form-item label="账号：" prop="account">
        <el-input style="width:200px" v-model="dataObj.account"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input style="width:200px" v-model="dataObj.password"></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="code" class="send-code">
        <el-input style="width:200px;margin-right: 10px;" v-model="dataObj.code"></el-input>
        <el-button type="primary" @click="sendCode">
          {{ isSendCode ? timeNum + 's' : '发送' }}
        </el-button>
      </el-form-item>
    </el-form>
    <div style="text-align:right">
      <el-button type="primary" @click="handleSubmitFor">提交</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  Ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElForm, ElMessage } from "element-plus";
import IconSvg from "@/components/IconSvg";
import { LoginParamsType } from "./data.d";
import { StateType as UserLoginStateType } from "./store";
import { merchantList, sendSmsCode, resetPassword } from './service'
import { throttle } from '@/utils/common'
import md5 from 'js-md5'

interface UserLoginSetupData {
  modelRef: LoginParamsType;
  rulesRef: any;
  formRef: Ref<typeof ElForm | undefined>;
  submitLoading: Ref<boolean>;
  handleSubmit: () => Promise<void>;
  merchanOption: Ref<any>
  dialogVisible: Ref<boolean>
  dataObj: any
  infoRef: Ref<unknown>
  infoRules: any
  handleSubmitFor: () => void
  sendCode: () => void
  timer: any
  timeNum: Ref<number>
  isSendCode: Ref<boolean>
}

export default defineComponent({
  name: "UserLogin",
  components: {
    // IconSvg,
  },
  setup(): UserLoginSetupData {
    const router = useRouter();
    const { currentRoute } = router;
    const store = useStore<{ userlogin: UserLoginStateType }>();
    const merchanOption = ref<any>([])
    const dialogVisible = ref(false);
    const infoRef = ref<unknown>(null)


    let dataObj = ref({
      account: '',
      password: '',
      code: ''
    })

    const infoRules = reactive({
      account: [
        {
          required: true,
          message: "请输入账号",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
        },
      ],
      code: [
        {
          required: true,
          message: "请输入验证码",
        },
      ],
    })


    // 表单值
    const modelRef = reactive<LoginParamsType>({
      account: "",  //13484832233
      password: "",
      merchantId: "",
    });

    // modelRef.password = modelRef.account.slice(5)

    // 表单验证
    const rulesRef = reactive({
      account: [
        {
          required: true,
          message: "请输入账号",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
        },
      ],
    });
    // form
    const formRef = ref<typeof ElForm>();
    // 登录loading
    const submitLoading = ref<boolean>(false);
    // 登录
    const handleSubmit = async () => {
      submitLoading.value = true;
      try {
        const valid: boolean | undefined = await formRef.value?.validate();
        if (valid === true) {
          const res: boolean = await store.dispatch(
            "userlogin/login",
            modelRef
          );
          if (res === true) {
            const resourceList = store.state.userlogin.currentUser.resourceList
            if (resourceList.length === 0) {
              ElMessage.error('该用户无权限登录')
              submitLoading.value = false;
              return
            }
            // ElMessage.success("登录成功");
            const { redirect, ...query } = currentRoute.value.query;
            router.replace({
              path: redirect as string || resourceList[0].children[0].path,
              query: {
                ...query,
              },
            });
            // 更新路由跳转的配置信息
            setTimeout(() => {
              location.reload()
            }, 500)
          }
        }
      } catch (error) {
        ElMessage.warning("请正确填写相关信息");
      }
      submitLoading.value = false;
    };

    // 获取商户列表
    const getMerchantList = async (account?: string): Promise<void> => {
      const { code, data } = await merchantList(account)
      if (+code === 1000) {
        merchanOption.value = data;
        modelRef.merchantId = data[0].merchantId
      }
    }
    // getMerchantList()

    watch(
      () => modelRef.account,
      () => {
        throttle(() => {
          getMerchantList(modelRef.account)
        }, 500);
      }
    );

    // 验证
    function handleSubmitFor() {
      (infoRef.value as any).validate((valid, fields) => {
        if (valid) {
          console.log('验证成功');
          handleResetPassword()
        } else {
          console.log('验证失败');
        }
      })
    }

    // 重置密码接口
    async function handleResetPassword() {
      const reqData = JSON.parse(JSON.stringify(dataObj.value))
      reqData.password = md5(reqData.password)
      const { code } = await resetPassword(reqData)
      if (+code === 1000) {
        ElMessage.success('重置成功')
        dialogVisible.value = false
        dataObj.value = {
          account: '',
          password: '',
          code: ''
        }
      }
    }

    let timer = null as any
    const isSendCode = ref<boolean>(false)
    const timeNum = ref<number>(60)
    // 发送验证码
    function sendCode() {
      if (!dataObj.value.account) {
        ElMessage.error('请输入账号')
        return
      }
      if (isSendCode.value) {
        ElMessage.error('请勿重复发送验证码')
        return
      }
      isSendCode.value = true
      handleSendSmsCode()
      timer = setInterval(() => {
        if (timeNum.value <= 1) {
          initLoading()
          return
        }
        timeNum.value--
      }, 1000)
    }

    // 发送验证码
    async function handleSendSmsCode() {
      const { code } = await sendSmsCode(dataObj.value.account)
      if (+code === 1000) {
        ElMessage.success('发送成功')
      }
    }

    // 初始化发送验证码
    function initLoading() {
      isSendCode.value = false
      timeNum.value = 60
      clearInterval(timer)
    }

    return {
      modelRef,
      rulesRef,
      formRef,
      submitLoading,
      handleSubmit,
      merchanOption,
      dialogVisible,
      dataObj,
      infoRef,
      infoRules,
      handleSubmitFor,
      sendCode,
      timer,
      timeNum,
      isSendCode,
    };
  },
});
</script>
<style lang="scss" scoped>
.main-login {
  flex: none;
  position: fixed;
  right: 290px;

  .login-box {
    width: 360px;
    padding: 40px 50px 57px;
    box-sizing: border-box;
    border-radius: 8px;
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    margin-bottom: 40px;
  }


  .botom-link {
    text-align: center;
    font-size: 14px;
    color: #fff;

    .footer-links {
      margin-bottom: 17px;

      a {
        font-size: 14px;
        margin-right: 40px;
        color: #fff;
        text-decoration: none;

        &:last-child {
          margin-right: 0;
        }

        &:hover {
          color: #fff;
        }
      }
    }

    .botom-text {
      p {
        font-size: 12px;
        margin-bottom: 5px;
      }
    }
  }

  .title {
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 25px;

    // font-size: 28px;
    // margin-top: 0;
    // margin-bottom: 30px;
    // text-align: center;
    // color: #ffffff;
    /* background-image:-webkit-linear-gradient(right,#FFFFFF,#009688, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color:transparent; */
  }

  .submit {
    width: 100%;
    width: 260px;
    height: 40px;
    background: #3C7FFF;
    border: 1px solid rgba(112, 112, 112, 0.2);
    border-radius: 4px;
  }

  .tip-box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }

  .tip {
    font-size: 12px;
    color: #999999;
  }

  .cur {
    color: #3C7FFF;
    cursor: pointer;
  }
}
</style>
