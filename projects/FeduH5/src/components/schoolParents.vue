<template>
  <div class="content">
    <div class="jsy-content">
      <div class="school">
        <div>
          <span
            class="school-name"
            :style="{color:theme.titleColor,borderBottom: '3px solid ' + theme.lineColor + ''}"
          >家长留言</span>
        </div>
        <img
          style="width: 35px; margin-top: 3vw"
          :src="theme.icon"
        />
      </div>
      <div
        class="teacher-content"
        :style="{backgroundColor:theme.parentColor}"
      >
        <div
          :class="'teacher-box'"
          v-for="(item, index) in school.parentComments"
          :key="index"
        >
          <van-image
            round
            fit="cover"
            class="teacher-img"
            :src="item.imgUrl"
          />
          <p>{{item.names}}家长</p>

          <span :style="index === school.parentComments.length - 1? 'border:none':''">{{ item.workRemark }}</span>
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

    };
  },
  mounted() {
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
  },
  methods: {},
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
  margin-bottom: 60px;
}
.school-name {
  font-size: 22px;
  font-weight: 400;
  color: #1c1c1c;
  letter-spacing: 1px;
  border-bottom: 3px solid #f1c929;
  height: 45px;
  margin: auto;
}
.teacher-content {
  width: 80%;
  margin: auto;
  // background-color: #e8fce2;
  border-radius: 20px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  margin-bottom: 10px;
  //overflow: scroll;
}
.teacher-box {
  margin-top: 30px;
  border-radius: 20px;
  margin: auto;
  padding-top: 20px;
  p {
    display: block;
    font-size: 18px;
    font-weight: 600;
    margin-top: 10px;
    color: #1c1c1c;
    text-align: left;
  }
  span {
    display: block;
    width: 85%;
    margin: auto;
    font-weight: 500;
    font-size: 14px;
    padding-top: 18px;
    text-align: left;
    padding-bottom: 20px;
    border-bottom: 2px solid #e3e3e3;
  }
}
.teacher-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border-radius: 50%;
  float: left;
  margin-top: 5px;
  margin-left: 15px;
  margin-right: 10px;
}
.jsy-footer {
  background: url("../assets/school/footer.png") no-repeat;
  width: 100%;
  background-size: 100% 100%;
  position: absolute;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/footer.png',sizingMethod='scale');
}
</style>
