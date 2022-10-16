<template>
  <el-dialog :visible="visible" width="500px" @close="close">
    <el-form :model="formData" label-position="left">
      <el-form-item label="广告名称">
        <el-input v-model="formData.name" style="width: 200px" />
      </el-form-item>
      <!--      <el-form-item label="链接地址">-->
      <!--        <el-input style="width: 200px" />-->
      <!--      </el-form-item>-->
      <el-form-item label="显示终端">
        <el-checkbox-group v-model="formData.appType">
          <el-checkbox label="1">家长端</el-checkbox>
          <el-checkbox label="2">老师端</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="广告图片">
        <div
          class="imgBox"
          style="width: 200px; min-height: 50px"
          :style="{ pointerEvents: isEdit ? 'none' : 'auto' }"
          @click="uploadFile"
        >
          <i v-if="!imgUrl" class="el-icon-plus" />
          <img v-else alt="" style="width: 100%; height: 100%" :src="imgUrl" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
    <cms-upload ref="cmsUpload" />
  </el-dialog>
</template>

<script>
  import CmsUpload from '@/cms/common/cmsUpload'
  import { saveScreenAdvertising } from '@/cms/api/openScreenAdvertising'
  import { Message } from 'element-ui'
  export default {
    name: 'EditOrAdd',
    components: { CmsUpload },
    data() {
      return {
        visible: false,
        isEdit: false,
        formData: {
          appType: [],
        },
        imgUrl: '',
      }
    },
    methods: {
      open(data) {
        this.visible = true
        this.isEdit = !!data
        if (data) {
          this.formData.id = data.id
          this.formData.name = data.name
          this.formData.appType = data.appType
          this.imgUrl = data.imgUrl
        }
      },
      close() {
        this.visible = false
        this.reset()
      },
      reset() {
        this.formData = {
          appType: [],
        }
      },
      uploadFile() {
        // const input = document.createElement('input')
        this.$refs.cmsUpload.upload('.png,.jpg').then((res) => {
          // console.log(res)
          this.imgUrl = res.url
          this.formData.imgId = res.data
        })
      },
      submit() {
        saveScreenAdvertising(this.formData).then((res) => {
          if (+res.code === 0) {
            Message.success('保存广告成功')
            this.$emit('success')
            this.close()
          } else {
            Message.warning(res.msg)
          }
        })
      },
    },
  }
</script>

<style scoped></style>
