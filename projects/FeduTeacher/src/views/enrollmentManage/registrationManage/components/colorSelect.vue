<template>
  <div class="container-student">
    <span class="label-title">{{ title }}</span>
    <ui-select
      :id="ids"
      clearable
      filterable
      class="select"
      :style="{
        width: width + 'px',
        fontColor: selectColor,
      }"
      v-model="selectedInfo"
      @change="handleSelect"
      :placeholder="placeholder"
    >
      <template v-if="title === '回访进度' || '家长意向'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :value="index"
        >
          <span :style="{ color: item.color }">{{
            item.label
          }}</span></ui-select-option
        >
      </template>
    </ui-select>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
export default defineComponent({
  name: "",
  props: {
    title: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    list: {
      type: Array,
      default: () => [],
    },
    changeTabStatus: Boolean,
  },
  emits: ["handleSelect"],
  setup(props, ctx) {
    //id值
    const ids = ref("");
    ids.value = "count" + Math.round(Math.random() * 100);
    //控件样式容器
    const colorStyle = ref();
    //数据备份
    const listInfo = ref([] as Array<any>);
    listInfo.value = props.list.length ? [...props.list] : [];
    //选择数据
    const selectedInfo = ref<number | null | string>();
    selectedInfo.value = null;
    //对应颜色
    const selectColor = ref<number | null | string>();
    const handleSelect = (index: number) => {
      selectedInfo.value = listInfo.value[index].label;
      selectColor.value = listInfo.value[index].color;
      colorStyle.value = document.getElementById(ids.value) as HTMLInputElement;
      colorStyle.value.style.color = selectColor.value;
    };

    // 只要监听到值改变就初始化值
    watch(
      () => props.changeTabStatus,
      () => {
        selectedInfo.value = "";
      }
    );
    return {
      handleSelect,
      listInfo,
      selectedInfo,
      selectColor,
      ids,
    };
  },
});
</script>
<style lang="less" scoped>
.container-student {
  display: flex;
  align-items: center;

  .label-title {
    min-width: 28px;
    color: #999;
    font-size: 14px;
    margin-right: 6px;
  }
}
</style>
