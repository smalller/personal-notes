<template>
  <el-dialog title="推荐历史" :visible.sync="dialogVisible" width="50%">
    <div class="top-info">
      <p>
        <span>专辑封面：</span>
        <el-image
          style="width: 200px; height: 100px; border-radius: 5px"
          src="https://yjbfiles.oss-cn-shenzhen.aliyuncs.com/22g/wS/22gA22IxXPUSjYvTY3oEwS.jpg?w=450&h=287"
          :preview-src-list="[
            'https://yjbfiles.oss-cn-shenzhen.aliyuncs.com/22g/wS/22gA22IxXPUSjYvTY3oEwS.jpg?w=450&h=287',
          ]"
        ></el-image>
      </p>
      <p>
        <span>专辑名称：</span>
        <span>汪汪队坐大牢</span>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'RecommendHistory',

    data() {
      return {
        dialogVisible: false,
      }
    },

    methods: {
      openDialog(row) {
        console.log(row)
        this.dialogVisible = true
      },
    },
  }
</script>

<style lang="scss" scoped>
  .top-info {
    > p {
      display: flex;
      margin-bottom: 20px;
    }
  }
</style>
