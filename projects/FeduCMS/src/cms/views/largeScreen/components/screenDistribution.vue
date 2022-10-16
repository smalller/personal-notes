<template>
  <screen-box :right-btn="true" class="screenDistribution" title="园所列表">
    <div slot="select" class="select-box">
      <select-com :option="option" @selectItem="selectItem"></select-com>
      <span class="school-num">23所学校</span>
    </div>
    <div class="body-box">
      <ul>
        <li v-for="(item, index) in 8" :key="index">
          <div class="top-box">
            <img
              :src="require('@/cms/assets/school-list/top-data1.png')"
              alt=""
            />
            <div class="school-info">
              <p class="name">星光幼儿园成都高新校区</p>
              <p class="address">四川省/成都市/高新区</p>
            </div>
          </div>
          <div class="botom-box">
            <div class="data-box">
              <div v-for="(item2, index3) in 6" :key="index3" class="item">
                <span class="num">26</span>
                <span class="name">班级数</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </screen-box>
</template>
<script>
  import ScreenBox from './screenBox.vue'
  import SelectCom from './selectCom.vue'
  export default {
    components: { ScreenBox, SelectCom },
    data() {
      return {
        option: [
          {
            label: '星光幼儿园成都高新校区星光幼儿园成都高新校区',
            value: 2021,
          },
          {
            label: '2022',
            value: 2022,
          },
          {
            label: '2023',
            value: 2023,
          },
          {
            label: '2024',
            value: 2024,
          },
          {
            label: '2021',
            value: 2021,
          },
          {
            label: '2022',
            value: 2022,
          },
          {
            label: '2023',
            value: 2023,
          },
          {
            label: '2024',
            value: 2024,
          },
        ],
      }
    },
    methods: {
      selectItem(res) {
        console.log(res)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .screenDistribution {
    position: relative;
    .select-box {
      position: absolute;
      left: 1.6rem;
      font-size: 0.18rem;
      display: flex;
      align-items: center;
      .school-num {
        margin-left: 20px;
      }
    }
    .body-box {
      margin-top: 12px;
      > ul {
        // height: auto;
        > li {
          background: rgba(210, 230, 255, 0.05);
          border: 1px solid rgba(0, 144, 255, 0.3);
          width: 100%;
          height: 130px;
          margin-bottom: 6px;
          .top-box {
            width: 100%;
            height: 68px;
            background: rgba(79, 168, 249, 0.1);
            position: relative;
            &::before {
              display: table;
              content: '';
            }
            > img {
              position: absolute;
              top: 16px;
              left: 16px;
              width: 60px;
              height: 60px;
              border: 2px solid #00e5ff;
              border-radius: 4px;
            }
            .school-info {
              margin: 16px 0 0 100px;
              .name {
                font-size: 0.16rem;
                color: #4aeceb;
                margin-bottom: 4px;
              }
              .address {
                font-size: 0.13rem;
                color: #acd3fc;
                opacity: 0.5;
              }
            }
          }
          .botom-box {
            .data-box {
              display: flex;
              margin: 9px 14px 0 100px;
              justify-content: space-between;
              .item {
                display: flex;
                flex-direction: column;
                align-items: center;
                .num {
                  font-size: 0.14rem;
                  color: #4fa8f9;
                }
                .name {
                  font-size: 0.13rem;
                  color: #acd3fc;
                  opacity: 0.5;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
