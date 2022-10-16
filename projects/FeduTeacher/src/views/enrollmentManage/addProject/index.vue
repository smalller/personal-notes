<template>
  <div class="addProject">
    <div class="content">
      <div class="phone">
        <schoolEnroll :tempId="imgIndex"></schoolEnroll>
      </div>
    </div>
    <div class="list">
      <span class="list-title">选择样式</span>
      <div class="list-img">
        <div
          :class="imgIndex == index + 1 ? 'img' : 'imgs'"
          v-for="(item, index) in tempList"
          :key="index"
          @click="getImgIndex(index)"
        >
          <img
            :src="item.coverUrl"
            alt=""
          />
          <span>{{ item.tempName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { defineComponent, ref, reactive, onMounted } from "vue";
import schoolEnroll from "./components/schoolEnroll.vue";
import { getTempList } from "@/api/enrollmentManage";
import { GetEnrollment } from "@/api/common";
// import DateFilter from "@/components/DateFilter.vue";
// import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
// import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    schoolEnroll,
    // SelectPostOrClass,
  },
  setup() {
    const route = useRoute();
    const tableIndex = ref(0);
    const tempList = ref([] as Array<any>);
    const imgIndex = ref(0);
    const activityId = ref();
    const $router = useRoute();
    activityId.value = $router.query.id;

    const getSchoolInfo = () => {
      if (activityId.value) {
        GetEnrollment(activityId.value).then((res) => {
          if (+res.code === 0 && res.data !== null) {
            imgIndex.value = res.data?.themeId;
          }
        });
      }
    };
    //判断有无ID
    if (activityId.value) {
      getSchoolInfo();
    } else {
      imgIndex.value = 1;
    }
    //切换封面
    const getImgIndex = (index: number) => {
      imgIndex.value = tempList.value[index].id;
      console.log(imgIndex.value);
    };
    const getSchoolTemp = async () => {
      const { code, data } = await getTempList();
      if (+code === 0) {
        tempList.value = [...data];
      }
    };
    onMounted(() => {
      console.log("11111111111");
      getSchoolTemp();
    });
    return {
      route,
      tableIndex,
      getImgIndex,
      tempList,
      imgIndex,
    };
  },
});
</script>
<style lang="less" scoped>
.addProject {
  max-width: 1920px;
  max-height: 918px;
  background: #79e3eb;
  box-sizing: border-box;
  display: flex;
  .content {
    width: 1730px;
    height: 918px;
    background: #eef2f8;
  }
  .list {
    width: 190px;
    height: 918px;
    background: #ffffff;
    box-shadow: 0px 4px 8px 0px undefined;
    .list-title {
      display: block;
      margin-left: 15px;
      margin-top: 20px;
      width: 56px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #222222;
    }
    .list-img {
      margin-top: 10px;
      .img {
        width: 190px;
        height: 143px;
        margin: auto;
        background: #f7f7f7;
        text-align: center;
        cursor: pointer;
        img {
          margin-top: 10px;
          width: 150px;
          height: 98px;
          border: 2px solid #ff9900;
        }
        span {
          display: block;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 400;
          color: #ff9900;
        }
      }
      .imgs {
        width: 190px;
        height: 143px;
        margin: auto;
        background: #ffffff;
        text-align: center;
        cursor: pointer;
        border-bottom: 1px solid #f2f2f2;

        img {
          margin-top: 10px;
          width: 150px;
          height: 98px;
        }
        span {
          display: block;
          margin: auto;
          margin-top: 8px;
          font-size: 12px;
          color: #666666;
        }
      }
    }
  }
}
</style>
