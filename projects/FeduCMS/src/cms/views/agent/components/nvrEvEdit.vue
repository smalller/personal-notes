<template>
  <!-- 园所新增编辑 -->
  <div class="informationEdit common">
    <el-form
      ref="dataForm"
      :model="editData"
      label-width="150px"
      style="margin-bottom: 30px"
    >
      <!--      基础信息-->
      <el-row>
        <el-col :span="12" style="margin-right: 10px">
          <el-form-item
            prop="schoolId"
            :rules="filterRules({ required: true, msg: '不可为空' })"
            label="所属幼儿园"
          >
            <el-select
              v-model="editData.schoolId"
              :disabled="type === 1"
              placeholder="请选择"
              @change="chooseOne"
            >
              <el-option
                v-for="item in nameData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="name"
            :rules="filterRules({ required: true, msg: '不可为空' })"
            label="摄像头名称"
          >
            <el-input
              v-model="editData.name"
              placeholder="请输入"
              style="width: 400px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="deviceSerial"
            :rules="filterRules({ required: true, msg: '不可为空' })"
            label="摄像头序列号"
          >
            <el-input
              v-model="editData.deviceSerial"
              :disabled="type === 1"
              placeholder="请输入"
              style="width: 400px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="validateCode"
            :rules="filterRules({ required: true, msg: '不可为空' })"
            label="摄像头验证码"
          >
            <el-input
              v-model="editData.validateCode"
              :disabled="type === 1"
              placeholder="请输入"
              style="width: 400px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.isEv = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import { mapGetters } from 'vuex'
  import { SCHOOLLIST } from '@/cms/api/information'
  import { ADDEV, EDITEV } from '@/cms/api/nvr'
  export default {
    name: 'NvrManagerEdit',
    data() {
      return {
        editType: '',
        type: 0,
        nameData: [],
        editData: {
          schoolName: '',
          name: '',
          schoolId: '',
          applyType: '0',
          applyUserName: '',
          applyUserMobile: '',
          agentCompanyId: this.$cookie.get(`${firmId}_company_id`),
        }, //提交的数据
      }
    },
    computed: {
      ...mapGetters(['username']),
    },
    methods: {
      chooseOne(val) {
        this.nameData.forEach((item) => {
          if (item.id === val) {
            this.editData.schoolName = item.name
          }
        })
      },
      //保存或修改
      save() {
        const vm = this
        if (this.editData.password !== this.editData.password2) {
          vm.$message.warning('两次密码不一致')
          return
        }
        vm.$refs.dataForm.validate((valid) => {
          if (valid) {
            vm.editData.applyUserName = this.$store.state.user.username
            if (vm.type === 0) {
              request({
                url: ADDEV,
                method: 'post',
                data: vm.editData,
              }).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success(res.msg)
                  vm.$emit('close')
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            } else {
              let obj = {
                deviceSerial: this.editData.deviceSerial,
                deviceName: this.editData.name,
              }
              request({
                url: `${EDITEV}?deviceName=${this.editData.name}&deviceSerial=${this.editData.deviceSerial}`,
                method: 'post',
              }).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success('修改成功！')
                  vm.$emit('close')
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            }
          }
        })
      },
      //编辑时初始化数据
      init(row) {
        request({
          url: `/schools/school/queryByAgentId/${this.$cookie.get(
            `${firmId}_company_id`
          )}`,
          method: 'get',
        }).then((res) => {
          this.nameData = res.data || []
          this.editType = ''
          if (row.id) {
            this.editData = { ...row }
            this.type = 1
          } else {
            this.type = 0
          }
        })
      },
      init2(val) {
        request({
          url: `/schools/school/queryByAgentId/${this.$cookie.get(
            `${firmId}_company_id`
          )}`,
          method: 'get',
        }).then((res) => {
          this.nameData = res.data || []
          this.editType = 'add2'
          this.editData.schoolId = val.schoolId
          this.$set(this.editData, 'maxChannels', val.maxChannels)
          this.editData.id = val.uuid
          console.log(res)
        })
        console.log(val)
      },
    },
  }
</script>

<style scoped></style>
