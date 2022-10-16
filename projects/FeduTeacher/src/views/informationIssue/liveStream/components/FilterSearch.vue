<template>
  <div class="filter-box">
    <ul>
      <li>
        <span class="label-title">发布人</span>
        <ui-input
          style="width: 140px"
          v-model="searchObj.searchIssuer"
          placeholder="输入发布人"
        ></ui-input>
      </li>
      <li>
        <span class="label-title">主播</span>
        <ui-input
          style="width: 140px"
          v-model="searchObj.searchAnchor"
          placeholder="输入主播"
        ></ui-input>
      </li>
      <li>
        <span class="label-title">主题</span>
        <ui-input
          style="width: 200px"
          v-model="searchObj.searchTheme"
          placeholder="输入主题"
        ></ui-input>
      </li>
      <li>
        <span class="label-title">状态</span>
        <ui-select
          style="width: 140px"
          v-model="searchObj.selectedStatus"
          placeholder="全部"
        >
          <ui-select-option
            v-for="item in allStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></ui-select-option>
        </ui-select>
      </li>
      <li>
        <ui-button type="primary" @click="handleSearch">查询</ui-button>
        <ui-button @click="handleReset">重置</ui-button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";
export default defineComponent({
  props: {
    changeTabStatus: Boolean,
  },
  emits: ["handleSearch", "handleReset"],
  setup(props, { emit }) {
    let searchObj = ref({
      searchIssuer: "",
      searchAnchor: "",
      searchTheme: "",
      selectedStatus: "",
    });
    const allStatusList = reactive([
      {
        label: "全部",
        value: "",
      },
      {
        label: "未开播",
        value: 0,
      },
      {
        label: "已结束",
        value: 1,
      },
      {
        label: "直播中",
        value: 2,
      },
    ]);

    // 只要监听到值改变就初始化值
    watch(
      () => props.changeTabStatus,
      () => {
        searchObj.value = {
          searchIssuer: "",
          searchAnchor: "",
          searchTheme: "",
          selectedStatus: "",
        };
      }
    );

    function handleSearch() {
      emit("handleSearch", searchObj.value);
    }

    function handleReset() {
      searchObj.value = {
        searchIssuer: "",
        searchAnchor: "",
        searchTheme: "",
        selectedStatus: "",
      };
      emit("handleReset", searchObj.value);
    }

    return {
      searchObj,
      allStatusList,
      handleSearch,
      handleReset,
    };
  },
});
</script>
<style lang="less" scoped>
.filter-box {
  > ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    > li {
      margin-bottom: 16px;
      margin-right: 16px;

      > button {
        margin-right: 16px;
      }

      .label-title {
        min-width: 28px;
        color: #999;
        font-size: 14px;
        margin-right: 6px;
      }
    }
  }
}
</style>
