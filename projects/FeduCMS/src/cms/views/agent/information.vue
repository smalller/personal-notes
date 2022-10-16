<template>
  <div class="information-wrap">
    <div class="top-data-box">
      <ul>
        <li v-for="(item, index) in topDataList" :key="index">
          <div class="left-box">
            <span class="num">{{ item.num }}</span>
            <span class="name">{{ item.name }}</span>
          </div>
          <div class="right-box">
            <img :src="item.img" alt="" />
          </div>
        </li>
        <li class="chart-data">
          <div class="left-chart">
            <canvas id="graph-canvas" width="160" height="160"></canvas>
          </div>
          <div class="right-data">
            <p>入驻App统计</p>
            <div class="data-box">
              <div class="top">
                <span class="diam"></span>
                <span class="data">已入驻 {{ settleNum }} 人</span>
              </div>
              <div class="botom">
                <span class="diam"></span>
                <span class="data">未入驻 {{ notSettleNum }} 人</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="information common">
      <el-dialog :visible="isEdit" @close=";(isEdit = false), list()">
        <edit
          ref="dialog"
          :city-list="provinceList"
          @close=";(isEdit = false), list()"
        ></edit>
      </el-dialog>
      <div v-if="!isEdit">
        <el-form
          ref="form"
          class="form-box"
          :inline="true"
          @submit.native.prevent
        >
          <div class="left-box">
            <el-form-item label="园所ID">
              <el-input v-model="params.id" placeholder="输入园所ID"></el-input>
            </el-form-item>
            <el-form-item label="园所">
              <el-input
                v-model="params.name"
                placeholder="输入园所名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input
                v-model="params.name"
                placeholder="输入联系人姓名"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                icon="el-icon-search"
                native-type="submit"
                type="primary"
                plain
                @click="search()"
              >
                查询
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </div>
          <div class="right-box">
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="isEdit = true"
            >
              新增园所
            </el-button>
          </div>
        </el-form>
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          border
          :data="tableList"
        >
          <el-table-column
            align="left"
            label="园所ID"
            prop="id"
          ></el-table-column>
          <el-table-column align="left" label="园所名称">
            <template #default="{ row }">
              <el-button type="text" @click="openDrawer(row)">
                {{ row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="班级数"
            prop="abutment"
          ></el-table-column>
          <el-table-column
            align="center"
            label="职工数"
            prop="abutment"
          ></el-table-column>
          <el-table-column
            align="center"
            label="学生数"
            prop="abutment"
          ></el-table-column>
          <el-table-column
            align="center"
            label="监控数"
            prop="abutment"
          ></el-table-column>
          <el-table-column
            align="left"
            label="入驻APP数"
            prop="abutment"
          ></el-table-column>
          <el-table-column align="center" label="未入驻APP数">
            <template #default="{ row }">
              <span style="color: #fc6392">{{ row.abutment }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="会员数"
            prop="abutment"
          ></el-table-column>
          <el-table-column
            align="center"
            label="对接人"
            prop="abutment"
          ></el-table-column>
          <el-table-column
            align="center"
            label="联系人"
            prop="contactName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="联系电话"
            prop="contactMobile"
          ></el-table-column>
          <el-table-column
            align="left"
            label="所在地区"
            prop="address"
          ></el-table-column>
          <el-table-column
            align="center"
            label="开通截止时间"
            prop="beginDate"
          ></el-table-column>
          <el-table-column align="center" label="开启状态" prop="usageAmount">
            <template #default="{ row }">
              <el-switch
                v-model="row.forbid"
                active-color="#1890FF"
                inactive-color="#DCDFE6"
                active-value="1"
                inactive-value="0"
                @change="control(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="edit(row)">编辑</el-button>
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
        <drawer ref="drawer"></drawer>
      </div>
    </div>
  </div>
</template>
<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import edit from '@/cms/views/agent/components/informationEdit'
  import { SCHOOLLIST, handleSchool, query8id } from '@/cms/api/information'
  import schoolIdMixin from '@/cms/mixins/schoolIdMixin'
  import { CircularChat } from '@/cms/common/circularChat'
  import drawer from '@/cms/components/information/drawer.vue'

  let vm
  export default {
    components: { edit, drawer },
    mixins: [tableMixin, schoolIdMixin],
    data() {
      return {
        provinceList: [],
        topDataList: [
          {
            num: 0,
            name: '园所总数',
            img: require('../../assets/school-list/top-data1.png'),
          },
          {
            num: 0,
            name: '幼儿总数',
            img: require('../../assets/school-list/top-data2.png'),
          },
          {
            num: 0,
            name: '职工总数',
            img: require('../../assets/school-list/top-data3.png'),
          },
          {
            num: 0,
            name: '监控总数',
            img: require('../../assets/school-list/top-data4.png'),
          },
          {
            num: 0,
            name: '会员总数',
            img: require('../../assets/school-list/top-data5.png'),
          },
        ],
        settleNum: 0,
        notSettleNum: 0,
        settlePercent: 0,
      }
    },
    mounted() {
      vm = this
      vm.params.agentCompanyId = this.$cookie.get(`${firmId}_company_id`)
      delete vm.params.schoolId
      vm.list(SCHOOLLIST)
      this.query8id()
    },
    methods: {
      async query8id() {
        const mobile = sessionStorage.getItem('mobile')
        const { code, data } = await query8id(mobile)
        if (+code === 0) {
          this.topDataList[0].num = data.schoolNum || 0
          this.topDataList[1].num = data.stuNum || 0
          this.topDataList[2].num = data.empNum || 0
          this.topDataList[3].num = data.cameraNum || 0
          this.settleNum = data.settleNum || 0
          this.notSettleNum = +data.stuNum - +data.settleNum
          this.settlePercent = +data.settleNum / +data.stuNum

          const graphCanvas = document.getElementById('graph-canvas')
          new CircularChat({
            drawingElem: graphCanvas,
            percent: this.settlePercent,
            forecolor: '#4FA8F9',
            bgcolor: '#FC6392',
            lineWidth: 16,
            fontSize: 32,
          })
        }
      },

      // 查看学校详情
      openDrawer(row) {
        this.$refs.drawer.handleOpen(row)
      },
      //创建
      edit(val) {
        vm.isEdit = true
        vm.$nextTick(() => {
          vm.$refs['dialog'].init(val)
        })
      },
      //启用禁用
      control(row) {
        const { id, forbid } = row
        handleSchool(id, id, forbid).then((res) => {
          if (+res.code === 0) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //查看摄像头
      lookCamera(val) {
        let { id, name } = val
        console.log(id)
        this.$router.push({ path: '/camera', query: { schoolId: id, name } })
      },
    },
  }
</script>
<style lang="scss">
  .information-wrap {
    .el-form--inline .el-form-item {
      margin-right: 14px;
    }
    .el-form-item__label {
      padding-right: 6px;
    }
    .top-data-box {
      padding-bottom: 20px;
      background-color: #f6f8f9;
      > ul {
        display: flex;
        justify-content: space-between;
        overflow-x: auto;
        > li {
          min-width: 252px;
          height: 140px;
          background: #ffffff;
          border: 1px solid #ebeef5;
          border-radius: 2px;
          // margin-right: 20px;
          margin-right: 18px;
          display: flex;
          justify-content: space-between;
          padding: 38px 0;
          box-sizing: border-box;
          &:last-child {
            margin-right: 0;
          }
          .left-box {
            margin-left: 30px;
            display: flex;
            flex-direction: column;
            .num {
              font-size: 32px;
              font-weight: 500;
              color: #1890ff;
            }
            .name {
              font-size: 14px;
              color: #1e1e1e;
            }
          }
          .right-box {
            width: 64px;
            height: 64px;
            margin-right: 20px;
            > img {
              width: 64px;
              height: 64px;
            }
          }
          &.chart-data {
            padding: 30px 0 0 23px;
            justify-content: flex-start;
            .left-chart {
              width: 80px;
              height: 80px;
              margin-right: 16px;
              #graph-canvas {
                width: 80px;
                height: 80px;
              }
            }
            .right-data {
              > p {
                margin-top: 5px;
                margin-bottom: 12px;
                font-size: 14px;
              }
              .data-box {
                font-size: 12px;
                .diam {
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  border-radius: 2px;
                  margin-right: 6px;
                }
                .top {
                  margin-bottom: 8px;
                  .diam {
                    background: #4fa8f9;
                  }
                }
                .botom {
                  .diam {
                    background: #fc6392;
                  }
                }
              }
            }
          }
        }
      }
    }
    .form-box {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
