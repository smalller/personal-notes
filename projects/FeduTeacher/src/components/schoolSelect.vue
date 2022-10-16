<template>
  <div class="schoolSelect" :style="{ width: width + 50 + 'px' }">
    <el-select v-model="schoolId" @change="schoolChange">
      <el-option
        v-for="item in SCHOOL_LIST"
        :key="item.schoolId"
        :label="item.schoolName"
        :value="item.schoolId"
      ></el-option>
    </el-select>
    <span ref="schoolSelectSpan" class="schoolSelectSpan">{{
      schoolDetails?.schoolName
    }}</span>
  </div>
</template>

<script lang="ts">
import { ElSelect, ElOption } from "element-plus";
import { defineComponent, computed, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { School } from "@/store/user/state";
import micell from "micell";
export default defineComponent({
  components: { ElSelect, ElOption },
  setup() {
    const $store = useStore();
    const schoolId = ref<string>($store.state.user.schoolId);
    const SCHOOL_LIST = computed(() => $store.state.user.schoolList);
    const school = computed(() => $store.state.user.schoolId);
    const schoolSelectSpan = ref(null);
    const width = ref(0);
    watch(school, () => {
      schoolId.value = school.value;
    });
    const schoolDetails = computed(() => {
      return $store.state.user.schoolList.find((item: any) => {
        if ($store.state.user.schoolId === item.schoolId) {
          return item;
        }
      });
    });
    /**
     * 修改学校
     */
    const schoolChange = (val: string): void => {
      const school: School | undefined = SCHOOL_LIST.value.find(
        (school: School) => school.schoolId === val
      );
      if (school) {
        $store.dispatch("setSchoolId", val).catch((id: string) => {
          schoolId.value = id;
        });
        setTimeout(() => {
          getWidth();
        });
      }
    };
    onMounted(() => {
      setTimeout(() => {
        getWidth();
      });
    });
    const getWidth = () => {
      width.value = micell.dom.pageWidth(schoolSelectSpan.value as any);
    };
    return {
      width,
      schoolId,
      SCHOOL_LIST,
      schoolDetails,
      schoolChange,
      schoolSelectSpan,
    };
  },
});
</script>

<style lang="less">
.schoolSelect {
  width: 300px;
  .el-select {
    .el-input {
      .el-input__inner {
        border: none !important;
        font-size: 24px !important;
        color: #656565 !important;
      }
    }
  }
  .schoolSelectSpan {
    border: none !important;
    font-size: 24px !important;
    color: #656565 !important;
    display: inline-block;
    visibility: hidden;
    position: fixed;
    top: -100px;
  }
}
</style>
