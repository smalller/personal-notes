<template>
  <el-card class="media-insert">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          添加小节
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      @selection-change="setSelectRows"
    >
      <el-table-column align="left" prop="name"></el-table-column>
      <el-table-column align="left" prop="name" width="155">
        <template #default="{ row }">
          <el-radio-group v-model="row.isFree" @change="changeFreeStatus(row)">
            <el-radio-button :label="true">免费</el-radio-button>
            <el-radio-button :label="false">收费</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="85"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="deleteItem(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card>
      <el-button type="primary" @click="online">保存并上线</el-button>
      <el-button style="margin-left: 50px" @click="back">取消</el-button>
    </el-card>
    <media-insert ref="insert" @close="handleQuery"></media-insert>
  </el-card>
</template>

<script>
  import { doDelete, getList } from '@/api/table'
  import MediaInsert from '@/cms/views/mediaSetting/insert'
  import {
    DeleteMediaAlbumItem,
    EditMediaAlbumItem,
    PublishMediaAlbum,
    QueryMediaAlbumItem,
  } from '@/cms/api/mediaSetting'

  export default {
    name: 'CustomTable',
    components: {
      MediaInsert,
    },
    data() {
      return {
        options: [
          {
            value: '1',
            label: '2',
          },
        ],
        columns: [
          {
            order: 1,
            label: '系列名称',
            width: '95',
            prop: 'name',
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
          title: '',
        },
        type: 1,
      }
    },
    computed: {},
    created() {
      this.type = this.$route.query.type
      this.fetchData()
    },
    beforeDestroy() {
      this.back()
    },
    methods: {
      // 修改小节收费状态
      async changeFreeStatus(row) {
        await EditMediaAlbumItem({
          mediaAlbumId: row.mediaAlbumId,
          id: row.id,
          isFree: row.isFree,
        })
        await this.fetchData()
      },
      back() {
        this.$router.push({
          name: this.type === 1 ? 'videoSettings' : 'audioSettings',
        })
      },
      online() {
        if (this.list.length > 0) {
          PublishMediaAlbum({
            id: this.$route.query.id,
          }).then(() => {
            this.back()
          })
        }
      },
      insert() {
        this.$router.push({ name: 'mediaSettingInsert' })
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['insert'].showEdit(
          {
            mediaAlbumId: this.$route.query.id,
            type: this.type,
          },
          'add'
        )
      },
      handleEdit(row) {
        row.mediaAlbumId = this.$route.query.id
        row.type = this.type
        this.$refs['insert'].showEdit(row, 'edit')
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
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        this.queryForm.id = this.$route.query.id
        const { data } = await QueryMediaAlbumItem(this.queryForm)
        // console.log(data)
        // const { data, totalCount } = await getList(this.queryForm)
        this.list = data
        this.listLoading = false
      },
      async deleteItem(id) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const { msg } = await DeleteMediaAlbumItem({ id })
          this.$baseMessage(msg, 'success')
          await this.fetchData()
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
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
