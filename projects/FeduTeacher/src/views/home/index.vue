<template>
  <div class="home">
    <div>
      <div v-show="false">
        <surveillance-video></surveillance-video>
      </div>
      <div v-show="false">
        <active-teacher></active-teacher>
        <active-class></active-class>
      </div>
      <div v-show="false">
        <banner />
      </div>
      <div>
        <number-of-t-and-s></number-of-t-and-s>
        <child-attendance></child-attendance>
      </div>
      <div>
        <personnel-trends></personnel-trends>
      </div>
    </div>
    <div>
      <my-menu />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SurveillanceVideo from "@/views/home/components/surveillanceVideo.vue";
import ChildAttendance from "@/views/home/components/childAttendance.vue";
import ActiveTeacher from "@/views/home/components/activeTeacher.vue";
import ActiveClass from "@/views/home/components/activeClass.vue";
import NumberOfTAndS from "@/views/home/components/numberOfTAndS.vue";
import PersonnelTrends from "@/views/home/components/personnelTrends.vue";
import MyMenu from "@/views/home/components/menu.vue";
// import Banner from "@/views/home/components/banner.vue";

export default defineComponent({
  name: "home",
  components: {
    // Banner,
    MyMenu,
    PersonnelTrends,
    NumberOfTAndS,
    ActiveClass,
    ActiveTeacher,
    ChildAttendance,
    SurveillanceVideo,
  },
});
</script>

<style scoped lang="less">
.home {
  padding-right: 40px;
  display: flex;
  > div {
    height: 100%;
    &:first-child {
      flex: 1;
      > div {
        display: flex;
        justify-content: space-between;

        flex-wrap: wrap;
        > div {
          margin-top: 24px;
        }
      }
    }
    &:last-child {
      margin-top: 24px;
      margin-left: 24px;
      width: 440px;
    }
  }
}
</style>
