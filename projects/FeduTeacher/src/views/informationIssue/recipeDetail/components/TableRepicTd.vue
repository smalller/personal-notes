<template>
  <ul class="recipe-td-ul">
    <li v-for="(item, index) in row" :key="index">
      <div class="img-box">
        <img
          :src="item.dishesImgUrl"
          alt=""
          @click="handleShowImgsList(row, +index)"
        />
      </div>
      <div class="detail-info">
        <span class="name">{{ item.dishesName }}</span>
        <span class="weight">{{ item.dishesWeight + "g" || "" }}</span>
      </div>
    </li>
  </ul>
  <ui-img-viewer
    v-if="showViewer"
    :initialIndex="initialIndex"
    :urlList="urlList"
    @close="handleclose"
    @changeShowImg="changeShowImg"
  ></ui-img-viewer>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
interface DataItem {
  [key: string]: any;
}

export default defineComponent({
  props: {
    rowData: {
      type: Array,
    },
  },
  setup(props) {
    const row = computed(() => props.rowData as Array<DataItem>);
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
    function handleShowImgsList(row: Array<DataItem>, index: number) {
      const arr = row.map((it: any) => it.dishesImgUrl);
      getImgsList(arr);
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

    return {
      row,
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
.recipe-td-ul {
  > li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .img-box {
      width: 40px;
      height: 40px;
      margin-right: 8px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
    }

    .detail-info {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      .name {
        font-size: 14px;
        color: #222;
        max-width: 90px;
        text-align: left;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        // flex-grow: 1;
      }

      .weight {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
