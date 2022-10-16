<template>
  <div>
    <el-form ref="form" :inline="true" @submit.native.prevent>
      <el-form-item label="班级">
        <el-select v-model="params.class" placeholder="全部">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="+currentType !== 4">
        <el-input
          v-model="params.name"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          native-type="submit"
          type="primary"
          plain
          @click="search"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <videoList v-if="+currentType === 4"></videoList>
    <el-table
      v-else
      ref="tableSort"
      v-loading="listLoading"
      border
      :data="tableList"
    >
      <template v-if="+currentType === 1 || +currentType === 2">
        <el-table-column label="幼儿姓名" prop=""></el-table-column>
        <el-table-column label="家长电话">
          <template #default="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
      </template>
      <template v-if="+currentType === 1">
        <el-table-column label="性别" prop=""></el-table-column>
        <el-table-column label="出生年月" prop=""></el-table-column>
        <el-table-column label="所属班级" prop=""></el-table-column>
      </template>
      <template v-if="+currentType === 2">
        <el-table-column label="幼儿及班级" prop=""></el-table-column>
        <el-table-column label="开通会员" prop=""></el-table-column>
      </template>
      <template v-if="+currentType === 3">
        <el-table-column label="老师姓名" prop=""></el-table-column>
        <el-table-column label="手机号" prop=""></el-table-column>
        <el-table-column label="称谓" prop=""></el-table-column>
        <el-table-column label="所属班级" prop=""></el-table-column>
      </template>
      <el-table-column label="入驻App" prop=""></el-table-column>
      <el-table-column label="入园时间" prop=""></el-table-column>
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
  import tableMixin from '@/cms/mixins/informationMixin'
  import videoList from './videoList.vue'
  export default {
    components: {
      videoList,
    },
    mixins: [tableMixin],
    props: {
      currentType: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        options: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '一班',
            value: 1,
          },
          {
            label: '二班',
            value: 2,
          },
          {
            label: '三班',
            value: 3,
          },
        ],
        a: '',
      }
    },
    watch: {
      currentType: {
        handler() {
          this.reset()
        },
        deep: true,
      },
    },
    created() {
      this.list('/schools/api/school/query')
    },
    methods: {},
  }
</script>

<style></style>
