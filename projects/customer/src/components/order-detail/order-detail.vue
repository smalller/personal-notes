<template>
  <div>
    <div class="basic-info">
      <el-form
        ref="orderDetailInfo"
        class="info-wrap"
        :model="orderDetailInfo"
        label-width="110px"
      >
        <div class="info-box left">
          <el-form-item label="订单发起人：">
            <el-input
              v-model="orderDetailInfo.consumerName"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="预定手机：">
            <el-input
              v-model="orderDetailInfo.consumerPhone"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="预定备注信息：">
            <el-input
              type="textarea"
              v-model="orderDetailInfo.consumerRemark"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input v-model="orderDetailInfo.orderNo" readonly></el-input>
          </el-form-item>

          <div class="info1">
            <div>
              订单类型：
              <span>{{ orderDetailInfo.typeOrder | typeOrder }}</span>
            </div>
            <div>
              支付状态：
              <span>{{ orderDetailInfo.payStatus | payStatus }}</span>
            </div>
            <div>
              支付类型：
              <span>{{ orderDetailInfo.payWay }}</span>
            </div>
          </div>

          <div class="info2">
            <div>
              <el-form-item label="实付金额：">
                <el-input v-model="orderDetailInfo.moneyPaid" readonly>
                  <template slot="append">￥</template>
                </el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="商品原价：">
                <el-input v-model="orderDetailInfo.moneyOrigin" readonly>
                  <template slot="append">￥</template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div class="info3">
            <div>
              下单时间：
              <span>{{ orderDetailInfo.timeCreate }}</span>
            </div>
            <div>
              结束时间：
              <span>{{ orderDetailInfo.timeEnd }}</span>
            </div>
            <div>
              支付时间：
              <span>{{ orderDetailInfo.timePay }}</span>
            </div>
          </div>
        </div>
        <div class="info-box right">
          <div class="right-info-title">
            <span> 清单详情：</span>
          </div>
          <div class="right-list">
            <div>
              <div class="list-box">
                <p>
                  <span>座位号/包间类型：</span>
                  <span>{{ orderDetailInfo.seatCode }}</span>
                </p>
                <p>
                  <span>容纳人数：</span>
                  <span>{{ orderDetailInfo.seatCapacity }}人</span>
                </p>
                <p>
                  <span>保留时间：</span>
                  <span>{{ orderDetailInfo.retentionTime }}</span>
                </p>
                <p>
                  <span>最低消费：</span>
                  <span>￥{{ orderDetailInfo.moneyMin }}</span>
                </p>
                <p>
                  <span>实际落座：</span>
                  <span>{{ orderDetailInfo.seatActualCode }}</span>
                </p>
              </div>
            </div>
            <div>
              <p class="title">酒水清单</p>
              <div class="list-box">
                <div
                  class="drink-list"
                  v-for="(item, index) in orderDetailInfo.drinksList"
                  :key="index"
                >
                  <div class="good-box">
                    <div class="good-name">
                      <span style="margin-right: 10px">{{
                        item.goodsName
                      }}</span>
                      <span class="num">x{{ item.goodsNum }}</span>
                    </div>
                  </div>
                  <div>
                    <span>￥{{ item.goodsPriceUnitPresent }}</span>
                    <span class="unline"
                      >￥{{ item.goodsPriceUnitOrigin }}</span
                    >
                  </div>
                </div>
                <div
                  class="drink-list"
                  v-for="(item, index) in orderDetailInfo.snacksList"
                  :key="item.goodsName + index"
                >
                  <div class="good-box">
                    <div class="good-name">
                      <span style="margin-right: 10px">{{
                        item.goodsName
                      }}</span>
                      <span class="num">x{{ item.goodsNum }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p class="title">追加酒水清单</p>
              <div class="list-box add-drinks">
                <div
                  class="add-drink-list"
                  v-for="(item, index) in orderDetailInfo.appendDrinksList"
                  :key="index"
                >
                  <div class="order-title">
                    <span>{{ item.name }}（{{ item.payWay }}）</span>
                    <span>{{ item.createTime }}</span>
                  </div>

                  <div
                    class="drink-list"
                    v-for="(item2, index2) in item.appendDetailList"
                    :key="index2"
                  >
                    <div class="good-box">
                      <div class="good-name">
                        <span style="margin-right: 10px">{{
                          item2.goodsName
                        }}</span>
                        <span class="num">x{{ item2.goodsNum }}</span>
                      </div>
                    </div>
                    <div>
                      <span>￥{{ item2.goodsPriceUnitPresent }}</span>
                      <span class="unline"
                        >￥{{ item2.goodsPriceUnitOrigin }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p class="title">优惠券</p>
              <div class="list-box">
                <p>
                  {{
                    orderDetailInfo.couponSource === 0
                      ? "商家优惠券："
                      : orderDetailInfo.couponSource === 1
                      ? "平台优惠券："
                      : ""
                  }}
                  {{ orderDetailInfo.couponDetail }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["orderDetailInfo"],
};
</script>

<style lang="scss" scoped>
.basic-info {
  .info-wrap {
    display: flex;
    justify-content: space-between;

    .info-box {
      width: 100%;

      .info1 {
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .info2 {
        display: flex;
        justify-content: space-between;

        & > div:first-child {
          margin-right: 20px;
        }
      }

      .info3 {
        > div {
          margin-bottom: 18px;
        }

        span {
          margin-left: 30px;
        }
      }
    }

    .info-box.right {
      box-sizing: border-box;
      padding-left: 60px;
      display: flex;

      .right-info-title {
        margin-right: 20px;
      }

      .right-list {
        display: flex;
        flex-direction: column;

        .title {
          color: #f00;
          margin-bottom: 18px;
        }

        .list-box {
          border-bottom: 1px solid #c0c4cc;
          margin-bottom: 18px;

          p {
            display: flex;
            margin-bottom: 18px;

            :first-child {
              width: 160px;
            }
          }
        }

        .drink-list {
          display: flex;
          margin-bottom: 18px;

          .good-box {
            width: 160px;

            .good-name {
              margin-bottom: 6px;
              display: flex;
              justify-content: space-between;
              padding-right: 20px;

              .num {
                min-width: 20px;
              }
            }
          }

          .unline {
            text-decoration: line-through;
            color: #bcbcbc;
            margin-left: 10px;
          }
        }

        .add-drink-list {
          margin-bottom: 20px;
          border: 1px solid #c0c4cc;
          border-radius: 6px;
          padding: 20px;

          .order-title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            color: #409eff;
          }
        }

        .change-seat {
          p {
            margin-bottom: 18px;
            display: flex;
            :first-child {
              width: 120px;
            }
          }
        }
      }
    }
  }
}
</style>