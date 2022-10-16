<template>
  <basic-container v-if="storeType === 1 || storeType === 2">
    <div>
      <!-- 更改楼层名称模态框 -->
      <el-dialog
        :visible.sync="updateFloorDialogVisible"
        append-to-body="true"
        title="修改楼层名称"
        @close="cancelUpdateFloor"
        width="20%"
      >
        <div class="update-floor">
          <span>楼层名称：</span>
          <el-input v-model="nowFloor"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdateFloor">取消</el-button>
          <template>
            <el-button
              type="primary"
              @click="sureUpdateFloor(nowFloor, floorId)"
              >确定</el-button
            >
          </template>
        </span>
      </el-dialog>

      <div class="shop-seat">
        <!-- 左边座位展示 -->
        <div class="left-box">
          <template>
            <el-button type="primary" @click="isUpdateFloor = true"
              >设置楼层</el-button
            >
            <el-button
              v-if="isUpdateFloor"
              type="danger"
              @click="isUpdateFloor = false"
              >取消设置</el-button
            >
            <el-button
              v-if="floorList.length !== 0"
              type="primary"
              @click="updateFloorDialogVisible = true"
              >更改楼层名称</el-button
            >
          </template>

          <!-- 回显楼层 -->
          <div class="floor-list">
            <el-tag
              :closable="isUpdateFloor"
              @close="handleDeleteFloor(item.id)"
              v-for="(item, index) in floorList"
              :key="index"
              :effect="nowFloor == item.floor ? 'dark' : 'plain'"
              @click="viewPresentFloor(item.id, item.floor)"
              >{{ item.floor }}</el-tag
            >
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else-if="!inputVisible && isUpdateFloor"
              class="button-new-tag"
              size="small"
              @click="showInput"
              >添加楼层</el-button
            >
          </div>

          <template v-if="floorList.length !== 0">
            <!-- 座位行数和列数 -->
            <div class="input-seat">
              座位行数：
              <div class="seat-change-box">
                <div @click="removeSeatEvent(1)">-</div>
                <div class="num">{{ seatX }}</div>
                <div @click="addSeatEvent(1)">+</div>
              </div>
              座位列数：
              <div class="seat-change-box">
                <div @click="removeSeatEvent(2)">-</div>
                <div class="num">{{ seatY }}</div>
                <div @click="addSeatEvent(2)">+</div>
              </div>
            </div>

            <!-- 座位属性标题 -->
            <div class="seat-title">
              <p v-for="(item, index) in seatAttOpt" :key="index">
                <span :class="item.class"></span>
                {{ item.name }}
              </p>
            </div>

            <!-- 回显的座位图 -->
            <div
              v-loading="seatLoading"
              v-if="seatX && seatY"
              class="seat-box"
              ref="seatBox"
              :style="{ width: 32 * seatY + 30 + 'px' }"
              style="overflow: hidden"
            >
              <div v-for="(itemY, indexY) in Number(seatY)" :key="indexY">
                <div v-for="(itemX, indexX) in Number(seatX)" :key="indexX">
                  <span
                    ref="seatSpan"
                    :data-indexX="indexX + 1"
                    :data-indexY="indexY + 1"
                    class="seat"
                    @click="handleSetSeat(itemX, itemY, $event)"
                  ></span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 座位属性 -->
        <div class="right-box" v-if="presentSeatInfo !== {} && isClickSeat">
          <div>
            <span>座位属性：</span>
            <el-radio v-model="presentSeatInfo.seatAttribute" :label="1"
              >普通座位</el-radio
            >
            <el-radio v-model="presentSeatInfo.seatAttribute" :label="2"
              >舞台</el-radio
            >
            <el-radio v-model="presentSeatInfo.seatAttribute" :label="3"
              >过道</el-radio
            >
          </div>
          <div v-if="presentSeatInfo.seatAttribute == 1">
            <span>座位状态：</span>
            <el-radio v-model="presentSeatInfo.status" :label="1"
              >可预订</el-radio
            >
            <el-radio v-model="presentSeatInfo.status" :label="2"
              >不可预订</el-radio
            >
          </div>
          <!-- 座位号 -->
          <div>
            <span>座位号：</span>
            <el-input
              v-model="presentSeatInfo.seatCode"
              placeholder="座位号"
              style="width: 50%"
            ></el-input>
          </div>
          <!-- 座位类型 -->
          <div>
            <span>座位类型：</span>
            <el-radio v-model="presentSeatInfo.seatType" :label="1"
              >独立高脚凳</el-radio
            >
            <el-radio v-model="presentSeatInfo.seatType" :label="2"
              >吧台</el-radio
            >
            <el-radio v-model="presentSeatInfo.seatType" :label="3"
              >沙发</el-radio
            >
            <el-radio v-model="presentSeatInfo.seatType" :label="4"
              >散台</el-radio
            >
            <el-radio v-model="presentSeatInfo.seatType" :label="5"
              >卡座</el-radio
            >
          </div>
          <!-- 容纳人数 -->
          <div>
            <span>容纳人数：</span>
            <el-input-number
              :step="1"
              step-strictly
              v-model="presentSeatInfo.capacity"
              controls-position="right"
              placeholder="容纳人数"
              style="width: 50%; margin-right: 6px"
              :min="1"
            ></el-input-number>
          </div>
          <!-- 最晚保留时间 -->
          <div class="lon-retain">
            <span>保留最晚时间：</span>
            <!-- <el-time-select
              @change="checkLateTime(presentSeatInfo.seatLatestReservationTime)"
              style="width: 50%"
              placeholder="最晚保留时间"
              v-model="presentSeatInfo.seatLatestReservationTime"
              :picker-options="
                startBussTime.slice(0, 2) > endBussTime.slice(0, 2)
                  ? {
                      start: startBussTime,
                      step: '00:10',
                      end: '23:50',
                    }
                  : {
                      start: startBussTime,
                      step: '00:10',
                      end: endBussTime,
                    }
              "
            ></el-time-select> -->
            <el-time-select
              :clearable="false"
              style="width: 50%"
              placeholder="最晚保留时间"
              v-model="presentSeatInfo.retain"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:50',
              }"
            ></el-time-select>
          </div>
          <!-- 最低消费 -->
          <div class="min-charge">
            <span class="min-con" style="margin-bottom: 10px">最低消费：</span>
            <div class="day-mincom">
              <div>
                <span>周一</span>
                <br />
                <el-input
                  min="0"
                  type="number"
                  v-model="presentSeatInfo.minMonday"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>
              <div>
                <span>周二</span>
                <br />
                <el-input
                  min="0"
                  type="number"
                  v-model="presentSeatInfo.minTuesday"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>
              <div>
                <span>周三</span>
                <br />
                <el-input
                  min="0"
                  type="number"
                  v-model="presentSeatInfo.minWednesday"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>
              <div>
                <span>周四</span>
                <br />
                <el-input
                  min="0"
                  type="number"
                  v-model="presentSeatInfo.minThursday"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>
              <div>
                <span>周五</span>
                <br />
                <el-input
                  min="0"
                  type="number"
                  v-model="presentSeatInfo.minFriday"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>
              <div>
                <span>周六</span>
                <br />
                <el-input
                  min="0"
                  type="number"
                  v-model="presentSeatInfo.minSaturday"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>
              <div>
                <span>周日</span>
                <br />
                <el-input
                  min="0"
                  type="number"
                  v-model="presentSeatInfo.minSunday"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="submitUpdateSeatInfo"
              >修改</el-button
            >
            <el-button type="danger" @click="cancelSubmitUpdateSeatInfo"
              >取消</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </basic-container>
  <basic-container v-else> 本店铺不支持座位管理 </basic-container>
