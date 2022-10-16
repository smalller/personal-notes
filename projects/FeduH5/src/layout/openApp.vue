<template>
<div :class="isOpen?'openAppBox':'openAppBos'">
  <div class="show" v-if="isOpen">
  <open-app-head :params="params"></open-app-head>
  </div>
  <div class="boxContent">
    <slot></slot>
  </div>
</div>
</template>

<script>
import OpenAppHead from "@/components/openAppHead";
export default {
  name: "openAppBox",
  components: {OpenAppHead},
  props: {
    params: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
    open:{
      type: Boolean,
      default:()=>{
        return true
      }
    }
  },
  data() {
    return{
      isOpen: '',
    }
  },
  mounted() {
    console.log(this.open,'799999999999999')
   console.log(this.isOpen,'7777777777777777')
  },
  watch: {
    open:{
      handler(){
            this.isOpen = !this.open;  
      },
      deep: true,
      immediate:true
    }
  }
}
</script>

<style scoped lang="less">
.openAppBox{
  position: relative;
  padding-top: 44px;
  padding-bottom: 44px;
}
.openAppBos{
  position: relative;
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
