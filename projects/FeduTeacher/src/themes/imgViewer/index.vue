<template>
  <el-image-viewer
    :initial-index="showImgIndex"
    :url-list="imgs"
    @close="handleclose"
    @switch="handleSwitch"
    :hide-on-click-modal="hideOnClickModal"
  >
  </el-image-viewer>
  <div class="btom-imgs-box">
    <img
      v-for="(item, index) in imgs"
      :key="index"
      :src="item"
      alt=""
      :class="[showImgIndex === index ? 'has-img-border' : '']"
      @click="handleClick(index)"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
export default defineComponent({
  name: "ui-img-viewer",
  props: {
    urlList: {
      type: Array,
      required: true,
    },
    initialIndex: {
      type: Number,
      required: true,
    },
    hideOnClickModal: {
      type: [Boolean, String],
      default: false,
    },
  },
  emits: ["changeShowImg", "close"],
  setup(props, { emit }) {
    const imgs = computed(() => props.urlList as Array<string>);
    const showImgIndex = ref(props.initialIndex);
    watch(
      () => props.initialIndex,
      (newVal) => {
        showImgIndex.value = newVal;
      }
    );

    // 关闭事件
    function handleclose() {
      emit("close");
    }

    // 左右切换事件
    function handleSwitch(index: number) {
      showImgIndex.value = index;
    }

    // 底部列表图片点击事件
    function handleClick(index: number) {
      showImgIndex.value = index;
      emit("changeShowImg", index);
    }

    return {
      imgs,
      handleClick,
      showImgIndex,
      handleclose,
      handleSwitch,
    };
  },
});
</script>
<style lang="less" scoped>
.btom-imgs-box {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  min-height: 70px;
  z-index: 2001;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 8px 0 8px;
  box-sizing: border-box;

  > img {
    width: 72px;
    height: 54px;
    margin-bottom: 8px;
    cursor: pointer;
    margin-right: 8px;
    opacity: 0.5;
    border: 2px solid transparent;
  }

  .has-img-border {
    opacity: 1 !important;
    border-color: #ff9900 !important;
  }
}
</style>
