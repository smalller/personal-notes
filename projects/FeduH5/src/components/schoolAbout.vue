<template>
  <div class="content">
    <div class="jsy-content">
      <div
        class="jsy-head"
        :style="{backgroundImage:'url(' + theme.center + ')'}"
      >
        <div class="head-content">
          <p>关于我们</p>
          <span ref="detailDom">{{ school.schoolDescribe }}</span>
          <div
            v-if="showDetailBtn"
            class="head-more"
            @click="showAbout"
          >
            查看更多<i class="el-icon-arrow-down"></i>
          </div>
        </div>
      </div>
      <img
        class="content-img"
        style="margin-top:-20%"
        :src="theme.centerImg"
        alt=""
      />
      <div class="photo-content">
        <div
          v-for="(item,index) in school.publicity"
          :key="index"
          v-show="item.imgUrl"
          class="photo"
          :style="{border: '3px solid ' + theme.borderColor + ''}"
        >
          <el-image
            fit="cover"
            class="photo-img"
            :src="item.imgUrl"
            :preview-src-list="[item.imgUrl]"
          >
          </el-image>
        </div>
      </div>
      <van-popup
        v-model="centerDialogVisible"
        :style="{ height: '70%' }"
      >
        <div class="header-show">
          <p>关于我们</p>
          <span>{{ school.schoolDescribe }}</span>
        </div>
      </van-popup>
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
      prjDetail: "",   // 详情
      showDetailBtn: false,    // 是否显示“详情”按钮
      centerDialogVisible: false
    };
  },
  mounted() {
    // 判断内容是否溢出
    this.showDetailBtnFun();
    window.addEventListener('resize', this.showDetailBtnFun());
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
  },
  methods: {
    showAbout() {
      this.centerDialogVisible = !this.centerDialogVisible
      // this.$emit('show')
    },
    showDetailBtnFun() {
      this.$nextTick(() => {
        // this.showDetailBtn = true
        let num = this.$refs.detailDom.offsetHeight / 22;
        num > 4 ? this.showDetailBtn = true : this.showDetailBtn = false;
      })
    },
  },
};
</script>

<style lang="less">
.el-image-viewer__mask {
  opacity: 1;
}
</style>
<style scoped lang="less">
.head-dialog /deep/ .el-dialog {
  border-radius: 20px;
  max-height: 500px;
  overflow: scroll;
}
.head-dialog /deep/ .el-dialog__header {
  padding-top: 0px;
}
.jsy-head {
  background: no-repeat;
  width: 90vw;
  // height: 350px;
  height: 90vw/1.1;
  margin: auto;
  margin-top: 5vh;
  // margin-left: 20px;
  background-size: 100% 75%;
}
.head-content {
  display: block;
  padding-top: 10%;
  width: 80%;
  margin-left: 10%;
  p {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 2px;
  }
  span {
    display: block;
    margin-top: 14px;
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    display: -webkit-box;
    width: 98%;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
}
.head-more {
  color: #ffffff;
  font-size: 14px;
}
.head-show {
  display: block;
  margin-top: 14px;
  width: 100%;
  p {
    font-size: 18px;
    font-weight: 600;
    color: #1c1c1c;
    letter-spacing: 2px;
  }
  span {
    display: block;
    margin-top: 10px;
    color: #1c1c1c;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: 1px;
  }
}
.content-img {
  float: left;
  width: 60%;
  margin-left: 10%;
}
.content-imgs {
  position: absolute;
  width: 60%;
  margin-left: 0%;
  margin-top: -5px;
}
.photo-content {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  margin-left: 8vw;
}
.photo {
  width: 39.2vw;
  height: 32.6vw;
  margin-right: 8px;
  margin-bottom: 14px;
  overflow: hidden;
  border-radius: 8px;
  // border: 3px solid #f1c929;
  opacity: 1;
}
.photo-img {
  width: 100%;
  height: 100%;
  img {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}

.jsy-footer {
  background: url("../assets/school/footer.png") no-repeat;
  width: 100%;
  height: 80vw;
  background-size: 100% 100%;
  position: absolute;
  overflow: hidden;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/footer.png',sizingMethod='scale');
}
.van-popup {
  height: 30%;
  border-radius: 20px;
  z-index: 9999;
}
.header-show {
  width: 300px;
  border-radius: 20px;
  margin: auto;
  margin-top: 24px;

  p {
    display: block;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    letter-spacing: 2px;
  }
  span {
    display: block;
    width: 90%;
    margin: auto;
    font-size: 14px;
    text-align: left;
    font-weight: 400;
    color: #1c1c1c;
    letter-spacing: 1px;
  }
}
</style>
