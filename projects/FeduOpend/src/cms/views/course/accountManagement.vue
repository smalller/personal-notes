<template>
  <el-card class="accountManagement">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="openAddClass">
          新增科目
        </el-button>
      </vab-query-form-left-panel>
      <!--      <vab-query-form-right-panel>-->
      <!--      -->
      <!--      </vab-query-form-right-panel>-->
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      >
      <el-table-column
        align="left"
        label="科目名称"
        prop="subjectName"
      ></el-table-column>

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="285"
      >
        <template #default="{ row }">
          <el-button type="text" @click="subjectPositionChange('up', row)">
            上移
          </el-button>
          <el-button type="text" @click="subjectPositionChange('down', row)">
            下移
          </el-button>
          <el-button
            v-if="!row.pid"
            type="text"
            @click="openAddClassChildren(row)"
          >
            添加子标签
          </el-button>
          <el-button
            type="text"
            @click="!row.pid ? openAddClass(row) : openAddClassChildren(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            v-show="!row.pid"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            :title="`确定${row.enableStatus === 1 ? '禁用' : '启用'}科目吗？`"
            @confirm="disabledSubject(row)"
          >
            <el-button
              slot="reference"
              style="color: #f56c6c; margin-left: 10px"
              :style="{ color: row.enableStatus === 1 ? '#f56c6c' : '#3df532' }"
              type="text"
            >
              {{ row.enableStatus === 1 ? '禁用' : '启用' }}
            </el-button>
          </el-popconfirm>
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
    <el-dialog
      :title="modelText"
      :visible="addAccountShow"
      width="400px"
      @close="closeModal"
    >
      <el-form ref="subjectFrom" :model="dataFrom" label-position="left">
        <el-form-item
          label="科目名称"
          prop="subjectName"
          :rules="[{ required: true, message: '科目名称不能为空' }]"
        >
          <el-input
            v-model="dataFrom.subjectName"
            maxlength="10"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubject">保存</el-button>
          <el-button @click="closeModal">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
  import {
    addCourseSubject,
    forbiddenSubject,
    querySubject,
    upOrDownSubject,
  } from '@/cms/api/course'

  export default {
    name: 'AccountManagement',
    data() {
      return {
        queryForm: {},
        list: [],
        listLoading: false,
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
        addAccountShow: false,
        dataFrom: {
          subjectName: '',
        },
        modelText: '新增科目',
      }
    },
    created() {
      this.querySubjectList()
    },
    methods: {
      //课程上移
      subjectPositionChange(type, data) {
        let list = this.list
        if (!!data.pid) {
          list = this.list.find((item) => item.id === data.pid).children
        }
        let index = list.findIndex((item) => item.id === data.id)
        data.index = index
        index = type === 'up' ? (index -= 1) : (index += 1)
        if (index < 0) index = 0
        if (index > list.length - 1) index = list.length - 1
        const arr = list.map((item, i) => {
          const subject = {
            id: item.id,
            sort: i,
            index: i,
            pid: item.pid || '',
          }
          if (item.id === data.id) {
            subject.sort = index
          }

          if (index === i) {
            subject.sort = data.index
          }
          return subject
        })
        upOrDownSubject(arr).then((res) => {
          if (+res.code === 0) {
            this.$message.success('修改科目位置成功')
            this.querySubjectList()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
      openAddClass(row) {
        console.log(row)
        this.modelText = row ? '编辑科目' : '新增科目'
        this.dataFrom = {
          subjectName: row.subjectName || '',
          id: row.id || '',
        }
        this.addAccountShow = true
      },
      openAddClassChildren(row) {
        this.modelText = row ? '编辑子标签' : '新增子标签'
        this.dataFrom = {
          subjectName: row.pid ? row.subjectName : '',
          id: row.pid ? row.id : '',
          pid: row.pid || row.id,
        }
        this.addAccountShow = true
      },
      closeModal() {
        this.dataFrom = {
          subjectName: '',
        }
        this.addAccountShow = false
      },
      disabledSubject(row) {
        forbiddenSubject({
          id: row.id,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success(
              `${row.enableStatus === 1 ? '禁用' : '启用'}成功`
            )
            this.querySubjectList()
          }
        })
      },
      pageChange(page) {
        this.pageForm.pageNo = page
        this.querySubjectList()
      },
      pageSizeChange(pageSize) {
        this.pageForm.pageSize = pageSize
        this.querySubjectList()
      },
      querySubjectList() {
        this.listLoading = true
        querySubject(this.pageForm)
          .then((res) => {
            if (+res.code === 0) {
              this.list = res.data.list
              this.pageForm.pageNo = res.data.page.pageNo
              this.pageForm.pageSize = res.data.page.pageSize
              this.pageForm.total = res.data.page.totalNum
            }
          })
          .finally(() => {
            this.listLoading = false
          })
      },
      addSubject() {
        this.$refs.subjectFrom.validate((valid) => {
          if (valid) {
            addCourseSubject(this.dataFrom).then((res) => {
              console.log(res)
              if (+res.code === 0) {
                this.$message.success(
                  !!this.dataFrom.id ? '新增科目成功' : '删除科目成功'
                )
                this.closeModal()
                this.querySubjectList()
              }
            })
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .accountManagement {
    padding: 0 0 $base-padding 0 !important;
    margin: 0 !important;
  }
</style>
