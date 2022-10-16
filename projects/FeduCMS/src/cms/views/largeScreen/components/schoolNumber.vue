<template>
  <div class="schoolNumber">
    <div class="bar">
      <div class="barbox">
        <ul class="clearfix">
          <li class="pulll_left counter">{{ schoolNum }}</li>
          <li class="pulll_left counter">{{ stuNum }}</li>
          <li class="pulll_left counter">{{ cameraNum }}</li>
          <li class="pulll_left counter">{{ vipNum }}</li>
          <li class="pulll_left counter">{{ settleNum }}</li>
          <li class="pulll_left counter">{{ notSettleNum }}</li>
        </ul>
      </div>
      <div class="barbox2">
        <ul class="clearfix">
          <li class="pulll_left">园所总数</li>
          <li class="pulll_left">幼儿总数</li>
          <li class="pulll_left">监控总数</li>
          <li class="pulll_left">会员总数</li>
          <li class="pulll_left">入驻App总数</li>
          <li class="pulll_left">未入驻App总数</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { query8id } from '@/cms/api/information'
  export default {
    data() {
      return {
        schoolNum: 0,
        stuNum: 0,
        cameraNum: 0,
        vipNum: 0,
        settleNum: 0,
        notSettleNum: 0,
      }
    },
    mounted() {
      this.query8id()
    },
    methods: {
      async query8id() {
        const mobile = sessionStorage.getItem('mobile')
        const { code, data } = await query8id(mobile)
        if (+code === 0) {
          this.schoolNum = data.schoolNum || 0
          this.stuNum = data.stuNum || 0
          this.cameraNum = data.cameraNum || 0
          this.settleNum = data.settleNum || 0
          this.notSettleNum = +data.stuNum - +data.settleNum
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @font-face {
    font-family: electronicFont;
    src: url(../font/DS-DIGIT.TTF);
  }
  .schoolNumber {
    position: relative;
    width: 100%;
    z-index: 100;

    .pulll_left {
      float: left;
    }
    .clearfix:after,
    .clearfix:before {
      display: table;
      content: ' ';
    }
    .clearfix:after {
      clear: both;
    }
    .bar {
      background: rgba(101, 132, 226, 0.1);
      padding: 0.15rem;
      height: 100%;
      box-sizing: border-box;
    }
    .barbox li,
    .barbox2 li {
      width: 33.33333%;
      text-align: center;
      position: relative;
    }
    .barbox:before,
    .barbox:after {
      position: absolute;
      width: 0.3rem;
      height: 0.1rem;
      content: '';
    }
    .barbox:before {
      border-left: 2px solid #02a6b5;
      left: 0;
      border-top: 2px solid #02a6b5;
    }
    .barbox:after {
      border-right: 2px solid #02a6b5;
      right: 0;
      bottom: 0;
      border-bottom: 2px solid #02a6b5;
    }

    .barbox li:before {
      position: absolute;
      content: '';
      height: 50%;
      width: 1px;
      background: rgba(255, 255, 255, 0.2);
      right: 0;
      top: 25%;
    }

    .barbox {
      border: 1px solid rgba(25, 186, 139, 0.17);
      position: relative;
      height: 0.94rem;
    }
    .barbox li {
      font-size: 0.667rem;
      color: #ffeb7b;
      padding: 0.05rem 0;
      font-family: Gotham, 'Helvetica Neue', Helvetica, Arial, 'sans-serif';
      font-weight: bold;
      font-family: electronicFont;
      width: 16.6666%;
    }
    .barbox2 li {
      margin-top: 0.1rem;
      font-size: 0.16rem;
      color: rgba(255, 255, 255, 0.7);
      width: 16.6666%;
    }
  }
</style>
