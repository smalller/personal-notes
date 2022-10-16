<template>
  <div class="information common">
    <edit v-if="isEdit" ref="dialog" @close=";(isEdit = false), list()"></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="list()">刷新</el-button>
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
          label="所属班级"
          prop="clazzNames"
        ></el-table-column>
        <el-table-column
          align="left"
          label="通道编码"
          prop="id"
        ></el-table-column>
        <el-table-column align="center" label="上午开放时间" prop="vendor">
          <template #default="{ row }">
            {{ row.amOpenStartTime ? row.amOpenStartTime.slice(0, 5) : '' }} -
            {{ row.amOpenEndTime ? row.amOpenEndTime.slice(0, 5) : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="下午开放时间" prop="vendor">
          <template #default="{ row }">
            {{ row.pmOpenStartTime ? row.pmOpenStartTime.slice(0, 5) : '' }} -
            {{ row.pmOpenEndTime ? row.pmOpenEndTime.slice(0, 5) : '' }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          label="是否加入明厨亮灶"
          prop="openCookHouse"
        >
          <template #default="{ row }">
            {{ +row.openCookHouse === 1 ? '否' : '是' }}
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="是否在线" prop="openCookHouse">
          <template #default="{ row }">
            {{ +row.onlineStatus === 1 ? '在线' : '离线' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="场景名称"
          prop="areaPath"
        ></el-table-column>
        <el-table-column align="right" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="edit(row)">编辑</el-button>
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
  import edit from '@/cms/views/circularOffice/components/videoEdit'
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
