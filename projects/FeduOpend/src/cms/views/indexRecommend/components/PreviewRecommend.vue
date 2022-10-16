<template>
  <div class="preview-box">
    <el-dialog :visible.sync="dialogVisible" @close="handleClose">
      <PhoneShow :preview-url="previewUrl" />
    </el-dialog>
  </div>
</template>

<script>
  import PhoneShow from '@/cms/views/activityManage/compoents/phoneShow.vue'
  import { sourceIdToMediaDetail } from '@/cms/api/indexRecommend'

  export default {
    name: 'PreviewRecommend',

    components: {
      PhoneShow,
    },

    inject: ['indexParent'],

    data() {
      return {
        dialogVisible: false,
        previewUrl: '',
      }
    },

    methods: {
      // 关闭弹窗
      handleClose() {
        this.previewUrl = ''
      },

      // 打开弹窗
      async openDialog(row) {
        this.dialogVisible = true
        if (this.indexParent.choosedRecommend === 3) {
          this.previewUrl = `${process.env.VUE_APP_PREVIEW_URL}/details?shareId=${row.sourceId}&type=1`
        } else {
          const res = await sourceIdToMediaDetail({
            id: row.sourceId,
          })
          if (res.code == 0) {
            this.previewUrl = `${process.env.VUE_APP_PREVIEW_URL}/mediaDetails?id=${res.data}&itemId=${row.sourceId}&type=cms`
          }
        }
        console.log(this.indexParent.choosedRecommend, this.previewUrl)
      },
    },
  }
</script>

<style lang="scss">
  .preview-box {
    .el-dialog {
      width: 390px !important;
      border-radius: 20px !important;
    }
  }
</style>
