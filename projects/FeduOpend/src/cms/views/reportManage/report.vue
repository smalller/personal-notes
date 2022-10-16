<template>
  <div class="report">
    <div class="head">
      <el-form
        :model="queryForm"
        inline
        label-position="left"
        label-width="70px"
      >
        <div>
          <el-form-item label="状态">
            <el-select v-model="queryForm.status" @change="moduleChange">
              <el-option
                v-for="item in reportList"
                :key="item"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="list">
        <el-table-column label="终端">
          <template #default="{ row }">
            <span>{{ +row.plat === 1 ? '家长端' : '园丁端' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模块" width="160" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{
                  row.hotspotDataType ? row.hotspotDataType.describe : '未知'
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="举报用户" prop="createUser"></el-table-column>
        <el-table-column label="举报类型" prop="type"></el-table-column>
        <el-table-column label="举报时间" prop="createTime"></el-table-column>
        <el-table-column label="处理状态">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === 1 ? 'success' : row.status === 2 ? 'danger' : ''
              "
            >
              {{
                row.status === 1 ? '通过' : row.status === 2 ? '驳回' : '审核中'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理结果">
          <template #default="{ row }">
            <div>
              <span>
                {{ row.reason ? row.reason : '暂无' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-button type="primary" @click="showReport(row)">
              举报详情
            </el-button>
            <el-button type="primary" @click="show(row)">查看内容</el-button>
            <el-button type="primary" @click="showHand(row)">处理</el-button>
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
    <el-dialog title="举报详情" :visible.sync="showInfo" width="20%" center>
      <div class="content-info">
        <div class="info">
          <span>举报问题:</span>
          <p>{{ selectInfo.type }}</p>
        </div>
        <div class="info">
          <span>文章链接:</span>
          <a
            style="margin-left: 10px; margin-top: -15px"
            :href="selectInfo.url"
          >
            <h4>查看链接</h4>
          </a>
        </div>
        <div style="margin: 10px">
          <span>举报内容:</span>
        </div>
        <div style="margin: 10px">{{ selectInfo.content }}</div>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="showInfo = false">
          {{
            selectInfo.status === 0
              ? '未处理'
              : selectInfo.status === 1
              ? '已处理'
              : '已驳回'
          }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="举报详情" :visible.sync="showAction" width="20%">
      <div class="content-info">
        <div class="info">
          <span>终端:</span>
          <p>APP</p>
        </div>
        <div class="info">
          <span>用户:</span>
          <p>1231231321223</p>
        </div>
        <div class="info">
          <span>时间:</span>
          <p>{{ selectInfo.createTime }}</p>
        </div>
        <div class="info">
          <span>举报问题:</span>
          <p>{{ selectInfo.type }}</p>
        </div>
        <!-- <div style="margin: 10px">
          <span>举报内容:</span>
        </div> -->
        <div style="margin: 10px">{{ selectInfo.content }}</div>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button
          type="danger"
          style="margin-right: 60px"
          @click="sendReport('0')"
        >
          违规内容
        </el-button>
        <el-button type="success" @click="sendReport('1')">正常内容</el-button>
      </div>
    </el-dialog>
    <el-dialog width="390px" class="phone-show" :visible.sync="showDetail">
      <phone-show v-if="showDetail" :preview-url="previewUrl"></phone-show>
    </el-dialog>
  </div>
</template>

<script>
  import { GetReportList, SendReport } from '@/cms/api/school'
  import { REPORT_LIST } from '@/cms/constants'
  import phoneShow from '.././activityManage/compoents/phoneShow.vue'

  export default {
    name: 'AdvertisingManagement',
    components: { phoneShow },
    data() {
      return {
        queryForm: {
          status: '',
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
        showInfo: false,
        selectInfo: {},
        showAction: false,
        reportList: REPORT_LIST,
        showDetail: false,
        previewUrl: '',
      }
    },
    created() {
      this.getList()
    },
    methods: {
      show(row) {
        if (row.url) {
          this.showDetail = true
          this.previewUrl = row.url
        } else {
          this.$message({
            message: '暂无预览信息',
            type: 'warning',
          })
        }
      },

      //处理翻页
      pageChange(val) {
        this.pageForm.pageNo = val
        this.getList()
      },
      //每页条数改变
      sizeChange(val) {
        this.pageForm.pageSize = val
        this.getList()
      },
      //获取列表数据
      getList() {
        let query = { ...this.queryForm, ...this.pageForm }
        GetReportList(query).then((res) => {
          if (+res.code === 0) {
            console.log(res)
            this.list = res.data.list
            this.pageForm = res.data.page
          }
        })
      },
      //提交处理信息
      sendReport(data) {
        let status = 0
        if (this.selectInfo) {
          status = +data === 0 ? 1 : 2
          let params = {
            content: this.selectInfo.content,
            hotspotDataType: this.selectInfo.hotspotDataType.describe,
            id: this.selectInfo.id,
            reason: +data === 0 ? '违规内容' : '正常内容',
            sourceId: this.selectInfo.sourceId,
            status: status,
            type: this.selectInfo.type,
          }
          SendReport(params).then((res) => {
            if (+res.code === 0) {
              console.log(res)
              this.$message({
                type: 'success',
                message: '提交成功!',
              })
              this.showAction = false
              this.getList()
            }
          })
        }
      },
      showReport(data) {
        this.selectInfo = { ...data }
        this.showInfo = true
      },
      showHand(data) {
        if (data) {
          this.selectInfo = { ...data }
          this.showAction = true
        }
      },
      reset() {
        this.queryForm = {
          module: '',
          area: '',
          relDataName: '',
        }
        this.getList()
      },
      moduleChange() {
        this.queryForm.area = ''
        this.queryArea()
      },
    },
  }
</script>

<style scoped lang="scss">
  .phone-show {
    // border-radius: 20px;

    .el-dialog {
      border-radius: 20px !important;
    }
  }
  .report {
    > div {
      box-sizing: border-box;
      // padding: 30px 30px 0;
    }
    .content-info {
      width: 100%;
      height: 400px;
      background-color: #eee;
      padding-top: 10px;
      span {
        font-size: 16px;
        font-weight: 600;
      }
      p {
        font-size: 16px;
        font-weight: 600;
        margin-left: 15px;
        text-align: left;
        width: 60%;
      }
    }
    .info {
      background: #ffffff;
      width: 95%;
      display: flex;
      height: 35px;
      padding: 5px;
      margin: auto;
      border-bottom: 1px solid #eeeeee;
    }
  }
</style>
