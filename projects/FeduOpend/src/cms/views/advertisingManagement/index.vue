<template>
  <div class="advertisingManagement">
    <div class="head">
      <el-form
        :model="queryForm"
        inline
        label-position="left"
        label-width="70px"
      >
        <div>
          <el-form-item label="模块">
            <el-select v-model="queryForm.module" @change="moduleChange">
              <el-option value="" label="全部"></el-option>
              <el-option
                v-for="item in moduleList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域">
            <el-select v-model="queryForm.area">
              <el-option value="" label="全部"></el-option>
              <el-option
                v-for="item in areaList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容名称">
            <el-input v-model="queryForm.relDataName"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="list">
        <el-table-column label="模块" prop="module"></el-table-column>
        <el-table-column label="区域" prop="area"></el-table-column>
        <el-table-column label="上架时间" prop="createTime"></el-table-column>
        <el-table-column label="类型" prop="typeName">
          <template #default="{ row }">
            <span>{{ row.dataType.describe }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容名称" prop="relDataName"></el-table-column>
        <el-table-column label="内容ID" prop="relDataId"></el-table-column>
        <el-table-column label="权重" prop="weight"></el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.upStatus ? 'success' : ''">
              {{ row.upStatus ? '已上架' : '未上架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <!--            <el-button-->
            <!--              type="primary-text"-->
            <!--              style="margin-right: 20px"-->
            <!--              @click="openEdit(row)"-->
            <!--            >-->
            <!--              编辑-->
            <!--            </el-button>-->
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除这个的广告吗？"
              @confirm="deleteAds(row)"
            >
              <el-button
                slot="reference"
                style="margin-right: 10px"
                type="danger"
              >
                删除
              </el-button>
            </el-popconfirm>
            <el-button
              :type="row.upStatus ? 'danger' : 'primary'"
              @click="upOrDownAds(row.id, row.upStatus)"
            >
              {{ row.upStatus ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :current-page="+pageForm.pageNo"
      :layout="'total, sizes, prev, pager, next, jumper'"
      :page-size="+pageForm.pageSize"
      :total="+pageForm.totalNum"
      background
      @current-change="pageChange"
      @size-change="sizeChange"
    ></el-pagination>
    <!--    <edit-popup ref="editPopup"></edit-popup>-->
  </div>
</template>

<script>
  import {
    ChangeAdsStatus,
    DeleteAds,
    GetAdsPosList,
    GetdataType,
    QueryAllModule,
    QueryAreaByModule,
  } from '@/cms/api/advertisement'
  export default {
    name: 'AdvertisingManagement',
    components: {},
    data() {
      return {
        queryForm: {
          module: '',
          area: '',
          relDataName: '',
        },
        list: [],
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          totalNum: 0,
        },
        moduleList: [],
        areaList: [],
      }
    },
    created() {
      this.getList()
      this.getCondition()
    },
    methods: {
      areaChange() {},
      // openEdit(row) {
      //   this.$refs.editPopup.init('edit', row)
      // },
      computeAds(adsList, typeList) {
        this.list = adsList.map((item) => {
          const data = typeList.find((type) => type.name === item.dataType)
          item.typeName = data.describe || ''
          return item
        })
      },
      deleteAds(row) {
        DeleteAds([row.id]).then((res) => {
          if (+res.code === 0) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      getCondition() {
        QueryAllModule().then((res) => {
          if (+res.code === 0) {
            this.moduleList = res.data
          }
        })
      },
      getList() {
        this.queryForm = Object.assign(this.queryForm, this.pageForm)
        // Promise.all([GetAdsPosList(this.queryForm), GetdataType()]).then(
        //   (res) => {
        //     this.pageForm = res[0].data.page
        //     this.computeAds(res[0].data.list, res[1].data)
        //   }
        // )
        GetAdsPosList(this.queryForm).then((res) => {
          if (+res.code === 0) {
            this.list = res.data.list
            this.pageForm = res.data.page
          }
        })
      },
      moduleChange() {
        this.queryForm.area = ''
        this.queryArea()
      },
      pageChange() {
        this.getList()
      },
      queryArea() {
        QueryAreaByModule({
          module: this.queryForm.module,
        }).then((res) => {
          if (+res.code === 0) {
            this.areaList = res.data
          }
        })
      },
      reset() {
        this.queryForm = {
          module: '',
          area: '',
          relDataName: '',
        }
        this.getList()
      },
      sizeChange() {
        this.getList()
      },
      upOrDownAds(id, status) {
        ChangeAdsStatus({
          adsId: id,
          status: +!status,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success('修改广告状态成功')
            this.getList()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .advertisingManagement {
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
