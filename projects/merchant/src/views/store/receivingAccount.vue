<template>
  <basic-container>
    <div>
      <div>
        <div class="set-info-box">
          <div class="set-btn">
            <el-button type="primary" @click="settingBankInfo"
              >设置账户</el-button
            >
            <el-button
              v-if="!isReadonly"
              type="success"
              @click="sureSettingBankInfo('accountInfo')"
              >确定</el-button
            >
            <el-button
              v-if="!isReadonly"
              type="danger"
              @click="cancelSettingBankInfo('accountInfo')"
              >取消</el-button
            >
            <el-button type="primary" @click="dialogVisible = true"
              >设置密码</el-button
            >
          </div>

          <el-form
            :model="accountInfo"
            label-width="100px"
            :rules="rules"
            ref="accountInfo"
          >
            <el-form-item label="收款人姓名" prop="accountName">
              <el-input
                :readonly="isReadonly"
                v-model.trim="accountInfo.accountName"
              ></el-input>
            </el-form-item>
            <el-form-item label="开户行" prop="accountBankName">
              <el-input
                :readonly="isReadonly"
                v-model="accountInfo.accountBankName"
              ></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" prop="accountBank">
              <el-input
                :readonly="isReadonly"
                v-model="accountInfo.accountBank"
              ></el-input>
              <!-- :onkeyup="
                (accountInfo.accountBank = accountInfo.accountBank.replace(
                  /^(0+)|[^\d]+/g,
                  ''
                ))
              " -->
            </el-form-item>
            <el-form-item label="支付宝账户" prop="accountAlipay">
              <el-input
                :readonly="isReadonly"
                v-model="accountInfo.accountAlipay"
              ></el-input>
            </el-form-item>
            <el-form-item label="微信账户" prop="accountWechat">
              <el-input
                :readonly="isReadonly"
                v-model="accountInfo.accountWechat"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="收款密码"
              v-if="!isReadonly"
              prop="accountPassword"
            >
              <el-input
                v-model="accountInfo.accountPassword"
                show-password
                placeholder="需验证您的身份，请输入密码"
              ></el-input>
              <!-- :onkeyup="
                (accountInfo.accountPassword = accountInfo.accountPassword.replace(
                  /[^\w]/g,
                  ''
                ))
              " -->
            </el-form-item>
          </el-form>

          <!-- 备用账户 -->
          <div>
            <h4>备用账户</h4>
            <el-form :model="accountInfo" label-width="100px">
              <el-form-item label="收款人姓名">
                <el-input
                  :readonly="isReadonly"
                  v-model.trim="accountInfo.backupAccountName"
                  placeholder="暂无，非必填"
                ></el-input>
              </el-form-item>
              <el-form-item label="开户行">
                <el-input
                  :readonly="isReadonly"
                  v-model="accountInfo.backupAccountBankName"
                  placeholder="暂无，非必填"
                ></el-input>
              </el-form-item>
              <el-form-item label="银行卡号">
                <el-input
                  :readonly="isReadonly"
                  v-model="accountInfo.backupAccountBank"
                  placeholder="暂无，非必填"
                ></el-input>
                <!-- :onkeyup="
                  (accountInfo.backupAccountBank = accountInfo.backupAccountBank.replace(
                    /^(0+)|[^\d]+/g,
                    ''
                  ))
                " -->
              </el-form-item>
              <el-form-item label="支付宝账户">
                <el-input
                  :readonly="isReadonly"
                  v-model="accountInfo.backupAccountAlipay"
                  placeholder="暂无，非必填"
                ></el-input>
              </el-form-item>
              <el-form-item label="微信账户">
                <el-input
                  :readonly="isReadonly"
                  v-model="accountInfo.backupAccountWechat"
                  placeholder="暂无，非必填"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 设置密码对话框 -->
        <el-dialog
          append-to-body="true"
          title="设置收款密码"
          :visible.sync="dialogVisible"
          width="25%"
          @close="handleCloseDialog"
        >
          <div class="input-box">
            <span style="color: #f00">*密码仅限数组或字母</span>
            <el-input
              style="margin-bottom: 10px"
              :onkeyup="
                (form.newPassword = form.newPassword.replace(/[^\w]/g, ''))
              "
              v-model="form.newPassword"
              show-password
              placeholder="请输入密码"
            ></el-input>
            <el-input
              style="margin-bottom: 10px"
              :onkeyup="
                (form.surePassword = form.surePassword.replace(/[^\w]/g, ''))
              "
              v-model="form.surePassword"
              show-password
              placeholder="请确认密码"
            ></el-input>
            <div class="auth-code">
              <el-input
                style="margin-right: 10px"
                v-model="form.smsCode"
                placeholder="验证码"
                :onkeyup="
                  (form.smsCode = form.smsCode.replace(/^(-1+)|[^\d]+/g, ''))
                "
                maxlength="6"
              ></el-input>
              <el-button
                :type="waitTime ? '' : 'primary'"
                @click="sendCode"
                :disabled="waitTime"
                >{{ waitTime ? countDown + "s" : "发送" }}</el-button
              >
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCloseDialog">取消</el-button>
            <el-button type="primary" @click="settingPassword">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </basic-container>
