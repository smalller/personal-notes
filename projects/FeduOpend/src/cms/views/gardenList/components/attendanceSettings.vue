<template>
  <el-dialog
    custom-class="attendanceSettings"
    :visible="visible"
    title="园所考勤类型设置"
    width="400px"
  >
    <el-form :model="formData">
      <el-form-item label="IC卡考勤">
        <el-radio-group v-model="formData.IC">
          <el-radio label="1">开启</el-radio>
          <el-radio label="">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="人脸考勤">
        <el-radio-group v-model="formData.face">
          <el-radio label="2">开启</el-radio>
          <el-radio label="">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" @click="submitForm">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { schoolSetAtt } from '@/cms/api/school'

  export default {
    name: 'AttendanceSettings',
    data() {
      return {
        visible: false,
        formData: {
          IC: '1',
          face: '2',
        },
        schoolId: '',
      }
    },
    methods: {
      open(schoolInfo) {
        if (schoolInfo.attType) {
          const typeArr = JSON.parse(schoolInfo.attType)
          if (typeArr.length > 0) {
            typeArr.forEach((item) => {
              if (+item === 1) {
                this.formData.IC = '1'
              }
              if (+item === 2) {
                this.formData.face = '2'
              }
            })
          }
        }
        this.schoolId = schoolInfo.id
        this.visible = true
      },
      close() {
        this.visible = false
        this.reset()
      },
      reset() {},
      submitForm() {
        const attType = [this.formData.IC, this.formData.face]
        const params = {
          schoolId: this.schoolId,
          attType: attType.filter((item) => !!item),
        }

        schoolSetAtt(params).then((res) => {
          if (+res.code === 0) {
            this.close()
            this.$emit('success')
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  .attendanceSettings {
  }
</style>
