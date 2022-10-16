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
        <h2>新增幼儿</h2>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="name"
            :rules="filterRules({ required: true, msg: '姓名不可为空' })"
            label="幼儿姓名"
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
            prop="birthTime"
            label="出生年月"
            :rules="filterRules({ required: true, msg: '请选择出生年月' })"
          >
            <el-date-picker
              v-model="editData.birthTime"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择日期"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="clazzId"
            label="所在班级"
            :rules="filterRules({ required: true, msg: '请选择所在班级' })"
          >
            <el-select v-model="editData.clazzId" placeholder="请选择班级">
              <el-option
                v-for="(item, index) in classList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="contacts"
            label="家长手机号"
            :rules="
              filterRules({
                required: true,
                type: 'mobile',
                msg: '手机号不能为空',
              })
            "
          >
            <el-input
              v-model="editData.contacts"
              placeholder="请输入"
              maxlength="13"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex">
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="editData.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
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
  import { addChild, childEixt, editChild } from '@/cms/api/children' //添加学生 判断学生是否存在
  import { getAllClass } from '@/cms/api/class' //获取该学校下所有班级
  export default {
    data() {
      return {
        editData: {
          sex: '1',
          birthTime: '',
          clazzId: '',
          contacts: '',
          name: '',
        }, //提交的数据
        classList: [],
        type: 0, // 0 新增 1修改 默认0
      }
    },
    mounted() {
      const vm = this
      getAllClass(vm.$parent.school).then((res) => {
        if (+res.code === 0) {
          vm.classList = res.data.list
        }
      })
    },
    methods: {
      //编辑时初始化数据
      init(val) {
        let vm = this
        vm.type = 1 //编辑
        if (val) {
          for (let key in vm.editData) {
            Object.keys(val).forEach((k) => {
              if (k === key) {
                vm.editData[k] = val[k]
              }
            })
          }
          vm.editData.id = val.id
          vm.editData.sex = vm.editData.sex.toString()
        }
      },
      //时间变化
      timeChange(e) {},
      //保存或修改
      save() {
        const vm = this
        vm.$refs.dataForm.validate((valid) => {
          if (valid) {
            let { name, contacts, clazzId } = vm.editData
            let obj = Object.assign(
              { clazzName: name, schoolId: vm.$parent.school },
              vm.editData
            )
            //首先判断学生是否存在
            childEixt(obj).then((r) => {
              if (+r.code === 0) {
                let { name } = vm.classList.find((item) => item.id == clazzId)

                //新增
                if (vm.type === 0) {
                  addChild(obj).then((res) => {
                    if (+res.code === 0) {
                      vm.$message.success(res.msg)
                      vm.$emit('close')
                    } else {
                      vm.$message.warning(res.msg || '接口错误')
                    }
                  })
                } else {
                  editChild(obj, obj.id).then((res) => {
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
          }
        })
      },
    },
  }
</script>

<style scoped></style>
