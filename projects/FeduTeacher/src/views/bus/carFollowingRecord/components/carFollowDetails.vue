<template>
  <el-drawer v-model="visible" custom-class="carFollowDetails" :size="900">
    <div class="content">
      <div class="titleBox">
        <div class="title">川A123456 阳光1号【环球中心~学校】上学</div>
        <div class="status">
          <ui-tag type="success" v-if="+enableStatus === 1">正常</ui-tag>
          <ui-tag type="warning" v-if="+enableStatus === 2">维护中</ui-tag>
          <ui-tag type="danger" v-if="+enableStatus === 9">已删除</ui-tag>
        </div>
      </div>
      <div class="infoBox">
        <span>跟车老师：李晓华 (15968687568)</span>
        <span>开始：2021-08-24 16:30</span>
        <span>结束：未结束</span>
      </div>
      <div class="remark">备注：车辆故障，已妥善解决</div>
      <ui-tab
        class="tabBox"
        v-model:index="tableIndex"
        :list="['学生记录', '跟车地图']"
      ></ui-tab>
      <div class="dataBox scroll">
        <student-record v-if="tableIndex === 0" />
        <div class="mapBox" v-if="tableIndex === 1">
          <bus-map />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import StudentRecord from "./studentRecord.vue";
import BusMap from "@/views/bus/components/busMap.vue";

const visible = ref(false);
const enableStatus = ref(2);
const tableIndex = ref(0);
</script>

<style lang="less">
.carFollowDetails {
  padding: 0 40px;
  box-sizing: border-box;

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .titleBox {
    display: flex;
    align-items: center;
    .title {
      color: #222222;
      font-size: 20px;
      font-weight: 500;
    }
    .status {
      margin-left: 27px;
    }
  }
  .infoBox {
    margin-top: 5px;
    display: flex;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    span {
      margin-right: 20px;
    }
  }
  .remark {
    font-weight: 400;
    font-size: 12px;
    color: #f56060;
    margin-top: 5px;
  }
  .tabBox {
    margin-top: 20px;
  }
  .dataBox {
    margin-top: 20px;
    flex: 1;
    overflow-y: auto;
    padding-bottom: 20px;
    box-sizing: border-box;
    .mapBox {
      width: 100%;
      height: 100%;
      border: 1px solid #4fa8f9;
      box-sizing: border-box;
    }
  }
}
</style>
