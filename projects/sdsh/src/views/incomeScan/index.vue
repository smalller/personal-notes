<template>
  <div class="indexlayout-main-conent">
    <el-card
      shadow="never"
      class="cus-card"
      style="margin-bottom: 15px;height:80px;"
      :body-style="{ 'padding-bottom': '0' }"
    >
      <el-button v-for="item in roles" :key="item.id" @click="btnId = +item.id">{{item.label}}</el-button>

    </el-card>
    <div style="width:100%">

    </div>
    <scan v-if="btnId === 20" @openDetailsList="getDetailsList" @openInfoTotal="openInfoTotal"></scan>
    <list v-if="btnId === 21" :projectName="projectName"></list>
    <total v-if="btnId === 22" :projectName="projectName"></total>
    <qrcode v-if="btnId === 23"></qrcode>
    <recycle v-if="btnId === 24"></recycle>

  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
} from "vue";
import { useStore } from "vuex";
import {useRouter, useRoute} from 'vue-router'
import scan from "./scan/index.vue";
import list from "./list/index.vue";
import total from "./total/index.vue";
import qrcode from "./qrcode/index.vue";
import recycle from "./recycle/index.vue";
import {StateType as UserStateType} from "@/store/user";

export default defineComponent({
  name: "ListSearchTablePage",
  components: {
    scan,
    list,
    total,
    qrcode,
    recycle,
    // TypeSelect,
  },
  setup() {
    const store = useStore<{user: UserStateType }>();
    const router = useRouter()
    const route = useRoute()

    const projectName = ref('')
    // const list = [];
    const btnId = ref(20)

    const roles = ref([])
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
    onMounted(() => {
      console.log(roles.value)
    });

    const getDetailsList = (name: string) => {
      projectName.value = name
      btnId.value = 21
    }

    const openInfoTotal = (name: string) => {
      projectName.value = name
      btnId.value = 22
    }

    return {
      list,
      roles,
      btnId,
      getDetailsList,
      projectName,
      openInfoTotal
    };
  },
});
</script>
