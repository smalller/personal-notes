<template>
  <div class="editChildren">
    <h3>{{ type === 0 ? '新增用户' : '编辑幼儿' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      style="margin-bottom: 30px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="幼儿姓名"
        prop="name"
        :rules="filterRules({ required: true, msg: '请输入幼儿姓名' })"
      >
        <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="出生年月"
        prop="birthTime"
        :rules="filterRules({ required: true, msg: '请输入出生年月' })"
      >
        <el-date-picker
          v-model="ruleForm.birthTime"
          type="date"
          placeholder="出生年月"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="所在班级"
        prop="clazzName"
        :rules="filterRules({ required: true, msg: '请选择班级' })"
      >
        <el-select
          v-model="ruleForm.clazzName"
          filterable
          placeholder="请选择班级"
          @change="getSelectClass"
        >
          <el-option
            v-for="(item, index) in classList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="性别"
        prop="sex"
        :rules="filterRules({ required: true, msg: '请选择幼儿性别' })"
      >
        <el-radio-group v-model="ruleForm.sex">
          <el-radio value="1" :label="1">男</el-radio>
          <el-radio value="0" :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="家长手机号"
        prop="contacts"
        :rules="
          filterRules({
            required: true,
            msg: '请输入家长手机号',
            type: 'mobile',
          })
        "
      >
        <el-input
          v-model.number="ruleForm.contacts"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { EditChildren } from '@/api/child'
  import { getAllClass } from '@/cms/api/class'
  export default {
    data() {
      return {
        ruleForm: {},
        type: 0, //0新增 1修改
        classList: [],
        SEX_TYPE: [
          {
            value: 0,
            label: '女',
          },
          {
            value: 1,
            label: '男',
          },
        ],
      }
    },
    methods: {
      //提交表单
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            EditChildren(this.ruleForm, this.ruleForm.id).then((res) => {
              if (res.code == 0) {
                this.$emit('success')
                this.$message({
                  message: '恭喜你，修改成功',
                  type: 'success',
                })
              }
            })
          } else {
            this.$message({
              message: '修改失败！',
              type: 'warning',
            })
            return
          }
        })
      },
      //获取班级数据
      getSelectClass(data) {
        this.classList.forEach((item) => {
          if (item.id == data) {
            this.ruleForm.clazzId = item.id
            this.ruleForm.clazzName = item.name
          }
        })
      },
      resetForm() {
        this.$refs.ruleForm.resetFields()
      },
      cancel() {
        this.$emit('cancel')
      },
      //查询班级信息
      getClassInfo(id) {
        if (id) {
          getAllClass(id).then((res) => {
            if (res.code == 0) {
              this.classList = res.data.list
            } else {
              this.$message({
                message: '班级信息查询失败!',
                type: 'warning',
              })
            }
          })
        }
      },
      init(row) {
        //父组件调用
        this.type = 1
        this.ruleForm = { ...row }
        this.getClassInfo(row.schoolId)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .editChildren {
    width: 25%;
    h3 {
      margin-bottom: 20px;
    }
  }
</style>
