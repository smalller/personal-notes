<template>
  <screen-box :right-btn="true" class="screenActive" title="园所幼儿数排行">
    <div class="screenChartBox">
      <ul>
        <li v-for="(item, index) in option" :key="index">
          <div class="top-box">
            <div class="school-name">{{ item.name }}</div>
            <div class="right-box">
              <span class="people">{{ item.peopleNum }}人</span>
              <span class="nvr">监控{{ item.nvrNum }}个</span>
            </div>
          </div>
          <div
            class="botom-box"
            :style="{ width: calcBarLen(item.peopleNum) + '%' }"
          ></div>
        </li>
      </ul>
    </div>
  </screen-box>
</template>

<script>
  import ScreenBox from './screenBox.vue'
  export default {
    components: { ScreenBox },
    data() {
      return {
        option: [
          {
            name: '星光幼儿园成都高新校区',
            peopleNum: 235,
            nvrNum: 20,
          },
          {
            name: '星光幼儿园成都高新校区',
            peopleNum: 100,
            nvrNum: 8,
          },
          {
            name: '星光幼儿园成都高新校区',
            peopleNum: 23,
            nvrNum: 10,
          },
          {
            name: '星光幼儿园成都高新校区',
            peopleNum: 235,
            nvrNum: 20,
          },
          {
            name: '星光幼儿园成都高新校区',
            peopleNum: 100,
            nvrNum: 8,
          },
        ],
      }
    },
    mounted() {},
    methods: {
      // 计算柱状长度
      calcBarLen(num) {
        const numArr = this.option
          .map((item) => item.peopleNum)
          .sort((a, b) => {
            return a + b
          })
        if (+num === +numArr[0]) {
          return 100
        } else {
          return (+num / +numArr[0]).toFixed(2) * 100
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .screenActive {
    display: flex;
    flex-direction: column;
    // height: 2;
    // width: 100% !important;
    .screenChartBox {
      flex: 1;
      position: relative;
      margin-top: 12px;
      > ul {
        > li {
          margin-bottom: 14px;
          .top-box {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            .school-name {
              color: #acd3fc;
            }
            .right-box {
              > span {
                display: inline-block;
              }
              .people {
                color: #4aeceb;
                width: 70px;
                text-align: left;
              }
              .nvr {
                // margin-left: 36px;
                color: #f9eb8f;
                width: 60px;
                text-align: left;
              }
            }
          }
          .botom-box {
            height: 8px;
            background: linear-gradient(180deg, #4fa8f9 0%, #0f5eff 100%);
            border-radius: 10px;
            margin-top: 4px;
          }
        }
      }
    }
    .screenChart {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
