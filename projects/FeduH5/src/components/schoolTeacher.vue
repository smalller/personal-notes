<template>
  <div class="content">
    <div
      class="jsy-content"
      v-if="teacherInfo"
    >
      <div class="school">
        <div>
          <span
            class="school-name"
            :style="{color:theme.titleColor,borderBottom: '3px solid ' + theme.lineColor + ''}"
          >教师风采</span>
        </div>
        <img
          style="width: 35px; margin-top: 3vw"
          :src="theme.icon"
        />
      </div>
      <div
        class="teacher-content"
        v-for="(item,index) in teacherInfo"
        :key="index"
      >

        <div
          v-if="teacherInfo.length!== 0"
          :class=" item.boxIndex === 1 ?'teacher-box':item.boxIndex  === 3 ?'teacher-box2':'teacher-box1'"
        >
          <van-image
            round
            fit="cover"
            :class=" (index+1)%2 === 1 ?'teacher-img' : 'teacher-img1'"
            :style="{border: '3px solid ' + theme.borderColor + ''}"
            :src="item.imgUrl"
          />
          <p :class=" (index+1)%2 === 1 ?'teacher-name' : 'teacher-name1'">{{item.names}}老师</p>
          <span>{{ item.workRemark }}</span>
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
      teacherInfo: []
    };
  },
  created() {

  },
  mounted() {
    console.log(this.school.teacherRemark)
    if (this.school.teacherRemark !== undefined) {
      this.setData()
    }
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
  },
  methods: {

    setData() {
      this.teacherInfo.length = 0
      let k = 1
      for (let i = 0; i < this.school.teacherRemark.length; i++) {
        this.school.teacherRemark[i].boxIndex = k
        if (k === 3) {
          k = 1
        } else {
          k++
        }
        this.teacherInfo.push(this.school.teacherRemark[i])
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
  margin-top: 10vh;
  margin-bottom: 5vh;
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
.teacher-content {
  //max-height: 50vh;
  //overflow: scroll;
  margin-bottom: 10px;
}
.teacher-box {
  width: 80%;
  background-color: #fff2e4;
  border-radius: 20px;
  box-shadow: 0rem 0rem 10px rgba(0, 0, 0, 0.16);
  margin: auto;
  margin-top: 5vh;
  margin-bottom: 8vh;

  span {
    display: block;
    width: 85%;
    margin: auto;
    font-weight: 500;
    font-size: 14px;
    padding-top: 15px;
    overflow: hidden;
    padding-bottom: 20px;
    text-align: left;
  }
}

.teacher-box1 {
  width: 80%;
  background-color: #dcf4ff;
  border-radius: 20px;
  box-shadow: 0rem 0rem 10px rgba(0, 0, 0, 0.16);
  margin: auto;
  margin-top: 5vh;

  margin-bottom: 8vh;
  span {
    display: block;
    width: 85%;
    margin: auto;
    font-weight: 500;
    font-size: 14px;
    padding-top: 15px;
    overflow: hidden;
    padding-bottom: 20px;
    text-align: left;
  }
}
.teacher-box2 {
  width: 80%;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0rem 0rem 10px rgba(0, 0, 0, 0.16);
  margin: auto;
  margin-top: 5vh;

  margin-bottom: 8vh;

  span {
    display: block;
    width: 85%;
    margin: auto;
    font-weight: 500;
    font-size: 14px;
    padding-top: 15px;
    overflow: hidden;
    padding-bottom: 20px;

    text-align: left;
  }
}
.teacher-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  // border: 3px solid #f1c929;
  float: left;
  margin-top: -30px;
  margin-left: 25px;
}
.teacher-img1 {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  // border: 3px solid #f1c929;
  float: right;
  margin-top: -30px;
  margin-right: 25px;
}
.teacher-name {
  display: block;
  font-size: 22px;
  float: right;
  margin-right: 23px;
  font-weight: 600;
  width: 36vw;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 10px;
}
.teacher-name1 {
  display: block;
  font-size: 22px;
  float: left;
  margin-left: 23px;
  font-weight: 600;
  width: 36vw;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 10px;
}
.jsy-footer {
  background: url("../assets/school/footer.png") no-repeat;
  width: 100%;
  height: 40vh;
  background-size: 100% 100%;
  position: absolute;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/footer.png',sizingMethod='scale');
}
</style>
