<template>
  <div class="login-container">
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          label-position="left"
          @keyup.enter.native="handleLogin"
        >
          <div class="title"><!--hello !--></div>
          <div class="title-tips">
            <!--{{ translateTitle('欢迎来到') }}-->
            {{ titleAgent }}
          </div>
          <el-form-item prop="mobile" style="margin-top: 40px">
            <el-input
              v-model.trim="form.mobile"
              v-focus
              :placeholder="translateTitle('请输入用户名')"
              tabindex="1"
              type="text"
            >
              <vab-remix-icon slot="prefix" icon="user-line"></vab-remix-icon>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :placeholder="translateTitle('请输入密码')"
              :type="passwordType"
              tabindex="2"
              @keyup.enter.native="handleLogin"
            >
              <vab-remix-icon slot="prefix" icon="lock-line"></vab-remix-icon>
              <vab-remix-icon
                v-if="passwordType === 'password'"
                slot="suffix"
                class="show-password"
                icon="eye-off-line"
                @click="handlePassword"
              ></vab-remix-icon>
              <vab-remix-icon
                v-else
                slot="suffix"
                class="show-password"
                icon="eye-line"
                @click="handlePassword"
              ></vab-remix-icon>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input
              v-model="form.captcha"
              type="text"
              placeholder="请输入验证码"
            />
            <img :src="img" alt style="margin-top: 20px" @click="getYzmImg" />
          </el-form-item>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            {{ translateTitle('登录') }}
          </el-button>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { titleAgent } from '@/config/setting.config'
  import router, { asyncRoutes } from '@/router'
  import { translateTitle } from '@/utils/i18n'
  import { isPassword } from '@/utils/validate'
  import { YZMURL } from '@/cms/api/login/login'
  import store from '@/store'
  export default {
    name: 'Login',
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
      const validateCaptcha = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.translateTitle('验证码不能为空')))
        } else {
          callback()
        }
      }
      return {
        nodeEnv: process.env.NODE_ENV,
        titleAgent,
        // title: this.$baseTitle,
        form: {
          mobile: '', //手机号
          password: '', //密码
          captcha: '', //验证码
          loginType: '1', //登录方式
          userType: '300408',
          sysType: '',
          uuid: '',
        },
        img: '', //验证码
        rules: {
          mobile: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
          captcha: [
            {
              required: true,
              trigger: 'blur',
              validator: validateCaptcha,
            },
          ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        uuid: 0,
      }
    },
    computed: {
      ...mapGetters({ title: 'settings/title' }),
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    created() {
      this.getYzmImg()
      if (
        localStorage.getItem('deviceNo') === null ||
        localStorage.getItem('deviceNo') === undefined ||
        localStorage.getItem('deviceNo') === ''
      ) {
        localStorage.setItem('deviceNo', new Date().valueOf())
      }
      document.body.style.overflow = 'hidden'
    },
    beforeDestroy() {
      document.body.style.overflow = 'auto'
    },
    mounted() {},
    methods: {
      ...mapActions({
        login: 'user/login',
        setCode: 'cms_code/setCode',
      }),
      translateTitle,
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      //获取验证码
      getYzmImg() {
        this.uuid = 0
        this.uuid = new Date().getTime()
        this.img = `${process.env.VUE_APP_BASE_API}${YZMURL}?uuid=${this.uuid}`
      },
      handleRoute() {
        return this.redirect === '/404' || this.redirect === '/401'
          ? '/'
          : this.redirect
      },
      handleLogin() {
        sessionStorage.setItem('loginAgent', 'agent')
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.form.uuid = this.uuid
            try {
              this.loading = true
              this.form.sysType = 'cms'
              // this.form.deviceNo = localStorage.getItem('deviceNo')
              await this.login(this.form)
              await this.$router.push(this.handleRoute())
              this.$store.dispatch('code_list/ac_getProvince') //获取中国省
              this.$store.dispatch('code_list/ac_getClassCode') // 获取码值
              this.$store.dispatch('code_list/ac_getTitleCode') // 获取称谓码值码值
              this.$store.dispatch('code_list/ac_getUserCode') // 获取称谓码值码值
            } catch (err) {
              this.loading = false
            } finally {
              await store.dispatch('user/getUserInfo')
              this.loading = false
              this.getYzmImg()
            }
          } else {
            this.loading = false
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background: url('~@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;
  }

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 4.5vh;
    margin: calc((100vh - 475px) / 2) 5vw 5vw;
    overflow: hidden;
    background: url('~@/assets/login_images/login_form.png');
    background-size: 100% 100%;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: $base-color-white;
    }

    .title-tips {
      margin-top: 29px;
      font-size: 26px;
      font-weight: 400;
      color: $base-color-white;
    }

    .login-btn {
      display: inherit;
      width: 220px;
      height: 50px;
      margin-top: 5px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }

      .forget-passwordword {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-password {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
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

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

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

    .show-password {
      position: absolute;
      right: 25px;
      left: -35px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

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
