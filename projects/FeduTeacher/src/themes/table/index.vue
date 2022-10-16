<template>
  <keep-alive>
    <div class="ui-table scroll">
      <table cellpadding="0" border="0" cellspacing="0" :key="key">
        <ui-table-thead :data="headList" :checkbox="checkbox"></ui-table-thead>
        <!--      <ui-table-tbody-->
        <!--        ref="tBody"-->
        <!--        :data="data"-->
        <!--        :head="headList"-->
        <!--        :checkbox="checkbox"-->
        <!--      ></ui-table-tbody>-->
        <tbody v-show="list.length > 0" class="ui-table-tbody" v-for="(item, index) in list" :key="index">
          <tr class="ui-table-tr">
            <td class="checkbox" v-if="checkbox">
              <el-checkbox :disabled="!!item?.checkboxDisabled" @change="checkChange" v-model="checkList[index]">
              </el-checkbox>
            </td>
            <slot :column="item" :row="item"></slot>
          </tr>
          <td :colspan="headList.length + checkbox" class="ui-table-row-details">
            <el-collapse-transition>
              <slot name="details" :row="item"></slot>
            </el-collapse-transition>
          </td>
        </tbody>
        <tbody v-show="list.length <= 0">
          <td class="ui-table-tbody-default" :colspan="headList.length + checkbox">
            没有查询到数据
          </td>
        </tbody>
      </table>
    </div>
  </keep-alive>
</template>

<script lang="ts">
import { defineComponent, provide, ref, watch } from "vue";
import UiTableThead from "@/themes/table/thead.vue";
import { ElCollapseTransition } from "element-plus";
import dayjs from "dayjs";

interface ChildComponent {
  prop: string;
  width?: number | string;
  label: string;
  fixed?: string;
  tips?: string;
  icon?: string;
}

interface Prop {
  props: ChildComponent;
}

type FuncArray = () => Array<Prop>;

type FuncNumber = (number: number) => void;
interface Slots {
  default: FuncArray;
}

export default defineComponent({
  name: "ui-table",
  components: { UiTableThead, ElCollapseTransition },
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
  provide() {
    return {
      myTable: this.ChildComponentRegister,
      allCheckedChange: this.checkboxAllChange,
      checkBoxChange: this.checkBoxChange,
      setData: this.setChildData,
    };
  },

  emits: {
    selectChange: null,
  },

  setup(props, context) {
    const headList = ref([] as Array<ChildComponent>);
    const checkList = ref([] as Array<boolean>);
    const list = ref(props.data as Array<any>);
    const tBody = ref();
    const key = ref(dayjs().toDate().getTime());

    /**
     * 子组件注册
     * @param child
     */
    let index = 0;
    const ChildComponentRegister = (child: FuncNumber): void => {
      // headList.value.push(child)
      index++;
      child(Math.ceil(index / headList.value.length));
    };

    interface childFuncData {
      prop: string;
    }
    type Func = (data: childFuncData[]) => void;
    let childFunc: Func;
    const setChildData = (child: Func): void => {
      childFunc = child;
      createCheckList();
      child(props.data as childFuncData[]);
    };
    // nextTick(() => {});
    watch(
      () => props.data,
      (newValue: any, oldValue: any): void => {
        // index = headList.value.length * oldValue.length;
        //

        index = oldValue.length;
        // list.value = [];
        list.value = newValue;
        index = 0;
        createCheckList();
        if (childFunc) {
          childFunc(newValue);
        }
        key.value = dayjs().toDate().getTime();
      },
      {
        deep: true,
      }
    );

    const createCheckList = () => {
      checkList.value = [];
      props.data.forEach(() => {
        checkList.value.push(false);
      });
    };

    // const { appContext } = getCurrentInstance();
    //TODO 这里添加了双重断言,因为类型推断无法推断出指定类型
    const slot = context.slots as unknown as Slots;

    slot.default().forEach((item: Prop) => {
      headList.value.push(item.props);
    });

    headList.value.forEach((item) => {
      provide(item.prop, props.data);
    });

    /**
     * 写入选中数据
     */
    const toggleRowSelection = (row: any): void => {
      props.data.forEach((item, index) => {
        if (JSON.stringify(row) === JSON.stringify(item)) {
          checkList.value[index] = true;
        }
      });
      checkChange();
    };

    /**
     * 移除选中数据
     */
    const removeRowSelection = (row: any): void => {
      props.data.forEach((item, index) => {
        if (JSON.stringify(row) === JSON.stringify(item)) {
          checkList.value[index] = false;
        }
      });
      checkChange();
    };

    /**
     * 表单选择
     */
    const checkBoxChange = (arr: Array<boolean>): void => {
      context.emit("selectChange", arr);
    };
    /**
     * 监听表格全选状态
     * @param val
     */
    const checkboxAllChange = (val: boolean): void => {
      checkList.value = checkList.value.map(() => val);
      // UI_TABLE_BODY.value.checkListSet(val);
      checkChange();
    };

    /**
     * 发送多选状态
     */
    const checkChange = (): void => {
      const arr: Array<any> = props.data.filter(
        (item, index) => checkList.value[index]
      );
      checkBoxChange(arr);
    };

    return {
      tBody,
      headList,
      checkList,
      list,
      key,
      ChildComponentRegister,
      setChildData,
      checkboxAllChange,
      checkBoxChange,
      checkChange,
      toggleRowSelection,
      removeRowSelection,
    };
  },
});
</script>

<style lang="less">
.ui-table {
  overflow-y: auto;

  * {
    box-sizing: border-box;
  }

  width: 100%;

  table {
    width: 100%;
    background: #ffffff;
  }

  .ui-table-tbody-default {
    text-align: center;
    color: #666666;
    font-size: 14px;
    padding: 30px 0;
  }

  td {
    box-sizing: border-box;
    padding: 0 10px;
  }

  .ui-table-tbody {
    .ui-table-tr {
      width: 100%;
      height: 54px;

      td {
        border-bottom: 1px solid #e8e8e8;
        font-size: 14px;
        color: #222222;

        &:last-child {
          padding-right: 20px;
        }
      }

      .checkbox {
        width: 21px;
        padding-right: 5px !important;

        //height: 52px;
        //display: flex;
        //justify-content: center;
        //align-items: center;
        label {
          margin-left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    .ui-table-row-details {
      padding: 0;
    }
  }
}
</style>
