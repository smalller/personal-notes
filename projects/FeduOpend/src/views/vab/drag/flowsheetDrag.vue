<template>
  <div class="flowsheet-drag-container">
    <el-scrollbar>
      <panel></panel>
    </el-scrollbar>
  </div>
</template>

<script>
  import Panel from './components/Panel'
  import './components/index.css'
  export default {
    name: 'FlowsheetDrag',
    components: {
      Panel,
    },
  }
</script>
