<template>
  <div class="largeScreenBg">
    <div class="map1">
      <img src="../images/lbx.png" alt="" />
    </div>
    <div class="map2">
      <img src="../images/jt.png" alt="" />
    </div>
    <div class="map3">
      <img src="../images/map.png" alt="" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LargeScreenBg',
  }
</script>

<style scoped lang="scss">
  .largeScreenBg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: url('../images/bg.jpg') center center no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      position: absolute;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .map1 {
      top: 36.5vh;
      width: 4rem;
      height: 4rem;
      z-index: 2;
      animation: myfirst2 15s infinite linear;
    }
    .map2 {
      top: 37vh;
      width: 3.9rem;
      height: 3.9rem;
      z-index: 3;
      opacity: 0.2;
      animation: myfirst 10s infinite linear;
    }
    .map3 {
      top: 38.5vh;
      width: 3.6rem;
      height: 3.6rem;
      // top: 35.2vh;
      // width: 4.2rem;
      // height: 4.2rem;
      z-index: 1;
      transform: scale(0.8);
      opacity: 0.6;
    }
    .map1,
    .map2,
    .map3 {
      position: absolute;
    }
    @keyframes myfirst2 {
      from {
        transform: rotate(0deg) scale(0.8);
      }
      to {
        transform: rotate(359deg) scale(0.8);
      }
    }

    @keyframes myfirst {
      from {
        transform: rotate(0deg) scale(0.8);
      }
      to {
        transform: rotate(-359deg) scale(0.8);
      }
    }
  }
</style>
