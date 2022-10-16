<template>
  <div class="review-html-content" v-loading="loading">
    <p class="content">
      {{ reviewDetail.content }}
    </p>
    <div class="img-box">
      <img
        v-for="(item, index) in reviewDetail.images"
        :key="index"
        :src="item"
        alt=""
        @click="handleShowImgsList(reviewDetail.images, +index)"
      />
    </div>
    <!-- <ui-video :mask="false" ref="videoPlayer"></ui-video> -->
  </div>
  <ui-img-viewer
    v-if="showViewer"
    :initialIndex="initialIndex"
    :urlList="urlList"
    @close="handleclose"
    @changeShowImg="changeShowImg"
  ></ui-img-viewer>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
// import { VideoPlayer } from "@/base/interface";

interface ReviewDetailHtml {
  [key: string]: any;
}

export default defineComponent({
  props: {
    reviewDetailHtml: {
      type: Object,
      require: true,
    },
  },
  setup(props) {
    // const videoPlayer = ref(null); //视频预览组件
    const loading = ref(true);
    const reviewDetail = computed(
      () => props.reviewDetailHtml as ReviewDetailHtml
    );

    if (reviewDetail.value) {
      loading.value = false;
    }

    const showViewer = ref(false); //预览图显示开关
    const urlList = ref([] as Array<string>); //预览图列表
    const initialIndex = ref(0); //要展示的预览图索引

    // 获取图片列表
    function getImgsList(row: Array<string>) {
      urlList.value = row;
    }

    // 获取图片索引
    function getImgsIndex(index: number) {
      initialIndex.value = index;
    }

    // 预览图开关
    function showImgsSwitch() {
      showViewer.value = !showViewer.value;
    }

    // 打开大图模式
    function handleShowImgsList(row: Array<string>, index: number) {
      getImgsList(row);
      getImgsIndex(index);
      showImgsSwitch();
    }

    // 关闭预览图
    function handleclose() {
      showImgsSwitch();
    }

    // 预览图底部图片列表中切换图片
    function changeShowImg(index: number) {
      // 由于element没有对首张预览图进行动态更新，所以用此方法
      showViewer.value = false;
      const res = Promise.resolve((initialIndex.value = index));
      res.then(() => {
        showViewer.value = true;
      });
    }

    // 预览视频
    // function openDetails() {
    //   const dp = (videoPlayer.value as unknown as VideoPlayer).init(
    //     "https://video.pearvideo.com/mp4/adshort/20211019/cont-1735599-15784054_adpkg-ad_hd.mp4",
    //     {
    //       autoPlay: false,
    //     }
    //   );
    //   dp.volume(0.7, true, true);
    // }

    return {
      // videoPlayer,
      loading,
      reviewDetail,
      handleShowImgsList,
      showViewer,
      initialIndex,
      urlList,
      handleclose,
      changeShowImg,
    };
  },
});
</script>
<style lang="less" scoped>
.review-html-content {
  .content {
    font-size: 18px;
    color: #222222;
    line-height: 30px;
    margin-bottom: 20px;
  }

  .img-box {
    display: flex;
    flex-wrap: wrap;
    max-width: 400px;

    > img {
      width: 124px;
      height: 124px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      margin: 0 4px 4px 0;
      cursor: pointer;
    }
  }
}
</style>