</template>

<script>
import {
  getStoreFloorList,
  setStoreFloor,
  removeStoreFloor,
  getSeatListByStoreFloorId,
  addSeatLayOut,
  delSeatLayOut,
  getSotreSeatDetail,
  updateSotreSeatDetail,
} from "@/api/store/storeseat";

export default {
  data() {
    return {
      seatLoading: false,
      storeBusiness: this.$store.state.storeBusiness,
      storeType: this.$store.state.storeType,
      allRegRight: false, //全部验证通过的开关
      updateFloorDialogVisible: false, //修改楼层名称弹窗
      floorId: "", //当前楼层id
      nowFloor: "", //当前正在操作的楼层名
      isUpdateFloor: false, //设置楼层的标杆
      inputVisible: false, //是否新增楼层的标杆
      inputValue: "", //新增楼层的名称
      floorList: [], //回显楼层列表
      antFlag: true, //防抖标杆
      seatX: 6, //座位行数
      seatY: 6, //座位列数
      seatList: [], //当前楼层的座位列表
      //座位属性数组
      seatAttOpt: [
        {
          name: "不可预订",
          style: "notBook",
          class: "not-book",
        },
        {
          name: "可预订",
          style: "canBook",
          class: "can-book",
        },
        {
          name: "舞台",
          style: "stageBook",
          class: "stage-book",
        },
        {
          name: "过道",
          style: "aisleBook",
          class: "aisle-book",
        },
      ],
      presentSeatInfo: {}, //当前正在操作的座位对应的详细信息
      isClickSeat: false, //展示当前座位的详细信息开关
    };
  },

  created() {
    this.getStoreFloorList();
  },

  methods: {
    //删除楼层
    handleDeleteFloor(storeFloorId) {
      this.$confirm("确认要删除该楼层吗?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await removeStoreFloor(storeFloorId);
          if (res.code === 200) {
            this.getStoreFloorList();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {});
    },

    //点击添加楼层按钮，显示输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //新增楼层
    handleInputConfirm() {
      let floor = this.inputValue;
      if (floor) {
        this.$confirm("确认要添加该楼层吗?", "提示", {
          type: "warning",
        })
          .then(() => {
            this.setStoreFloor(floor).then((res) => {
              if (res.code === 200) {
                this.isUpdateFloor = false;
                this.$message.success("新增楼层成功");
              }
            });
          })
          .catch(() => {});
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    //修改楼层名称
    sureUpdateFloor(floor, id) {
      if (floor) {
        this.setStoreFloor(floor, id).then((res) => {
          if (res.code === 200) {
            this.$message.success("修改楼层名称成功");
            this.updateFloorDialogVisible = false;
          }
        });
      } else {
        this.$message.error("楼层名称不能为空");
      }
    },

    //取消修改楼层名称
    cancelUpdateFloor() {
      this.getStoreFloorList();
      this.updateFloorDialogVisible = false;
    },

    //新增/修改楼层名称请求
    async setStoreFloor(floor, id = "") {
      let data = {
        floor,
        id,
      };
      const { data: res } = await setStoreFloor(data);
      if (res.code === 200) {
        this.getStoreFloorList();
      }
      return Promise.resolve(res);
    },

    //点击当前楼层
    viewPresentFloor(id, floor) {
      this.floorId = id;
      this.nowFloor = floor;
      this.isClickSeat = false;
      this.clearSeatBorder();
      this.getSeatListByStoreFloorId(this.floorId);
    },

    //获取楼层信息，默认展示第一层座位信息
    async getStoreFloorList() {
      const { data: res } = await getStoreFloorList();
      if (res.code === 200) {
        if (res.data.length !== 0) {
          this.floorList = res.data;
          this.floorId = res.data[0].id;
          this.nowFloor = res.data[0].floor;
          this.getSeatListByStoreFloorId(this.floorId);
        } else {
          this.floorList = res.data;
          this.isUpdateFloor = false;
        }
      }
    },

    //根据楼层去获取当前楼层的座位列表
    async getSeatListByStoreFloorId(id) {
      this.seatLoading = true;
      const { data: result } = await getSeatListByStoreFloorId(id);
      if (result.code === 200) {
        let res = result.data;
        this.seatList = res.storeSeatVOList;
        this.seatX =
          res.storeSeatVOList[res.storeSeatVOList.length - 1].seatRow;
        this.seatY =
          res.storeSeatVOList[res.storeSeatVOList.length - 1].seatColumn;
        this.showSeatAtt();
        this.seatLoading = false;
      }
    },

    //座位属性回显
    showSeatAtt() {
      this.$nextTick(() => {
        if (this.$refs.seatSpan) {
          //遍历所有座位
          this.$refs.seatSpan.forEach((item) => {
            let seatX = item.dataset.indexx; //行
            let seatY = item.dataset.indexy; //列
            //根据返回的楼层对应的座位数组进行匹配，并替换当前座位的属性
            this.seatList.forEach((item2) => {
              if (item2.seatRow == seatX && item2.seatColumn == seatY) {
                //可预订
                if (item2.status == 1 && item2.seatAttribute == 1) {
                  item.className = `seat canBook`;
                }
                //不可预订
                if (
                  (item2.status == 2 ||
                    item2.status == 3 ||
                    item2.status == 4 ||
                    item2.status == 5) &&
                  item2.seatAttribute == 1
                ) {
                  item.className = `seat notBook`;
                }

                //过道
                if (item2.seatAttribute == 3) {
                  item.className = `seat aisleBook`;
                }
                //舞台
                if (item2.seatAttribute == 2) {
                  item.className = `seat stageBook`;
                }
              }
            });
          });
        }
      });
    },

    //增加行列操作
    async addSeatEvent(flag) {
      this.seatLoading = true;
      let data = {
        storeFloorId: this.floorId,
        flag,
      };
      if (flag === 1) {
        data.seatRow = this.seatX;
      } else {
        data.seatColumn = this.seatY;
      }

      this.handleSetSeatRequest(addSeatLayOut, data);
    },

    //减少行列操作
    async removeSeatEvent(flag) {
      this.seatLoading = true;
      let data = {
        storeFloorId: this.floorId,
        flag,
      };
      if (flag === 1) {
        data.seatRow = this.seatX;
      } else {
        data.seatColumn = this.seatY;
      }

      this.handleSetSeatRequest(delSeatLayOut, data);
    },

    //增加或减少行列的请求函数
    async handleSetSeatRequest(fn, data) {
      if (this.antFlag) {
        this.antFlag = false;
        const { data: res } = await fn(data);
        if (res.code === 200) {
          this.getSeatListByStoreFloorId(this.floorId);
          this.isClickSeat = false;
        }
        this.antFlag = true;
        this.seatLoading = false;
      }
    },

    //点击座位
    handleSetSeat(x, y, e) {
      for (let i = 0; i < this.seatList.length; i++) {
        if (this.seatList[i].seatRow == x && this.seatList[i].seatColumn == y) {
          this.clearSeatBorder(); //清空座位外边框（定位当前座位）
          e.target.classList.add("border"); //定位当前座位，加上外边框
          this.getSotreSeatDetail(this.seatList[i].id);
          break;
        }
      }
    },

    //获取当前点击的座位详情
    async getSotreSeatDetail(storeSeatId) {
      const { data: res } = await getSotreSeatDetail(storeSeatId);
      if (res.code === 200) {
        console.log(res.data);
        this.presentSeatInfo = res.data;
        if (
          this.presentSeatInfo.status != 1 &&
          this.presentSeatInfo.status != 2
        ) {
          this.$message.error("座位已被占用，暂时不能修改");
          this.isClickSeat = false;
        } else {
          this.isClickSeat = true;
        }
      }
    },

    //修改座位信息
    async submitUpdateSeatInfo() {
      if (this.presentSeatInfo.seatAttribute != 1) {
        this.presentSeatInfo.status = 2;
      }

      if (this.presentSeatInfo.retain == "") {
        this.$message.error("请选择保留最晚时间");
        return;
      }

      const { data: res } = await updateSotreSeatDetail(this.presentSeatInfo);
      if (res.code === 200) {
        this.getSeatListByStoreFloorId(this.floorId);
        this.$message.success("修改成功");
        this.isClickSeat = false;
      }
    },

    //取消修改座位信息
    cancelSubmitUpdateSeatInfo() {
      this.isClickSeat = false;
    },

    //清空座位外边框（定位当前座位）
    clearSeatBorder() {
      if (this.$refs.seatSpan) {
        this.$refs.seatSpan.forEach((item) => {
          item.classList.remove("border");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.el-tag + .el-tag {
  margin-left: 10px;
  cursor: pointer;
}

.el-tag--small {
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
}

.update-floor {
  display: flex;
  align-items: center;

  > span {
    width: 100px;
  }
}

.clearfix::after {
  display: block;
  content: "";
  clear: both;
}

.left-wrap {
  h4 {
    font-weight: normal;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    box-sizing: border-box;

    > span {
      margin-right: 30px;
    }
  }

  h4::before {
    display: inline-block;
    content: "";
    width: 4px;
    height: 30px;
    margin-right: 10px;
    background-color: #000;
  }

  .shop-info {
    display: flex;
    margin-bottom: 30px;

    .left-info {
      > span {
        font-size: 12px;
      }

      > p {
        margin-bottom: 10px;
      }
    }

    .right-info {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .shop-name {
        margin-bottom: 40px;

        > span {
          min-width: 80px;
        }

        display: flex;
        align-items: center;
      }

      .shop-brief {
        > span {
          min-width: 80px;
        }

        display: flex;
        align-items: center;
      }
    }
  }

  .shop-loca {
    margin-bottom: 30px;

    > p {
      margin-bottom: 10px;
    }

    > div span {
      display: inline-block;
      height: 32px;
      padding: 0 10px;
      line-height: 30px;
      font-size: 12px;
      color: #409eff;
      border: 1px solid #d9ecff;
      border-radius: 4px;
      margin: 0 10px 10px 0;
      box-sizing: border-box;
      white-space: nowrap;
      cursor: pointer;
    }
  }

  .service-phone {
    margin-bottom: 30px;

    .show-box {
      margin-bottom: 10px;
    }

    > p {
      margin-bottom: 10px;
    }
  }
  .shop-div {
    display: flex;
    margin-bottom: 30px;

    .shop-div1 {
      width: 42%;
      margin-right: 30px;

      .bussiness-hours {
        margin-bottom: 30px;

        /deep/.el-input--suffix .el-input__inner {
          padding-right: 0;
        }

        > p {
          margin-bottom: 10px;
        }

        .time-select {
          display: flex;
          align-items: center;

          > span {
            margin: 0 10px;
          }
        }
      }

      .per-con > p {
        margin-bottom: 10px;
      }
    }

    .shop-div2 {
      .shop-type {
        > p {
          margin-bottom: 10px;
        }

        .type-box::after {
          display: block;
          content: "";
          clear: both;
        }

        .type-box div > span {
          display: inline-block;
          height: 32px;
          padding: 0 10px;
          line-height: 30px;
          font-size: 12px;
          color: #409eff;
          border: 1px solid #d9ecff;
          border-radius: 4px;
          margin: 0 10px 10px 0;
          box-sizing: border-box;
          white-space: nowrap;
          cursor: pointer;
        }
      }
    }
  }

  .shop-label {
    margin-bottom: 30px;

    > p {
      margin-bottom: 10px;
    }

    .labels > span {
      display: block;
      border: 1px solid #409eff;
      color: #409eff;
      border-radius: 6px;
      padding: 6px 20px;
      float: left;
      margin: 0 10px 10px 0;
      background-color: #ecf5ff;
    }

    /deep/ .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
      vertical-align: middle !important;
    }

    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 32px;
      padding-top: 0;
      padding-bottom: 0;
      box-sizing: border-box;
      font-weight: bolder;
    }
  }

  .shop-address {
    margin-bottom: 30px;

    /deep/ .dtl_add {
      margin: 10px 0;
    }

    > p {
      margin-bottom: 10px;
    }

    .shop-add span {
      background-color: #ecf5ff;
      display: inline-block;
      height: 32px;
      padding: 0 10px;
      line-height: 30px;
      font-size: 12px;
      color: #409eff;
      border: 1px solid #d9ecff;
      border-radius: 4px;
      margin: 0 10px 10px 0;
      box-sizing: border-box;
      white-space: nowrap;
    }
  }

  /deep/ .el-textarea__inner {
    resize: none !important;
    line-height: 1.9;
  }
}

h4 {
  font-weight: normal;
  display: flex;
  align-items: center;
  height: 26px;
  margin-bottom: 30px;
  box-sizing: border-box;
}

h4::before {
  display: inline-block;
  content: "";
  width: 4px;
  height: 26px;
  margin-right: 10px;
  background-color: #000;
}

.shop-seat {
  display: flex;

  .left-box {
    margin: 0 30px 30px 0;

    .seat-title {
      display: flex;
      justify-content: space-between;
      width: 400px;
      margin-bottom: 20px;

      > p {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      p span {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background-color: #ddd;
        margin-right: 6px;
        border: 1px solid #ddd;
      }
    }

    .seat-box {
      padding: 20px;
      box-sizing: border-box;
      background-color: #ddd;
      display: flex;

      > div {
        > div {
          &:last-child {
            > span {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .input-seat {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .seat-change-box {
        &:first-child {
          margin-right: 20px;
        }

        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #ddd;
        width: 120px;
        height: 32px;
        font-size: 16px;
        color: #606266;
        > div {
          width: 33%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid #ddd;
          cursor: pointer;

          &:not(.num) {
            background: #f5f7fa;
          }

          &:last-child {
            border-right: none;
          }
        }
      }
    }

    .floor-list {
      margin: 20px 0;
    }
  }

  .right-box {
    padding: 20px;
    .min-charge {
      align-items: flex-start;
      .day-mincom {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 30px 20px;
        width: 60%;
        white-space: nowrap;
        > div {
          margin-bottom: 16px;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;

          > span {
            margin-right: 10px;
            white-space: nowrap;
          }
        }

        > div:last-child {
          margin-bottom: 0;
        }
      }
    }

    > div {
      margin-bottom: 30px;

      &:not(.min-charge) {
        display: flex;
        align-items: center;
      }

      > span {
        margin-right: 0;
        width: 120px;
        display: block;
      }

      > span.snacks {
        width: 48px !important;
      }
    }

    > div.snacks {
      align-items: flex-start;
    }

    .seat-detail {
      margin-bottom: 30px;
    }

    .seat-prop {
      display: flex;
      align-items: center;

      .prop-box {
        float: left;
        padding: 10px;
        padding-bottom: 0;
        border: 1px solid #ddd;

        .min-con {
          float: left;
          margin-right: 0px;
        }

        span {
          float: left;
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background-color: #ddd;
          margin-right: 10px;
          border: 1px solid #ddd;
        }

        span:last-child {
          margin-right: 0;
        }
      }
    }

    .lon-retain {
      display: flex;
      align-items: center;
    }
  }
}

.ktv-wrap {
  display: flex;

  .ktv-left-box {
    width: 60%;

    .time-quan {
      max-height: 420px;
      width: 70%;
      overflow-y: auto;
      margin: 20px 0;
    }

    .date-dist {
      border: 1px solid #c0c4cc;
      border-radius: 4px;
      padding: 20px 20px 10px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      > div {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        > span {
          min-width: 120px;
        }
      }

      .data > div {
        display: flex;
        align-items: center;
      }
    }

    > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 20px;

      > span {
        min-width: 120px;
      }
    }

    .snacks {
      display: block;

      > p {
        margin-bottom: 10px;
      }

      .snacks-detail {
        .mult {
          margin: 0 3px;
        }

        li {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          .snacks-name {
            max-width: 132px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        div span:first-child {
          margin-right: 30px;
        }
      }

      .snacks-form {
        display: flex;
        align-items: center;
      }
    }

    .ktv-banner {
      display: flex;
      align-items: flex-start;
      > p {
        margin-bottom: 10px;
      }
      > div {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
      img {
        width: 130px;
        height: 80px;
        margin: 0 8px 6px 0;
        border-radius: 6px;
      }
      /deep/ .el-upload-list--picture-card .el-upload-list__item {
        transition: none;
        width: 130px;
        height: 80px;
        margin: 0 8px 6px 0;
      }

      /deep/ .el-upload--picture-card {
        width: 130px;
        height: 80px;
        line-height: 80px;
      }
    }

    /deep/ .el-textarea__inner {
      resize: none !important;
      line-height: 1.9;
    }

    .el-textarea {
      width: 50%;
    }
  }

  .ktv-right-box {
    width: 38%;

    .change-ktvFloor {
      margin-bottom: 20px;
    }

    .left-box {
      display: flex;
      justify-content: space-between;
    }

    ul li {
      border: 1px solid #c0c4cc;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 20px;

      p {
        margin-bottom: 10px;
      }
    }
  }
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 170px;
  height: 100px;
}

/deep/ .el-upload--picture-card {
  width: 170px;
  height: 100px;
  line-height: 100px;
}

/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

/deep/.avatar {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  display: block;
}

/deep/.el-upload.el-upload--text {
  width: 120px;
  height: 120px;
}

/deep/ .el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
}

/deep/.right-wrap .day-mincom {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 5px;
  }

  .el-input__inner {
    padding: 0 0 0 5px;
  }
  .el-input__prefix {
    left: 100%;
  }
}

/deep/ .el-input--suffix .el-input__inner {
  padding-right: 0;
}

/deep/ .floor-dialog {
  .el-dialog {
    width: 30%;

    .el-dialog__body {
      padding: 10px 20px;
    }

    .input-box {
      > div {
        margin-bottom: 15px;
      }
    }
  }
}

.shop-loca-span {
  background-color: #ecf5ff;
}

.shop-type-span {
  background-color: #ecf5ff;
}

.not-book {
  background-color: #e6a23c !important;
  border: 1px solid transparent !important;
}

.can-book {
  background-color: #fff !important;
}

.in-book {
  background-color: #409eff !important;
  border: 1px solid transparent !important;
}

.has-book {
  background-color: #f56c6c !important;
  border: 1px solid transparent !important;
}

.stage-book {
  background-color: #008000 !important;
  border: 1px solid transparent !important;
}

.aisle-book {
  background-color: #999 !important;
  border: 1px solid transparent !important;
}

.seat {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-right: 10px;
  border: 1px solid transparent;
  background-color: #999 !important;
  cursor: pointer;
}

.border {
  border: 1px solid #f00 !important;
}

.notBook {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-right: 10px;
  border: 1px solid transparent;
  background-color: #e6a23c !important;
  cursor: pointer;
}

.canBook {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  background-color: #fff !important;
  cursor: pointer;
}

.stageBook {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-right: 10px;
  border: 1px solid transparent;
  background-color: #008000 !important;
  cursor: pointer;
}

.aisleBook {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-right: 10px;
  border: 1px solid transparent;
  background-color: #999 !important;
  cursor: pointer;
}
</style>
