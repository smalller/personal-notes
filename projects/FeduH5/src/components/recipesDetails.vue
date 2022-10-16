<template>
  <div class="recipesDetails">
    <div class="content" ref="content">
<!--      <div class="weekChange" :class="{top:isTop}" ref="weekChange">-->
<!--        <div class="left btn">-->
<!--          <img src="@/assets/image/kq_ri_z@2x.png" alt="">-->
<!--          <span>上一周</span>-->
<!--        </div>-->
<!--        <div class="center">12月10日-12月16日</div>-->
<!--        <div class="right btn">-->
<!--          <span>下一周</span>-->
<!--          <img src="@/assets/image/kq_ri_y@2x.png" alt="">-->
<!--        </div>-->
<!--      </div>-->
      <div class="contentData">

        <div class="imgList">
          <img v-for="(imgUrl, index) in data.recipes.images" @click="reviewImage(data.recipes.images,index)" :key="imgUrl" :src="imgUrl" alt="">
        </div>

        <div class="itemBox">
          <div class="item" v-for="item in data.recipeItem" :key="item.id">
            <div class="title">{{getWeek(item.recipesDate)}}</div>
            <div class="itemInfo" v-html="item.content">
<!--              <div>早餐</div>-->
<!--              <span>sadasdasdasdsdsadasdasdasdsdsadasdasdasdsd</span>-->
            </div>
            <div class="itemImg">
              <img :src="imgUrl" alt="" v-for="(imgUrl, index) in item.imageUrls" @click="reviewImage( item.imageUrls,index)" :key="imgUrl">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import OpenAppHead from "@/components/openAppHead";

export default {
  name: "recipesDetails",
  components: {OpenAppHead},
  data() {
    return {
      imgList: [],
      isTop: false,
      weeks: ["日","一","二","三","四","五","六"]
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  methods: {
    getWeek(date) {
      const d =new Date(date).getDay()
      return '星期'+this.weeks[d]
    },
    reviewImage(imgs,index) {
      vant.ImagePreview({
        images: imgs,
        startPosition: index
      })
    },
  }
}
</script>

<style scoped lang="less">
.recipesDetails {
  padding-bottom: 80px;
  .content {
    position: relative;

    .weekChange {
      position: absolute;
      padding: 0 12px;
      top: 44px;
      left: 0;
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
      background: #ffffff;
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
      .btn {
        width: 60px;
        font-size: 16px;
        color: #666666;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        img {
          margin: 0 5px;
          color: #cccccc;
          height: 13px;
          width: 8px;
        }
      }

      .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #343434;
        font-size: 18px;
      }

      &.top {
        position: fixed;
        top: 0;
      }
    }

    .contentData {
      border-top: 12px solid #E8E8E8;

      .imgList {
        padding: 20px 16px;
        display: flex;
        flex-direction: column;

        img {
          width: 91.5vw;
          border-radius: 12px;
          overflow: hidden;
        }
      }

      .itemBox {
        padding: 0 16px;
        box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.06);

        .item {
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);

          .title {
            padding-top: 19px;
            font-size: 16px;
            color: #333333;
            font-weight: bold;
            padding-bottom: 24px;
          }

          .itemInfo {
            text-align: left;
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            color: #333333;
            padding-bottom: 16px;

            > div {
              white-space: nowrap;
              margin-right: 20px;
            }

            > span {
              word-break: break-all;
            }
          }

          .itemImg {
            width: 91.5vw;
            border-radius: 12px;
            overflow: hidden;
            padding-bottom: 20px;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .footer {
    bottom: 0;
    border-top: 4px #f2f2f2 solid;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    background: #FFFFFF;

    span {
      font-size: 14px;
      color: #0099FF;
    }
  }
}
</style>
