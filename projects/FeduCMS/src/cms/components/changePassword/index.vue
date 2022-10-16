<template>
  <el-dialog
    ref="editRef"
    title="修改密码"
    :visible.sync="passShow"
    width="25%"
    :show-close="false"
    :close-on-click-modal="false"
    center
  >
    <div>
      <el-form ref="dialogForm" :model="editForm">
        <el-form-item
          prop="mobile"
          :rules="
            filterRules({
              required: true,
              msg: '验证码不可为空',
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
          prop="code"
          :rules="filterRules({ required: true, msg: '验证码不可为空' })"
        >
          <el-input
            v-model="editForm.code"
            placeholder="请输入短信验证码"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click=";(passShow = false), (editForm = { captchaCode: '' })">
        取 消
      </el-button>
      <el-button type="primary" @click="send">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ChangePassWord',
    data() {
      return {
        passShow: false, //修改密码弹框
        editForm: {},
      }
    },
  }
</script>

<style scoped></style>
