<template>
  <!-- 幼儿管理 -->
  <div class="children common">
    <edit v-if="isEdit" ref="dialog" @close=";(isEdit = false), list()"></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="班级" prop="columnId">
          <el-select v-model="params.classId" placeholder="请选择">
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="columnId">
          <el-select v-model="params.clazz" placeholder="请选择">
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="姓名">
          <el-input
            v-model="params.stuName"
            placeholder="请输入学生姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="考勤日期" prop="startTime">
          <el-date-picker
            v-model="params.startTime"
            type="date"
            placeholder="开始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-date-picker
            v-model="params.endTime"
            type="date"
            placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            native-type="submit"
            type="primary"
            @click="search()"
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="research">重置</el-button>
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
          label="姓名"
          prop="stuName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="班级"
          prop="className"
        ></el-table-column>
        <el-table-column align="center" label="考勤日期">
          <template slot-scope="scope">
            <span>{{ getdate(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="打卡时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column align="right" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="show(row)">记录</el-button>
            <!--            <el-button type="text" @click="lookInfo(row)">查看家长</el-button>-->
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
    <el-dialog title="考勤照片" :visible.sync="showPic" width="20%" center>
      <el-form>
        <el-form-item label="" prop="startTime">
          <el-card v-show="picUrl !== ''" :body-style="{ padding: '15px' }">
            <img :src="picUrl" class="image" />
          </el-card>
          <span v-show="picUrl == ''">暂无考勤记录</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="showPic = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let vm
  import { getAllClass } from '@/cms/api/class'
  import { GetPicture } from '@/cms/api/attendance/index'
  import tableMixin from '@/cms/mixins/tableMixin'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  import edit from '@/cms/views/circularOffice/components/childrenEdit'
  import { BATCHCHILDREN } from '@/cms/api/children'
  import { parseTime } from '@/utils/index'

  export default {
    name: 'Children',
    components: {
      edit,
    },
    mixins: [tableMixin, schoolMixin],
    data() {
      return {
        classList: [], //班级列表数据
        parentDialog: false, //查看家长的弹框
        family: [], //储存所查看家长信息
        tableUrl: '/facility/api/attendanceInfo/query', //列表地址
        params: { identity: 2 },
        picUrl: '', //图片地址
        showPic: false,
      }
    },
    mounted() {
      const vm = this
      vm.fileAction = `${process.env.VUE_APP_BASE_API}${BATCHCHILDREN}`
      getAllClass(sessionStorage.getItem('zdyjb_schoolId')).then((res) => {
        if (+res.code === 0) {
          vm.classList = res.data.list
          let { clazzId } = vm.$route.query
          if (clazzId) {
            vm.$set(vm.params, 'clazz', clazzId)
          }
          vm.list()
        }
      })
    },
    methods: {
      research() {
        this.params = {
          pageNo: 1, //页码
          pageSize: 20, //条数
          total: 0, //总数
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
        }
        this.params.identity = 2
        this.list()
      },
      getdate(date) {
        let now = ''
        if (date) {
          now = parseTime(date, '{y}-{m}-{d}')
        }
        return now
      },
      //查看图片
      async show(val) {
        const vm = this
        vm.picUrl = ''
        if (val.images !== null) {
          let data = val.images.replace(/[\ |\[|\\|\"|\'|\]]/g, '', '')
          vm.picUrl = vm.getPicture(data)
        }
        vm.showPic = true
      },
      //获取图片数据
      getPicture(data) {
        if (data) {
          GetPicture(data).then((res) => {
            if (res.code == 0) {
              this.picUrl = res.data
            }
          })
        }
      },
      // 选中上传文件的回调
      success(data) {
        console.log('文件上传信息', data)
        if (+data.code === 0) {
          vm.$message.success(data.msg)
          vm.list()
        } else {
          vm.$message.error(data.msg)
        }
      },
      //导出
      excelExport() {},
    },
  }
</script>

<style scoped lang="scss">
  .content {
    min-height: 200px;
  }
  .image {
    height: 400px;
  }
</style>
