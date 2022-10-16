<template>
  <OpenAppBox>
    <div class="repice-share">
      <div class="top-bg">
        <img
          src="@/assets/recipe/top-bg-title.png"
          alt=""
        >
        <div class="repice-date">{{weekDate.slice(5)}}营养食谱</div>
      </div>
      <div class="body-content">
        <div class="change-repice-date">
          <div class="top-head">
            <img
              :src="schoolLogo || require('@/assets/image/img-list3.png')"
              alt=""
            >
            <span>{{schoolName}}</span>
          </div>
          <div class="date-box">
            <ul>
              <li @click="moveToPosition('周一')">周一</li>
              <span></span>
              <li @click="moveToPosition('周二')">周二</li>
              <span></span>
              <li @click="moveToPosition('周三')">周三</li>
              <span></span>
              <li @click="moveToPosition('周四')">周四</li>
              <span></span>
              <li @click="moveToPosition('周五')">周五</li>
              <span></span>
              <li @click="moveToPosition('周六')">周六</li>
              <span></span>
              <li @click="moveToPosition('周日')">周日</li>
            </ul>
          </div>
        </div>
        <div class="recipe-box">
          <template v-if="+recipeType === 1">
            <div
              v-for="(item,index) in dataList"
              :key="index"
              :class="['list-item','item-' + dateToWeek(item.recipesDateStr)]"
            >
              <div class="top-title">
                {{dateToWeek(item.recipesDateStr)}}食谱
              </div>
              <ul class="recpie-content">
                <li v-if="item.zaocan">
                  <div class="top">
                    <img
                      src="@/assets/recipe/breakfast.png"
                      alt=""
                    >
                    <span>早餐</span>
                  </div>
                  <div class="content">{{getRecipeStrArr(item.zaocan)}}</div>
                </li>
                <li v-if="item.wucan">
                  <div class="top">
                    <img
                      src="@/assets/recipe/lunch.png"
                      alt=""
                    >
                    <span>午餐</span>
                  </div>
                  <div class="content">{{getRecipeStrArr(item.wucan)}}</div>
                </li>
                <li v-if="item.jiacan">
                  <div class="top">
                    <img
                      src="@/assets/recipe/extra-meal.png"
                      alt=""
                    >
                    <span>加餐</span>
                  </div>
                  <div class="content">{{getRecipeStrArr(item.jiacan)}}</div>
                </li>
                <li v-if="item.wancan">
                  <div class="top">
                    <img
                      src="@/assets/recipe/dinner.png"
                      alt=""
                    >
                    <span>晚餐</span>
                  </div>
                  <div class="content">{{getRecipeStrArr(item.wancan)}}</div>
                </li>
                <li v-if="item.yexiao">
                  <div class="top">
                    <img
                      src="@/assets/recipe/ngiht-food.png"
                      alt=""
                    >
                    <span>夜宵</span>
                  </div>
                  <div class="content">{{getRecipeStrArr(item.yexiao)}}</div>
                </li>
              </ul>
            </div>
          </template>
          <template v-else-if="+recipeType === 2">
            <div
              class="img-box"
              @click="viewImg(dishesImgUrl)"
            >
              <img
                :src="dishesImgUrl"
                alt=""
              >
            </div>
          </template>
        </div>
      </div>
      <div class="footer">
        <span @click="openWeb">
          园所详情 →
        </span>
      </div>
    </div>
  </OpenAppBox>
</template>

<script>
import qs from "qs";
import OpenAppBox from "@/layout/openApp";
import smoothscroll from 'smoothscroll-polyfill';
import { getFetch } from '@/utils/request.js'

