<template>
  <div id="login-wrap">
    <div class="input-box">
      <div class="logo">
        <img src="img/logo.png" alt />
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style>
.el-notification.right {
  width: 336px;
  top: 24px;
  right: 20px;
  padding: 10px 0px 10px 10px;
}

.el-notification__content {
  margin: 0;
}

#login-wrap {
  height: 100vh;
  padding: 0 20px;
}

#login-wrap::before {
  display: table;
  content: "";
}

.input-box {
  position: relative;
  top: 21%;
  margin-top: -50px;
}

.input-box .logo {
  text-align: center;
}

.logo img {
  height: 80px;
  width: 80px;
  border-radius: 6px;
  margin-bottom: 50px;
}

.mint-cell.mint-field {
  border: 1px solid #ececec;
  border-right: none;
  border-left: none;
  border-top: none;
}

.login {
  margin-top: 30px;
  width: 100%;
  cursor: pointer;
}

.bottom-text {
  position: fixed;
  bottom: 0;
  left: 50%;
  margin-left: -32px;
  margin-bottom: 50px;
  color: #26a2ff;
}

.bottom-text .btn {
  cursor: pointer;
}
</style>