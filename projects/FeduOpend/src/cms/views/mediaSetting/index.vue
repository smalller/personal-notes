<template>
  <el-card class="media-insert">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="专辑名称">
            <el-input
              v-model="queryForm.albumName"
              placeholder="专辑名称"
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
          <el-form-item label="状态">
            <el-select v-model="queryForm.enableStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-search" type="primary" @click="handleQuery">
          查询
        </el-button>
        <el-button @click="reset">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="insert">
          新建系列
        </el-button>
      </vab-query-form-left-panel>
      <!--      <vab-query-form-right-panel>-->
      <!--        <el-popover popper-class="custom-table-checkbox" trigger="hover">-->
      <!--          <el-checkbox-group v-model="checkList">-->
      <!--            <el-checkbox-->
      <!--              v-for="(item, index) in columns"-->
      <!--              :key="index"-->
      <!--              :label="item.label"-->
      <!--            ></el-checkbox>-->
      <!--          </el-checkbox-group>-->
      <!--          <el-button slot="reference">-->
      <!--            <vab-remix-icon icon="settings-line" />-->
      <!--          </el-button>-->
      <!--        </el-popover>-->
      <!--      </vab-query-form-right-panel>-->
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      @selection-change="setSelectRows"
    >
      <el-table-column label="系列名称" width="200" prop="title" order="1">
        <template #default="{ row }">
          <div class="titleBox">
            <img :src="row.cover" alt="" />
            <span>{{ row.albumName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="uuid" prop="id"></el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        align="center"
        :label="item.label"
        :sortable="item.sortable"
        :width="item.width"
      >
        <template #default="{ $index, row }">
          <span v-if="item.label === '序号'">{{ $index + 1 }}</span>
          <span v-else-if="item.label === '评级'">
            <el-rate v-model="row.rate" disabled></el-rate>
          </span>
          <span v-else-if="item.label === '头像'">
            <el-image :preview-src-list="imageList" :src="row.img"></el-image>
          </span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        effect="dark"
        label="推广剩余时间"
        width="160"
        type="danger"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getTime(row.topExpire || 0) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        effect="dark"
        label="状态"
        width="80"
        type="danger"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tag>{{ getStatus(row.enableStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="推广状态"
        align="center"
        effect="dark"
        width="80"
        type="danger"
        show-overflow-r-tooltip
      >
        <template #default="{ row }">
          <el-tag>{{ getToppingStatus(row.topStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="收费方式"
        align="center"
        effect="dark"
        width="80"
        type="danger"
        show-overflow-r-tooltip
      >
        <template #default="{ row }">
          <el-tag>{{ row.isFree ? '免费' : 'VIP' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="330"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            :disabled="+row.enableStatus !== 1"
            @click="openTopping(row)"
          >
            推广
          </el-button>
          <el-button
            type="text"
            :disabled="+row.enableStatus !== 1"
            @click="refresh(row)"
          >
            刷新
          </el-button>
          <!--TODO 移动端未实现推荐功能,推荐按钮隐藏-->
          <el-button
            type="text"
            :disabled="+row.enableStatus !== 1"
            @click="openPopHome(row)"
          >
            推荐
          </el-button>

          <el-button
            :disabled="+row.enableStatus === 1"
            type="text"
            @click="edit(row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            :disabled="+row.enableStatus === 1"
            @click="handleEdit(row)"
          >
            小节管理
          </el-button>
          <el-button
            type="text"
            @click=";+row.enableStatus === 1 ? offLine(row) : publish(row.id)"
          >
            {{ getStatus2(row.enableStatus) }}
          </el-button>
          <el-button
            :disabled="+row.enableStatus === 1"
            type="danger"
            @click="deleteItem(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      :layout="layout"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!--   推广设置弹窗 -->
    <topping-modal ref="toppingModal" @close="fetchData"></topping-modal>
    <!--    首页推荐-->
    <pop-home ref="popHomeModal" @close="fetchData"></pop-home>
  </el-card>
</template>

<script>
  import _ from 'lodash'
  import { doDelete } from '@/api/table'
  import {
    DeleteMediaAlbum,
    OffLineMediaAlbum,
    PublishMediaAlbum,
    QueryMediaAlbum,
    RefreshAlbum,
  } from '@/cms/api/mediaSetting'
  import ToppingModal from '@/cms/components/mediaManage/toppingModal'
  import PopHome from '@/cms/components/mediaManage/popHome'

  export default {
    name: 'CustomTable',
    components: { PopHome, ToppingModal },
    data() {
      return {
        times: [],
        options: [
          {
            value: 0,
            label: '未上架',
          },
          {
            value: 1,
            label: '已上架',
          },
          {
            value: 9,
            label: '已下架',
          },
        ],
        checkList: ['发布时间', '下线时间'],
        columns: [
          {
            order: 1,
            label: '小节数量',
            prop: 'itemCount',
            sortable: false,
          },
          {
            order: 2,
            label: '发布时间',
            prop: 'publishTime',
            width: 160,
            sortable: false,
          },
          {
            order: 3,
            label: '下线时间',
            width: 160,
            prop: 'offlineTime',
            sortable: false,
          },
          {
            order: 4,
            label: '刷新时间',
            prop: 'refreshTime',
            width: 160,
            sortable: false,
          },
          {
            order: 5,
            label: '播放量',
            prop: 'views',
            width: 70,
            sortable: false,
          },
          {
            order: 6,
            label: '评论数',
            prop: 'commentCount',
            width: 70,
            sortable: false,
          },
          {
            order: 7,
            label: '点赞数',
            prop: 'likes',
            width: 70,
            sortable: false,
          },
        ],
        list: [],
        imageList: [],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
        },
        type: 1,
      }
    },
    computed: {
      finallyColumns() {
        let finallyArray = []
        this.checkList.forEach((checkItem) => {
          finallyArray.push(
            this.columns.filter((item) => item.label === checkItem)[0]
          )
        })
        return _.sortBy(finallyArray, (item) => item.order)
      },
    },
    created() {
      this.type = this.$route.meta.type
      this.fetchData()
    },
    methods: {
      getTime(num) {
        let hour = Math.floor(num / 3600)
        let minuts = Math.floor((num % 3600) / 60)
        let second = Math.floor(num % 60)
        if (second.toString().length < 2) {
          second = '0' + second.toString()
        }
        if (minuts.toString().length < 2) {
          minuts = '0' + minuts.toString()
        }
        if (hour.toString().length < 2) {
          hour = '0' + hour.toString()
        }
        return `${hour}:${minuts}:${second}`
      },
      // 刷新推荐
      async refresh(row) {
        this.$baseConfirm('你确定要刷新这条数据吗', null, async () => {
          const { msg } = await RefreshAlbum({ id: row.id })
          this.$baseMessage(msg, 'success')
          await this.fetchData()
        })
      },
      // 打开推荐到首页设置窗口
      openPopHome(row) {
        this.$refs.popHomeModal.open(row)
      },
      // 打开推广设置窗口
      openTopping(row) {
        this.$refs.toppingModal.open(row)
      },
      getToppingStatus(status) {
        return +status === 0 ? '未推广' : +status === 1 ? '已推广' : '未推广'
      },
      getStatus(status) {
        return +status === 0 ? '未上架' : +status === 1 ? '已上架' : '已下架'
      },
      getStatus2(status) {
        return +status === 0 ? '上架' : +status === 1 ? '下架' : '上架'
      },
      edit(row) {
        this.$router.push({ name: 'addAlbum', query: row })
      },
      insert() {
        this.$router.push({ name: 'addAlbum', query: { type: this.type } })
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['addAlbum'].showEdit()
      },
      handleEdit(row) {
        this.$router.push({
          name: 'mediaSettingInsert',
          query: { id: row.id, type: row.type },
        })
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
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
        console.log(this.times)
        if (this.times.length === 2) {
          this.queryForm.publishTimeBegin = this.times[0] + ' 00:00:00'
          this.queryForm.publishTimeEnd = this.times[1] + ' 23:59:59'
        }
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        this.queryForm.type = this.type
        const { data } = await QueryMediaAlbum(this.queryForm)
        this.list = data.list
        this.total = data.page.totalNum
        this.listLoading = false
      },
      /**
       * 发布专辑
       */
      async publish(id) {
        await PublishMediaAlbum({ id })
        await this.fetchData()
      },
      /**
       * 下架专辑
       */
      async offLine(row) {
        if (+row.topStatus === 1) {
          this.$baseConfirm(
            `当前推广时间还剩余${this.getTime(row.topExpire)},确定要下架吗`,
            null,
            async () => {
              const { msg } = await OffLineMediaAlbum({ id: row.id })
              this.$baseMessage(msg, 'success')
              await this.fetchData()
            }
          )
        } else {
          await OffLineMediaAlbum({ id: row.id })
          await this.fetchData()
        }
      },
      /**
       * 删除专辑
       * @param id*
       */
      async deleteItem(id) {
        this.$baseConfirm('你确定要删除当前项专辑吗', null, async () => {
          const { msg } = await DeleteMediaAlbum({ id })
          this.$baseMessage(msg, 'success')
          await this.fetchData()
        })
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .custom-table-container {
    ::v-deep {
      i {
        cursor: pointer;
      }
    }
  }
</style>
<style lang="scss">
  .custom-table-checkbox {
    .el-checkbox {
      display: block !important;
      margin: 0 0 $base-padding/4 0;
    }
  }
</style>
