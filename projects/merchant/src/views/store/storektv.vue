<template>
  <basic-container v-if="storeType === 3">
    <div>
      <div>
        <div class="ktv-wrap">
          <div class="top-btn-box">
            <el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="handleAddKtv"
                >新增包间</el-button
              >
            </el-row>
          </div>

          <el-dialog
            :visible.sync="dialogFormVisible"
            append-to-body="true"
            title="包间信息"
            width="60%"
            @close="clearKtvInfo"
          >
            <div class="dialog-box">
              <!-- 包间类型 -->
              <div>
                <span>包间类型：</span>
                <el-input
                  v-model="presentKtvInfo.type"
                  placeholder="请输入"
                  style="width: 50%"
                >
                </el-input>
              </div>

              <!-- 包间描述 -->
              <div>
                <span>包间描述：</span>
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入包间描述，非必填"
                  v-model="presentKtvInfo.roomDetail"
                  maxlength="120"
                  show-word-limit
                ></el-input>
              </div>

              <!-- 包间数量 -->
              <div>
                <span>包间数量：</span>
                <el-input-number
                  @blur="checkNull(presentKtvInfo.roomNumber, '包间数量')"
                  :step="1"
                  step-strictly
                  v-model="presentKtvInfo.roomNumber"
                  controls-position="right"
                  :min="1"
                  placeholder="包间数量"
                  style="width: 50%"
                ></el-input-number>
              </div>

              <!-- 容纳人数 -->
              <div>
                <span>容纳人数：</span>
                <el-input-number
                  @blur="checkNull(presentKtvInfo.capacity, '容纳人数')"
                  :step="1"
                  step-strictly
                  controls-position="right"
                  :min="1"
                  v-model="presentKtvInfo.capacity"
                  placeholder="容纳人数"
                  style="width: 50%"
                ></el-input-number>
              </div>

              <!-- 服务费 -->
              <div>
                <span>服务费：</span>
                <el-input
                  type="number"
                  v-model="presentKtvInfo.fee"
                  placeholder="服务费（非必填）"
                  style="width: 50%"
                  @blur="checkPrice(presentKtvInfo.fee, 3)"
                >
                  <template slot="append">￥</template>
                </el-input>
              </div>

              <!-- 配套设施 -->
              <div>
                <span>配套设施：</span>
                <template>
                  <el-checkbox
                    v-model="presentKtvInfo.haveToilet"
                    :true-label="1"
                    :false-label="0"
                    >独立卫生间</el-checkbox
                  >
                  <el-checkbox
                    v-model="presentKtvInfo.haveDiningTable"
                    :true-label="1"
                    :false-label="0"
                    >餐桌</el-checkbox
                  >
                  <el-checkbox
                    v-model="presentKtvInfo.haveMahjong"
                    :true-label="1"
                    :false-label="0"
                    >机麻</el-checkbox
                  >
                  <el-checkbox
                    v-model="presentKtvInfo.haveSwimming"
                    :true-label="1"
                    :false-label="0"
                    >泳池</el-checkbox
                  >
                  <el-checkbox
                    v-model="presentKtvInfo.haveTableTennis"
                    :true-label="1"
                    :false-label="0"
                    >桌球</el-checkbox
                  >
                </template>
              </div>

              <!-- 时间段分布 -->
              <div class="time-quan">
                <!-- 回显 -->
                <div
                  class="date-dist clearfix"
                  v-for="(item, index) in presentKtvInfo.roomTimeIntervalList"
                  :key="index"
                >
                  <!-- 时间段 -->
                  <div class="data">
                    <span>时间段分布：</span>
                    <div>
                      <el-time-select
                        :clearable="false"
                        :editable="false"
                        @change="checkNull(item.startTime, '开始时间')"
                        @blur="checkDate(item.startTime, item.endTime, index)"
                        style="width: 100px"
                        v-model="item.startTime"
                        :picker-options="{
                          start: '00:00',
                          step: '00:10',
                          end: '23:50',
                        }"
                        placeholder="开始"
                      ></el-time-select>
                      <span style="margin: 0 10px">~</span>
                      <el-time-select
                        :clearable="false"
                        :editable="false"
                        @change="checkNull(item.endTime, '结束时间')"
                        @blur="checkDate(item.startTime, item.endTime, index)"
                        style="width: 100px"
                        v-model="item.endTime"
                        :picker-options="{
                          start: '00:00',
                          step: '00:10',
                          end: '23:50',
                        }"
                        placeholder="结束"
                      ></el-time-select>
                    </div>
                  </div>
                  <!-- 最低消费 -->
                  <div class="minCon">
                    <span>最低消费：</span>
                    <el-input
                      type="number"
                      @blur="checkPrice(item.minConsumption, 1, index)"
                      v-model="item.minConsumption"
                      placeholder="最低消费"
                      style="width: 50%"
                      min="0"
                    >
                      <template slot="append">￥</template>
                    </el-input>
                  </div>
                  <!-- 删除 -->
                  <el-button
                    @click="delTimeQuan(item)"
                    type="danger"
                    style="float: right"
                    >删除</el-button
                  >
                </div>

                <!-- 新增 -->
                <div class="date-dist clearfix">
                  <!-- 时间段 -->
                  <div class="data">
                    <span>时间段分布：</span>
                    <div>
                      <el-time-select
                        style="width: 100px"
                        v-model="timeQuanObj.startTime"
                        :picker-options="{
                          start: '00:00',
                          step: '00:10',
                          end: '23:50',
                        }"
                        placeholder="开始"
                      ></el-time-select>
                      <span style="margin: 0 10px">~</span>
                      <el-time-select
                        style="width: 100px"
                        v-model="timeQuanObj.endTime"
                        :picker-options="{
                          start: '00:00',
                          step: '00:10',
                          end: '23:50',
                        }"
                        placeholder="结束"
                      ></el-time-select>
                    </div>
                  </div>
                  <!-- 最低消费 -->
                  <div class="minCon">
                    <span>最低消费：</span>
                    <el-input
                      type="number"
                      @blur="checkPrice(timeQuanObj.minConsumption, 2)"
                      v-model="timeQuanObj.minConsumption"
                      placeholder="最低消费"
                      style="width: 50%"
                      min="0"
                    >
                      <template slot="append">￥</template>
                    </el-input>
                  </div>
                  <span style="font-size: 12px; color: #f00"
                    >*输入完内容后，点击添加按钮视为添加成功</span
                  >
                  <!-- 确定 -->
                  <el-button
                    @click="addTimeQuan"
                    type="primary"
                    style="float: right"
                    >添加</el-button
                  >
                </div>
              </div>

              <!-- 赠品 -->
              <div class="snacks">
                <p>赠品：</p>
                <div class="snacks-detail">
                  <!-- 回显 -->
                  <ul>
                    <li
                      v-for="(item, index) in presentKtvInfo.snacks"
                      :key="index"
                    >
                      <el-input
                        v-if="'id' in item"
                        readonly
                        :value="item.goodsName"
                        style="width: 215px"
                      >
                      </el-input>
                      <el-input
                        v-else
                        readonly
                        :value="item.goodsName.split('_')[1]"
                        style="width: 215px"
                      >
                      </el-input>
                      <span class="mult">
                        <i class="el-icon-close"></i>
                      </span>
                      <el-input
                        readonly
                        style="width: 70px; margin-right: 10px"
                        v-model="item.num"
                      ></el-input>
                      <el-button @click="deleteSnacks(item)" type="danger"
                        >删除</el-button
                      >
                    </li>
                  </ul>

                  <!-- 新增 -->
                  <div class="snacks-form">
                    <el-select
                      @focus="selGoodsList(false, 2)"
                      v-model="snacksObj.goodsName"
                      placeholder="选择赠品"
                      clearable
                    >
                      <el-option
                        v-for="item in resSelGoodsList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id + '_' + item.name"
                      ></el-option>
                    </el-select>

                    <span class="mult">
                      <i class="el-icon-close"></i>
                    </span>
                    <el-input
                      :onkeyup="
                        (snacksObj.num = snacksObj.num.replace(
                          /^(0+)|[^\d]+/g,
                          ''
                        ))
                      "
                      style="width: 70px; margin-right: 10px"
                      v-model="snacksObj.num"
                      placeholder="数量"
                    ></el-input>
                    <el-button type="primary" @click="addSnacks"
                      >添加</el-button
                    >
                  </div>
                </div>
              </div>

              <!-- 必选商品 -->
              <div class="snacks">
                <p>必选套餐：</p>
                <div class="snacks-detail">
                  <!-- 回显 -->
                  <ul>
                    <li
                      v-for="(item, index) in presentKtvInfo.ncsGoodsSkuList"
                      :key="index"
                    >
                      <el-input
                        v-if="'id' in item"
                        readonly
                        :value="item.goodsName"
                        style="width: 215px"
                      >
                      </el-input>
                      <el-input
                        v-else
                        readonly
                        :value="item.goodsName.split('_')[1]"
                        style="width: 215px"
                      >
                      </el-input>
                      <span class="mult">
                        <i class="el-icon-close"></i>
                      </span>
                      <el-input
                        readonly
                        style="width: 70px; margin-right: 10px"
                        v-model="item.num"
                      ></el-input>
                      <el-button type="danger" @click="delNcsGoods(item)"
                        >删除</el-button
                      >
                    </li>
                  </ul>

                  <!-- 新增 -->
                  <div class="snacks-form">
                    <el-select
                      @focus="selGoodsList(false, 3)"
                      v-model="ncsGoods.goodsName"
                      placeholder="选择套餐"
                      clearable
                    >
                      <el-option
                        v-for="item in resSelGoodsList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id + '_' + item.name"
                      ></el-option>
                    </el-select>
                    <span class="mult">
                      <i class="el-icon-close"></i>
                    </span>
                    <el-input
                      :onkeyup="
                        (ncsGoods.num = ncsGoods.num.replace(
                          /^(0+)|[^\d]+/g,
                          ''
                        ))
                      "
                      style="width: 70px; margin-right: 10px"
                      v-model="ncsGoods.num"
                      placeholder="数量"
                    ></el-input>
                    <el-button type="primary" @click="addNcsGoods"
                      >添加</el-button
                    >
                  </div>
                </div>
              </div>

              <!-- ktv包间示意图 -->
              <div class="ktv-banner" v-loading="imgLoading.loading1">
                <p>ktv示意图：</p>
                <el-upload
                  class="avatar-uploader"
                  action="1"
                  :before-upload="beforeImgUpload"
                  :http-request="uploadSketchFile"
                  :show-file-list="false"
                  :on-error="uploadError"
                >
                  <img
                    v-if="presentKtvInfo.sketch"
                    :src="showImgPrefix + presentKtvInfo.sketch"
                    class="avatar"
                  />
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>

              <!-- ktv包间缩略图 -->
              <div class="ktv-banner" v-loading="imgLoading.loading2">
                <p>ktv缩略图：</p>
                <el-upload
                  class="avatar-uploader"
                  action="1"
                  :before-upload="beforeImgUpload"
                  :http-request="uploadThumbFile"
                  :show-file-list="false"
                  :on-error="uploadError"
                >
                  <img
                    v-if="presentKtvInfo.thumb"
                    :src="showImgPrefix + presentKtvInfo.thumb"
                    class="avatar"
                  />
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="clearKtvInfo">取消</el-button>
              <template>
                <el-button type="primary" @click="sureSubmitKtvInfo"
                  >确定</el-button
                >
              </template>
            </span>
          </el-dialog>
          <!-- ktv包间属性列表 -->
          <div class="list-box" v-if="ktvList.length !== 0">
            <ul>
              <li v-for="(item, index) in ktvList" :key="index">
                <div class="top-wrap">
                  <div class="left-box">
                    <p>
                      <span>包间类型：</span>
                      <span>{{ item.type }}</span>
                    </p>
                    <p>
                      <span>容纳人数：</span>
                      <span>{{ item.capacity }}人</span>
                    </p>
                    <p>
                      <span>包间数量：</span>
                      <span>{{ item.num }}个</span>
                    </p>
                    <p>
                      <span>服务费：</span>
                      <span>{{ item.tip }}个</span>
                    </p>
                    <p>
                      <span>最低消费：</span>
                      <span>{{ item.minConsumption }}元</span>
                    </p>
                  </div>
                  <div class="right-box">
                    <img :src="showImgPrefix + item.thumb" />
                  </div>
                </div>
                <div class="set-box">
                  <el-button @click="lookKtvInfo(item.id)" type="primary"
                    >编辑</el-button
                  >
                  <el-button @click="handleDelete(item.id)" type="danger"
                    >删除</el-button
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
  <basic-container v-else> 本店铺不支持包间管理 </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  uploadFile,
  getGoodsList,
} from "@/api/store/storektv";

