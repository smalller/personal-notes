<template>
  <td class="ui-table-column" ref="ruleFormRef" :align="align">
    <div
      class="ui-table-column-box scroll"
      :style="[width === '' ? 'white-space:nowrap' : `width:${width}px`]"
    >
      <slot :row="column">{{ !column[prop] ? "-" : column[prop] }}</slot>
    </div>
  </td>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from "vue";

type CallBack = () => void;

export default defineComponent({
  name: "ui-table-column",
  props: {
    label: {
      type: String,
      default: "",
    },
    width: {
      type: [Number, String],
      default: "",
    },
    prop: {
      type: String,
      default: "",
    },
    align: {
      type: String,
      default: "left",
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    icon: {
      type: String,
      default: "icon-a-63",
    },
    tips: {
      type: String,
      default: "3333",
    },
  },

  setup(props) {
    const ruleFormRef = ref(null);
    const item = ref([] as Array<any>);
    const ChildComponentRegister = inject(
      "myTable",
      (callBack: (index: number) => void) => {
        console.log(callBack);
      }
    );
    const columnIndex = ref(0);
    ChildComponentRegister((index: number) => {
      columnIndex.value = index - 1;
    });

    const setData = inject(
      "setData",
      (callBack: (data: Array<any>) => void) => {
        console.log(callBack);
      }
    );
    setData((data: Array<any>) => {
      item.value = data;
    });

    // const item = inject("datas", []);
    const column = computed(() =>
      item.value[columnIndex.value] ? item.value[columnIndex.value] : {}
    );
    return {
      ruleFormRef,
      column,
    };
  },
});
</script>

<style scoped lang="less">
td {
  //display: inline-block;
  .ui-table-column-box {
    overflow: auto;
  }
}
</style>
