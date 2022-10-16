<template>
  <div class="information common">
    <edit v-if="isEdit" ref="dialog" @close=";(isEdit = false), list()"></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="isEdit = true">
            新增摄像头
          </el-button>
          <span v-if="name" class="title">{{ name }}</span>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="tableList"
      >
        <el-table-column
          align="left"
          label="所在位置"
          prop="areaPath"
        ></el-table-column>
        <el-table-column
          align="center"
          label="厂商"
          prop="vendor"
        ></el-table-column>
        <el-table-column
          align="center"
          label="类型"
          prop="type"
        ></el-table-column>
        <el-table-column
          align="center"
          label="通道数"
          prop="channels"
        ></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <el-tag type="success">{{ chargeStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="设备ID"
          prop="deviceId"
        ></el-table-column>
        <el-table-column
          align="center"
          label="设备IP"
          prop="ip"
        ></el-table-column>
        <el-table-column
          align="center"
          label="国际ID"
          prop="gbId"
        ></el-table-column>
        <el-table-column
          align="center"
          label="所属目录"
          prop="directoryId"
        ></el-table-column>
        <el-table-column align="right" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="edit(row)">编辑</el-button>
            <el-button type="text" @click="delCamera(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="+params.pageNo"
        :layout="'total, sizes, prev, pager, next, jumper'"
        :page-size="+params.pageSize"
        :total="+params.total"
        background
        @current-change="pageChange"
        @size-change="sizeChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import edit from '@/cms/views/circularOffice/components/cameraEdit'
  import { CAMERALIST, cameraDelete } from '@/cms/api/camera'
  let vm
  export default {
    name: 'Camera',
    components: { edit },
    mixins: [tableMixin],
    data() {
      return {
        sc: '', //学校id
        name: '', //学校名字
      }
    },
    computed: {},
    created() {},
    mounted() {
      vm = this
      // let { schoolId, name } = vm.$route.query
      // if (schoolId) {
      //   vm.schoolId = schoolId
      //   vm.$set(vm.params, 'schoolId', schoolId)
      // } else {
      //   vm.$set(vm.params, 'schoolId', '')
      // }
      // if (name) {
      //   vm.name = name
      // }
      vm.list(CAMERALIST)
    },
    methods: {
      //判断状态
      chargeStatus(s) {
        switch (s) {
          case 'on':
            return '在线'
            break
          case 'off':
            return '离线'
            break
          case 'failed':
            return '锁定'
            break
          case 'new':
            return '未注册'
            break
          default:
            return '未知'
        }
      },
      //创建
      edit(val) {
        vm.isEdit = true
        vm.$nextTick(() => {
          vm.$refs['dialog'].type = 1
          vm.$refs['dialog'].init(val)
        })
      },
      //启用禁用
      control(row) {
        if (+row.enableStatus === 0) return
        let obj = Object.assign({}, row)
        obj.enableStatus = +obj.enableStatus === 1 ? 2 : 1
        let msg = +row.enableStatus === 1 ? '是否确定禁用' : '是否确定开启'
        vm.$baseConfirm(msg, null, () => {
          console.log('111111111111111')
        })
      },
      //删除摄像头
      delCamera(row) {
        let vm = this
        vm.$baseConfirm('是否确认删除', null, () => {
          cameraDelete(row.id).then((res) => {
            if (+res.code === 0) {
              vm.$message.success(res.msg || '删除成功')
              vm.list()
            } else {
              vm.$message.warning(res.msg || '接口错误')
            }
          })
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .title {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    margin-left: 10px;
  }
</style>