export default {
  data() {
    return {
      storeBusiness: this.$store.state.storeBusiness,

      storeType: this.$store.state.storeType,
      imgLoading: {
        loading1: false,
        loading2: false,
      },
      id: "", //当前要修改的ktv包间id
      isUpdate: false, //是否为修改信息状态
      checkRight: false, //是否字段全部验证通过
      dialogFormVisible: false,
      showImgPrefix: this.$imgHead, //回显图片的前缀
      ktvList: [], //回显KTV列表

      resSelGoodsList: [], //返回的可选择的ktv赠品/必选商品列表

      //当前ktv包间配置的赠品
      snacksObj: {
        goodsName: "",
        num: "",
      },

      //当前ktv包间配置的必选商品
      ncsGoods: {
        goodsName: "",
        num: "",
      },

      //当前ktv包间配置的时间段
      timeQuanObj: {
        startTime: "", //开始时间
        endTime: "", //结束时间
        minConsumption: 0.1, //最低消费
      },

      //当前ktv包间对应的详细信息
      presentKtvInfo: {
        type: "", //包间类型
        roomDetail: "", //包间描述
        roomNumber: 1, //包间数量
        capacity: 1, //容纳人数
        fee: 0, //服务费
        haveToilet: 0, //独立卫生间
        haveDiningTable: 0, //餐桌
        haveMahjong: 0, //麻将
        haveSwimming: 0, //泳池
        haveTableTennis: 0, //桌球
        roomTimeIntervalList: [], //时间段集合
        snacks: [], //赠品
        ncsGoodsSkuList: [], //必选商品
        sketch: "", //ktv示意图
        thumb: "", //ktv缩略图
      },
    };
  },

  created() {
    this.getKtvList();
  },

  methods: {
    //新增ktv按钮
    handleAddKtv() {
      this.dialogFormVisible = true;
    },

    // 上传头像之前的验证
    beforeImgUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 <= 1; //限制文件大小

      //限制上传文件格式
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 JPG / PNG 格式");
        return false;
      }

      //限制上传文件大小
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 1MB");
        return false;
      }
    },

    //上传ktv示意图
    async uploadSketchFile(file) {
      this.imgLoading.loading1 = true;
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        this.presentKtvInfo.sketch = res.data.name;
        this.$message.success("上传成功");
        this.imgLoading.loading1 = false;
      } else {
        this.imgLoading.loading1 = false;
      }
    },

    //上传ktv缩略图
    async uploadThumbFile(file) {
      this.imgLoading.loading2 = true;
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        this.presentKtvInfo.thumb = res.data.name;
        this.$message.success("上传成功");
        this.imgLoading.loading2 = false;
      } else {
        this.imgLoading.loading2 = false;
      }
    },

    //获取ktv列表
    async getKtvList() {
      const { data: res } = await getList();
      if (res.code === 200) {
        this.ktvList = res.data.records;
      }
    },

    //提交保存ktv信息
    async sureSubmitKtvInfo() {
      this.ktvSureSub();
      if (this.checkRight) {
        let data = {
          type: this.presentKtvInfo.type,
          description: this.presentKtvInfo.roomDetail,
          num: this.presentKtvInfo.roomNumber,
          capacity: this.presentKtvInfo.capacity,
          tip: this.presentKtvInfo.fee,
          hasToilet: this.presentKtvInfo.haveToilet,
          hasDining: this.presentKtvInfo.haveDiningTable,
          hasMahjong: this.presentKtvInfo.haveMahjong,
          hasSnooker: this.presentKtvInfo.haveTableTennis,
          hasSwim: this.presentKtvInfo.haveSwimming,
          timeIntervalList: this.presentKtvInfo.roomTimeIntervalList,
          snacksList: this.presentKtvInfo.snacks,
          necessaryList: this.presentKtvInfo.ncsGoodsSkuList,
          sketch: this.presentKtvInfo.sketch,
          thumb: this.presentKtvInfo.thumb,
        };

        if (this.isUpdate) {
          data.id = this.id;
          const { data: res } = await update(data);
          if (res.code === 200) {
            this.$message.success("修改成功");
            this.getKtvList();
            this.clearKtvInfo();
          }
        } else {
          const { data: res } = await add(data);
          if (res.code === 200) {
            this.$message.success("新增成功");
            this.getKtvList();
            this.clearKtvInfo();
          }
        }
      }
    },

    //包间信息初始化
    clearKtvInfo() {
      this.dialogFormVisible = false;
      this.isUpdate = false;
      this.presentKtvInfo = {
        type: "", //包间类型
        roomDetail: "", //包间描述
        roomNumber: 1, //包间数量
        capacity: 1, //容纳人数
        fee: 0, //服务费
        haveToilet: 0, //独立卫生间
        haveDiningTable: 0, //餐桌
        haveMahjong: 0, //麻将
        haveSwimming: 0, //泳池
        haveTableTennis: 0, //桌球
        roomTimeIntervalList: [], //时间段集合
        snacks: [], //赠品
        ncsGoodsSkuList: [], //必选商品
        sketch: "", //ktv示意图
        thumb: "", //ktv缩略图
      };

      this.timeQuanObj = {
        startTime: "", //开始时间
        endTime: "", //结束时间
        minConsumption: 0.1, //最低消费
      };

      this.snacksObj = {
        goodsName: "",
        num: "",
      };

      this.ncsGoods = {
        goodsName: [],
        num: "",
      };
    },

    //包间删除
    handleDelete(id) {
      this.$confirm("确认要删除此包间吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.removeKtvList(id);
        })
        .catch(() => {});
    },

    //删除包间操作
    async removeKtvList(ids) {
      const { data: res } = await remove(ids);
      if (res.code === 200) {
        this.getKtvList();
        this.$message.success("删除成功");
      }
    },

    //验证输入的金额
    checkPrice(price, opt, index) {
      if (price !== "") {
        if (price < 0.1 || this.$regular.money(price) === false) {
          switch (opt) {
            case 1:
              this.presentKtvInfo.roomTimeIntervalList[
                index
              ].minConsumption = 0.1;
              break;
            case 2:
              this.timeQuanObj.minConsumption = 0.1;
              break;
            case 3:
              this.presentKtvInfo.fee = 0;
              break;
          }
          if (price < 0 && opt === 3) {
            this.$message.error("服务费金额不能低于0元，可不填");
          } else if (this.$regular.money(price) === false) {
            this.$message.error("请输入正确格式的金额");
          } else if (price < 0.1 && opt !== 3) {
            this.$message.error("消费金额不能低于0.1元");
          }
        }
      }
    },

    //字段非空验证
    checkNull(item, txt) {
      if (item === "" || item === undefined || item === null) {
        this.$message.error(`${txt}不能为空`);
      }
    },

    //验证时间段分布
    checkDate(startTime, endTime, index) {
      if (startTime === endTime) {
        this.$message.error("开始时间不能等于结束时间");
        this.presentKtvInfo.roomTimeIntervalList[index].startTime = "";
        this.presentKtvInfo.roomTimeIntervalList[index].endTime = "";
        return;
      }
    },

    //图片上传失败时
    uploadError() {
      this.$message.error("上传失败");
    },

    //添加时间段
    addTimeQuan() {
      if (
        this.timeQuanObj.startTime === "" ||
        this.timeQuanObj.startTime === null
      ) {
        this.$message.error("开始时间不能为空");
      } else if (
        this.timeQuanObj.endTime === "" ||
        this.timeQuanObj.endTime === null
      ) {
        this.$message.error("结束时间不能为空");
      } else if (this.timeQuanObj.startTime === this.timeQuanObj.endTime) {
        this.$message.error("开始时间不能等于结束时间");
      } else if (this.timeQuanObj.minConsumption == 0) {
        this.$message.error("最低消费不能为0");
      } else if (
        this.$regular.money(this.timeQuanObj.minConsumption) === false
      ) {
        this.$message.error("请输入正确格式的金额");
      } else {
        let timeQuan = Object.assign({}, this.timeQuanObj);
        this.presentKtvInfo.roomTimeIntervalList.push(timeQuan);
        this.timeQuanObj = {
          startTime: "", //开始时间
          endTime: "", //结束时间
          minConsumption: 0.1, //最低消费
        };
      }
    },

    //删除时间段
    delTimeQuan(item) {
      const index = this.presentKtvInfo.roomTimeIntervalList.indexOf(item);
      if (index !== -1) {
        this.presentKtvInfo.roomTimeIntervalList.splice(index, 1);
      }
    },

    //获取当前可选择的赠品/必选商品列表
    async selGoodsList(needSku = 0, type) {
      this.resSelGoodsList = [];
      let data = {
        needSku,
        type,
      };
      const { data: res } = await getGoodsList(data);
      if (res.code === 200) {
        this.resSelGoodsList = res.data;
      }
    },

    //添加赠品
    addSnacks() {
      if (!this.snacksObj.goodsName) {
        this.$message.error("请选择赠品");
      } else if (!this.snacksObj.num) {
        this.$message.error("请输入赠品数量");
      } else {
        let snacksObj = Object.assign({}, this.snacksObj);
        this.presentKtvInfo.snacks.push(snacksObj);
        this.snacksObj = {
          goodsName: "",
          num: "",
        };
      }
    },

    //删除赠品
    deleteSnacks(item) {
      const index = this.presentKtvInfo.snacks.indexOf(item);
      if (index !== -1) {
        this.presentKtvInfo.snacks.splice(index, 1);
      }
    },

    //添加必选商品
    addNcsGoods() {
      if (!this.ncsGoods.goodsName) {
        this.$message.error("请选择必选商品");
      } else if (!this.ncsGoods.num) {
        this.$message.error("请输入必选商品数量");
      } else {
        let ncsGoods = Object.assign({}, this.ncsGoods);
        this.presentKtvInfo.ncsGoodsSkuList.push(ncsGoods);
        this.ncsGoods = {
          goodsName: "",
          num: "",
        };
      }
    },

    //删除必选商品
    delNcsGoods(item) {
      const index = this.presentKtvInfo.ncsGoodsSkuList.indexOf(item);
      if (index !== -1) {
        this.presentKtvInfo.ncsGoodsSkuList.splice(index, 1);
      }
    },

    //查看当前ktv包间信息
    async lookKtvInfo(id) {
      this.isUpdate = true;
      const { data: resu } = await getDetail(id);
      if (resu.code === 200) {
        let res = resu.data;
        this.id = res.id;
        this.presentKtvInfo.type = res.type;
        this.presentKtvInfo.roomDetail = res.description;
        this.presentKtvInfo.roomNumber = res.num;
        this.presentKtvInfo.capacity = res.capacity;
        this.presentKtvInfo.fee = res.tip;
        this.presentKtvInfo.haveToilet = res.hasToilet;
        this.presentKtvInfo.haveDiningTable = res.hasDining;
        this.presentKtvInfo.haveMahjong = res.hasMahjong;
        this.presentKtvInfo.haveSwimming = res.hasSwim;
        this.presentKtvInfo.haveTableTennis = res.hasSnooker;
        this.presentKtvInfo.roomTimeIntervalList = res.timeIntervalList;
        this.presentKtvInfo.snacks = res.snacksList;
        this.presentKtvInfo.ncsGoodsSkuList = res.necessaryList;
        this.presentKtvInfo.sketch = res.sketch;
        this.presentKtvInfo.thumb = res.thumb;
        this.dialogFormVisible = true;
      }
    },

    //提交保存ktv包间信息
    ktvSureSub() {
      if (!this.presentKtvInfo.type) {
        this.$message.error("请输入包间类型");
      } else if (!this.presentKtvInfo.roomNumber) {
        this.$message.error("请输入包间数量");
      } else if (!this.presentKtvInfo.capacity) {
        this.$message.error("请输入容纳人数");
      } else if (this.presentKtvInfo.roomTimeIntervalList.length == 0) {
        this.$message.error("请添加时间段分布");
      } else if (!this.presentKtvInfo.sketch) {
        this.$message.error("请上传ktv示意图");
      } else if (!this.presentKtvInfo.thumb) {
        this.$message.error("请上传ktv缩略图");
      } else {
        this.checkRight = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.clearfix::after {
  display: block;
  content: "";
  clear: both;
}

.ktv-wrap {
  .top-btn-box {
    margin-bottom: 20px;
  }

  .list-box {
    ul::after {
      height: 0;
      content: "";
    }

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        border: 1px solid #c0c4cc;
        box-shadow: 1px 1px 3px 0 #999;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 16px;
        margin: 0 20px 20px 0;
        width: 380px;

        p {
          margin-bottom: 10px;
        }
      }
    }

    .top-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .right-box {
        img {
          width: 180px;
          height: 120px;
          border-radius: 8px;
        }
      }
    }
  }
}

