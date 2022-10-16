<template>
  <div class="addHospital">
    <div v-loading="loading" class="map">
      <el-input
        v-model="mapName"
        placeholder="请输入搜索地址"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="mapNameChange"
        ></el-button>
      </el-input>

      <div id="container" ref="allmap" style="height: 200px; width: 100%"></div>
      <div v-if="mapPointName" style="padding: 10px 0">
        当前选中：{{ mapPointName }}
      </div>
    </div>
  </div>
</template>

<script>
  let map = null,
    geoc = null
  export default {
    name: 'AddHospital',
    data() {
      return {
        dialogMap: false,
        mapName: '',
        mapPointName: '',
        loading: false,
        mapGetshow: true,
        dialogName: '',
      }
    },
    created() {
      this.mapBuild()
    },
    methods: {
      //搜索地图
      mapNameChange() {
        let that = this,
          point,
          marker = null
        let local = new BMap.LocalSearch(map, {
          renderOptions: { map: map },
          onSearchComplete: (res) => {
            if (local.getResults() != undefined) {
              map.clearOverlays() //清除地图上所有覆盖物
              if (local.getResults().getPoi(0)) {
                point = local.getResults().getPoi(0).point //获取第一个智能搜索的结果
                map.centerAndZoom(point, 10)
                marker = new BMap.Marker(point) // 创建标注
                map.addOverlay(marker) // 将标注添加到地图中
                marker.enableDragging() // 可拖拽
                geoc.getLocation(point, function (rs) {
                  var addComp = rs.addressComponents
                  console.log(addComp)
                  that.mapPointName =
                    addComp.province +
                    ', ' +
                    addComp.city +
                    ', ' +
                    addComp.district +
                    ', ' +
                    addComp.street +
                    ', ' +
                    addComp.streetNumber
                })
              } else {
                alert('未匹配到地点!可拖动地图上的红色图标到精确位置')
              }
            } else {
              alert('未找到搜索结果')
            }
          },
        })
        local.search(this.mapName)
      },
      //地图显示
      mapBuild() {
        let that = this
        this.dialogMap = !this.dialogMap
        setTimeout(function () {
          if (that.mapGetshow) {
            map = new BMap.Map('container')
            geoc = new BMap.Geocoder()
            let point = new BMap.Point(104.072458, 30.578248)
            map.centerAndZoom(point, 10)
            map.enableScrollWheelZoom()
            var geolocation = new BMap.Geolocation()
            //定位
            // geolocation.getCurrentPosition(
            //   (r) => {
            //     console.log(r)
            //     var mk = new BMap.Marker(r.point)
            //     map.addOverlay(mk)
            //     map.panTo(r.point)
            //     geoc.getLocation(r.point, function (rs) {
            //       var addComp = rs.addressComponents
            //       console.log(addComp)
            //       that.mapPointName =
            //         addComp.province +
            //         addComp.city +
            //         addComp.district +
            //         addComp.street +
            //         addComp.streetNumber
            //       that.loading = false
            //       that.mapGetshow = false
            //     })
            //   },
            //   { enableHighAccuracy: true }
            // )
            //鼠标点击
            map.addEventListener('click', function (e) {
              console.log(e)
              var pt = e.point
              var marker = new BMap.Marker(pt) // 创建标注
              map.clearOverlays()
              map.addOverlay(marker)
              geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents
                console.log(addComp)
                that.mapPointName =
                  addComp.province +
                  addComp.city +
                  addComp.district +
                  addComp.street +
                  addComp.streetNumber
              })
            })
          }
        }, 1000)
      },
    },
  }
</script>
<style scoped lang="scss">
  .addHospital {
    width: 100%;
    height: 100%;
    .map {
      padding: 10px;

      .map-btn {
        padding: 10px 20px;
        margin: auto;
        text-align: right;
        button {
          padding: 12px 30px;
        }
      }
    }
  }
</style>
