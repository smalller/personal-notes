<template>
  <div style="padding: 20px">
    <h3>{{ type === 0 ? '新增代理商' : '修改代理商' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      class="agent_ruleForm"
    >
      <el-form-item
        label="机构名称"
        prop="name"
        :rules="filterRules({ required: true, msg: '请输入机构名称' })"
      >
        <el-input
          v-model="ruleForm.name"
          placeholder="请输入机构名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="负责人姓名"
        prop="contactName"
        :rules="filterRules({ required: true, msg: '请输入负责人姓名' })"
      >
        <el-input
          v-model="ruleForm.contactName"
          placeholder="请输入负责人姓名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="contacts"
        :rules="filterRules({ required: true, msg: '请输入联系方式' })"
      >
        <el-input
          v-model="ruleForm.contacts"
          placeholder="请输入联系方式"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="filterRules({ type: 'password' })"
      >
        <el-input
          v-model="ruleForm.password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="重复密码"
        prop="password2"
        :rules="filterRules({ type: 'checkPassword', pass: ruleForm.password })"
      >
        <el-input
          v-model="ruleForm.password2"
          type="password"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="分成比例"
        prop="returnRate"
        :rules="filterRules({ required: true, msg: '请输入分成比例' })"
      >
        <el-input
          v-model="ruleForm.returnRate"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          maxlength="4"
          placeholder="请输入分成比例"
        >
          <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
        </el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="ruleForm.remarks"
          type="textarea"
          placeholder="请输入内容"
          maxlength="50"
          :rows="4"
          resize="none"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          提交
        </el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { newAddAgent, EditAgent } from '@/api/agent'

  const validatorAccountNumber = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('值不能为空'))
    }
    setTimeout(() => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 1) {
          callback(new Error('值必须大于1'))
        } else {
          callback()
        }
      }
    }, 200)
  }

  export default {
    data() {
      return {
        ruleForm: {
          contactName: '',
          name: '',
          contacts: '',
          password: '',
          password2: '',
          returnRate: '',
          remarks: '',
        },
        type: 0,
      }
    },
    methods: {
      //提交表单信息
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.type === 0) {
              newAddAgent(this.ruleForm).then((res) => {
                if (res.code == 0) {
                  this.$emit('success')
                  this.$message({
                    message: '恭喜你，新增成功',
                    type: 'success',
                  })
                }
              })
            } else {
              let ruleForm = { ...this.ruleForm }
              if (ruleForm.password === '000000') {
                delete ruleForm.password
                delete ruleForm.password2
              }
              EditAgent(ruleForm).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success',
                  })
                  this.$emit('success')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      //重置信息
      resetForm() {
        this.$emit('cancel')
        this.$refs.ruleForm.resetFields()
      },
      //初始化
      init(row) {
        let params = { ...row }
        params.password = '000000'
        params.password2 = '000000'
        this.type = 1
        this.ruleForm = params
      },
    },
  }
</script>

<style lang="scss" scoped>
  .agent_ruleForm {
    max-width: 600px;
    padding: 20px;
  }
</style>
