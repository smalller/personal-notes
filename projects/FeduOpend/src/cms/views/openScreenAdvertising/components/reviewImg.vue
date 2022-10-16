<template>
  <el-dialog :visible="visible" width="900px" @close="close">
    <div class="imgBox" style="display: flex; flex-wrap: wrap">
      <div v-for="(item, index) in typeList" :key="index" class="imgBoxItem">
        <div class="label">{{ `${item.w}X${item.h} (${item.label})` }}</div>
        <div class="img">
          <img
            style="height: 300px; object-fit: cover; border: 1px solid #525252"
            :style="{ width: 300 * item.n + 'px' }"
            :src="`${src}?w=${item.w}&h=${item.h}`"
            alt=""
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ReviewImg',
    data() {
      return {
        visible: false,
        src: '',
        typeList: [
          {
            n: 1242 / 2208,
            w: 1242,
            h: 2208,
            label: 'iphone xs max、11 Pro Max',
          },
          { n: 720 / 1280, w: 720, h: 1280, label: '720P' },
          { n: 480 / 800, w: 480, h: 800, label: '安卓' },
          { n: 1080 / 1920, w: 1080, h: 1920, label: '1080P' },
          { n: 1284 / 2778, w: 1284, h: 2778, label: 'iphone 12 Pro Max' },
          { n: 1170 / 2532, w: 1170, h: 2532, label: 'iphone 12、12 Pro' },
          { n: 1080 / 2340, w: 1080, h: 2340, label: 'iphone 12 mini' },
          { n: 828 / 1792, w: 828, h: 1792, label: 'iphone XR、11' },
          { n: 1125 / 2436, w: 1125, h: 2436, label: 'iphone X、XS、11 Pro' },
        ],
      }
    },
    methods: {
      open(url) {
        this.visible = true
        this.src = url
      },
      close() {
        this.visible = false
      },
    },
  }
</script>

<style scoped></style>
