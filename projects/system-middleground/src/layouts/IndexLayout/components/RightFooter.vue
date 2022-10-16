<template>
  <div class="indexlayout-right-footer">
    <div class="footer-links">
      <a href="#" target="_blank" rel="noreferrer">
        帮助
      </a>
      <a href="#" target="_blank" rel="noreferrer">
        隐私
      </a>
      <a href="#" target="_blank" rel="noreferrer">
        条款
      </a>
    </div>
    <div class="botom-text">
      <p>本产品由中国民生银行提供金融支持</p>
      <p>copyright ©2022 成都在线支点教育科技出品 </p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: 'RightFooter',
  components: {
  }
})
</script>
<style lang="scss" scoped>
.indexlayout-right-footer {
  // position: fixed;
  // left: calc(50% + 60px);
  // transform: translateX(-50%);
  // bottom: 30px;
  // overflow: hidden;
  // text-align: center;
  // font-size: 14px;
  // color: #858687;
  width: 100%;
  bottom: 30px;
  margin-bottom: 30px;
  text-align: center;
  font-size: 14px;
  color: #858687;

  .footer-links {
    margin-bottom: 17px;

    a {
      font-size: 14px;
      margin-right: 40px;
      color: #858687;
      text-decoration: none;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        color: #515a6e;
      }
    }
  }

  .botom-text {
    p {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
}
</style>