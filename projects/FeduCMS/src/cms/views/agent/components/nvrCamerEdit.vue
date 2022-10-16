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
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="name"
            :rules="filterRules({ required: true, msg: '不可为空' })"
            label="摄像头名称"
          >
            <el-input
              v-model="editData.name"
              placeholder="请输入"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="margin-right: 10px">
          <el-form-item
            prop="schoolId"
            :rules="filterRules({ required: true, msg: '不可为空' })"
            label="所属幼儿园"
          >
            <el-select
              v-model="editData.schoolId"
              :disabled="editType === 'add2'"
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

      <el-row v-if="editType !== 'add2'">
        <el-col :span="12">
          <el-form-item
            prop="password"
            label="摄像头设备密码"
            :rules="filterRules({ required: true, msg: '不可为空' })"
          >
            <el-input
              v-model="editData.password"
              placeholder="请输入"
              style="width: 300px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="editType !== 'add2'">
        <el-col :span="12">
          <el-form-item
            prop="password2"
            label="再次输入密码"
            :rules="filterRules({ required: true, msg: '不可为空' })"
          >
            <el-input
              v-model="editData.password2"
              placeholder="请输入"
              style="width: 300px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.isCamer = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import { mapGetters } from 'vuex'
  import { SCHOOLLIST } from '@/cms/api/information'
  import { INSERTCHANNEL, INSERTDEVICE, ADDCAREMA } from '@/cms/api/nvr'
  export default {
    name: 'NvrManagerEdit',
    data() {
      return {
        editType: '',
        type: 0,
        nameData: [],
        editData: {
          school_name: '',
          name: '',
          maxChannels: '1',
          selfOpenChannels: '1',
          type: 'newIpc',
          schoolId: '',
          password: '',
          password2: '',
          applyType: '0',
          applyUserName: '',
          applyUserMobile: '',
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
            this.editData.school_name = item.name
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
        if (+this.editData.selfOpenChannels > +this.editData.maxChannels) {
          vm.$message.warning('本次开通通道数不能大于最大通道数')
          return
        }

        vm.$refs.dataForm.validate((valid) => {
          if (valid) {
            // obj.agentCompanyId = vm.$cookie.get(`${firmId}_company_id`)
            vm.editData.applyUserName = this.$store.state.user.username
            // vm.editData.name = vm.editData.school_name
            if (vm.editType === '') {
              request({
                url: ADDCAREMA,
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
                id: this.editData.id,
                selfOpenChannels: this.editData.selfOpenChannels,
              }
              request({
                url: INSERTCHANNEL,
                method: 'post',
                data: obj,
              }).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success(res.msg)
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
      init() {
        request({
          url: `/schools/school/queryByAgentId/${this.$cookie.get(
            `${firmId}_company_id`
          )}`,
          method: 'get',
        }).then((res) => {
          this.nameData = res.data || []
          this.editType = ''
          console.log(res)
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
