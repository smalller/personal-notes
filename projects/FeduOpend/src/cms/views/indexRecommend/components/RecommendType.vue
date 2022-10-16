<script>
  export default {
    name: 'RecommendType',

    data() {
      return {
        recommendType: [
          {
            label: '视频专辑',
            value: 1,
          },
          {
            label: '音频专辑',
            value: 2,
          },
          {
            label: '新闻内容',
            value: 3,
          },
        ],
        choosedRecommend: 1,
      }
    },

    methods: {
      // 切换推荐类型
      changeRecommend(value) {
        this.choosedRecommend = value
        this.$emit('changeRecommend', value)
      },
    },

    render() {
      return (
        <div class="recommend-type">
          {this.recommendType.map((item) => {
            return (
              <el-button
                type={this.choosedRecommend === item.value ? 'primary' : ''}
                on-click={() => this.changeRecommend(item.value)}
              >
                {item.label}
              </el-button>
            )
          })}
        </div>
      )
    },
  }
</script>

<style lang="scss" scoped>
  .recommend-type {
    margin-bottom: 20px;
  }
</style>
