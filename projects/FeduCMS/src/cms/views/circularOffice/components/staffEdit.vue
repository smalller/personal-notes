<template>
  <!-- 园所新增编辑 -->
  <div class="childrenEdit common">
    <el-form
      ref="dataForm"
      :model="editData"
      label-width="120px"
      style="margin-bottom: 30px"
    >
      <!--      基础信息-->
      <el-row style="margin: 30px 0">
        <h2>{{ +type === 0 ? '新增员工' : '编辑员工' }}</h2>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="name"
            :rules="filterRules({ required: true, msg: '姓名不可为空' })"
            label="姓名"
          >
            <el-input
              v-model="editData.name"
              placeholder="请输入"
              maxlength="40"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="mobile"
            label="手机号"
            :rules="
              filterRules({
                required: true,
                type: 'mobile',
                msg: '手机号不能为空',
              })
            "
          >
            <el-input
              v-model="editData.mobile"
              placeholder="请输入"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="roleId"
            label="角色"
            :rules="filterRules({ required: true, msg: '请选择角色' })"
          >
            <el-select v-model="editData.roleId" placeholder="请选择角色">
              <el-option
                v-for="(item, index) in user_code"
                :key="index"
                :label="item.codeInfoName"
                :value="item.codeInfoId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="title"
            label="称谓"
            :rules="filterRules({ required: true, msg: '请选择称谓' })"
          >
            <el-select v-model="editData.title" placeholder="请选择称谓">
              <el-option
                v-for="(item, index) in title_code"
                :key="index"
                :label="item.codeInfoName"
                :value="item.codeInfoName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-form-item prop="allowLoginPC" label="电脑端登录">
          <el-radio-group v-model="editData.allowLoginPC">
            <el-radio label="1">允许</el-radio>
            <el-radio label="0">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row style="display: flex">
        <el-form-item prop="noticeScope" label="发送全园通知">
          <el-radio-group v-model="editData.noticeScope">
            <el-radio label="2">允许</el-radio>
            <el-radio label="1">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.isEdit = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </div>
</template>

<script>
  import { addStaff, editStaff } from '@/cms/api/staff' //引入新增接口 编辑接口
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        editData: {
          roleName: '',
          roleId: '',
          allowLoginPC: '1',
          noticeScope: '1',
          mobile: '',
          name: '',
          title: '',
        }, //提交的数据
        classList: [],
        type: 0, //0 新增 1 编辑
      }
    },
    computed: {
      ...mapGetters({
        title_code: 'code_list/title_code',
        user_code: 'code_list/user_code',
      }),
    },
    mounted() {},
    methods: {
      //保存或修改
      save() {
        const vm = this
        vm.$refs.dataForm.validate((valid) => {
          if (valid) {
            // let { codeInfoName } = vm.title_code.find(
            //   (item) => +item.codeInfoValue === +title
            // )
            for (let item of this.user_code) {
              if (item.codeInfoId === this.editData.roleId) {
                this.editData.roleName = item.codeInfoName
              }
            }
            let obj = {}
            if (+this.editData.allowLoginPC === 1) {
              obj = Object.assign(
                {
                  sysAllow: ['cms'],
                  jobStatus: 1,
                  schoolId: sessionStorage.getItem('zdyjb_schoolId'),
                },
                vm.editData
              )
            } else {
              obj = Object.assign(
                {
                  sysAllow: [],
                  jobStatus: 1,
                  schoolId: sessionStorage.getItem('zdyjb_schoolId'),
                },
                vm.editData
              )
            }
            if (+vm.type === 0) {
              addStaff(obj).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success(res.msg)
                  vm.$emit('close')
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            } else {
              editStaff(obj, obj.id).then((res) => {
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
      //编辑初始化数据
      init(val) {
        let vm = this
        vm.type = 1
        if (val) {
          for (let key in val) {
            Object.keys(vm.editData).forEach((k) => {
              if (k === key) {
                vm.editData[k] = val[k]
              }
            })
            vm.editData.id = val.id
            vm.editData.allowLoginPC = vm.editData.allowLoginPC.toString()
          }
        }
      },
    },
  }
</script>

<style scoped></style>
