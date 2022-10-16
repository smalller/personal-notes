<template>
  <div class="addUser_warpper">
    <h3>{{ type === 0 ? '新增版本' : '修改版本' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="width: 600px"
    >
      <!-- :rules="filterRules({ required: true, msg: '请输入昵称' })" -->

      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col>
          <el-form-item
            label="系统"
            prop="appType"
            :rules="filterRules({ required: true, msg: '请选择系统类型' })"
          >
            <el-select
              v-model="ruleForm.appType"
              placeholder="请选择系统类型"
              @change="systemChange"
            >
              <el-option
                v-for="(item, index) in SYSTEM_TYPE"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowVisionPage && showType"
            label="APP类型"
            prop="appSide"
            :rules="filterRules({ required: true, msg: '请选择APP类型' })"
          >
            <el-select v-model="ruleForm.appSide" placeholder="请选择APP类型">
              <el-option
                v-for="(item, index) in APP_TYPE"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        v-if="isShowVisionPage"
        label="文件上传"
        prop="apkPath"
        :rules="filterRules({ required: true, msg: '请上传安装文件' })"
      >
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :headers="headers"
          :on-change="handleChange"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList || []"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="版本号"
        prop="versionNumber"
        :rules="filterRules({ required: true, msg: '请输入版本号' })"
      >
        <el-input
          v-model="ruleForm.versionNumber"
          autocomplete="off"
          placeholder="请输入版本号"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          maxlength="6"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="升级内容"
        prop="content"
        :rules="filterRules({ required: true, msg: '请输入内容' })"
      >
        <el-input
          v-model="ruleForm.content"
          type="textarea"
          placeholder="请输入内容"
          maxlength="50"
          :rows="5"
          show-word-limit
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio
            v-for="item in VISION_STATUS"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item
        label="强制更新"
        prop="isUpdate"
        :rules="filterRules({ required: true, msg: '请选择是否强制更新' })"
      >
        <el-radio-group v-model="ruleForm.isUpdate">
          <el-radio
            v-for="(item, index) in UPDATA_STATUS"
            :key="index"
            :label="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="!ruleForm.apkPath"
          @click="submitForm"
        >
          提交
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { AddVersion, EditVersion } from '@/api/version'
  import VueCookie from 'vue-cookie'
  import {
    SYSTEM_TYPE,
    VISION_STATUS,
    UPDATA_STATUS,
    APP_TYPE,
  } from '@/cms/constants'
  export default {
    data() {
      return {
        ruleForm: {
          appType: '',
          versionNumber: '',
          content: '',
          status: '1',
          isUpdate: '',
          apkPath: '',
          appSide: '',
        },
        fileList: [],
        type: 0, //0新增 1修改
        SYSTEM_TYPE: SYSTEM_TYPE,
        VISION_STATUS: VISION_STATUS,
        UPDATA_STATUS: UPDATA_STATUS,
        APP_TYPE: APP_TYPE,
        isShowVisionPage: true, //是否需要安装包
        showType: false, //
        userType: VueCookie.get(`${firmId}_user_type`),
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
        uploadUrl: '',
        headers: {},
      }
    },
    watch: {
      'ruleForm.visionPage': {
        handler(val) {},
        deep: true,
      },
    },
    methods: {
      submitForm() {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            console.log(this.ruleForm, '000000000000')
            if (this.type === 0) {
              let ruleData = { ...this.ruleForm }
              AddVersion(ruleData).then((res) => {
                if (+res.code === 0) {
                  this.$emit('success')
                  this.$message({
                    message: '恭喜你，新增成功',
                    type: 'success',
                  })
                }
              })
            } else {
              let ruleForm = { ...this.ruleForm }
              if (!!ruleForm.appSide.describe) {
                ruleForm.appSide = ruleForm.appSide.name
              }
              EditVersion(ruleForm).then((res) => {
                if (+res.code === 0) {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success',
                  })
                  this.$emit('success')
                }
              })
            }
          }
        })
      },
      resetForm() {
        this.$refs.ruleForm.resetFields()
      },
      cancel() {
        this.$emit('cancel')
      },
      init(row) {
        //父组件调用
        this.type = 1
        this.ruleForm = row
        this.showType = false
        if (row.appType == 'Android' || row.appType == 'AttMachine') {
          if (row.appType == 'Android') {
            this.showType = true
          }
          this.isShowVisionPage = true
        } else {
          this.isShowVisionPage = false
        }
      },
      async beforeAvatarUpload(file) {
        this.uploadUrl = `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadAndUserType?bizType=AndroidApk&userType=${this.userType}`
        this.headers = {
          token: this.token,
          userId: this.userId,
          sysType: 'cms',
        }
        let isFile = file.type === 'application/vnd.android.package-archive'
        if (!isFile) {
          this.$message.error('上传文件格式错误!')
          return false
        }
        return isFile
      },
      async handleChange(file) {
        if (!this.beforeAvatarUpload) {
          this.$set(this.ruleForm, 'apkPath', '')
          return
        }
        if (file.response) {
          this.$set(this.ruleForm, 'apkPath', file.response.data)
        }
      },
      systemChange(val) {
        this.showType = false
        if (val == 'Android' || val == 'AttMachine') {
          if (val == 'Android') {
            this.showType = true
          }
          this.isShowVisionPage = true
        } else {
          this.isShowVisionPage = false
        }
      },
    },
  }
</script>

<style lang="scss">
  .addUser_warpper {
    .el-list-enter-active,
    .el-list-leave-active {
      transition: none;
    }

    .el-list-enter,
    .el-list-leave-active {
      opacity: 0;
    }
    .el-upload-list {
      position: absolute;
      top: -5px;
      left: 80px;
      height: 40px;
    }
  }
</style>

<style lang="scss" scoped>
  .addUser_warpper {
    padding: 20px;
    h3 {
      margin-bottom: 20px;
    }
    .upload-demo {
      position: relative;
      display: flex;
    }
  }
</style>
