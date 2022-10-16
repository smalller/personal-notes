<template>
  <div class="goods-info-box">
    <div class="left-box">
      <el-form ref="goodsForm" :model="goodsForm" label-width="80px">
        <div class="good-name-box">
          <div>
            <span>*商品名称：</span>
            <el-input
              v-model="goodsForm.name"
              maxlength="20"
              style="width: 160px"
            ></el-input>
          </div>
          <div>
            <span>商品排序：</span>
            <el-input-number
              v-model="goodsForm.goodWeight"
              :min="0"
              label="商品排序"
            ></el-input-number>
            <span>（*数值越小排序越靠前）</span>
          </div>
          <div>
            <el-switch
              v-model="goodsForm.putAway"
              :active-value="0"
              :inactive-value="1"
              inactive-text="是否下架"
              style="margin-right: 30px"
            ></el-switch>
          </div>
        </div>
        <p>
          <span>商品简介：</span>
          <el-input
            type="textarea"
            v-model="goodsForm.desc"
            maxlength="60"
            show-word-limit
            style="width: 300px"
          ></el-input>
        </p>

        <!-- 商品规格 -->
        <template v-if="activeNum != 1 && activeNum != 11">
          <div class="drinks-spec">
            <div class="title">
              <span>*商品规格：</span>
            </div>
            <div class="sku-list">
              <!-- 回显规格 -->
              <div
                v-for="(item, index) in goodsForm.dynamicValidateForm.domains"
                :key="index"
              >
                <div class="sku-input">
                  <el-input
                    maxlength="20"
                    v-model="item.specName"
                    placeholder="规格（如：一瓶）"
                    style="width: 132px; margin-right: 10px"
                  ></el-input>
                  <el-input
                    @blur="checkPrice(item.priceUnitOrigin, 1, index)"
                    v-model="item.priceUnitOrigin"
                    placeholder="原价（如：9.99）"
                    style="width: 170px; margin-right: 10px"
                  >
                    <template slot="append">￥</template>
                  </el-input>
                  <el-input
                    @blur="checkPrice(item.priceUnitActual, 2, index)"
                    v-model="item.priceUnitActual"
                    placeholder="现价（如：9.99）"
                    style="width: 170px; margin-right: 10px"
                  >
                    <template slot="append">￥</template>
                  </el-input>
                  <el-button @click.prevent="removeDomain(item)">
                    <i class="el-icon-close"></i>
                  </el-button>
                </div>

                <div>
                  <el-switch
                    v-model="item.status"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-text="是否售罄"
                    style="margin-right: 30px"
                  ></el-switch>
                </div>
              </div>

              <!-- 新增规格 -->
              <div>
                <el-input
                  maxlength="20"
                  v-model="goodsForm.skuObj.specName"
                  placeholder="规格（如：一瓶）"
                  style="width: 132px; margin-right: 10px"
                ></el-input>
                <el-input
                  @blur="checkPrice(goodsForm.skuObj.priceUnitOrigin, 3)"
                  v-model="goodsForm.skuObj.priceUnitOrigin"
                  placeholder="原价（如：9.99）"
                  style="width: 170px; margin-right: 10px"
                >
                  <template slot="append">￥</template>
                </el-input>
                <el-input
                  @blur="checkPrice(goodsForm.skuObj.priceUnitActual, 4)"
                  v-model="goodsForm.skuObj.priceUnitActual"
                  placeholder="现价（如：9.99）"
                  style="width: 170px; margin-right: 10px"
                >
                  <template slot="append">￥</template>
                </el-input>
                <el-button @click="addDomain">
                  <i class="el-icon-plus"></i>
                </el-button>
              </div>
              <span style="color: #f00"
                >*输入完规格信息后，点击后面加号视为添加成功</span
              >
            </div>

            <!-- 不需要点加号就能新增的写法 -->
            <!-- <el-form
                            :model="goodsForm.dynamicValidateForm"
                            ref="goodsForm.dynamicValidateForm"
                            label-width="100px"
                            class="demo-dynamic"
                        >
                            <el-form-item v-for="(item, index) in goodsForm.dynamicValidateForm.domains" :key="index">
                                <el-input
                                    v-model="item.specName"
                                    placeholder="规格（如：一瓶）"
                                    style="width: 132px; margin-right: 10px"
                                ></el-input>
                                <el-input
                                    v-model="item.priceUnitOrigin"
                                    placeholder="原价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-input
                                    v-model="item.priceUnitActual"
                                    placeholder="现价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-button @click="addDomain">
                                    <i class="el-icon-plus"></i>
                                </el-button>
                                <el-button v-show="goodsForm.dynamicValidateForm.domains.length > 1" @click.prevent="removeDomain(item)">
                                    <i class="el-icon-close"></i>
                                </el-button>
                            </el-form-item>
                        </el-form> -->
          </div>
        </template>

        <!-- 酒水 -->
        <template
          v-if="
            activeNum != 1 &&
            activeNum != 9 &&
            activeNum != 10 &&
            activeNum != 11
          "
        >
          <p>
            <span>酒水产地：</span>
            <el-input v-model="goodsForm.area" style="width: 170px"></el-input>
          </p>
          <p>
            <span>酒水年份：</span>
            <el-input
              type="number"
              v-model="goodsForm.year"
              style="width: 170px"
            >
              <template slot="append">年</template>
            </el-input>
          </p>
        </template>

        <!-- 套餐 -->
        <template v-if="activeNum == 1">
          <!-- 套餐选择单品 -->
          <p>
            <span>*选择商品：</span>
            <el-cascader
              filterable
              clearable
              v-model="specChooseValue"
              :options="options"
              @change="selectGoodInfo"
              @focus="selectGoodsList"
            ></el-cascader>
          </p>

          <!-- 套餐单品表格数据 -->
          <p v-if="goodsForm.tableData.length > 0" style="width: 90%">
            <el-table :data="goodsForm.tableData" border>
              <el-table-column
                prop="goodsName"
                label="商品名称"
                width="150"
              ></el-table-column>
              <el-table-column label="商品图片" width="126">
                <template slot-scope="scope">
                  <img
                    style="width: 100px; height: 60px"
                    :src="showImgPrefix + scope.row.listPicture"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="specName"
                label="商品规格"
                width="150"
              ></el-table-column>
              <el-table-column label="数量" width="160">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.num"
                    :min="1"
                    label="商品数量"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </p>
          <p>
            <span>*套餐原单价：</span>
            <el-input
              type="number"
              @blur="checkPrice(goodsForm.originPrice, 5)"
              v-model="goodsForm.originPrice"
              style="width: 120px; margin-right: 20px"
            ></el-input>
            <span>*套餐现单价：</span>
            <el-input
              @blur="checkPrice(goodsForm.nowPrice, 6)"
              type="number"
              v-model="goodsForm.nowPrice"
              style="width: 120px"
            ></el-input>
          </p>
        </template>

        <!-- 会员卡 -->
        <template v-if="activeNum == 11">
          <p>
            <span>*会员卡积分：</span>
            <el-input
              readonly
              v-model="goodsForm.num"
              style="width: 120px; margin-right: 20px"
            ></el-input>

            <span>*会员卡原价：</span>
            <el-input
              v-model="goodsForm.originPrice"
              style="width: 120px; margin-right: 20px"
            ></el-input>

            <span>*会员卡现价：</span>
            <el-input
              v-model="goodsForm.nowPrice"
              style="width: 120px"
            ></el-input>
          </p>
        </template>
      </el-form>

      <!-- 酒水上传广告图与推荐位图 -->
      <template v-if="activeNum != 9 && activeNum != 10 && activeNum != 11">
        <div class="drinks-update-box">
          <!-- 商家推荐位 -->
          <div class="reco-box">
            <div class="reco-top-box">
              <el-checkbox
                :true-label="1"
                :false-label="0"
                @change="removeReco"
                v-model="goodsForm.checkedReco"
                label="放至商品推荐位"
                border
                style="margin-right: 20px"
              ></el-checkbox>
              <div v-if="goodsForm.checkedReco !== 0">
                <el-input-number
                  v-model="goodsForm.recoWeight"
                  :min="0"
                  label="推荐位排序"
                ></el-input-number>
                <span style="margin-left: 10px">推荐位排序</span>
              </div>
            </div>

            <div class="drinks-div">
              <el-upload
                v-if="goodsForm.checkedReco !== 0"
                class="avatar-uploader reco-img-box"
                action="1"
                :before-upload="beforeImgUpload"
                :show-file-list="false"
                :http-request="uploadRecoFiles"
                :on-error="uploadError"
              >
                <img
                  v-if="goodsForm.recoImageUrl"
                  :src="showImgPrefix + goodsForm.recoImageUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span v-if="goodsForm.checkedReco == 1"
                >（*选填，请上传尺寸为120*160，格式为jpg/jpeg/png的图片）</span
              >
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="right-box">
      <template v-if="activeNum != 11">
        <!-- 商品图 -->
        <div class="thum-img-box">
          <p>
            <span>*商品图：</span>
            <el-upload
              class="avatar-uploader"
              action="1"
              :before-upload="beforeImgUpload"
              :show-file-list="false"
              :http-request="uploadThumFiles"
              :on-error="uploadError"
            >
              <img
                v-if="goodsForm.thumImageUrl"
                :src="showImgPrefix + goodsForm.thumImageUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </p>
          <span>（*请上传尺寸为80*80，格式为jpg/jpeg/png的图片）</span>
        </div>

        <!-- 详情图 -->
        <div class="details-img-box">
          <p>
            <span>*商品详情图：</span>
            <el-upload
              class="avatar-uploader detail-img-box"
              action="1"
              :before-upload="beforeImgUpload"
              :show-file-list="false"
              :http-request="uploadDetailFiles"
              :on-error="uploadError"
            >
              <img
                v-if="goodsForm.detailImageUrl"
                :src="showImgPrefix + goodsForm.detailImageUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </p>
          <span>（*请上传尺寸为200*200，格式为jpg/jpeg/png的图片）</span>
        </div>
      </template>

      <!-- 会员卡卡片列表 -->
      <template>
        <div class="vip-card-wrap" v-if="activeNum == 11">
          <span>*会员卡商品图：</span>
          <div class="image-box" v-if="thumImageBox.length > 0">
            <img
              v-for="(item, index) in thumImageBox"
              ref="thumImg"
              @click="chooseThumImg(item.background, $event)"
              :src="showImgPrefix + item.background"
              :key="index"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  uploadFile,
  getGoodsList,
  getVipPhoto,
} from "@/api/handle-shop/handle-shop";

