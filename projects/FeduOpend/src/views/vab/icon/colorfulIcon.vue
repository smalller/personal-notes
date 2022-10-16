<template>
  <div class="colorful-icon-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-alert
          :closable="false"
          title="多彩图标在演示环境中使用的是cdn加速服务，开发时需存储到本地，使用方法可查看群文档，点击图标即可复制源码"
          show-icon
          type="success"
        ></el-alert>
      </el-col>
      <el-col :span="24">
        <el-form :inline="true" label-width="80px" @submit.native.prevent>
          <el-form-item label="图标名称">
            <el-input v-model="queryForm.title"></el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <el-button native-type="submit" type="primary" @click="queryData">
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col
        v-for="(item, index) in queryIcon"
        :key="index"
        :lg="2"
        :md="3"
        :sm="8"
        :xl="2"
        :xs="6"
      >
        <el-card shadow="hover" @click.native="handleCopyIcon(item, $event)">
          <vab-colorful-icon
            :icon="`https://cdn.jsdelivr.net/gh/chuzhixin/zx-colorful-icon@master/${item}.svg`"
          />
        </el-card>
        <div class="icon-text" @click="handleCopyText(item, $event)">
          {{ item }}
        </div>
      </el-col>
      <el-col :span="24">
        <el-pagination
          :current-page="queryForm.pageNo"
          :layout="layout"
          :page-size="queryForm.pageSize"
          :page-sizes="[72, 144, 216, 288]"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getIconList } from '@/api/colorfulIcon'
  import clip from '@/utils/clipboard'

  export default {
    name: 'ColorfulIcon',
    data() {
      return {
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryIcon: [],
        queryForm: {
          pageNo: 1,
          pageSize: 72,
          title: '',
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        const { data, totalCount } = await getIconList(this.queryForm)
        this.queryIcon = data
        this.total = totalCount
      },
      handleCopyText(item, event) {
        clip(item, event)
      },
      handleCopyIcon(item, event) {
        clip(`<vab-colorful-icon icon="${item}" />`, event)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .colorful-icon-container {
    ::v-deep {
      .el-card__body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: $base-padding/1.75;
        cursor: pointer;
      }
    }

    .icon-text {
      height: 30px;
      margin-top: -15px;
      overflow: hidden;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
