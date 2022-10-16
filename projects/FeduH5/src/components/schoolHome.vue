<template>
  <div class="content">
    <div
      class="jsy-head"
      :style="{backgroundImage:'url(' + theme.header + ')'}"
    >
    </div>
    <div>
      <!-- <img
        style="width: 50%; margin-top: 10px"
        src="../assets/school/002.png"
      /> -->
    </div>
    <div class="jsy-content">
      <div class="school">
        <div>
          <span
            class="school-name"
            :style="{color:theme.titleColor,borderBottom: '3px solid ' + theme.lineColor + ''}"
          >{{ school.schoolName }}</span>
        </div>
        <img
          style="width: 35px; margin-top: 2vw"
          :src="theme.icon"
        />
      </div>
      <div
        class="school-address"
        :style="{color:theme.addressColor}"
      >
        <p>
          地址：<span>{{ school.schoolAreaName }}</span>
        </p>
        <div
          class="school-map"
          :style="{border: '4px solid ' + theme.borderColor + ''}"
        >
          <div
            id="myMap"
            ref="allmap"
            class="school-maps"
          ></div>
        </div>
        <img
          class="content-imgs"
          src="../assets/school/001.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
var map = null;
import schoolFooter from "./schoolFooter.vue";
export default {
  components: { schoolFooter },
  props: {
    school: {
      type: Object,
      default: () => {
        return {};
      },
    },
    theme: {
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  data() {
    return {
      isShow: false,
      type: 1,
      geoc: null,
      mapInfo: "",
    };
  },
  mounted() {
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
    this.mapBuild();
  },
  methods: {
    //地图显示
    mapBuild() {
      let that = this;
      that.geoc = new BMap.Geocoder();
      this.dialogMap = !this.dialogMap;
      setTimeout(function () {
        that.mapInfo = new BMap.Map("myMap");
        map = that.mapInfo;
        let point = "";
        if (that.school.schoolGps) {
          let gps = that.school.schoolGps.split(",");
          point = new BMap.Point(gps[1], gps[0]);
          let marker = new BMap.Marker(point); // 创建标注
          map.addOverlay(marker);
          map.centerAndZoom(point, 16);
          map.enableScrollWheelZoom();
          map.disableDragging();
        }
      }, 1000);
    },
  },
};
</script>

<style scoped lang="less">
.jsy-head {
  // background: url("../assets/school/school.png") no-repeat;
  width: 95vw;
  // padding-top: 20px;
  // margin-left: 16px;
  height: 95vw/2;
  background-size: 100% 100%;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/sun.png',sizingMethod='scale');
}
.school {
  display: inline-flex;
  margin-top: 16px;
}
.school-name {
  font-size: 22px;
  font-weight: 400;
  // color: #1c1c1c;
  letter-spacing: 1px;
  // border-bottom: 3px solid #f1c929;
  height: 45px;
  margin: auto;
}
.school-address {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  font-weight: 400;
  // color: #1c1c1c;
  letter-spacing: 1px;
  height: 45px;
}
.content {
  margin-top: 10vw;
  height: 130vw;
}
.school-map {
  width: 80vw;
  height: 80vw/1.6;
  background: rgba(0, 0, 0, 0);
  // border: 3px solid #f1c929;
  box-shadow: 0rem 0rem 3px rgba(28, 87, 190, 0.38);
  border-radius: 25px;
  margin: auto;
  margin-top: 50px;
}
.school-maps {
  // width: 100%;
  height: 100%;
  border-radius: 20px;
}
.content-imgs {
  margin-top: 25px;
  width: 60%;
}
</style>
