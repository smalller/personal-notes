<template>
<div class="about" >
 <div class="about-body">
   <div class="about-img">
     <img src="../assets/image/aboutBg.png" alt="">
   </div>
    <div>
      <span class="about-title">关于我们</span>
      <span class="about-title1">金树丫是非络通达科技有限公司旗下的家校共育平台子公司，金树丫一直以教育信 息化为核心，专注幼教行业的互联网公司，致力打造具智慧家园共育系统，为家长、园长、幼师和第三方幼教机构打造一个高效、便捷的教育服务平台。截止目前，已与全国500+家经销商达成合作，获得500W+用户认可。</span>
           <span style="display:block;margin-top:30px" class="about-title1">金树丫将持续提升开发平台的能力，为建设幼教服务生态圈赋能全面布局园长大学、线上教研、家长课堂等，构建学前教育新生态。</span>
    </div>
 </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {

  },
}
</script>

<style scoped lang="less">
.about{
  background:#FFF0A4;
  min-height: 100vh;
  position: fixed !important;
  padding-top: 44px;
  top: 0;
  width: 100%;
  bottom: 0;
  z-index: 1;
}
.about-body {
  box-sizing: border-box;

  position: absolute;
  padding-top: 44px;
  top: 0;
  width: 100%;
  bottom: -4px;
  min-height:100vh;
  z-index:1;
  .about-img {
    width: 100%;
    height: auto;
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    img{
      width: 100%;
    }
  }
  .about-title{
    display: block;
    padding-top: 40px;
    padding-bottom: 24px;
    margin-left: 15px;
    font-size: 22px;
    text-align: center;
    font-weight: 700;
    color: #1E1E1E;
    opacity: 1;
  }
  .about-title1{
    text-indent: 2em;
    display: block;
    box-sizing: border-box;
    text-align: left;
    padding: 0 16px;
    font-size: 16px;
    font-weight: 500;
    color: #4c2609;
    opacity: 1;
    line-height: 26px;


  }
}

</style>
