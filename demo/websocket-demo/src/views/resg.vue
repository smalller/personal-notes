<template>
  <div>
    <mt-field label="用户名" placeholder="请输入用户名" v-model="username" @keydown.native.13="resg"></mt-field>
    <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password" @keydown.native.13="resg"></mt-field>
    <mt-field label="确认密码" placeholder="请再次输入密码" type="password" v-model="surePass" @keydown.native.13="resg"></mt-field>
    <mt-button type="primary" class="login" @click="resg">注 册</mt-button>
    <div class="bottom-text">
      <span @click="changeLogin" class="btn">用户登录</span>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      username: "",
      password: "",
      surePass: "",
    };
  },

  methods: {
    //路由跳转
    changeLogin() {
      this.$router.push("/login");
    },

    resg() {
      if (this.password == this.surePass) {
        //开启加载图标
        Indicator.open();
        this.axios({
          methods: "post",
          url: "http://api_dev.wanxikeji.cn/api/register",
          params: {
            name: this.username,
            pw: this.password,
          },
        })
          .then((result) => {
            //开启加载图标
            Indicator.open();

            if (result.data.code == "2000") {
              //弹出相关成功消息
              this.$notify({
                dangerouslyUseHTMLString: true,
                showClose: false,
                duration: 2000,
                message: `<i class="el-icon-circle-check" style="color:green;font-weight: bolder;"></i> 注册成功！2秒后自动跳转到登录页面`,
              });

              setTimeout(() => {
                //跳转到登录页面
                this.$router.push("/login");
              }, 2000);
            } else {
              //弹出相关错误
              this.$notify({
                dangerouslyUseHTMLString: true,
                showClose: false,
                duration: 2000,
                message: `<i class="el-icon-circle-close" style="color:red;font-weight: bolder;"></i> ${result.data.msg}`,
              });
            }

            //关闭加载图标
            Indicator.close();
          })
          .catch((result) => {
            console.log("返回失败");
            //关闭加载图标
            Indicator.close();
          });
      } else {
        this.$notify({
          dangerouslyUseHTMLString: true,
          showClose: false,
          duration: 2000,
          message: `<i class="el-icon-circle-close" style="color:red;font-weight: bolder;"></i> 两次密码不相同，请重新传入`,
        });
      }
    },
  },
};
</script>