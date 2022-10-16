<template>
  <!-- 园所管理 -->
  <div class="information common">
    <edit
      v-if="isEdit"
      ref="dialog"
      :city-list="provinceList"
      @close=";(isEdit = false), list()"
    ></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="圆所名称">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="圆所ID">
          <el-input v-model="params.id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            native-type="submit"
            type="primary"
            @click="search()"
          >
            查询
          </el-button>
          <el-button type="primary" @click="isEdit = true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="tableList"
      >
        <el-table-column
          align="left"
          label="圆所ID"
          prop="id"
        ></el-table-column>
        <el-table-column
          align="center"
          label="圆所名称"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="联系人"
          prop="contactName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="联系方式"
          prop="contactMobile"
        ></el-table-column>
        <el-table-column
          align="center"
          label="所在区域"
          prop="address"
        ></el-table-column>
        <el-table-column align="center" label="状态" prop="usageAmount">
          <template #default="{ row }">
            <el-button
              type="text"
              :style="{ color: +row.forbid === 1 ? '#999999' : '' }"
            >
              {{ +row.forbid === 0 ? '使用中' : '已禁用' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="开通时间"
          prop="beginDate"
        ></el-table-column>
        <el-table-column align="right" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="edit(row)">编辑</el-button>
            <el-button
              type="text"
              :style="{ color: +row.forbid === 1 ? '' : '#999999' }"
              @click="control(row)"
            >
              {{ +row.forbid === 1 ? '开启' : '禁用' }}
            </el-button>
            <!--            <el-button type="primary" @click="lookCamera(row)">-->
            <!--              查看摄像头-->
            <!--            </el-button>-->
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
  </div>
</template>
<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import edit from '@/cms/views/agent/components/informationEdit'
  import { SCHOOLLIST, handleSchool } from '@/cms/api/information'
  import schoolIdMixin from '@/cms/mixins/schoolIdMixin'
  let vm
  export default {
    components: { edit },
    mixins: [tableMixin, schoolIdMixin],
    data() {
      return {
        provinceList: [],
      }
    },
    computed: {},
    created() {},
    mounted() {
      vm = this
      vm.list(SCHOOLLIST)
    },
    methods: {
      //创建
      edit(val) {
        vm.isEdit = true
        vm.$nextTick(() => {
          vm.$refs['dialog'].init(val)
        })
      },
      //启用禁用
      control(row) {
        let msg = +row.forbid === 0 ? '是否确定禁用' : '是否确定开启'
        let s = +row.forbid === 1 ? 0 : 1
        let id = row.id
        vm.$baseConfirm(msg, null, () => {
          handleSchool(id, vm.school, s).then((res) => {
            if (+res.code === 0) {
              vm.$message.success(res.msg || '操作成功')
              row.forbid = s
            } else {
              vm.$message.warning(res.msg || '接口错误')
            }
          })
        })
      },
      //查看摄像头
      lookCamera(val) {
        let { id, name } = val
        this.$router.push({ path: '/camera', query: { schoolId: id, name } })
      },
    },
  }
</script>
<style lang="scss" scoped></style>
