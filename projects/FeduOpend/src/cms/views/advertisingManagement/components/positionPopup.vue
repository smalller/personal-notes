<template>
  <el-dialog
    :title="title"
    class="positionPopup"
    :visible="visible"
    width="400px"
    @close="close"
  >
    <el-form
      ref="formData"
      size="small"
      :model="form"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        label="所在模块"
        prop="module"
        :rules="filterRules({ required: true, msg: '所在模块必须输入' })"
      >
        <!--        <el-input v-model="form.module" class="input"></el-input>-->
        <el-select v-model="form.module">
          <el-option
            v-for="item in moduleList"
            :key="item"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所在区域"
        prop="area"
        :rules="filterRules({ required: true, msg: '所在区域必须输入' })"
      >
        <el-input v-model="form.area" class="input"></el-input>
      </el-form-item>
      <el-form-item
        label="广告数量"
        prop="adsCount"
        :rules="filterRules({ required: true, msg: '广告数量必须输入' })"
      >
        <el-input
          v-model.number="form.adsCount"
          class="input"
          type="number"
          prop="adsCount"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="固定KEY"
        prop="adsKey"
        :rules="filterRules({ required: true, msg: '固定KEY必须输入' })"
      >
        <el-input v-model="form.adsKey" class="input"></el-input>
      </el-form-item>
      <el-form-item
        label="客户端"
        prop="portType"
        :rules="filterRules({ required: true, msg: '客户端必须选择' })"
      >
        <el-select v-model="form.portType">
          <!--          <el-option value="pc">pc</el-option>-->
          <el-option value="app">app</el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="图片尺寸"
        :rules="filterRules({ required: true, msg: '所在模块必须输入' })"
      >
        <el-input
          v-model="form.width"
          class="size"
          style="margin-right: 20px"
        ></el-input>
        <el-input v-model="form.height" class="size"></el-input>
      </el-form-item>
      <el-form-item
        label="可选内容"
        prop="hotspotDataType"
        :rules="filterRules({ required: true, msg: '最少选择一项内容' })"
      >
        <el-checkbox-group v-model="form.hotspotDataType">
          <el-checkbox
            v-for="item in typeList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            {{ item.describe }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {
    GetdataType,
    QueryAllModule,
    QueryAreaByModule,
    SaveAdsPosConfig,
  } from '@/cms/api/advertisement'

  export default {
    name: 'PositionPopup',
    data() {
      return {
        visible: false,
        form: {
          module: '',
          area: '',
          adsCount: 0,
          adsKey: '',
          portType: '',
          width: '',
          height: '',
          hotspotDataType: [],
        },
        title: '新增',
        typeList: [],
        moduleList: [],
      }
    },
    created() {
      this.getCondition()
    },
    methods: {
      init(opt) {
        this.visible = true
        this.title = !opt ? '新增' : '编辑'
        if (opt) {
          this.form = Object.assign(this.form, opt)
        }
      },
      close() {
        this.$refs.formData.resetFields()
        this.visible = false
        this.form = {
          module: '',
          area: '',
          adsCount: 0,
          adsKey: '',
          portType: '',
          width: '',
          height: '',
          hotspotDataType: [],
        }
        this.$emit('close')
      },
      getCondition() {
        GetdataType().then((res) => {
          if (+res.code === 0) {
            this.typeList = res.data
          }
        })
        QueryAllModule().then((res) => {
          if (+res.code === 0) {
            this.moduleList = res.data
          }
        })
      },
      submitForm() {
        this.$refs.formData.validate((validate) => {
          if (validate) {
            SaveAdsPosConfig(this.form).then((res) => {
              if (+res.code === 0) {
                this.$message.success('提交成功')
                this.visible = false
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .positionPopup {
    .input {
      width: 200px;
    }
    .size {
      width: 90px;
    }
  }
</style>
