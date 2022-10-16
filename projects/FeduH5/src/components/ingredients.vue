<template>
<div class="ingredients">
  <author-info :info="author"></author-info>
  <div class="content">
    <p>{{ data.content }}</p>

    <div class="imgList">
      <img v-for="(imgUrl, index) in data.images" @click="reviewImage(index)" :src="imgUrl" alt="">
    </div>

    <player ref="liveVideo" v-show="data.videoPath"></player>
  </div>
</div>
</template>

<script>
import AuthorInfo from "@/components/authorInfo";
import Player from "@/components/player";
export default {
  name: "ingredients",
  components: {Player, AuthorInfo},
  props: {
    data: {
      type: Object,
      default: {
        videoPath: ''
      }
    }
  },
  data() {
    return {
      author:{}
    }
  },
  methods: {
    reviewImage(index) {
      vant.ImagePreview({
        images: this.data.images,
        startPosition: index
      })
    },
  },
  watch: {
    data: {
      handler: function () {
        this.author = {
          userName: this.data.publishUserNikeName,
          date: this.data.createTime,
          img: this.data.headPortrait
        }
        if (this.data?.videoPath) {
          this.$refs.liveVideo.setPlay(this.data.videoPath, {
            autoplay: true
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
.ingredients{
  padding: 8px 16px 0;
  .content{
    margin-top: 12px;
    p{
      text-align: left;
      color:#333333;
      font-size: 18px;
    }
    .imgList{
      margin-top: 10px;
      margin-bottom: 10px;
      //display: flex;
      //justify-content: flex-start;
      //flex-wrap: wrap;
      display: grid;
      grid-template-columns: 30% 30% 30% ;
      //grid-template-rows: 48px 48px 48px 48px;
      grid-row-gap: 10px;
      grid-column-gap: 5%;
      img{
        width: 100%;
      }
    }
  }
}
</style>
