<template>
  <!-- 园所管理 -->
  <div class="information common">
    <editBox v-if="isEdit" ref="editBox"></editBox>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="isEdit = true">新增</el-button>
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
          label="场景名称"
          prop="scene"
        ></el-table-column>
        <el-table-column
          align="left"
          label="创建时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column align="left" label="操作" prop="action">
          <template #default="{ row }">
            <el-button
              v-show="row.enableStatus === 1"
              type="text"
              @click="closeSences(row.id)"
            >
              禁用
            </el-button>
            <el-button
              v-show="row.enableStatus === 9"
              type="text"
              @click="openSences(row.id)"
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
  </div>
</template>
<script>
  import editBox from './components/sceneEdit.vue'
  import tableMixin from '@/cms/mixins/tableMixin'
  import { openScene, disableScene } from '@/cms/api/scene'
  import { CAMERALIST, cameraDelete } from '@/cms/api/camera'
  let vm
  export default {
    name: 'Camera',
    components: {
      editBox,
    },
    mixins: [tableMixin],
    data() {
      return {
        isEdit: false,
        sc: '', //学校id
        name: '', //学校名字
        schoolId: sessionStorage.getItem('zdyjb_schoolId'),
      }
    },
    computed: {},
    created() {},
    mounted() {
      vm = this
      vm.list('/schools/api/scene/query')
    },
    methods: {
      closeSences(data) {
        console.log(data)
        if (data) {
          disableScene(this.schoolId, data).then((res) => {
            if (+res.code === 0) {
              this.$message.success('场景禁用成功!')
              this.list()
            }
          })
        }
      },
      openSences(data) {
        if (data) {
          openScene(this.schoolId, data).then((res) => {
            if (+res.code === 0) {
              this.$message.success('场景启用成功!')
              this.list()
            }
          })
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .title {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    margin-left: 10px;
  }
</style>
