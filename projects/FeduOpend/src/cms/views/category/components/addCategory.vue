<template>
  <div class="addUser_warpper">
    <h3>{{ type === 0 ? '新增栏目' : '修改栏目' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="width: 600px"
    >
      <el-form-item
        label="封面"
        prop="logo"
        :rules="filterRules({ required: true, msg: '请选择封面图片' })"
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
        label="栏目名称"
        prop="name"
        :rules="filterRules({ required: true, msg: '请输入栏目名称' })"
      >
        <el-input
          v-model="ruleForm.name"
          maxlength="40"
          show-word-limit
          autocomplete="off"
          placeholder="请输入栏目名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="栏目排序"
        prop="sequence"
        :rules="
          filterRules({
            required: true,
            msg: '请输入栏目排序',
            type: 'sequence',
          })
        "
      >
        <el-input
          v-model.number="ruleForm.sequence"
          placeholder="请输入栏目排序"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { AddCategory, EditCategory } from '@/api/category'
  import VueCookie from 'vue-cookie'

  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          sequence: '',
          status: 1,
          logo: '',
        },
        type: 0, //0新增 1修改
        uploadUrl: '',
        headers: {},
        picture: '',
        userType: VueCookie.get(`${firmId}_user_type`),
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
      }
    },
    methods: {
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.type === 0) {
              AddCategory(this.ruleForm).then((res) => {
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
              EditCategory(ruleForm).then((res) => {
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
      handleChange(file) {
        this.picture = file.attach
        this.ruleForm.logo = file.data
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
      cancel() {
        this.$emit('cancel')
      },
      init(row) {
        this.type = 1
        this.ruleForm = row
        this.picture = row.logoUrl
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
    width: 150px;
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
    width: 150px;
    height: 80px;
    padding-top: 30px;
    border: 1px solid rgb(223, 215, 215);
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 80px;
    display: block;
    // border-radius: 50%;
  }
</style>
