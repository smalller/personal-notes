<template>
  <el-drawer v-model="drawer" title="权限设置" custom-class="drawer-box">
    <el-tree :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[]" :default-checked-keys="roleCheck"
      :props="defaultProps" default-expand-all="true" ref="tree" @getCheckedKeys="currentChecked" />

    <div class="botom-btn-box">
      <el-button type="primary" @click="save">提交</el-button>
      <el-button @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { ElMessage } from "element-plus";

export interface Setup {
  drawer: Ref<boolean>;
  handleOpen: (any) => void;
  save: (any) => void;
  currentChecked: (any) => void;
  defaultProps: any;
  tree: any;
  treeData: any;
  roleCheck: Ref<[string | number]>;
}

export default defineComponent({
  name: "",
  setup() {
    const drawer = ref<boolean>(false);

    const defaultProps = {
      children: "children",
      label: "label",
    };

    const treeData = ref([]);
    const tree = ref<unknown>(null);
    const roleId = ref<string>("0");
    // 打开抽屉
    const handleOpen = (res: any): void => {
      drawer.value = true;
    };

    return {
      drawer,
      handleOpen,
    };
  },
});
</script>
<style lang='scss' scoped>
.el-form-item__content {
  display: flex;
  align-items: center;

  .el-input {
    width: 200px;
  }
}

.botom-btn-box {
  text-align: right;
  margin-top: 20px;
}
</style>