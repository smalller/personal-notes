<template>
  <div class="indexlayout-main-conent">
    <el-card
      shadow="never"
      class="cus-card"
      style="margin-bottom: 15px;height:80px;"
      :body-style="{ 'padding-bottom': '0' }"
    >
      <el-button v-for="item in roles" :key="item.id" @click="typeNum = item.id">{{ item.label }}</el-button>

    </el-card>
    <list v-if="typeNum === 25"></list>
    <detail v-if="typeNum === 26"></detail>
    <recycle v-if="typeNum === 27"></recycle>

  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
} from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage, ElForm } from "element-plus";
import { StateType as ListStateType } from "./store";
import list from "./list/index.vue";
import detail from "./detail/index.vue";
import recycle from "./recycle/index.vue";
import {useRoute} from "vue-router";
import {StateType as UserStateType} from "@/store/user";


export default defineComponent({
  name: "ListSearchTablePage",
  components: {
    // CreateForm,
    // UpdateForm,
    // TypeSelect,
    list,
    detail,
    recycle,
  },
  setup() {
    const store = useStore<{ ListSearchTable: ListStateType,user: UserStateType  }>();
    const route = useRoute()

    const roles = ref<any[]>([])
    const getRoles = () => {
      store.getters['user/routes'].forEach(item => {
        if(route.fullPath.indexOf(item.path)>-1) {
          item.children.forEach(j => {
            if(j.path === route.fullPath) {
              console.log(j.children)
              roles.value = j.children
            }
          })
        }
      })
    }
    getRoles()

    const typeNum = ref<number>(roles.value[0].id);



    return {
      typeNum,
      roles
    };
  },
});
</script>
