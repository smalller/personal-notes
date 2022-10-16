<template>
  <div>
    <add-video
      v-if="isEdit"
      ref="addVideo"
      @cancel="isEdit = false"
    ></add-video>
    <Layout v-else>
      <template #search>
        <search-filter @search="search" @reset="reset"></search-filter>
      </template>
      <template #btn>
        <el-button type="primary" @click="addVideo">发布视频</el-button>
      </template>
      <template #table>
        <Table :colums="colums" :data="tableList"></Table>
      </template>
    </Layout>
  </div>
</template>

<script>
  import Layout from '@/cms/components/Layout'
  import SearchFilter from './components/SearchFilter'
  import Table from '@/cms/components/table'
  import tableMinix from '@/cms/mixins/tableMixin'
  import AddVideo from './components/AddVideo'
  export default {
    components: {
      Layout,
      SearchFilter,
      Table,
      AddVideo,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableList: [
          {
            a: 100,
          },
        ],
      }
    },
    computed: {
      colums() {
        return [
          {
            type: 'selection',
            width: 55,
          },
          {
            prop: 'a',
            label: '标题',
            align: 'center',
          },
          {
            prop: 'b',
            label: '发布人',
            align: 'center',
          },
          {
            prop: 'c',
            label: '发布时间',
            align: 'center',
          },
          {
            prop: 'd',
            label: '下线时间',
            align: 'center',
          },
          {
            prop: 'e',
            label: '作者',
            align: 'center',
          },
          {
            prop: 'f',
            label: '状态',
            align: 'center',
          },
          {
            prop: 'g',
            label: '来源',
            align: 'center',
          },
          {
            prop: 'h',
            label: '点赞数',
            align: 'center',
          },
          {
            prop: 'i',
            label: '浏览数',
            align: 'center',
          },
          {
            prop: 'j',
            label: '热度',
            align: 'center',
          },
          {
            label: '操作',
            align: 'center',
            width: 150,
            scopedSlots: {
              default: (scope) => {
                let { edit } = this
                return (
                  <div>
                    <el-button type="text" on-click={() => edit(scope.row)}>
                      编辑
                    </el-button>
                    <el-button type="text">删除</el-button>
                    <el-button type="text">下线/上线</el-button>
                  </div>
                )
              },
            },
          },
        ]
      },
    },
    methods: {
      addVideo() {
        this.isEdit = true
      },
      edit(row) {
        this.isEdit = true
        this.$nextTick(() => {
          this.$refs.addVideo.init(row)
        })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
