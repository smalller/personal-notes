<template>
  <div>
    <el-form ref="form" :inline="true" @submit.native.prevent>
      <el-form-item label="园所名称">
        <el-input v-model="params.orderId"></el-input>
      </el-form-item>
      <!--      <el-form-item label="园所ID">-->
      <!--        <el-input v-model="params.productName"></el-input>-->
      <!--      </el-form-item>-->
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
      <!-- <el-form-item>
        <el-button @click="reset()">重置</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button
          icon="el-icon-search"
          native-type="submit"
          type="primary"
          @click="reset()"
        >
          刷新
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          native-type="submit"
          type="primary"
          @click="back()"
        >
          返回
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      style="margin-top: 20px"
      :data="tableList"
    >
      <el-table-column
        align="center"
        label="园所名称"
        prop="name"
      ></el-table-column>
      <el-table-column
        align="center"
        label="视频通道编码ID"
        width="200"
        prop="gbId"
      ></el-table-column>
      <el-table-column
        align="center"
        label="设备ID"
        width="270"
        prop="deviceId"
      ></el-table-column>
      <el-table-column
        align="center"
        label="场景名称"
        prop="description"
      ></el-table-column>
      <el-table-column align="right" label="在线状态" prop="onlineStatus">
        <template #default="{ row }">
          {{ row.onlineStatus == 1 ? '在线' : '离线' }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="启用状态" prop="status">
        <template #default="{ row }">
          {{ changeStatus(row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="是否为名厨亮灶"
        prop="openCookHouse"
      >
        <template #default="{ row }">
          {{ row.openCookHouse == 1 ? '不是' : '是' }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="操作" width="400px">
        <template #default="{ row }">
          <!--          <el-button type="primary" @click="stopFuc(row, 'stop')">-->
          <!--            预览-->
          <!--          </el-button>-->
          <el-button
            v-show="row.status === 0"
            type="primary"
            @click="stopFuc(row, 'stop')"
          >
            停用
          </el-button>
          <el-button
            v-show="row.status === 5"
            type="primary"
            @click="stopFuc(row, 'start')"
          >
            启用
          </el-button>
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
</template>
<script>
  import { CAREMALIST } from '@/cms/api/nvr'
  import tableMixin from '@/cms/mixins/tableMixin'
  export default {
    mixins: [tableMixin],
    data() {
      return {
        camerInfo: {},
      }
    },
    created() {},
    methods: {
      back() {
        this.$parent.seen = false
      },
      changeStatus(key) {
        let val
        switch (key) {
          case '0':
            val = '使用中'
            break
          case '1':
            val = '待审核'
            break
          case '2':
            val = '未通过'
            break
          case '3':
            val = '未配置'
            break
          case '4':
            val = '接入中'
            break
          case '5':
            val = '已停用'
            break
          case 'NotFound':
            val = '已移除'
            break
        }
        return val
      },
      init(val) {
        console.log(val)
        this.camerInfo = {}
        this.camerInfo = { ...val }
        this.params.pid = val.id
        this.list(CAREMALIST)
      },
      reset() {
        this.params.pid = this.camerInfo.id
        this.list(CAREMALIST)
      },
    },
  }
</script>
<style lang="scss"></style>
