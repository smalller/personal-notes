<template>
  <el-dialog
    ref="editRef"
    title="修改密码"
    :visible.sync="passShow"
    width="25%"
    :show-close="false"
    :close-on-click-modal="false"
    center
    @close="closeDig"
  >
    <div>
      <el-form ref="dialogForm" :model="editForm">
        <el-form-item
          prop="mobile"
          :rules="
            filterRules({
              required: true,
              msg: '手机号不可为空',
              type: 'mobile',
            })
          "
        >
          <el-input
            v-model="editForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="smscode"
          :rules="filterRules({ required: true, msg: '验证码不可为空' })"
        >
          <el-col :span="12">
            <el-input
              v-model="editForm.smscode"
              placeholder="请输入短信验证码"
            ></el-input>
          </el-col>
          <el-col :span="6" style="margin-left: 20px">
            <el-button @click="getPhone">{{ chargeText }}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item
          prop="pwd"
          label="新密码"
          :rules="
            filterRules({
              required: true,
              msg: '密码不可为空',
            })
          "
        >
          <el-input v-model="editForm.pwd" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item
          prop="pwdAgain"
          label="请确认新密码"
          :rules="
            filterRules({
              required: true,
              msg: '密码不可为空',
            })
          "
        >
          <el-input
            v-model="editForm.pwdAgain"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="passShow = false">取 消</el-button>
      <el-button type="primary" @click="send">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getPhoneMsg, changePassWord } from '@/cms/api/login/login'
  export default {
    name: 'ChangePassWord',
    data() {
      return {
        passShow: false, //修改密码弹框
        editForm: { mobile: '', smscode: '', pwd: '', pwdAgain: '' },
        second: 120, //短信验证时间
        isSend: false,
        msgInterval: null, // 短信验证码获取定时器
      }
    },
    computed: {
      chargeText() {
        if (this.msgInterval) {
          return this.second + '(倒计时)'
        } else {
          if (this.isSend) {
            return '短信获取中'
          } else {
            return '点击获取验证码'
          }
        }
      },
    },
    methods: {
      //关闭弹框
      closeDig() {
        console.log('进来')
        if (this.isSend) {
          this.isSend = false
        }
        if (this.msgInterval) {
          clearInterval(this.msgInterval)
          this.msgInterval = null
        }
        this.second = 120
        this.editForm = { mobile: '', smscode: '', pwd: '', pwdAgain: '' }
      },

      //确定按钮
      send() {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            let obj = this.editForm
            changePassWord(obj).then((res) => {
              //清理定时器
              this.$message.success(res.msg)
              if (+res.code === 0) {
                this.passShow = false
              }
            })
          }
        })
      },
      //获取验证码
      getPhone() {
        if (this.msgInterval) return
        if (this.isSend) return this.$message.warning('请勿重复获取')
        this.isSend = true
        getPhoneMsg(this.editForm.mobile).then((res) => {
          this.isSend = false
          console.log('验证码', res)
          if (+res.code === 0) {
            this.msgInterval = setInterval(() => {
              if (+this.second > 0) {
                this.second--
              } else {
                clearInterval(this.msgInterval)
                this.msgInterval = null
              }
            }, 1000)
          }
        })
      },
    },
  }
</script>

<style scoped></style>
