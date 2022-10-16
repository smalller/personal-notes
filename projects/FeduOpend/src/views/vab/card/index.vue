<template>
  <div class="card-container">
    <vab-query-form class="page-header">
      <vab-query-form-top-panel :span="24">
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="活动区域">
            <el-select v-model="queryForm.area" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="queryForm.datetime"
              placeholder="选择日期时间"
              type="datetime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="所属城市">
            <el-checkbox-group v-model="queryForm.checkboxGroup">
              <el-checkbox-button
                v-for="city in cities"
                :key="city"
                :label="city"
              >
                {{ city }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="queryForm.title" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in list"
        :key="index"
        :lg="8"
        :md="8"
        :sm="8"
        :xl="6"
        :xs="24"
      >
        <el-card
          :body-style="{ padding: '0px', position: 'static' }"
          shadow="hover"
        >
          <vab-magnifier
            style="width: 100%; height: 228px"
            :url="item.img"
            :width="150"
            type="circle"
          ></vab-magnifier>
          <div class="card-title">{{ item.title }}</div>
          <div class="card-description">{{ item.description }}</div>
          <div class="card-datetime">{{ item.datetime }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
  import VabMagnifier from '@/extra/vabMagnifier'
  import { getList } from '@/api/table'

  export default {
    name: 'Card',
    components: { VabMagnifier },
    data() {
      return {
        queryForm: {
          checkboxGroup: ['上海'],
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        cities: ['上海', '北京', '广州', '深圳'],
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
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data, totalCount } = await getList(this.queryForm)
        this.list = data
        this.total = totalCount
      },
    },
  }
</script>
<style lang="scss" scoped>
  .card-container {
    padding: 0 0 $base-padding 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    .page-header {
      display: flex;
      align-items: center;
      padding: $base-padding $base-padding 0 $base-padding;
      margin-bottom: $base-padding;
      background: $base-color-white;
      border: 1px solid #ebeef5;

      ::v-deep {
        .el-form-item__content {
          width: 221px !important;

          .el-select,
          .el-input,
          .el-date-editor,
          .el-checkbox-group {
            width: 100%;
          }
        }
      }
    }

    ::v-deep {
      .el-card {
        &__body {
          position: relative;
          padding: $base-padding;
          cursor: pointer;

          img {
            height: 228px;
          }

          .card-title {
            margin: $base-padding $base-padding 10px $base-padding;
            font-size: 16px;
            font-weight: bold;
          }

          .card-description {
            margin: 0 $base-padding 10px $base-padding;
          }

          .card-datetime {
            margin: 0 $base-padding 10px $base-padding;
            color: rgba($base-color-black, 0.6);
          }
        }
      }

      .el-pagination.is-background {
        .btn-next,
        .btn-prev {
          background-color: $base-color-white;
        }

        .el-pager {
          li {
            background-color: $base-color-white;

            &.active {
              background-color: $base-color-blue;
            }
          }
        }
      }
    }
  }
</style>
