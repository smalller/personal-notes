<template>
  <div class="busMap" id="busMap"></div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted } from "vue";
declare const BMapGL: any;
let mapGl: any;

onMounted(() => {
  mapGl = new BMapGL.Map("busMap");
  console.log(123, mapGl);
  initMap();
});

const initMap = () => {
  const point = new BMapGL.Point(104.074666, 30.558275);
  mapGl.centerAndZoom(point, 15);

  createStudentPoint();
  createStudentLine();
};

//增加学生点
const createStudentPoint = () => {
  // const marker = new BMapGL.Marker(new BMapGL.Point(104.074666, 30.558275));
  // marker.addEventListener("click", () => {
  //   console.log(123, marker);
  // });
  //
  // mapGl.addOverlay(marker);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const boyImg = require("@/assets/images/user/userIcon.png");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const girlImg = require("@/assets/images/user/userIcon.png");

  const html = `
  <div style="display: flex;align-items: center;padding: 2px;background: #F2647E;border-radius: 46px;color: #FFFFFF;">
  <img style="width:32px;height:32px;border-radius: 50%" src="${boyImg}" alt="">
  <span style="padding: 0 10px">12333</span>
  </div>
`;
  const point = new BMapGL.Point(104.074666, 30.558275);
  const label = new BMapGL.Label(html, {
    position: point,
  });
  label.setStyle({
    color: "#ffffff",
    borderRadius: "46px",
    borderColor: "#ccc",
    backgroundColor: "#F2647E",
    // padding: "0 10px",
    fontSize: "16px",
    fontFamily: "微软雅黑",
  });
  mapGl.addOverlay(label);
};

//渲染路径
const createStudentLine = () => {
  const polyline = new BMapGL.Polyline(
    [
      new BMapGL.Point(104.074666, 30.558275),
      new BMapGL.Point(104.075, 30.5583),
      new BMapGL.Point(104.1, 30.5584),
    ],
    { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 }
  );
  mapGl.addOverlay(polyline);
};

onBeforeMount(() => {
  mapGl = null;
});
</script>

<style scoped>
.busMap {
  width: 100%;
  height: 100%;
  background: #ffffff;
}
</style>
