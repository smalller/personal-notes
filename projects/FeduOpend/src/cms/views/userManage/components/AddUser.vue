<template>
  <div class="addUser_warpper">
    <h3>{{ type === 0 ? '新增用户' : '修改用户' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="width: 600px"
    >
      <el-form-item
        label="头像"
        prop="headPortrait"
        :rules="filterRules({ required: true, msg: '请选择头像图片' })"
      >
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleChange"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="picture" :src="picture" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="运营名称"
        prop="username"
        :rules="filterRules({ required: true, msg: '请输入运营名称' })"
      >
        <el-input
          v-model="ruleForm.username"
          autocomplete="off"
          placeholder="请输入用户昵称"
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
        label="再次输入"
        prop="password2"
        :rules="filterRules({ type: 'checkPassword', pass: ruleForm.password })"
      >
        <el-input
          v-model="ruleForm.password2"
          type="password"
          autocomplete="off"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="mobile"
        :rules="
          filterRules({ required: true, msg: '请输入联系电话', type: 'mobile' })
        "
      >
        <el-input
          v-model.number="ruleForm.mobile"
          placeholder="请输入联系电话"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { newAddUser, changeUser } from '@/api/user'
  import VueCookie from 'vue-cookie'
  import { GetFile } from '@/api/common'

  export default {
    data() {
      return {
        ruleForm: {
          username: '',
          headPortrait: '',
          password: '',
          password2: '',
          mobile: '',
        },
        uploadUrl: '',
        headers: {},
        type: 0, //0新增 1修改
        userType: VueCookie.get(`${firmId}_user_type`),
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
        picture: '',
      }
    },
    methods: {
      async getPicture(data, type) {
        if (data) {
          await GetFile(data).then((res) => {
            if (res.code == 0) {
              console.log(res, '图片数据')
              this.ruleForm.headPortrait = data

              this.picture = res.data
            }
          })
        }
      },
      handleChange(file) {
        this.getPicture(file.data)
      },
      async beforeAvatarUpload(file) {
        this.uploadUrl = `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadAndUserType?bizType=article&userType=${this.userType}`
        this.headers = {
          token: this.token,
          userId: this.userId,
        }
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
          return false
        }
        return isJPG
      },
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.type === 0) {
              newAddUser(this.ruleForm).then((res) => {
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
              changeUser(ruleForm).then((res) => {
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
      resetForm() {
        this.$refs.ruleForm.resetFields()
      },
      cancel() {
        this.$emit('cancel')
      },
      async init(row) {
        //父组件调用
        this.type = 1
        this.picture = ''
        if (row.headPortrait) {
          await this.getPicture(row.headPortrait)
        }
        this.ruleForm = row
      },
    },
  }
</script>

<style lang="scss" scoped>
  .addUser_warpper {
    padding: 20px;
    h3 {
      margin-bottom: 20px;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px solid rgb(209, 206, 206);
    border-radius: 20px;
    cursor: pointer;
    width: 80px;
    height: 80px;
    border: 1px solid red;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    padding-top: 30px;
    border: 1px solid rgb(223, 215, 215);
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 50%;
  }
</style>
