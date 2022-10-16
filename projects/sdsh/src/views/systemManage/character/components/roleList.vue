<template>
  <el-drawer v-model="drawer" title="权限设置" custom-class="drawer-box">
    <el-tree :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[]" :default-checked-keys="roleCheck"
      :props="defaultProps" ref="tree" />
    <div class="botom-btn-box">
      <el-button type="primary" @click="save">提交</el-button>
      <el-button @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { getRole, setRole } from "../api";
import { ElMessage } from "element-plus";

export interface Setup {
  drawer: Ref<boolean>;
  handleOpen: (any) => void;
  save: (any) => void;
  defaultProps: any;
  tree: any;
  treeData: any;
  roleCheck: any;
}

export default defineComponent({
  name: "",
  setup(): Setup {
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
      roleId.value = res.id;
      roleInfo();
    };

    const roleCheck = ref([]);
    async function roleInfo() {
      treeData.value = [];
      roleCheck.value = [];
      const { code, data } = await getRole(roleId.value);
      if (+code === 1000) {
        treeData.value = data.resources
        roleCheck.value = data.checked
        drawer.value = true;
      }
    }

    const roleData = ref([] as any);
    async function save() {
      roleData.value = (tree.value as any).getCheckedNodes(false, true)
      let data = [] as any;
      for (let i = 0; i < roleData.value.length; i++) {
        data.push(roleData.value[i].id);
      }
      const params = {
        resourceId: data,
        roleId: roleId.value,
      };
      const { code } = await setRole(params);
      if (+code === 1000) {
        ElMessage.success("保存成功");
        drawer.value = false;
      }
    }
    return {
      drawer,
      handleOpen,
      defaultProps,
      treeData,
      roleCheck,
      save,
      tree,
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