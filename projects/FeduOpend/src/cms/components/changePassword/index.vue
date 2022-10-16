<template>
  <el-dialog
    ref="editRef"
    title="修改信息"
    :visible.sync="passShow"
    width="25%"
    :show-close="false"
    :close-on-click-modal="false"
    center
  >
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
