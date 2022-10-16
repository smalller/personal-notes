<template>
  <div class="advertisingPosition">
    <div class="head">
      <el-button type="primary" @click="add">新增配置</el-button>
    </div>
    <div class="content">
      <el-table :data="list">
        <el-table-column label="模块" prop="module"></el-table-column>
        <el-table-column label="区域" prop="area"></el-table-column>
        <el-table-column label="广告数量" prop="adsCount"></el-table-column>
        <el-table-column label="图片尺寸">
          <template #default="{ row }">
            {{ row.width + '+' + row.height }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template #default="{ row }">
            <el-button
              style="margin-right: 10px"
              type="primary"
              @click="addAds(row)"
            >
              新增广告
            </el-button>
            <el-button style="margin-right: 10px" @click="edit(row)">
              编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除这个配置吗？"
              @confirm="deleteConfig(row)"
            >
              <el-button slot="reference" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <position-popup ref="positionPopup" @close="getList"></position-popup>
    <!--    <el-pagination-->
    <!--      :current-page="+pageForm.pageNo"-->
    <!--      :layout="'total, sizes, prev, pager, next, jumper'"-->
    <!--      :page-size="+pageForm.pageSize"-->
    <!--      :total="+pageForm.totalNum"-->
    <!--      background-->
    <!--      @current-change="pageChange"-->
    <!--      @size-change="sizeChange"-->
    <!--    ></el-pagination>-->
    <edit-popup ref="editPopup"></edit-popup>
  </div>
</template>

<script>
  import PositionPopup from './components/positionPopup.vue'
  import {
    DeleteAdsPosConfig,
    GetAdsPosConfigList,
    GetdataType,
  } from '@/cms/api/advertisement'
  import EditPopup from './components/editPopup'
  export default {
    name: 'AdvertisingPosition',
    components: { EditPopup, PositionPopup },
    data() {
      return {
        queryForm: {},
        pageForm: {
          pageNo: 1,
          pageSize: 999,
          totalNum: 0,
        },
        list: [],
        moduleList: [],
        typeList: [],
      }
    },
    created() {
      this.getList()
      this.getCondition()
    },
    methods: {
      getList() {
        this.queryForm = Object.assign(this.queryForm, this.pageForm)
        GetAdsPosConfigList(this.queryForm).then((res) => {
          if (+res.code === 0) {
            this.list = res.data.list
            this.pageForm = res.data.page
          }
        })
      },
      add() {
        this.$refs.positionPopup.init()
      },
      edit(row) {
        this.$refs.positionPopup.init(row)
      },
      //添加广告
      addAds(config) {
        config.typeName = config.hotspotDataType.map(
          (item) => {
            const data = this.typeList.find((type) => type.name === item)
            return data.describe || ''
          }
          //     this.typeList.find((type) => type.name === item)?.describe || ''
        )
        config.types = config.hotspotDataType.map(
          (item) => this.typeList.find((type) => type.name === item) || {}
        )

        this.$refs.editPopup.init('add', config)
      },
      deleteConfig(row) {
        DeleteAdsPosConfig([row.id]).then((res) => {
          if (+res.code === 0) {
            this.getList()
            this.$message.success('删除成功')
          }
        })
      },
      getCondition() {
        GetdataType().then((res) => {
          if (+res.code === 0) {
            this.typeList = res.data
          }
        })
      },
      pageChange() {
        this.getList()
      },
      sizeChange() {
        this.getList()
      },
    },
  }
</script>

<style scoped lang="scss">
  .advertisingPosition {
    > div {
      box-sizing: border-box;
      padding: 30px 30px 0;
    }
    .head {
    }
    .content {
    }
  }
</style>
