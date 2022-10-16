<template>
  <thead class="ui-table-thead">
    <th v-if="checkbox" class="ui-table-checkbox">
      <el-checkbox @change="checkBoxChange"></el-checkbox>
    </th>
    <th
      v-for="(item, index) in data"
      :align="item.align || 'left'"
      :key="index"
      :style="{ width: item.width ? item.width + 'px' : 'auto' }"
    >
      {{ item.label }}
      <ui-icon v-if="item?.icon && !item?.tips" :icon="item.icon"></ui-icon>
      <el-tooltip
        v-if="item?.tips"
        effect="light"
        :content="item.tips"
        placement="bottom"
        :append-to-body="false"
      >
        <span>
          <ui-icon :icon="item?.icon ? item.icon : 'icon-a-71'"></ui-icon>
        </span>
      </el-tooltip>
    </th>
  </thead>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { inject } from "vue";
import { ElTooltip } from "element-plus";

export default defineComponent({
  name: "ui-table-thead",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    checkbox: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  components: {
    ElTooltip,
  },
  setup() {
    // console.log(prop.data);
    const allCheckedChange = inject(
      "allCheckedChange",
      function (val: boolean): void {
        console.log(val);
      }
    );
    /**
     * 修改表格全选状态
     * @param val
     */
    const checkBoxChange = (val: boolean) => {
      allCheckedChange(val);
    };

    return {
      checkBoxChange,
    };
  },
});
</script>

<style lang="less">
.ui-table-thead {
  width: 100%;
  height: 52px;
  background: #fafafa;
  .ui-table-checkbox {
    width: 21px;
    padding-right: 5px !important;
    height: 52px;
    margin: 0;
  }
  th {
    border-bottom: 1px solid #e8e8e8;
    font-size: 14px;
    color: #222222;
    font-weight: 400;
    padding: 0 10px;
    box-sizing: border-box;
    white-space: nowrap;
    .icon {
      fill: #bfbfbf;
      width: 14px;
      height: 14px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }
}
</style>
