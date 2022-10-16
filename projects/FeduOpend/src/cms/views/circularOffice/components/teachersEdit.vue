<template>
  <el-dialog
    ref="editRef"
    title="老师管理"
    :visible.sync="teacherDiag"
    width="70%"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="adverCenter">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-input
                v-model="params.name"
                placeholder="请输入老师名称查询..."
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 30px">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableList" style="width: 100%" height="500">
        <el-table-column
          label="姓名"
          align="left"
          prop="name"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="称谓"
          width="180"
        ></el-table-column>
        <el-table-column label="班级名称" align="center">
          <template #default="{ row }">
            <el-button type="text">
              {{
                row.classNames.length ? row.classNames.join(',') : '暂无班级'
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="right">
          <template #default="{ row }">
            <div
              class="choose-item"
              :class="+row.isChoosed ? 'choosed' : 'notChoosed'"
              @click="chooseAder(row)"
            >
              {{ +row.isChoosed ? '移除' : '添加' }}
            </div>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.isEdit = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'
  import { STAFFLIST, moveTeacher } from '@/cms/api/staff'
  export default {
    name: 'TeachersEdit',
    data() {
      return {
        teacherDiag: false, //管理老师弹框显示隐藏
        params: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
          schoolId: this.$parent.school,
        },
        tableList: [],
        listLoading: false,
      }
    },
    mounted() {
      let vm = this
      vm.list()
    },
    methods: {
      //查询
      search() {
        let vm = this
        vm.params.pageNo = 1
        vm.params.total = 0
        vm.list()
      },
      //  table列表查询
      list() {
        let vm = this
        vm.listLoading = true //默认开启加载动
        // console.log('查询的参数', vm.params)
        return request({
          url: STAFFLIST,
          method: 'GET',
          params: vm.params,
        }).then((list) => {
          vm.listLoading = false
          console.log('查询的列表', list)
          //处理列表数据逻辑
          if (+list.code === 0) {
            let choosedClazzId = vm.$parent.params.clazzId
            // console.log(choosedClazzId)
            list.data.forEach((item) => {
              // console.log(item.clazzIds.indexOf(choosedClazzId))
              if (item.clazzIds.indexOf(choosedClazzId) > -1) {
                item.isChoosed = true
              } else {
                item.isChoosed = false
              }
            })
            vm.tableList = list.data || []
            vm.params.total = +list.page.totalNum || 0
          }
        })
      },
      //处理翻页
      pageChange(val) {
        vm.params.pageNo = val
        vm.list()
      },
      //查询limit改变
      sizeChange(val) {
        vm.params.pageSize = val
        vm.list()
      },
      //处理选择移除
      chooseAder(val) {
        let vm = this
        let enableStatus = val.isChoosed ? 9 : 1
        let p = {
          title: val.title,
          clazzId: vm.$parent.params.clazzId,
          employeeId: val.id,
          enableStatus,
          schoolId: vm.$parent.school,
        }
        // console.log(p)
        moveTeacher(p).then((res) => {
          vm.$message.success(res.msg)
          if (+res.code === 0) {
            if (val.isChoosed) {
              let i = val.classNames.indexOf(vm.$parent.name)
              if (i >= 0) {
                val.classNames.splice(i, 1)
              }
            } else {
              val.classNames.push(vm.$parent.name)
            }
            val.isChoosed = !val.isChoosed
            vm.$emit('listRefresh')
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .choose-item {
    background: #ffffff;
    color: #333333;
    font-size: 13px;
    cursor: pointer;
    width: 68px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    transition: all 0.25s linear;
    float: right;
  }
  .choosed {
    border: none;
    background: #409eff;
    color: #ffffff;
  }
  /*.el-table::v-deep .cell {*/
  /*  display: flex;*/
  /*  justify-content: flex-end;*/
  /*}*/
</style>
