<template>
  <div class="remix-icon-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-alert
          :closable="false"
          title="pro版小清新图标，点击图标即可复制源码使用，无需下载到本地，pro版已移除常规图标，故router中必须配置remixIcon方能显示菜单图标"
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
        :xs="6"
        :sm="8"
        :md="3"
        :lg="2"
        :xl="2"
      >
        <el-card shadow="hover" @click.native="handleCopyIcon(item, $event)">
          <vab-remix-icon :icon="item" />
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
  import { getIconList } from '@/api/remixIcon'
  import clip from '@/utils/clipboard'

  export default {
    name: 'RemixIcon',
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
        clip(`<vab-remix-icon icon="${item}" />`, event)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .remix-icon-container {
    ::v-deep {
      .el-card__body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: $base-padding/2.1;
        cursor: pointer;

        i {
          font-size: 28px;
          color: $base-color-gray;
          text-align: center;
          pointer-events: none;
          cursor: pointer;
        }
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
