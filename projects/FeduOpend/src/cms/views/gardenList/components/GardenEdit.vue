<template>
  <div>
    <el-form
      ref="dataForm"
      :model="editData"
      label-width="120px"
      style="margin-bottom: 30px"
    >
      <!--      基础信息-->
      <el-row style="margin: 30px 0">
        <h2>{{ type == 0 ? '新增园所' : '编辑园所' }}</h2>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="name"
            :rules="filterRules({ required: true, msg: '联系人姓名不可为空' })"
            label="幼儿园名称"
          >
            <el-input
              v-model="editData.name"
              placeholder="请输入幼儿园名称"
              maxlength="40"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="contactName"
            :rules="filterRules({ required: true, msg: '联系人姓名不可为空' })"
            label="联系人姓名"
          >
            <el-input
              v-model="editData.contactName"
              placeholder="请输入联系人姓名"
              maxlength="40"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="contactMobile"
            label="联系人手机号"
            :rules="
              filterRules({
                required: true,
                type: 'mobile',
                msg: '联系人手机号不能为空',
              })
            "
          >
            <el-input
              v-model="editData.contactMobile"
              placeholder="请输入联系人手机号"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="areaId"
            label="所在省市区"
            :rules="filterRules({ required: true, msg: '请选择省市区' })"
          >
            <el-cascader
              v-model="editData.areaId"
              :options="addressOptions"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-form-item
          prop="time"
          label="开通时间"
          :rules="filterRules({ required: true, msg: '请选择开通时间' })"
        >
          <el-date-picker
            v-model="editData.time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00']"
          ></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row style="display: flex">
        <el-form-item
          prop="agentContactName"
          label="选择代理商"
          :rules="filterRules({ required: true, msg: '请选择代理商' })"
        >
          <el-input
            v-model="editData.agentContactName"
            placeholder="请选择代理商"
            suffix-icon="el-icon-search"
            @focus="chooseAgent"
          ></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.isEdit = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
    <choose-agent ref="chooseAgent" @setAgent="getAgent"></choose-agent>
  </div>
</template>

<script>
  import moment from 'moment'
  import { AddGarden, EditGarden } from '@/api/garden'
  import ChooseAgent from './ChooseAgent'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  export default {
    components: {
      ChooseAgent,
    },
    props: {
      row: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        editData: {
          agentCompanyName: '',
        },
        addressOptions: regionDataPlus,
        type: 0,
      }
    },
    watch: {
      // row: {
      //   handler(newVal) {
      //     this.editData = newVal
      //   },
      //   deep: true,
      // },
    },
    methods: {
      async save() {
        this.$refs.dataForm.validate(async (valid) => {
          if (valid) {
            let ruleData = {}
            let data = await this.formData(this.editData)
            ruleData = { ...data }
            ruleData.abutment = '测试'
            if (this.type === 0) {
              ruleData.forbid = 0
              AddGarden(ruleData).then((res) => {
                if (+res.code === 0) {
                  this.$message({
                    message: '恭喜你，新增成功',
                    type: 'success',
                  })
                  this.$emit('success')
                } else {
                  this.$message({
                    message: '添加失败，请重新添加！',
                    type: 'warning',
                  })
                  // this.$emit('success')
                }
              })
            } else {
              EditGarden(ruleData, ruleData.id).then((res) => {
                if (+res.code === 0) {
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
      //格式化数据
      async formData(data) {
        if (data) {
          data.address = data.address || this.codeChange(data.areaId)
          data.beginDate = await moment(data.time[0]).format('YYYY-MM-DD')
          data.endDate = await moment(data.time[1]).format('YYYY-MM-DD')
          console.log(data.areaId.length)
          if (Array.isArray(data.areaId)) {
            data.areaId = data.areaId.join(',')
          }
        }
        return data
      },
      //初始化表单数据
      init(row) {
        let params = { ...row }
        this.type = 1
        params.areaId = params.areaId.split(',')
        params.time = [params.beginDate, params.endDate]
        this.editData = params
      },
      async getAgent(data) {
        if (data) {
          this.$set(this.editData, 'agentContactName', data.contactName)
          this.editData.agentCompanyId = data.id
          this.$refs['dataForm'].clearValidate(['agentContactName'])
        }
        this.$refs.chooseAgent.close()
      },
      chooseAgent() {
        this.$refs.chooseAgent.open()
      },
      //获取地区数据
      codeChange(value) {
        if (value[1] != null && value[2] != null) {
          var dz =
            CodeToText[value[0]] +
            '/' +
            CodeToText[value[1]] +
            '/' +
            CodeToText[value[2]]
        } else {
          if (value[1] != null) {
            dz = CodeToText[value[0]] + '/' + CodeToText[value[1]]
          } else {
            dz = CodeToText[value[0]]
          }
        }
        return dz
      },
    },
  }
</script>

<style lang="scss" scoped></style>