export default {
  name: "repiceShare",
  components: { OpenAppBox },
  data() {
    return {
      dataList: [],
      recipeType: '-1',
      dishesImgUrl: '',
      recipeList: [],
      weeksArr: [],
      weeksMap: [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
      ],
      weekDate: '',
      schoolName: '',
      schoolLogo:'',
      schoolId: ''
    }
  },
  methods: {
    // 了解更多
    openWeb() {
      // location.href = 'https://www.jinshuy.com'
      this.$router.push(`/school?schoolId=${this.schoolId}`);
    },

    // 锚点定位
    moveToPosition(week) {
      if (+this.recipeType === 1 && this.weeksArr.includes(week)) {
        smoothscroll.polyfill();
        // 跳转到指定位置并且平滑滚动
        this.$el
          .querySelector(`.item-${week}`)
          .scrollIntoView({ block: "start", behavior: "smooth" });
      }
    },

    // 预览图片
    viewImg(url) {
      vant.ImagePreview([url]);
    },

    // 请求食谱信息
    async getRecipe(weekId) {
      // 1452569257960841216 图片
      // SRC1451078843919564800 文字
      const { code, data } = await getFetch(`${process.env["VUE_APP_BASE_API"]}/schools/api/apprecipes/unAccess/queryRecipes`, {
        weekId,
      }, { version: '1.4.0' })
      if (+code === 0) {
        this.dataList = data;
        this.recipeType = data[0].recipesType;
        this.dishesImgUrl = data[0].dishesImgUrl;
        this.weekDate = data[0].weekDate;
        this.schoolName = data[0].schoolName;
        this.schoolLogo = data[0].schoolLogo;
        this.schoolId = data[0].schoolId;

        // 获取当前返回的已有的星期数
        data.forEach(item => {
          this.weeksArr.push(this.weeksMap[new Date(item.recipesDateStr).getDay()])
        })
        this.setWeekColor()
      }
    },

    // 没有返回的星期数，颜色就改变
    setWeekColor() {
      const lis = this.$el.querySelectorAll(`.date-box ul li`);
      lis.forEach(item => {
        // 如果星期数在返回的已有的星期数里没有匹配到，就将其字体颜色变灰
        const isHasweek = this.weeksArr.includes(item.innerHTML);
        if (!isHasweek && +this.recipeType === 1) {
          item.style.color = '#D4D4D4'
        }
      })
    },

    // 日期转星期几
    dateToWeek(date) {
      return this.weeksMap[new Date(date).getDay()];
    },

    // 获取菜品名称
    getRecipeStrArr(arr) {
      return arr.map(item => item.dishesName).join('、')
    }
  },
  created() {
    const url = location.href.split('?')[1]
    const params = qs.parse(url)
    if (params?.weekId) {
      this.getRecipe(params.weekId)
    }
  }
}
</script>

<style scoped lang="less">
.repice-share {
  position: relative;
  display: flex;
  flex-direction: column;

  background-color: #f6c774;
  height: auto;
  min-height: 100vh;
  // top: 0;
  // left: 0;
  // overflow-y: auto;

  .top-bg {
    background: url("../assets/recipe/top-bg.png") no-repeat;
    background-size: cover;
    // background-size: 100%;
    width: 100%;
    height: 210px;
    position: relative;

    > img {
      width: 129px;
      height: 62px;
      position: absolute;
      top: 27px;
      left: 21px;
    }

    .repice-date {
      position: absolute;
      left: 0;
      top: 108px;
      font-size: 14px;
      color: #ffffff;
      width: 100%;
      padding: 0 21px;
      box-sizing: border-box;
    }
  }

  .body-content {
    flex-grow: 1;
    // height: 100%;
    // height: calc(100vh - 210px);
    // height: 100vh;
    // min-height: 100%;
    // height: 100%;
    // min-height: 100%;
    // background-color: #f6c774;

    // position: absolute;
    // left: 0;
    // top: 155px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    padding-top: 48px;

    .change-repice-date {
      position: absolute;
      left: 16px;
      top: 155px;

      width: 100%;
      width: calc(100% - 32px);
      height: 103px;
      background: #ffffff;
      border-radius: 12px;
      padding: 11px 15px 0;
      box-sizing: border-box;

      .top-head {
        position: relative;

        > img {
          width: 50px;
          height: 50px;
          border: 2px solid rgba(241, 146, 40, 0.3);
          border-radius: 50%;
          position: absolute;
          top: -22px;
          left: 6px;
        }

        > span {
          margin-left: 68px;
          color: #1c1c1c;
          font-size: 16px;
        }
      }

      .date-box {
        > ul {
          margin-top: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #656980;

          > span {
            height: 8px;
            width: 1px;
            background-color: #f1f0f5;
            border-radius: 1px;
          }
        }
      }
    }

    .recipe-box {
      margin-top: 10px;

      .img-box {
        width: 100%;
        height: 206px;

        > img {
          width: 100%;
          height: 100%;
          border-radius: 12px;
        }
      }

      .list-item {
        scroll-behavior: smooth;
        background: #ffffff;
        border-radius: 12px;
        width: 100%;
        // height: 320px;
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        .top-title {
          margin: 0 auto;
          width: 94px;
          height: 29px;
          line-height: 29px;
          text-align: center;
          background: linear-gradient(180deg, #eb8112, #f9cc4e);
          border-radius: 0px 0px 12px 12px;
          font-size: 14px;
          color: #fff;
        }

        .recpie-content {
          padding: 0 15px;
          box-sizing: border-box;

          > li {
            border-top: 1px solid #f2f2f2;
            padding: 14px 0;
            box-sizing: border-box;

            &:first-child {
              border-top: none;
            }

            .top {
              display: flex;
              align-items: center;
              margin-bottom: 11px;

              > img {
                height: 23px;
                width: 23px;
                margin-right: 6px;
              }

              > span {
                font-size: 16px;
                font-weight: 700;
                color: #1c1c1c;
              }
            }

            .content {
              // text-align: center;
              font-size: 14px;
              color: #4e4e4e;
              padding-left: 34px;
            }
          }
        }
      }
    }
  }

  .footer {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    color: #0099ff;
    margin: 40px 0 30px 0;
  }
}
</style>
