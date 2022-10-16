<template>
<div class="videoDetails">
  <player ref="liveVideo"></player>
  <div class="data" v-html="data.content"></div>
</div>
</template>

<script>
import Player from "@/components/player";
export default {
  name: "videoDetails",
  components: {Player},
  data() {
    return {}
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  watch: {
    data: {
      handler: function () {
        if (this.data?.pushStreamAddress) {
          this.$refs.liveVideo.setPlay(this.data.pushStreamAddress,{
            live: true,
            autoPlay: true,
            poster:this.data.picturePath
          })
        }
      },
      deep: true
    },
    created() {
      if (this.data?.pushStreamAddress) {
        this.$refs.liveVideo.setPlay(this.data.pushStreamAddress,{
          live: true,
          autoPlay: true,
          poster:this.data.picturePath
        })
      }
    }
  }
}
</script>

<style lang="less">
.videoDetails {
  padding: 20px 0;
  .data{
    padding: 0 16px;
    margin-top: 10px;
    text-align: left;
    img{
      max-width: 100% !important;
    }
    video {
      max-width: 100% !important;
    }
  }
}
</style>
