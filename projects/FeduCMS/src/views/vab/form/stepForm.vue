<template>
  <div class="step-form-container">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="{ span: 20, offset: 2 }"
        :md="{ span: 20, offset: 2 }"
        :lg="{ span: 12, offset: 6 }"
        :xl="{ span: 10, offset: 7 }"
      >
        <el-steps :active="active" align-center class="steps">
          <el-step title="填写转账信息"></el-step>
          <el-step title="确认转账信息"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <step1 v-if="active === 1" @change-step="handleSetStep"></step1>
        <step2
          v-if="active === 2"
          :info-data="form"
          @change-step="handleSetStep"
        ></step2>
        <step3
          v-if="active === 3"
          :info-data="form"
          @change-step="handleSetStep"
        ></step3>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Step1 from './components/Step1'
  import Step2 from './components/Step2'
  import Step3 from './components/Step3'
  export default {
    name: 'Pay',
    components: { Step1, Step2, Step3 },
    data() {
      return {
        active: 1,
        form: {},
      }
    },
    methods: {
      handleSetStep(active, form) {
        this.active = active
        if (form) this.form = Object.assign(this.form, form)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .step-form-container {
    .el-steps {
      margin-bottom: $base-padding;
    }
  }
</style>