</template>


<script>
import {
  detail,
  update,
  resetPwd,
  getAuthCode,
} from "@/api/store/receivingAccount";

export default {
  data() {
    return {
      isReadonly: true,
      accountInfo: {},
      dialogVisible: false,
      form: {
        newPassword: "",
        surePassword: "",
        smsCode: "",
      },
      waitTime: false,
      countDown: 59,

      rules: {
        accountName: [
          { required: true, message: "请输入收款人姓名", trigger: "change" },
        ],
        accountBankName: [
          { required: true, message: "请输入银行卡开户行", trigger: "change" },
        ],
        accountBank: [
          {
            required: true,
            message: "请输入银行卡号",
            trigger: "change",
          },
          {
            min: 15,
            max: 18,
            message: "长度在 15 到 18 个数字",
            trigger: "change",
          },
        ],
        accountAlipay: [
          {
            required: true,
            message: "请输入支付宝账户",
            trigger: "change",
          },
        ],
        accountWechat: [
          {
            required: true,
            message: "请输入微信账户",
            trigger: "change",
          },
        ],
        accountPassword: [
          {
            required: true,
            message: "请输入收款密码，以验证您的身份",
            trigger: "change",
          },
        ],
      },
    };
  },

  created() {
    this.getCountInfo();
  },

  methods: {
    //设置账户按钮
    settingBankInfo() {
      if (this.accountInfo.pwdStatus === 1) {
        this.isReadonly = false;
      } else if (this.accountInfo.pwdStatus === 0) {
        this.$confirm("未设置收款密码，请先设置收款密码", "提示", {
          confirmButtonText: "设置",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.dialogVisible = true;
          })
          .catch(() => {});
      }
    },

    //确定设置
    handleConfrim() {
      if (this.form.bankName === "") {
        this.$message.error("请输入收款人姓名");
        return;
      } else if (!this.$regular.bankAcountNum(this.form.bankAccount)) {
        this.$message.error("银行卡卡号格式不对，请重新输入");
        return;
      } else {
        let data = {
          bankName: this.form.bankName,
          bankAccount: this.form.bankAccount,
        };
        this.$post("/merchant/store/settled/updatePayAccount", data).then(
          (res) => {
            if (res.code === 0) {
              this.$message.success("设置成功");
              this.handleCloseDialog();
              this.getCountInfo();
            }
          }
        );
      }
    },

    //确定设置账户信息
    sureSettingBankInfo(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await update(this.accountInfo);
          if (res.code === 200) {
            this.getCountInfo();
            this.isReadonly = true;
            this.$message.success("修改成功");
          }
        } else {
          return false;
        }
      });
    },

    //取消设置账户信息
    cancelSettingBankInfo(formName) {
      this.$refs[formName].resetFields();
      this.isReadonly = true;
      this.getCountInfo();
    },

    //回显账户信息
    async getCountInfo() {
      const { data: res } = await detail();
      if (res.code === 200) {
        this.accountInfo = res.data;
      }
    },

    //关闭弹窗操作
    handleCloseDialog() {
      this.dialogVisible = false;
      this.form = {
        newPassword: "",
        surePassword: "",
        smsCode: "",
      };
    },

    //发送验证码操作
    sendCode() {
      this.waitTime = true;
      let timer = setInterval(() => {
        this.countDown--;
        if (this.countDown === 0) {
          this.countDown = 59;
          this.waitTime = false;
          clearInterval(timer);
        }
      }, 1000);
      this.getAuthCode();
    },

    //获取验证码操作
    async getAuthCode() {
      const { data: res } = await getAuthCode();
      if (res.code === 200) {
        this.$message.success("发送成功");
      }
    },

    //确认设置密码
    settingPassword() {
      if (this.form.newPassword !== this.form.surePassword) {
        this.$message.error("两次密码不一致，请重新输入");
        return;
      } else if (this.form.smsCode === "") {
        this.$message.error("请输入验证码");
        return;
      } else {
        this.requestSubmit();
      }
    },

    //设置密码请求
    async requestSubmit() {
      let data = {
        smsCode: this.form.smsCode,
        newPassword: this.form.newPassword,
      };

      const { data: res } = await resetPwd(data);
      if (res.code === 200) {
        this.getCountInfo();
        this.$message.success("设置成功");
        this.dialogVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.set-info-box {
  /deep/ .el-form-item__content {
    width: 40%;
  }
}

.set-btn {
  margin-bottom: 30px;
}

h4 {
  margin: 50px 0 20px 0;
}

.password-box {
  width: 70%;
  margin: 0 auto;

  .auth-code {
    display: flex;
  }
}

.input-box {
  width: 60%;
  margin: 0 auto;

  .auth-code {
    display: flex;
  }
}
</style>