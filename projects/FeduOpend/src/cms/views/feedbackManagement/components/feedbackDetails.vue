<template>
  <el-dialog
    custom-class="feedbackDetails"
    width="700px"
    title="反馈详情"
    :visible="visible"
    @close="close"
  >
    <el-descriptions :column="3">
      <el-descriptions-item label="反馈类型">
        {{ feedbackInfo.type }}
      </el-descriptions-item>
      <el-descriptions-item label="反馈方式">
        {{ feedbackInfo.mode }}
      </el-descriptions-item>
      <el-descriptions-item label="反馈时间">
        {{ feedbackInfo.createTime }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="反馈用户">
        {{ feedbackInfo.username }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="反馈手机">
        {{ feedbackInfo.mobile }}
      </el-descriptions-item>
      <!--      <el-descriptions-item label=""></el-descriptions-item>-->
      <el-descriptions-item label="反馈终端">
        {{ feedbackInfo.appType }}
      </el-descriptions-item>
      <el-descriptions-item label="反馈设备">
        {{ feedbackInfo.device }}
      </el-descriptions-item>
      <el-descriptions-item label="应用版本">
        {{ feedbackInfo.appVersion }}
      </el-descriptions-item>
      <el-descriptions-item label="反馈园所">
        {{ feedbackInfo.schoolName }}
      </el-descriptions-item>
      <el-descriptions-item label="反馈班级">
        {{ feedbackInfo.clazzName }}
      </el-descriptions-item>
      <el-descriptions-item label="幼儿名称">
        {{ feedbackInfo.studentName }}
      </el-descriptions-item>
    </el-descriptions>
    <el-row>
      <div>
        <h4>反馈信息:</h4>
      </div>
      <el-input v-model="feedbackInfo.message" readonly type="textarea" />
    </el-row>
    <el-row>
      <div class="imgBox">
        <el-image
          v-for="item in feedbackInfo.images"
          :key="item"
          style="width: 100px; height: 100px"
          :src="item"
          :preview-src-list="feedbackInfo.images"
        ></el-image>
      </div>
    </el-row>
    <el-row>
      <div>
        <h4>处理记录:</h4>
      </div>
      <el-input v-model="feedbackInfo.reply" type="textarea" />
    </el-row>
    <el-row justify="center" style="margin-top: 20px">
      <el-button type="primary" @click="submitForm">
        {{ +feedbackInfo.isFastFeedback === 1 ? '保存' : '处理' }}
      </el-button>
      <el-button type="primary" @click="close">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  import { handleFeedBack } from '@/cms/api/feedback'

  export default {
    name: 'FeedbackDetails',
    data() {
      return {
        visible: false,
        feedbackInfo: {},
      }
    },
    methods: {
      open(data) {
        this.feedbackInfo = data
        this.visible = true
        console.log(data)
      },
      reviewImg() {},
      submitForm() {
        if (this.feedbackInfo.reply) {
          handleFeedBack({
            id: this.feedbackInfo.id,
            reply: this.feedbackInfo.reply,
          }).then((res) => {
            if (+res.code === 0) {
              this.$message.success('处理成功')
              this.close()
            } else {
              this.$message.warning(res.msg)
            }
          })
        } else {
          this.$message.warning('请输入处理结果')
        }
      },
      close() {
        this.reset()
        this.visible = false
        this.$emit('close')
      },
      reset() {
        this.feedbackInfo = {}
      },
    },
  }
</script>

<style scoped></style>
