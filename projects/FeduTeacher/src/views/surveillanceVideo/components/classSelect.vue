<template>
  <ui-modal
    width="800"
    v-model:visible="visible"
    :title="`${title} 绑定班级`"
    class="classSelect"
    @ok="ok"
    okText="保存"
  >
    <div class="classSelectHead">
      <div>
        <ui-input
          v-model="className"
          placeholder="输入班级名称"
          icon="icon-a-101"
        ></ui-input>
      </div>
      <div>
        <!--        <span>排序</span>-->
        <!--        <ui-select placeholder="排序方式">-->
        <!--          <ui-select-option label="按名称排序" value="1"></ui-select-option>-->
        <!--        </ui-select>-->
      </div>
    </div>
    <div class="classSelectContent scroll">
      <ui-checkbox-group v-model="selected">
        <ui-checkbox
          class="classSelectItem"
          v-for="(item, index) in classSelectList"
          :key="index"
          :label="item.id"
        >
          <div class="checkBoxItem">
            <img :src="item.clazzImg" alt="" />
            <span>{{ item.name }}</span>
          </div>
        </ui-checkbox>
      </ui-checkbox-group>
    </div>
    <template #tips>
      <div class="tipsBox">
        <ui-button @click="allSelect">全选</ui-button>
        <p>
          已选
          <span>{{ selected.length }}</span>
          项
        </p>
      </div>
    </template>
  </ui-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useStore } from "vuex";

interface clazz {
  id: string;
}

export default defineComponent({
  name: "classSelect",
  emits: {
    ok: null,
  },
  setup(props, context) {
    const $store = useStore();
    const visible = ref(false);
    const title = ref("");
    let selected = ref([] as string[]);
    const className = ref("");

    const ok = () => {
      const arr = classList.value.filter((item: clazz) =>
        selected.value.includes(item.id)
      );
      context.emit("ok", arr);
      visible.value = false;
    };
    const open = (name: string, data: string[]) => {
      title.value = name;
      selected.value = data;
      visible.value = true;
      $store.dispatch("getClassList");
    };

    /**
     * 查询班级信息
     */
    const classSelectList = ref([]);
    const classList = computed(() => $store.state.commonData.classList);
    watch(classList, () => {
      classSelectList.value = classList.value;
    });

    watch(className, () => {
      searchNameClass();
    });
    const searchNameClass = () => {
      if (!className.value) {
        classSelectList.value = classList.value;
      } else {
        classSelectList.value = classList.value.filter((item: any) => {
          if (item.name && item.name.indexOf(className.value) > -1) {
            return item;
          }
        });
      }
    };

    /**
     * 全选
     */
    const allSelect = () => {
      if (selected.value.length === classList.value.length) {
        selected.value = [];
      } else {
        selected.value = [];
        classList.value.forEach((item: clazz): void => {
          selected.value.push(item.id);
        });
      }
    };
    return {
      ok,
      visible,
      open,
      title,
      selected,
      className,
      allSelect,
      classSelectList,
    };
  },
});
</script>

<style scoped lang="less">
.classSelect {
  .classSelectHead {
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
      span {
        color: #999999;
        margin-right: 6px;
      }
    }
  }
  .classSelectContent {
    margin-top: 26px;

    .el-checkbox-group {
      display: grid;
      grid-template-rows: repeat(auto-fill, 32px);
      grid-template-columns: repeat(3, 33.3%);
      grid-row-gap: 20px;
      grid-column-gap: 0px;
      overflow-y: auto;
      max-height: 420px;
    }
    .classSelectItem {
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-checkbox {
        display: flex;
        align-items: center;
      }
      .checkBoxItem {
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        span {
          font-size: 14px;
          color: #222222;
          margin-left: 10px;
        }
      }
    }
  }
  .tipsBox {
    display: flex;
    align-items: center;
    p {
      margin-left: 10px;
      span {
        color: #222222;
      }
    }
  }
}
</style>
