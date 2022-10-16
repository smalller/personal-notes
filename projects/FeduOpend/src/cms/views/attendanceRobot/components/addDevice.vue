<template>
  <el-dialog
    :visible="visible"
    :title="isEdit ? '修改' : '添加'"
    width="500px"
    @close="close"
  >
    <el-form :model="formData">
      <el-form-item label="设备编号">
        <el-input style="width: 200px" />
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select>
          <el-option value="1" label="考勤机" />
          <el-option value="2" label="晨检机器人" />
          <el-option value="3" label="手口检测" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input style="width: 200px" />
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input style="width: 200px" />
      </el-form-item>
    </el-form>
    <el-row justify="center">
      <el-button type="primary">确定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    name: 'AddDevice',
    data() {
      return {
        visible: false,
        isEdit: false,
        formData: {},
      }
    },
    methods: {
      open() {
        this.visible = true
      },
      close() {
        this.visible = false
        this.reset()
      },
      reset() {
        this.formData = {}
      },
    },
  }
</script>

<style scoped></style>
