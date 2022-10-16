<template>
  <div class="openScreenAdvertising">
    <el-card>
      <el-button type="primary" @click="add">新增开屏广告</el-button>
    </el-card>
    <el-card>
      <el-table :data="list">
        <el-table-column label="广告名称" prop="name" />
        <el-table-column label="广告图片">
          <template #default="{ row }">
            <img style="height: 100px" :src="row.imgUrl" />
          </template>
        </el-table-column>
        <el-table-column label="广告链接" />
        <el-table-column label="显示终端" prop="appType">
          <template #default="{ row }">
            {{ row.appType.indexOf('1') > -1 ? '家长端' : '' }}
            {{ row.appType.indexOf('2') > -1 ? '老师端' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="广告状态">
          <template #default="{ row }">
            <el-tag v-if="+row.isUse === 1">启用</el-tag>
            <el-tag v-if="+row.isUse === 0" type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
        <el-table-column label="操作" width="200px">
          <template #default="{ row }">
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定启用这条广告吗？"
              @confirm="enableScreenAdvertising(row)"
            >
              <el-button slot="reference" type="text">启用</el-button>
            </el-popconfirm>
            <el-button type="text" @click="edit(row)">编辑</el-button>
            <el-button type="text" @click="viewImg(row)">预览</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除这条广告吗？"
              @confirm="deleteScreenAdvertising(row)"
            >
              <el-button slot="reference" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="+pageForm.pageNo"
        :layout="'total, sizes, prev, pager, next, jumper'"
        :page-size="+pageForm.pageSize"
        :total="+pageForm.total"
        background
        @current-change="pageChange"
        @size-change="sizeChange"
      ></el-pagination>
    </el-card>
    <EditOrAdd ref="editOrAdd" @success="getList" />
    <review-img ref="reviewImg" />
  </div>
</template>

<script>
  import EditOrAdd from './components/editOrAdd'
  import {
    delScreenAdvertising,
    getScreenAdvertising,
    useScreenAdvertising,
  } from '@/cms/api/openScreenAdvertising'
  import { Message } from 'element-ui'
  import ReviewImg from '@/cms/views/openScreenAdvertising/components/reviewImg'
  export default {
    components: { ReviewImg, EditOrAdd },
    data() {
      return {
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
        list: [],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      pageChange(page) {
        this.pageForm.pageNo = page
        this.getList()
      },
      sizeChange(pageSize) {
        this.pageForm.pageSize = pageSize
        this.getList()
      },
      add() {
        this.$refs.editOrAdd.open()
      },
      edit(row) {
        this.$refs.editOrAdd.open(row)
      },
      getList() {
        getScreenAdvertising(Object.assign(this.pageForm, {})).then((res) => {
          if (+res.code === 0) {
            this.list = res.data.list
            this.pageForm.pageNo = res.data.page.pageNo
            this.pageForm.total = res.data.page.totalNum
          }
        })
      },
      deleteScreenAdvertising(row) {
        delScreenAdvertising(row.id).then((res) => {
          if (+res.code === 0) {
            Message.success('删除广告成功！')
            this.getList()
          }
        })
      },
      enableScreenAdvertising(row) {
        useScreenAdvertising(row.id).then((res) => {
          if (+res.code === 0) {
            Message.success('启用广告成功！')
            this.getList()
          }
        })
      },
      viewImg(row) {
        this.$refs.reviewImg.open(row.imgUrl)
      },
    },
  }
</script>

<style scoped></style>
