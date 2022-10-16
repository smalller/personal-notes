<template>
  <div class="content">
    <div class="jsy-content">
      <div class="school">
        <div>
          <span
            class="school-name"
            :style="{color:theme.titleColor,borderBottom: '3px solid ' + theme.lineColor + ''}"
          >报名中</span>
        </div>
        <img
          style="width: 35px; margin-top: 3vw"
          :src="theme.icon"
        />
      </div>
      <div class="work-content">
        <p :style="{color:theme.formColor}">招生条件</p>
        <span :style="{color:theme.formNameColor}">招生对象：{{school.admissionsCrowd}}</span>
        <span :style="{color:theme.formNameColor}">招生名额：{{school.admissionsNum}}</span>
        <span :style="{color:theme.formNameColor}">招生电话：{{school.admissionsTel}}</span>
        <p :style="{color:theme.formColor}">报名要求</p>
        <span :style="{color:theme.formNameColor}">{{school.admissionsPrecautions}}</span>
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
      isShow: false,
      type: 1,
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

.work-content {
  width: 98%;
  margin-top: 10px;
  text-align: left;
  padding-left: 10%;
  display: grid;
  //overflow: scroll;
  p {
    display: block;
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 22px;
    font-weight: 500;
    // color: #ff8000;
  }
  span {
    display: block;
    width: 90%;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 10px;
  }
}
</style>
