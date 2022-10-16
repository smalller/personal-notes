<template>
  <div id="wrap" ref="wrap">
    <div class="top-container">
      <i class="el-icon-arrow-left" @click="exitInfo" style="cursor: pointer;"></i>
      <span>相亲相爱一家人</span>
      <i class="el-icon-s-custom" @click="drawerEvent" style="cursor: pointer;"></i>
    </div>
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="40%">
      <span class="userList">
        在线用户
        <span class="userLength">{{userLength}}</span>
        人
      </span>
      <div class="listBox"></div>
    </el-drawer>

    <div ref="msg" class="msg-box"></div>

    <footer>
      <el-input
        placeholder="请输入内容"
        ref="input"
        v-model="input"
        clearable
        @keydown.native.13="sendInfo"
      ></el-input>
      <el-button type="primary" size="medium" @click="sendInfo">发送</el-button>
    </footer>
  </div>
</template>


<script>
import { MessageBox } from "mint-ui";

export default {
  data() {
    return {
      input: "",
      clientSocket: "",
      userName: "",
      drawer: false,
      userLength: 0,
      status: true,
    };
  },

  methods: {
    //发送消息
    sendInfo() {
      //输入框不能为空
      if (this.input !== "") {
        //发送当前输入的内容给服务端
        this.clientSocket.emit("message", this.userName + "说：" + this.input);
        this.input = "";
      }
    },

    //退出按钮
    exitInfo() {
      MessageBox.confirm("确定要退出聊天室吗?")
        .then((action) => {
          //发送当前是谁点的退出群聊
          this.clientSocket.emit("exitName", this.userName);

          //清理缓存
          sessionStorage.clear();

          //开关变量，有用户退出就赋为false
          this.status = false;

          //跳转到登录页
          this.$router.push("/login");
        })
        .catch((action) => {});
    },

    //在线用户列表展示
    drawerEvent() {
      //展开隐藏栏
      this.drawer = true;

      //发送一次用户名，这样后台才能重新反馈一次当前在线的用户
      this.clientSocket.emit("username", this.userName);

      //当前在线的用户列表
      this.clientSocket.on("userArr", (data) => {
        if (this.status == true) {
          let listBox = document.querySelector(".listBox");

          this.userLength = data.length;

          //渲染到页面上
          let frag = "";
          for (let key of data) {
            frag += `
            <div class="userListBox">
              <img src="img/user3.png" class="userListPhoto">
              <span class="userListName">${key}</span>
            </div>
          `;
          }
          listBox.innerHTML = frag;
        }
      });
    },
  },

  destroyed() {
    this.status = false;
    // console.log(this.status);
  },

  mounted() {
    //创建socket对象并且连接服务器
    let clientSocket = io("ws://192.168.1.168s:4000");

    //赋给一个变量，方便其他地方调用
    this.clientSocket = clientSocket;
    if (sessionStorage.getItem("sessionJson")) {
      //获取缓存中的登录用户信息并转为引用类型
      let jsonArr = JSON.parse(sessionStorage.getItem("sessionJson"));

      //让当前登录的用户名全局引用
      this.userName = jsonArr.userName;

      //把当前登录的用户发给后台
      clientSocket.emit("username", this.userName);
    } else {
      this.$router.push("/login");
    }

    //每次进入一个用户
    clientSocket.on("enter", (data) => {
      if (this.status == true) {
        let enter = document.createElement("div");
        enter.classList.add("systemInfo");
        enter.innerHTML = data;

        this.$refs.msg.appendChild(enter);
        //自动定位到页面最底部
        this.$refs.wrap.scrollTo(0, this.$refs.msg.offsetHeight);
      }
    });

    //每次退出一个用户
    clientSocket.on("leave", (data) => {
      if (this.status == true) {
        let leave = document.createElement("div");
        leave.classList.add("systemInfo");
        leave.innerHTML = data;

        this.$refs.msg.appendChild(leave);

        //自动定位到页面最底部
        this.$refs.wrap.scrollTo(0, this.$refs.msg.offsetHeight);
      }
    });

    //用户每发一条消息
    clientSocket.on("list", (data) => {
      if (this.status == true) {
        let userName = data.slice(0, data.indexOf("：") - 1); //获取用户名
        let userInfo = data.slice(data.indexOf("：") + 1); //获取用户发送的消息

        let info = document.createElement("div");

        //判断发消息的用户是否是自己（别人发的消息样式和自己发的消息样式是不相同的）
        if (this.userName == userName) {
          info.classList.add("selfSendInfo"); //添加样式名
          //添加相关内容
          info.innerHTML += `     
            <div>
                <div class="selfUserName">${userName}</div>
                <div class="selfUserInfo">${userInfo}</div>
            </div>
            <img src="img/user2.png" class="selfUserPhoto">
        `;
        } else {
          info.classList.add("sendInfo"); //添加样式名
          //添加相关内容
          info.innerHTML += `
            <img src="img/user.png" class="userPhoto">
            <div>
                <div class="userName">${userName}</div>
                <div class="userInfo">${userInfo}</div>
            </div>
        `;
        }

        //追加到msg中去
        this.$refs.msg.appendChild(info);

        //自动定位到页面最底部
        this.$refs.wrap.scrollTo(0, this.$refs.msg.offsetHeight);
      }
    });
  },
};
</script>

<style>
#wrap {
  height: 100vh;
  padding: 60px 10px;
  box-sizing: border-box;
  overflow: auto;
  background-color: #ececec;
}

.top-container {
  background-color: #ececec;
  padding: 0 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  border-bottom: 1px solid #ddd;
}

.top-container i {
  font-size: 18px;
}

.listBox {
  overflow: auto;
}

footer {
  padding: 0 10px;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 56px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f2f1;
  border-top: 1px solid #ddd;
}

.el-drawer {
  overflow: auto;
}

html,
body {
  height: 100%;
}

.el-input {
  margin-right: 10px;
}

.sendInfo {
  margin-bottom: 18px;
  display: flex;
}

.userPhoto {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-right: 10px;
}

.userName {
  font-size: 12px;
  margin-bottom: 4px;
  color: #666;
}

.userInfo {
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
}

.selfSendInfo {
  margin-bottom: 18px;
  display: flex;
  justify-content: flex-end;
}

.selfUserPhoto {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  margin-left: 10px;
}

.selfUserName {
  font-size: 12px;
  margin-bottom: 4px;
  color: #666;
  text-align: right;
}

.selfUserInfo {
  background-color: #66b1ff;
  color: #fff;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
}

.systemInfo {
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #666;
  font-size: 14px;
  overflow: hidden;
}

.userList {
  text-align: center;
  padding: 14px 0;
  display: block;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

.userLength {
  overflow: hidden;
  color: #ff6700;
}

.userListPhoto {
  width: 42px;
  height: 42px;
  margin: 0 10px;
  border-radius: 50%;
}

.userListBox {
  margin-top: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

span {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}

img {
  cursor: pointer;
}
</style>