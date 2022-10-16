<template>
  <div class="model-box">
    <div
      class="model"
      @click="showSelectList"
    >
      <span :class="['model-value', { 'high-light': modelLabel }]">{{
        modelLabel
          ? modelLabel
          : dataList[0]?.admissionsTitle
          ? dataList[0]?.admissionsTitle
          : ""
      }}</span>
      <ui-icon
        class="icon"
        :icon="icon"
      ></ui-icon>
    </div>
    <div
      id="dataBox"
      class="data-list"
      v-show="showSelectStatus"
    >
      <ul>
        <li
          @click="chooseItem(item)"
          :class="[
            'item',
            item.admissionsTitle === modelLabel ? 'selected-item' : '',
          ]"
          v-for="(item, index) in dataList"
          :key="index"
        >
          {{ item.admissionsTitle }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch, computed } from "vue";
import dayjs from "dayjs";

interface ListItem {
  name: string;
  value?: string;
  admissionsTitle: string;
  id: string;
}

export default defineComponent({
  props: {
    option: {
      type: Array,
      default: () => {
        return [];
      },
    },
    highLight: Boolean,
  },
  emits: ["selectItem"],
  setup(props, ctx) {
    const dataList = computed(() => props.option as Array<any>);
    const chooseData = ref([] as Array<any>);
    const modelLabel = ref("");
    if (props.option.length) {
      chooseData.value = props.option.filter((item: any) => {
        return item.rstatus === 1;
      });
      modelLabel.value = chooseData.value.length
        ? chooseData.value[0].admissionsTitle
        : "";
      if (chooseData.value.length) {
        ctx.emit("selectItem", chooseData.value[0]);
      }
    }
    let icon = ref("icon-a-9");
    let showSelectStatus = ref(false);
    // 如果没有选择年份，就取消高亮
    watch(
      () => props.highLight,
      () => {
        if (!props.highLight) {
          modelLabel.value = "";
        }
      }
    );

    // 打开/隐藏年份列表
    const showSelectList = () => {
      showSelectStatus.value = !showSelectStatus.value;
      if (showSelectStatus.value) {
        icon.value = "icon-a-51";
      } else {
        icon.value = "icon-a-9";
      }
    };

    // 初始化样式
    const initStyle = () => {
      showSelectStatus.value = false;
      icon.value = "icon-a-9";
    };

    // 选择年份
    const chooseItem = (item: ListItem) => {
      modelLabel.value = item.admissionsTitle;
      ctx.emit("selectItem", item);
      initStyle();
    };

    const classList = ["model-value high-light", "model-value"];
    const nodeList = ["svg", "use"];
    // 当点击出下拉框本身以外的地方时，就隐藏下拉框选项列表
    document.onclick = function (e: Event) {
      const className = (e.target as HTMLDivElement).className;
      const nodeName = (e.target as HTMLDivElement).nodeName;
      if (!classList.includes(className) && !nodeList.includes(nodeName)) {
        initStyle();
      }
    };

    return {
      modelLabel,
      icon,
      showSelectList,
      showSelectStatus,
      chooseItem,
      dayjs,
      dataList,
    };
  },
});
</script>
<style lang="less" scoped>
.model-box {
  cursor: pointer;
  display: flex;
  align-items: center;
  //   justify-content: center;
  width: 260px;
  position: relative;
  user-select: none;

  .model {
    display: flex;
    align-items: center;
    // justify-content: center;
    height: 20px;

    .model-value {
      font-size: 20px;
      color: #222222;
      max-width: 350px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 4px;
    }
    .model-value.high-light {
      //   color: #ff9900;
    }
    .icon {
      font-size: 8px;
      color: #666666;
    }
  }

  .data-list {
    width: 200px;
    height: 182px;
    overflow: auto;
    padding: 6px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    position: absolute;
    top: 24px;
    left: 0;
    z-index: 9;

    // 滚动条宽度
    &::-webkit-scrollbar {
      width: 6px;
    }
    // 滚动条中滑块的样式
    &::-webkit-scrollbar-thumb {
      background-color: #bfbfbf;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
    }

    > ul > li {
      height: 34px;
      line-height: 34px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #222222;
      padding: 0 19px 0 33px;
      box-sizing: border-box;
    }

    .item:hover {
      background: #f0f0f0;
    }

    .item.selected-item {
      background-color: #fff;
    }

    .selected-item {
      position: relative;
      color: #ff9900;

      &::before {
        display: block;
        font-family: "iconfont";
        content: "\e610";
        position: absolute;
        top: 0;
        left: 10px;
        line-height: 34px;
        font-size: 18px;
      }
    }
  }
}
</style>