export default {
  props: ["goodsForm", "activeNum"], //父组件传过来的值

  data() {
    return {
      showImgPrefix: this.$imgHead, //回显图片前缀
      thumImageBox: [], //会员卡卡片列表
      options: [], //输入框请求到的商品信息数组
      goodName: "", //选中的商品对应的信息
      antiStatus: true, //防抖状态值
      specChooseValue: "", //二级联动选择后获取到的值
    };
  },

  mounted() {
    this.activeNum == 11 && this.getVipCard();
  },

  watch: {
    activeNum(val) {
      //如果切换到会员卡页面就加载会员卡卡片列表
      val == 11 && this.getVipCard();
    },

    "goodsForm.originPrice": {
      handler(val) {
        this.goodsForm.num = val;
      },
      deep: true,
    },
  },

  methods: {
    //验证金额
    checkPrice(price, opt, index) {
      if (price !== "") {
        if (price < 0.1 || this.$regular.money(price) === false) {
          switch (opt) {
            case 1:
              this.goodsForm.dynamicValidateForm.domains[
                index
              ].priceUnitOrigin = 0.1;
              break;
            case 2:
              this.goodsForm.dynamicValidateForm.domains[
                index
              ].priceUnitActual = 0.1;
              break;
            case 3:
              this.goodsForm.skuObj.priceUnitOrigin = 0.1;
              break;
            case 4:
              this.goodsForm.skuObj.priceUnitActual = 0.1;
              break;
            case 5:
              this.goodsForm.originPrice = 0.1;
              break;
            case 6:
              this.goodsForm.nowPrice = 0.1;
              break;
          }
          if (price < 0.1) {
            this.$message.error("消费金额不能低于0.1元");
          } else if (this.$regular.money(price) === false) {
            this.$message.error("请输入正确格式的金额");
          }
        }
      }
    },

    // 上传单图之前的验证
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
      if (isJPG || isPNG) {
        if (!isLt2M) {
          this.$message.error("图片大小不能超过 1MB");
          return false;
        }
      }
    },

    //关闭商家推荐位操作
    removeReco() {
      if (!this.goodsForm.checkedReco) {
        this.goodsForm.recoImageUrl = "";
        this.goodsForm.recoWeight = 0;
      }
    },

    //套餐处理当前选中的商品信息
    selectGoodInfo() {
      const goodInfoFlag = this.specChooseValue[0].split("^");

      // 将商品相关信息存入对象
      let obj = {
        itemId: goodInfoFlag[0],
        goodsName: goodInfoFlag[1],
        listPicture: goodInfoFlag[2],
        specName: this.specChooseValue[1],
        num: 1,
      };
      this.goodsForm.goodsIdList.push(goodInfoFlag[0]); //存入当前选择的商品id
      this.goodsForm.tableData.push(obj); //存入当前选择的商品所有信息，用于表格回显
      this.specChooseValue = ""; //清空选择的选项
      // this.selectGoodsList(); //重新请求商品列表
    },

    //请求套餐商品列表
    async selectGoodsList() {
      if (this.antiStatus === true) {
        this.antiStatus = false;
        let data = {
          goodsIds: this.goodsForm.goodsIdList.join(","),
        };
        const { data: res } = await getGoodsList(data);
        if (res.code === 200) {
          //转换格式
          let arrList = [];
          res.data.forEach((item) => {
            let obj = {
              value: item.id + "^" + item.name + "^" + item.listPicture,
              label: item.name,
              children: [],
            };

            item.goodsSkuList.forEach((item) => {
              let obj2 = {
                value: item.specName,
                label: item.specName,
              };

              obj.children.push(obj2);
            });

            arrList.push(obj);
          });

          this.options = arrList;
          this.antiStatus = true;
        }
      }
    },

    //移除套餐商品列表里的商品
    handleDelete(row) {
      //删除列表里的
      const tableDataDelIndex = this.goodsForm.tableData.indexOf(row);
      if (tableDataDelIndex !== -1) {
        this.goodsForm.tableData.splice(tableDataDelIndex, 1);
      }

      if ("itemId" in row) {
        this.goodsIdListDelFn(row.itemId);
      } else {
        this.goodsIdListDelFn(row.id);
      }

      //删除一个单品就添加到这个删除单品数组里
      if ("id" in row) {
        this.goodsForm.skuCodeArr.push(row.id);
      }
    },

    //移除套餐单品时，也要移除goodsIdList里相应的id
    goodsIdListDelFn(item) {
      const goodsIdListDelIndex = this.goodsForm.goodsIdList.indexOf(item);
      this.goodsForm.goodsIdList.splice(goodsIdListDelIndex, 1);
    },

    //选择会员卡片
    chooseThumImg(item, e) {
      this.$refs.thumImg.forEach((item) => {
        item.classList.remove("border");
      });
      e.target.classList.add("border");
      this.goodsForm.thumImageUrl = item;
    },

    //获取会员卡片
    async getVipCard() {
      const { data: res } = await getVipPhoto();
      if (res.code === 200) {
        this.thumImageBox = res.data;
        this.showVipCard();
      }
    },

    //回显会员卡片
    showVipCard() {
      this.$nextTick(() => {
        this.$refs.thumImg.forEach((item) => {
          let imgSrc = item.getAttribute("src");
          if (imgSrc == this.showImgPrefix + this.goodsForm.thumImageUrl) {
            item.classList.add("border");
          }
        });
      });
    },

    //商品规格添加按钮
    addDomain() {
      if (!this.goodsForm.skuObj.specName) {
        this.$message.error("请输入商品规格名称");
      } else if (!this.$regular.money(this.goodsForm.skuObj.priceUnitOrigin)) {
        this.$message.error("请输入正确的规格原价");
      } else if (!this.$regular.money(this.goodsForm.skuObj.priceUnitActual)) {
        this.$message.error("请输入正确的规格现价");
      } else if (
        +this.goodsForm.skuObj.priceUnitActual >
        +this.goodsForm.skuObj.priceUnitOrigin
      ) {
        this.$message.error("规格现价不能大于原价");
      } else {
        this.goodsForm.dynamicValidateForm.domains.push(this.goodsForm.skuObj);

        console.log(this.goodsForm.dynamicValidateForm.domains);
        this.goodsForm.skuObj = {
          specName: "", //规格
          priceUnitOrigin: "", //规格原价
          priceUnitActual: "", //规格现价
        };
      }
    },

    //商品规格删除按钮
    removeDomain(item) {
      const index = this.goodsForm.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.goodsForm.dynamicValidateForm.domains.splice(index, 1);
      }

      //删除一个规格就添加到这个删除规格数组里
      if ("id" in item) {
        this.goodsForm.skuCodeArr.push(item.id);
      }
    },

    //上传推荐位图
    async uploadRecoFiles(file) {
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        this.goodsForm.recoImageUrl = res.data.name;
      }
    },

    //上传商品图
    async uploadThumFiles(file) {
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        this.goodsForm.thumImageUrl = res.data.name;
      }
    },

    //上传详情图
    async uploadDetailFiles(file) {
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        this.goodsForm.detailImageUrl = res.data.name;
      }
    },

    //图片上传失败时
    uploadError() {
      this.$message.error("插入失败");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs__header {
  margin-bottom: 30px;
}

.goods-info-box {
  display: flex;

  /deep/.avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .el-upload:hover {
      border-color: #409eff;
    }
  }

  /deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }

  /deep/.el-upload--text {
    width: 140px;
    height: 140px;
  }

  /deep/.avatar {
    width: 140px;
    height: 140px;
    display: block;
  }

  .left-box {
    width: 68%;

    .drinks-update-box {
      display: flex;

      .banner-box {
        width: 50%;
      }

      .drinks-div {
        margin-top: 20px;
      }
    }

    .reco-box {
      .reco-top-box {
        display: flex;
      }
    }
  }

  .right-box {
    width: 32%;

    .thum-img-box,
    .details-img-box {
      margin-bottom: 30px;

      > p {
        margin-bottom: 0;

        > span {
          min-width: 90px;
        }
      }
    }

    .vip-card-wrap {
      > span {
        min-width: 110px;
      }

      display: flex;
      margin-bottom: 30px;

      .image-box {
        font-size: 0;
        img {
          width: 140px;
          height: 70px;
          margin-right: 10px;
          margin-bottom: 10px;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: pointer;
        }
      }

      .border {
        box-sizing: border-box;
        border: 2px solid #f56c6c;
      }
    }
  }

  p {
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    > i {
      display: inline-block;
      font-style: normal;
      text-align: center;
      line-height: 30px;
      width: 60px;
      height: 30px;
      border-radius: 5px;
      margin-right: 10px;
      background-color: #999;
      color: #fff;
    }
  }

  div.drinks-spec {
    display: flex;
    margin-bottom: 30px;

    // align-items: flex-start;

    .title > span {
      margin-right: 10px;
      margin-top: 6px;
    }

    .sku-list > div {
      margin-bottom: 20px;

      .sku-input {
        margin-bottom: 10px;
      }
    }

    // .el-form-item {
    //     margin-bottom: 10px;
    // }
  }

  .good-name-box {
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    > div {
      margin-right: 20px;
    }
  }

  /deep/.el-textarea__inner {
    resize: none;
    height: 84px;
  }
}
</style>