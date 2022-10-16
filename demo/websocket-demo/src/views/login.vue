<template>
  <div>
    <mt-field label="用户名" placeholder="请输入用户名" v-model="username" @keydown.native.13="login"></mt-field>
    <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password" @keydown.native.13="login"></mt-field>
    <mt-button type="primary" class="login" @click="login">登 录</mt-button>
    <div class="bottom-text">
      <span @click="changeResg" class="btn">用户注册</span>
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
      timer:undefined
    };
  },

  methods: {
    //路由跳转
    changeResg() {
      this.$router.push("/resg");
    },

    login() {
      //开启加载图标
      Indicator.open();
      this.axios({
        methods: "post",
        url: "http://api_dev.wanxikeji.cn/api/login",
        params: {
          name: this.username,
          pw: this.password,
        },
      })
        .then((result) => {
          if (result.data.code == "2000") {
            //定义一个对象
            let jsonStr = {
              userName: result.data.data.user_account,
            };
            //将这个对象转为JSON字符串
            let sessionStr = JSON.stringify(jsonStr);
            //将这个JSON字符串存入缓存
            sessionStorage.setItem("sessionJson", sessionStr);
            //跳转到首页
            this.$router.push("/index");
          } else {
            //弹出相关错误
            this.$notify({
              dangerouslyUseHTMLString: true,
              showClose: false,
              duration: 3000,
              message: `<i class="el-icon-circle-close" style="color:red;font-weight: bolder;"></i> ${result.data.msg}`,
            });
          }

          //关闭加载图标
          Indicator.close();
        })
        .catch((result) => {
          console.log("返回失败");
          Indicator.close();
        });
    },
  },
};
</script>