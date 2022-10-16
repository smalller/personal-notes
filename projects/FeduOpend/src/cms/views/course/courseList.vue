<template>
  <el-card class="courseList">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-button icon="el-icon-plus" type="primary" @click="openAddCourse()">
          新增
        </el-button>
        <el-button
          icon="el-icon-notebook-1"
          type="primary"
          @click="openSubjectManager"
        >
          科目管理
        </el-button>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <el-form label-position="left" inline>
          <el-form-item label="课程名称">
            <el-input v-model="queryForm.courseName" />
          </el-form-item>
          <el-form-item label="学科" prop="subjectId">
            <el-select
              v-model="queryForm.subjectId"
              placeholder="请选择学科"
              @change="subjectSelect"
            >
              <el-option value="" label="所有" />
              <el-option
                v-for="item in subjectList"
                :key="item.id"
                :label="item.subjectName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学科小类" prop="courseSubjectId">
            <el-select
              v-model="queryForm.courseSubjectId"
              placeholder="请选择学科小类"
              @change="subjectChildrenSelect"
            >
              <el-option value="" label="所有" />
              <el-option
                v-for="item in subjectChildren"
                :key="item.id"
                :label="item.subjectName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <!--      <vab-query-form-right-panel>-->
      <!--      -->
      <!--      </vab-query-form-right-panel>-->
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list">
      <el-table-column align="left" label="课程名称">
        <template #default="{ row }">
          <div class="courseTitle">
            <img :src="row.pic" alt="" />
            <span>{{ row.courseName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template #default="{ row }">
          <el-tag v-if="row.publishStatus" type="success">已上架</el-tag>
          <el-tag v-else type="danger">已下架</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="185"
      >
        <template #default="{ row }">
          <el-button type="text" @click="upOrDownCourse(row)">
            {{ row.publishStatus ? '下架' : '上架' }}
          </el-button>

          <el-button type="text" @click="openAddCourse(row)">编辑</el-button>
          <el-button type="text" @click="openCourseSection(row.id)">
            课节
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageForm.pageNo"
      :page-size="pageForm.pageSize"
      :total="pageForm.total"
      background
      @current-change="pageChange"
      @size-change="pageSizeChange"
    ></el-pagination>
  </el-card>
</template>

<script>
  import { queryCourse, querySubject, upOrDownCourse } from '@/cms/api/course'
  export default {
    name: 'CourseList',
    components: {},
    data() {
      return {
        queryForm: {},
        subjectList: [],
        subjectChildren: [],
        list: [],
        listLoading: false,
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
      }
    },
    created() {
      this.query()
      this.querySubjectList()
    },
    methods: {
      reset() {
        this.queryForm = {}
        this.pageForm = {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        }
        this.query()
      },
      querySubjectList() {
        querySubject({
          pageNo: 1,
          pageSize: 999,
          enableStatus: 1,
        }).then((res) => {
          if (+res.code === 0) {
            this.subjectList = res.data.list
          }
        })
      },
      subjectSelect(id) {
        this.subjectChildren = []
        if (id) {
          const subject = this.subjectList.find((item) => item.id === id)
          this.subjectChildren = subject.children
        }
        this.$set(this.queryForm, 'courseSubjectId', '')
      },
      subjectChildrenSelect(id) {
        this.$set(this.queryForm, 'courseSubjectId', id)
      },
      //打开新增课程界面
      openAddCourse(row) {
        this.$router.push({
          path: '/courseManagement/addCourse',
          query: row || '',
        })
      },
      //上下架课程
      upOrDownCourse(item) {
        upOrDownCourse({
          id: item.id,
          publishStatus: +!item.publishStatus,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success('修改课程状态成功')
            this.query()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
      //打开课节界面
      openCourseSection(id) {
        this.$router.push({
          path: '/courseManagement/classManagement',
          query: {
            id,
          },
        })
      },
      //打开科目管理界面
      openSubjectManager() {
        this.$router.push('/courseManagement/accountManagement')
      },
      pageChange(page) {
        this.pageForm.pageNo = page
        this.query()
      },
      pageSizeChange(pageSize) {
        this.pageForm.pageSize = pageSize
        this.query()
      },
      query() {
        const params = Object.assign(this.pageForm, this.queryForm)
        params.courseType = 1
        queryCourse(params).then((res) => {
          if (+res.code === 0) {
            this.list = res.data.list
            this.pageForm.pageNo = res.data.page.pageNo
            this.pageForm.pageSize = res.data.page.pageSize
            this.pageForm.total = res.data.page.totalNum
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .courseList {
    padding: 0 0 $base-padding 0 !important;
    margin: 0 !important;
    .courseTitle {
      display: flex;
      align-items: center;
      img {
        width: 160px;
        height: 90px;
      }
    }
  }
</style>
