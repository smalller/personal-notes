<template>
  <div ref="editor"></div>
  <cms-upload ref="cmsUpload" />
</template>
<script lang="ts">
import Wangeditor from "./index";
import CmsUpload from "@/base/cmsUpload.vue";
export default {
  components: {
    CmsUpload,
  },
  ...Wangeditor,
};
</script>
<style lang="less" scoped></style>
