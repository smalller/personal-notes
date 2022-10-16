<template>
  <div
    ref="node"
    :style="nodeContainerStyle"
    :class="nodeContainerClass"
    @click="clickNode"
    @mouseup="changeNodeSite"
  >
    <!-- 最左侧的那条竖线 -->
    <div class="vab-node-left"></div>
    <!-- 节点类型的图标 -->
    <div class="vab-node-left-ico flow-node-drag">
      <i :class="nodeIcoClass"></i>
    </div>
    <!-- 节点名称 -->
    <div class="vab-node-text" :show-overflow-tooltip="true">
      {{ node.name }}
    </div>
    <!-- 节点状态图标 -->
    <div class="vab-node-right-ico">
      <i
        v-show="node.state === 'success'"
        class="el-icon-circle-check el-node-state-success"
      ></i>
      <i
        v-show="node.state === 'error'"
        class="el-icon-circle-close el-node-state-error"
      ></i>
      <i
        v-show="node.state === 'warning'"
        class="el-icon-warning-outline el-node-state-warning"
      ></i>
      <i
        v-show="node.state === 'running'"
        class="el-icon-loading el-node-state-running"
      ></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      node: {
        type: Object,
        default: () => {},
      },
      activeElement: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    computed: {
      nodeContainerClass() {
        return {
          'vab-node-container': true,
          'vab-node-active':
            this.activeElement.type === 'node'
              ? this.activeElement.nodeId === this.node.id
              : false,
        }
      },
      // 节点容器样式
      nodeContainerStyle() {
        return {
          top: this.node.top,
          left: this.node.left,
        }
      },
      nodeIcoClass() {
        let nodeIcoClass = {}
        nodeIcoClass[this.node.ico] = true
        // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
        nodeIcoClass['flow-node-drag'] = !this.node.viewOnly
        return nodeIcoClass
      },
    },
    methods: {
      // 点击节点
      clickNode() {
        this.$emit('click-node', this.node.id)
      },
      // 鼠标移动后抬起
      changeNodeSite() {
        // 避免抖动
        if (
          this.node.left === this.$refs.node.style.left &&
          this.node.top === this.$refs.node.style.top
        ) {
          return
        }
        this.$emit('change-node-site', {
          nodeId: this.node.id,
          left: this.$refs.node.style.left,
          top: this.$refs.node.style.top,
        })
      },
    },
  }
</script>
