<template>
  <div class="model-box">
    <div class="model" @click="showSelectList">
      <span :class="['model-value']">{{ modelLabel || '全园' }}</span>
      <i :class="['iconfont', icon]"></i>
    </div>
    <div v-show="showSelectStatus" id="dataBox" class="data-list">
      <ul>
        <li
          v-for="(item, index) in option"
          :key="index"
          :class="['item', item.label === modelLabel ? 'selected-item' : '']"
          @click="chooseItem(item)"
        >
          {{ item.label + '年' }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      option: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        modelLabel: '',
        icon: 'icon-xiajiantou',
        showSelectStatus: false,
      }
    },

    mounted() {
      const classList = ['model-value']
      const nodeList = ['I']
      // 当点击出下拉框本身以外的地方时，就隐藏下拉框选项列表
      document.onclick = (e) => {
        const className = e.target.className
        const nodeName = e.target.nodeName
        if (!classList.includes(className) && !nodeList.includes(nodeName)) {
          this.initStyle()
        }
      }
    },
    methods: {
      // 打开/隐藏列表
      showSelectList() {
        this.showSelectStatus = !this.showSelectStatus
        if (this.showSelectStatus) {
          this.icon = 'icon-shangjiantou'
        } else {
          this.icon = 'icon-xiajiantou'
        }
      },

      // 初始化样式
      initStyle() {
        this.showSelectStatus = false
        this.icon = 'icon-xiajiantou'
      },

      // 选择
      chooseItem(item) {
        this.modelLabel = item.label
        this.$emit('selectItem', item)
        this.initStyle()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .model-box {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    user-select: none;

    .model {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      color: #acd3fc;
      > i {
        font-size: 10px;
      }
      .model-value {
        font-size: 0.18rem;
        margin-right: 4px;
        max-width: 2rem;
      }
      .icon {
        font-size: 8px;
        color: #666666;
      }
    }

    .data-list {
      width: 200px;
      height: 182px;
      overflow: auto;
      padding: 6px 0;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      position: absolute;
      top: 24px;
      left: 0;
      z-index: 9;

      // 滚动条宽度
      &::-webkit-scrollbar {
        width: 6px;
      }
      // 滚动条中滑块的样式
      &::-webkit-scrollbar-thumb {
        background-color: #bfbfbf;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
      }

      > ul > li {
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        color: #222222;
        padding: 0 19px 0 33px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item:hover {
        background: #f0f0f0;
      }

      .item.selected-item {
        background-color: #fff;
      }

      .selected-item {
        position: relative;
        color: #409eff;

        &::before {
          display: block;
          font-family: 'iconfont';
          content: '\e68f';
          position: absolute;
          top: 0;
          left: 10px;
          line-height: 34px;
          font-size: 10px;
        }
      }
    }
  }
</style>