.dialog-box {
  width: 70%;
  margin: 0 auto;

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
      width: 100%;
      height: 100%;
      border-radius: 6px;
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

// /deep/ .el-upload-list--picture-card .el-upload-list__item {
//   width: 170px;
//   height: 100px;
// }

// /deep/ .el-upload--picture-card {
//   width: 170px;
//   height: 100px;
//   line-height: 100px;
// }

// /deep/ .avatar-uploader .el-upload {
//   border: 1px dashed #d9d9d9;
//   border-radius: 6px;
//   cursor: pointer;
//   position: relative;
//   overflow: hidden;
// }

// /deep/ .avatar-uploader .el-upload:hover {
//   border-color: #409eff;
// }

/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  height: 180px;
  line-height: 180px;
  text-align: center;
}

// /deep/.avatar {
//   width: 120px;
//   height: 120px;
//   border-radius: 6px;
//   display: block;
// }

// /deep/.el-upload.el-upload--text {
//   width: 120px;
//   height: 120px;
// }

// /deep/ .el-input-group__append,
// .el-input-group__prepend {
//   padding: 0 10px;
// }

// /deep/.right-wrap .day-mincom {
//   .el-input-group__append,
//   .el-input-group__prepend {
//     padding: 0 5px;
//   }

//   .el-input__inner {
//     padding: 0 0 0 5px;
//   }
//   .el-input__prefix {
//     left: 100%;
//   }
// }

// /deep/ .el-input--suffix .el-input__inner {
//   padding-right: 0;
// }

// /deep/ .floor-dialog {
//   .el-dialog {
//     width: 30%;

//     .el-dialog__body {
//       padding: 10px 20px;
//     }

//     .input-box {
//       > div {
//         margin-bottom: 15px;
//       }
//     }
//   }
// }

// .el-tag + .el-tag {
//   margin-left: 10px;
// }

// .el-tag--small {
//   height: 32px;
//   line-height: 32px;
//   margin-bottom: 10px;
// }
</style>

