<template>
  <div class="register-container">
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="registerForm"
          :model="form"
          :rules="registerRules"
          class="register-form"
          size="mini"
        >
          <div class="title-tips">{{ translateTitle('注册') }}</div>
          <el-form-item prop="username">
            <el-input
              v-model.trim="form.username"
              v-focus
              :placeholder="translateTitle('请输入用户名')"
              auto-complete="off"
              type="text"
            >
              <vab-remix-icon slot="prefix" icon="user-line" />
            </el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              v-model.trim="form.phone"
              :placeholder="translateTitle('请输入手机号')"
              maxlength="11"
              show-word-limit
              type="text"
            >
              <vab-remix-icon slot="prefix" icon="smartphone-line" />
            </el-input>
          </el-form-item>
          <el-form-item prop="phoneCode" style="position: relative">
            <el-input
              v-model.trim="form.phoneCode"
              :placeholder="translateTitle('请输入手机验证码')"
              type="text"
            >
              <vab-remix-icon slot="prefix" icon="barcode-box-line" />
            </el-input>
            <el-button
              :disabled="isGetPhone"
              class="phone-code"
              type="primary"
              @click="getPhoneCode"
            >
              {{ phoneCode }}
            </el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="form.password"
              :placeholder="translateTitle('请输入密码')"
              autocomplete="new-password"
              type="password"
            >
              <vab-remix-icon slot="prefix" icon="lock-line" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="register-btn"
              type="primary"
              @click.native.prevent="handleRegister"
            >
              {{ translateTitle('注册') }}
            </el-button>
            <router-link to="/login">
              <div style="margin-top: 20px">
                {{ translateTitle('登录') }}
              </div>
            </router-link>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { translateTitle } from '@/utils/i18n'
  import { isPassword, isPhone } from '@/utils/validate'
  import { register } from '@/api/user'

  export default {
    name: 'Register',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if ('' === value) {
          callback(new Error(this.translateTitle('用户名不能为空')))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value)) {
          callback(new Error(this.translateTitle('密码不能少于6位')))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error(this.translateTitle('请输入正确的手机号')))
        } else {
          callback()
        }
      }
      return {
        isGetPhone: false,
        getPhoneInterval: null,
        phoneCode: this.translateTitle('获取验证码'),
        showRegister: false,
        nodeEnv: process.env.NODE_ENV,
        form: {},
        registerRules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              message: this.translateTitle('请输入用户名'),
            },
            { validator: validateUsername, trigger: 'blur' },
          ],
          phone: [
            {
              required: true,
              trigger: 'blur',
              message: this.translateTitle('请输入手机号'),
            },
            { validator: validatePhone, trigger: 'blur' },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              message: this.translateTitle('请输入密码'),
            },
            { validator: validatePassword, trigger: 'blur' },
          ],
          phoneCode: [
            {
              required: true,
              trigger: 'blur',
              message: this.translateTitle('请输入手机验证码'),
            },
          ],
        },
        loading: false,
        passwordType: 'password',
      }
    },
    created() {
      document.body.style.overflow = 'hidden'
    },
    beforeDestroy() {
      document.body.style.overflow = 'auto'
      this.getPhoneInterval = null
      clearInterval(this.getPhoneInterval)
    },
    methods: {
      translateTitle,
      getPhoneCode() {
        if (!isPhone(this.form.phone)) {
          //this.$baseMessage('请输入手机号', 'error')
          this.$refs['registerForm'].validateField('phone')
          return
        }
        this.isGetPhone = true
        let n = 60
        this.getPhoneInterval = setInterval(() => {
          if (n > 0) {
            n--
            this.phoneCode = this.translateTitle('获取验证码 ') + n + 's'
          } else {
            this.getPhoneInterval = null
            clearInterval(this.getPhoneInterval)
            this.phoneCode = this.translateTitle('获取验证码')
            this.isGetPhone = false
          }
        }, 1000)
      },
      handleRegister() {
        this.$refs['registerForm'].validate(async (valid) => {
          if (valid) {
            const param = {
              username: this.form.username,
              phone: this.form.phone,
              password: this.form.password,
              phoneCode: this.form.phoneCode,
            }
            const { msg } = await register(param)
            this.$baseMessage(msg, 'success')
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .register-container {
    height: 100vh;
    min-height: 700px;
    background: url('~@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;

    .register-form {
      position: relative;
      max-width: 100%;
      padding: 4.5vh;
      margin: calc((100vh - 590px) / 2) 5vw 5vw;
      overflow: hidden;
      background: url('~@/assets/login_images/login_form.png');
      background-size: 100% 100%;

      .title-tips {
        margin-top: 29px;
        font-size: 26px;
        font-weight: 400;
        color: $base-color-white;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .register-btn {
        display: inherit;
        width: 220px;
        height: 50px;
        margin-top: 5px;
        border: 0;

        &:hover {
          opacity: 0.9;
        }
      }

      .phone-code {
        position: absolute;
        top: 8px;
        right: 10px;
        width: 120px;
        height: 32px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        user-select: none;
        border-radius: 3px;
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        i {
          position: absolute;
          top: 8px;
          left: 5px;
          z-index: $base-z-index;
          font-size: 16px;
          color: #d7dee3;
          cursor: pointer;
          user-select: none;
        }

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 48px;
          padding-left: 35px;
          font-size: $base-font-size-default;
          line-height: 58px;
          color: $base-font-color;
          background: #f6f4fc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
  }
</style>
