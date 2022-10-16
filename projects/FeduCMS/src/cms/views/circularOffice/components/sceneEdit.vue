<template>
  <!-- 摄像头新增或编辑 -->
  <div class="informationEdit common">
    <el-form
      ref="dataForm"
      :model="editData"
      label-width="160px"
      style="margin-bottom: 30px"
    >
      <!--      基础信息-->
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="scene"
            label="场景名称"
            :rules="filterRules({ required: true, msg: '请输入' })"
          >
            <el-input
              v-model="editData.scene"
              placeholder="请输入"
              maxlength="46"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.isEdit = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import { getAllClass } from '@/cms/api/class'
  import { mapGetters } from 'vuex'
  import {
    getSpaceList,
    camereAdd,
    camereUpdate,
    getGbId,
  } from '@/cms/api/camera'
  export default {
    data() {
      return {
        editData: {
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
        }, //提交的数据
      }
    },
    computed: {},
    methods: {
      //保存或修改
      save() {
        const vm = this
        vm.$refs.dataForm.validate((valid) => {
          if (valid) {
            request({
              url: '/schools/api/scene/add',
              method: 'post',
              data: vm.editData,
            }).then((res) => {
              if (+res.code === 0) {
                vm.$message.success(res.msg || '添加成功')
                vm.$parent.isEdit = false
                vm.$parent.list()
              } else {
                vm.$message.warning(res.msg || '接口错误')
              }
            })
          }
        })
      },
      //编辑时初始化数据
      init() {
        const vm = this
        vm.editData.schoolId = sessionStorage.getItem('zdyjb_schoolId')
        vm.$forceUpdate()
      },
    },
  }
</script>

<style scoped></style>
