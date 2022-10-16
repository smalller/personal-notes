<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="所属幼儿园" prop="a">
      <el-input
        type="password"
        v-model="ruleForm.a"
        autocomplete="off"
        style="width: 400px"
      ></el-input>
    </el-form-item>
    <el-form-item label="所在位置" prop="location">
      <el-input
        type="password"
        v-model="ruleForm.location"
        style="width: 400px"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input
        type="password"
        v-model="ruleForm.checkPass"
        autocomplete="off"
        style="width: 400px"
      ></el-input>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model.number="ruleForm.age"></el-input>
    </el-form-item>
    <el-form-item>
      <!-- <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {},
    }
  },
}
</script>

<style lang="scss" scoped>
</style>