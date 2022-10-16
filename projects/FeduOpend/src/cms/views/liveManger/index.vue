<template>
  <div class="liveManage_warpper">
    <add-live v-show="isEdit" ref="addLive" @cancel="close"></add-live>
    <div v-show="!isEdit">
      <vab-query-form>
        <vab-query-form-top-panel>
          <el-form
            ref="form"
            :inline="true"
            :model="queryForm"
            label-width="80px"
            @submit.native.prevent
          >
            <el-form-item label="直播名称">
              <el-input
                v-model="queryForm.name"
                placeholder="直播名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="times"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </vab-query-form-top-panel>
        <vab-query-form-left-panel>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">
            查询
          </el-button>
          <el-button @click="reset">重置</el-button>
          <el-button
            type="primary"
            style="margin-bottom: 20px"
            @click="addLiveBtn"
          >
            新增
          </el-button>
        </vab-query-form-left-panel>
      </vab-query-form>

      <el-table :data="tableList">
        <el-table-column width="250" label="活动名称">
          <template #default="{ row }">
            <div class="titleBox">
              <img :src="row.picturePath" alt="" />
              <span>{{ row.name }}</span>
            </div>
          </template>
          <el-table-column label="uuid" prop="id"></el-table-column>
        </el-table-column>
        <el-table-column
          prop="pushStreamAddress"
          label="直播地址"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="liveTime"
          width="160"
          label="开始时间"
        ></el-table-column>
        <el-table-column prop="title" label="状态">
          <template #default="{ row }">
            <el-tag>{{ getStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="操作" width="150">
          <template #default="{ row }">
            <el-button
              type="text"
              :disabled="row.status === 3"
              @click="editForm(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="row.status === 3 ? unPublish(row) : publish(row)"
            >
              {{ getStatus2(row.status) }}
            </el-button>
            <el-button
              :disabled="row.status === 3"
              type="text"
              @click="deleteItem(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import tableMinix from '@/cms/mixins/tableMixin'
  import AddLive from './components/AddLive'
  import {
    LiveVideoDelete,
    LiveVideoPublish,
    LiveVideoQuery,
    LiveVideoUnPublish,
  } from '@/cms/api/liveSetting'
  import { DeleteMediaAlbum } from '@/cms/api/mediaSetting'

  export default {
    components: {
      AddLive,
    },

    mixins: [tableMinix],
    data() {
      return {
        times: [],
        tableList: [
          {
            a: 100,
          },
        ],
        queryForm: {
          pageNo: 1,
          pageSize: 20,
        },
      }
    },

    created() {
      this.fetchData()
    },
    methods: {
      //上线
      async publish(row) {
        await LiveVideoPublish({ id: row.id })
        await this.fetchData()
      },
      //下线
      async unPublish(row) {
        await LiveVideoUnPublish({ id: row.id })
        await this.fetchData()
      },
      async deleteItem(id) {
        this.$baseConfirm('你确定要删除当前项专辑吗', null, async () => {
          const { msg } = await LiveVideoDelete({ id })
          this.$baseMessage(msg, 'success')
          await this.fetchData()
        })
      },
      editForm(item) {
        this.$refs.addLive.update(item)
        this.isEdit = true
      },
      getStatus(status) {
        const text = ['', '待处理', '待上线', '已上线', '已下线']
        return text[+status]
      },
      getStatus2(status) {
        return +status === 3 ? '下线' : '上线'
      },
      close() {
        this.isEdit = false
        this.fetchData()
      },
      addLiveBtn() {
        this.isEdit = true
      },
      reset() {
        this.queryForm = {
          pageNo: 1,
          pageSize: 20,
        }
        this.times = []
        this.handleQuery()
      },
      handleQuery() {
        if (this.times.length === 2) {
          this.queryForm.startTime = this.times[0] + ' 00:00:00'
          this.queryForm.endTime = this.times[1] + ' 23:59:59'
        }
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        this.queryForm.type = this.type
        const { data } = await LiveVideoQuery(this.queryForm)
        this.tableList = data.list
        this.total = data.page.totalNum
        this.listLoading = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .titleBox {
    display: flex;
    align-items: center;
    img {
      width: 80px;
      height: 45px;
    }
    span {
      margin-left: 10px;
    }
  }
  .liveManage_warpper {
    padding: 20px;
  }
</style>
