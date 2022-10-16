<template>
  <div class="content">
    <div class="jsy-content">
      <div class="school">
        <div>
          <span
            class="school-name"
            :style="{color:theme.titleColor,borderBottom: '3px solid ' + theme.lineColor + ''}"
          >作品墙</span>
        </div>
        <img
          style="width: 35px; margin-top: 3vw"
          :src="theme.icon"
        />
      </div>
      <div class="work-content">
        <div
          v-for="(item, index) in stuInfo"
          class="teacher"
          :key="index"
          v-show="item.imgUrl"
        >
          <div
            class="teacher-box"
            :style="{border: '3px solid ' + theme.borderColor + ''}"
          >
            <el-image
              fit="cover"
              class="teacher-img"
              :src="item.imgUrl"
              :preview-src-list=" index === 1 ? '' :[item.imgUrl]"
            >
            </el-image>
          </div>
          <span :style="{color:theme.workColor}">{{item.names}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    school: {
      type: Object,
      default: () => {
        return {}
      }
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
      stuInfo: [],
      img: require("../../src/assets/school/demo.png"),
    };
  },
  mounted() {
    if (this.school.stuWork !== undefined) {
      this.setData()
    }
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
  },
  methods: {
    setData() {
      this.stuInfo.length = 0
      let k = 1

      for (let i = 0; i < this.school.stuWork.length; i++) {
        this.school.stuWork[i].boxIndex = k
        // if (i === 1) {
        //   this.stuInfo.push({
        //     imgUrl: this.img
        //   })
        // }
        this.stuInfo.push(this.school.stuWork[i])
        // if (this.school.stuWork.length === 1) {
        //   this.stuInfo.push({
        //     imgUrl: this.img
        //   })
        // }
      }
    }
  },
};
</script>

<style scoped lang="less">
.jsy-head {
  background: url("../assets/school/sun.png") no-repeat;
  width: 100%;
  margin-top: 25px;
  background-size: 95% 75%;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/sun.png',sizingMethod='scale');
}
.school {
  display: inline-flex;
  margin-top: 70px;
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
.work-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
}

.teacher {
  // width: 40vw;
  margin-bottom: 20px;
  span {
    display: block;
    text-align: center;
    margin-top: 10px;
    margin-left: 25px;
  }
}

.teacher-box {
  width: 38vw;
  margin-left: 25px;
  height: 40vw/1.2;
  margin-right: 5px;
  overflow: hidden;
  border-radius: 8px;
  // border: 3px solid #f1c929;
  opacity: 1;
  span {
    display: block;
    font-size: 14px;
    margin-top: -20px;
    font-weight: 400;
  }
}

.teacher-img {
  width: 100%;
  height: 100%;
  // border-radius: 10px;
  // border: 3px solid #f1c929;
  // box-shadow: 0rem 0rem 10px rgba(0, 0, 0, 0.16);
  // margin-top: 5vh;
  // width: 38.1vw;
  // height: 38vw/1.1;
  // box-shadow: 0rem 0rem 10px rgba(0, 0, 0, 0.16);
  img {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
