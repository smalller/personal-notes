<template>
  <div class="card-drag-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="sort">重置顺序</el-button>
        <el-button type="primary" @click="reload">重载页面</el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-row :gutter="20">
      <vab-draggable :list="iconList" v-bind="dragOptions">
        <el-col
          v-for="(item, index) in iconList"
          :key="item.color + index"
          :lg="3"
          :md="3"
          :sm="6"
          :xl="3"
          :xs="12"
        >
          <el-card class="icon-panel" shadow="hover">
            <vab-remix-icon :icon="item.icon" :style="{ color: item.color }" />
            <p>按住拖拽</p>
          </el-card>
        </el-col>
      </vab-draggable>
    </el-row>
  </div>
</template>
<script>
  import { getIconList } from '@/api/remixIcon'
  import vabDraggable from 'vuedraggable'
  import { shuffle } from '@/utils/array'

  export default {
    name: 'CardDrag',
    components: {
      vabDraggable,
    },
    data() {
      return {
        iconList: [],
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      randomHexColor() {
        const arr = [
          '#1890FF',
          '#36CBCB',
          '#4ECB73',
          '#FBD437',
          '#F2637B',
          '#975FE5',
        ]
        return shuffle(arr)
      },
      async fetchData() {
        const { data } = await getIconList({
          pageNo: 1,
          pageSize: 32,
        })
        this.iconList = data.map((icon, index) => {
          return { icon, color: this.randomHexColor(), order: index + 1 }
        })
      },
      sort() {
        const iconList = this.iconList
        this.iconList = iconList.sort((a, b) => a.order - b.order)
      },
      reload() {
        this.$baseEventBus.$emit('reload-router-view')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .icon-panel {
    height: 120px;
    text-align: center;
    cursor: move;
    user-select: none;

    &:hover {
      i {
        transform: scale(1.15);
      }
    }

    i {
      display: block;
      width: 50px;
      height: 50px;
      margin: auto;
      font-size: 40px;
      transition: all ease-in-out 0.3s;
    }

    p {
      margin-top: 10px;
    }
  }
</style>
