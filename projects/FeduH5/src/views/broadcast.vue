<template>
  <OpenAppBox>
    <div class="boardcast">

      <div class="footer">
        <span @click="openWeb">
          了解金树丫 →
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
      schoolName: ''
    }
  },
  methods: {
    // 了解更多
    openWeb() {
      location.href = 'https://www.jinshuy.com'
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
.boardcast {
  position: relative;
  display: flex;
  flex-direction: column;

  background-color: #f6c774;
  height: auto;
  min-height: 100vh;


  .footer {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    color: #0099ff;
    margin: 40px 0 30px 0;
  }
}
</style>
