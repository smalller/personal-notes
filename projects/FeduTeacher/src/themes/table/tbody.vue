<template>
  <tbody class="ui-table-tbody">
    <tr class="ui-table-tr" v-for="(column, index) in data" :key="index">
      <td
        v-if="checkbox"
        style="
          width: 54px;
          height: 52px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <el-checkbox
          @change="checkChange"
          v-model="checkList[index]"
        ></el-checkbox>
      </td>
      <td
        class="ui-table-td"
        v-for="(item, columnIndex) in head"
        :style="{ width: item.width ? item.width + 'px' : 'auto' }"
        :key="columnIndex"
      >
        <span v-if="!item.isSlot">
          {{ column[item.prop] }}
        </span>
        <div v-else>{{ item.el }}</div>
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, defineExpose, inject } from "vue";
import { ref, watch } from "vue";
export default defineComponent({
  name: "ui-table-tbody",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },

    head: {
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
  setup(props) {
    const checkList = ref([] as Array<boolean>);
    if (props.data.length > 1) {
      props.data.forEach(() => {
        checkList.value.push(false);
      });
    }
    /**
     * 发送多选状态
     */
    const checkChange = (): void => {
      const arr: Array<any> = props.data.filter(
        (item, index) => checkList.value[index]
      );
      checkBoxChange(arr);
    };

    /**
     * 写入选中数据
     */
    const toggleRowSelection = (row: any): void => {
      props.data.forEach((item, index) => {
        if (row === item) {
          checkList.value[index] = true;
        }
      });
      checkChange();
    };

    const checkListSet = (val: boolean): void => {
      checkList.value = checkList.value.map(() => val);
      checkChange();
    };

    const getChildBodyCall = inject(
      "getChildBodyCall",
      function (fun: any): void {
        // console.log(fun);
      }
    );

    const checkBoxChange = inject(
      "checkBoxChange",
      function (arr: Array<boolean>): void {
        console.log(arr, 222);
      }
    );

    getChildBodyCall(checkListSet);

    watch(
      () => props.data,
      (newVal: Array<any>) => {
        newVal.forEach(() => {
          checkList.value.push(false);
        });
      }
    );
    return {
      checkList,
      checkChange,
      checkListSet,
    };
  },
});
</script>

<style lang="less">
.ui-table-tbody {
  .ui-table-tr {
    width: 100%;
    height: 52px;
    td {
      border-bottom: 1px solid #e8e8e8;
      font-size: 14px;
      color: #222222;
    }
    tbody {
      background: #ffffff;
    }
  }
}
</style>
