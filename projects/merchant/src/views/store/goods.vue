<template>
  <basic-container>
    <div>
      <div class="clearfix" v-loading="wrapLoading">
        <!-- 顶部操作模块 -->
        <div class="head-handle clearfix">
          <!-- 左边操作区域 -->
          <el-row class="left-handle">
            <template>
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="getAddGoodsTitleSort"
                style="margin-right: 10px"
                >添加商品</el-button
              >
              <el-button
                v-if="goodsData.length > 0"
                type="danger"
                icon="el-icon-delete"
                @click="isSelect = true"
                style="margin-right: 10px"
                >批量删除</el-button
              >
              <el-button
                v-if="isSelect && goodsData.length > 0"
                type="warning"
                @click="sureDelAll"
                style="margin-right: 10px"
                >确定</el-button
              >
              <el-button
                v-if="isSelect && goodsData.length > 0"
                @click="cancelDelete"
                >取消</el-button
              >
            </template>
          </el-row>

          <!-- 右边操作区域 -->
          <div class="right-handle">
            <el-button
              type="primary"
              @click="handleSelGoodsType"
              class="mr10"
              v-if="goodsData.length > 0"
              >APP展示选择</el-button
            >
            <el-input
              v-model="searchName"
              @keydown.13.native="searchGoodsInfo"
              placeholder="商品名称"
              class="handle-input mr10"
              clearable
            ></el-input>
            <el-select
              v-model="value"
              placeholder="选择分类"
              class="mr10"
              style="width: 100px"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchGoodsInfo"
              >搜索</el-button
            >
          </div>
        </div>

        <!-- 操作商品的对话框 -->
        <el-dialog
          :visible.sync="dialogVisible"
          @close="handleCancel"
          append-to-body="true"
        >
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 编辑商品时 -->
            <el-tab-pane
              v-if="isUpdate"
              :label="activeName"
              :name="activeName"
            ></el-tab-pane>
            <!-- 新增商品时 -->
            <el-tab-pane
              v-else
              :label="item.typeName"
              :name="item.typeName"
              v-for="(item, index) in titleArrList"
              :key="index"
            ></el-tab-pane>
          </el-tabs>

          <!-- 标签页组件信息 -->
          <template>
            <handle-shop :goodsForm="goodsForm" :activeNum="activeNum" />
          </template>

          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <template>
              <el-button type="primary" @click="submitSetGoodsInfo"
                >确定</el-button
              >
            </template>
          </span>
        </el-dialog>

        <!-- APP展示商品分类弹窗 -->
        <el-dialog
          append-to-body="true"
          :visible.sync="showTypeDialog"
          @close="showTypeDialog = false"
          class="show-type-dialog"
        >
          <span class="add-classify-title"
            >请选择给用户展示的商品种类
            <span style="color: #f00">（选中为不展示分类）</span></span
          >
          <el-checkbox
            v-model="item.isHidden"
            :true-label="1"
            :false-label="0"
            v-for="(item, index) in goodsTypeList"
            :key="index"
            >{{ item.type | showAppGoodsType }}</el-checkbox
          >
          <span slot="footer" class="dialog-footer">
            <el-button @click="showTypeDialog = false">取 消</el-button>
            <template>
              <el-button type="primary" @click="handleSureShowType"
                >确 定</el-button
              >
            </template>
          </span>
        </el-dialog>

        <!-- 商品列表 -->
        <div class="goodsList">
          <div
            class="goods-box"
            v-for="(item, index) in goodsData"
            :key="index"
            @click="selectGoods"
          >
            <el-checkbox
              v-if="isSelect"
              :data-id="item.id"
              class="checkbox"
            ></el-checkbox>
            <img :src="showImgPrefix + item.listPicture" alt />
            <div class="goods-detail">
              <h4 title="商品名称">{{ item.name }}</h4>
              <p class="goods-price">
                售价:
                <span>￥{{ item.presentPrice }}</span>
                <s>￥{{ item.originalPrice }}</s>
              </p>
              <div class="goods-handle">
                <el-button type="primary" @click="handleEdit(item.id)"
                  >编辑</el-button
                >
                <el-button
                  type="warning"
                  @click="handleSellOut(item.id, item.isSellOut)"
                  >{{ item.isSellOut === 1 ? "已售罄" : "未售罄" }}
                </el-button>
                <el-button type="danger" @click="handleDelete(item.id)"
                  >删除</el-button
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 翻页区域 -->
        <div>
          <el-pagination
            v-if="goodsData.length > 0"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="dataListCount"
            :current-page="currentPage"
            :page-size="pagesize"
            class="page"
          ></el-pagination>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  getListStoreGoodsType,
  updateStoreGoodsType,
  getAllListStoreGoodsType,
  sellOutGoods,
} from "@/api/store/goods";
import handleShop from "@/components/handle-shop/handle-shop";

export default {
  components: {
    handleShop,
  },

  data() {
    return {
      storeBusiness: this.$store.state.storeBusiness,
      showImgPrefix: this.$imgHead, //回显图片前缀
      searchName: "", //商品名称输入框
      value: "", //商品分类下拉框

      dialogVisible: false, //操作商品的对话框开关
      activeName: "", //默认展示的标签页名称
      editActiveName: "", //编辑时展示的标签页

      showTypeDialog: false, //APP展示商品分类开关
      goodsTypeList: [], //该商家已有的商品种类列表
      showTypeList: [], //要展示的商品种类列表

      // 表格数据分页相关属性
      dataListCount: 0, //默认当前要显示的数据条数
      currentPage: 1, //默认页码
      pagesize: 16, //默认每页要显示多少条数据

      goodsData: [], //请求到的商品信息数组
      goodId: "", //当前编辑的商品id
      activeNum: "", //标签页对应的下标（种类 1-套餐 2-威士忌 3-白兰地 4-伏特加 5-香槟 6-红酒 7-啤酒 8-鸡尾酒 9-小吃 10-其它 11-会员卡）

      //商品信息
      goodsForm: {
        putAway: 1, //是否下架（默认否）
        name: "", //名称
        desc: "", //简介
        originPrice: "", //原价
        nowPrice: "", //现价
        checkedReco: 0, //商家推荐位开关
        area: "", //产地
        year: "", //年份
        goodWeight: 0, //商品排序
        recoWeight: 0, //商家推荐位排序
        recoImageUrl: "", //推荐位图
        thumImageUrl: "", //缩略图
        detailImageUrl: "", //详情图
        tableData: [], //套餐中渲染单品数据
        num: "", //会员卡积分

        skuObj: {
          specName: "", //规格
          priceUnitOrigin: "", //规格原价
          priceUnitActual: "", //规格现价
        },

        //新增商品规格
        dynamicValidateForm: {
          domains: [],
        },
        skuCodeArr: [], //要删除的规格和套餐单品id数组
        goodsIdList: [], //所有已选择的商品对应的id
      },

      //商品分类下拉框
      options: [
        {
          label: "套餐 ",
          value: 1,
        },
        {
          label: "威士忌",
          value: 2,
        },
        {
          label: "白兰地",
          value: 3,
        },
        {
          label: "伏特加",
          value: 4,
        },
        {
          label: "香槟",
          value: 5,
        },
        {
          label: "红酒",
          value: 6,
        },
        {
          label: "啤酒",
          value: 7,
        },
        {
          label: "鸡尾酒",
          value: 8,
        },
        {
          label: "小吃",
          value: 9,
        },
        {
          label: "其它",
          value: 10,
        },
        {
          label: "会员卡",
          value: 11,
        },
        {
          label: "果酒",
          value: 12,
        },
        {
          label: "利口酒",
          value: 13,
        },
        {
          label: "朗姆酒",
          value: 14,
        },
        {
          label: "金酒",
          value: 15,
        },
        {
          label: "其他酒类",
          value: 16,
        },
        {
          label: "米酒",
          value: 17,
        },
      ],

      isUpdate: false, //是否为修改操作
      isSelect: false, //是否要批量删除
      deleteSelect: [], //批量删除的数组
      requestStatus: true, //请求时的防抖标杆
      wrapLoading: false, //加载开关
      titleArrList: [], //标签页标题信息
      allRegRight: false, //验证输入框输入内容的标杆
    };
  },

  methods: {
    //搜索操作
    searchGoodsInfo() {
      this.currentPage = 1;
      this.getGoodsInfo(); //请求数据
    },

    //APP展示选择按钮
    async handleSelGoodsType() {
      const { data: res } = await getListStoreGoodsType();
      if (res.code === 200) {
        this.showTypeDialog = true;
        this.goodsTypeList = res.data;
      }
    },

    //要展示的商品分类弹窗中的确认按钮
    async handleSureShowType() {
      let types = [];
      this.goodsTypeList.forEach((item) => {
        if (item.isHidden === 1) {
          types.push(item.type);
        }
      });

      let data = {
        types: types.join(","),
      };

      const { data: res } = await updateStoreGoodsType(data);
      if (res.code === 200) {
        this.$message.success("修改成功");
        this.showTypeDialog = false;
      }
    },

    //翻页操作
    handleCurrentChange(val) {
      this.currentPage = val; //将当前跳转的页码赋给显在页面上的页码

      //防抖请求
      if (this.requestStatus) {
        this.requestStatus = false;
        this.getGoodsInfo(); //请求翻页后的数据
      }
    },

    //批量删除选中操作
    selectGoods(e) {
      if (e.target.nodeName == "INPUT") {
        //将当前选中的商品的id加入到数组中
        let id = e.target.parentNode.parentNode.dataset.id;
        if (e.target.checked) {
          this.deleteSelect.push(id);
        } else {
          //从数组中删除当前商品id
          let delId = this.deleteSelect.indexOf(id);
          this.deleteSelect.splice(delId, 1);
        }
      }
    },

    //确认删除选择的商品
    sureDelAll() {
      if (this.deleteSelect.length > 0) {
        this.$confirm("确认要删除所选商品吗?", "提示", {
          type: "warning",
        })
          .then(() => {
            const ids = this.deleteSelect.join(",");
            this.removeGoods(ids).then(() => {
              this.cancelDelete();
            });
          })
          .catch(() => {
            this.cancelDelete();
          });
      } else {
        this.$message.error("请选择要删除的商品");
      }
    },

    //删除商品的初始化操作
    cancelDelete() {
      this.deleteSelect = [];
      this.isSelect = false;
    },

    //添加商品时的操作
    async getAddGoodsTitleSort() {
      const { data: res } = await getAllListStoreGoodsType();
      if (res.code === 200) {
        if (res.data.length === 0) {
          this.$message.error("无商品类型可添加");
          return;
        }
        this.titleArrList = res.data;
        this.activeName = this.titleArrList[0].typeName;
        this.activeNum = this.titleArrList[0].type;
        this.isUpdate = false;
        this.dialogVisible = true;
      }
    },

    //关闭对话框操作
    handleCancel() {
      this.goodId = "";
      this.dialogVisible = false;
      this.activeName = "";
      this.activeNum = "";
      this.editActiveName = "";
      this.isUpdate = false;
      this.cancelDelete(); //初始化删除商品相关的操作
      this.clearAllForm(); //清空所有表单
    },

    //清空所有表单
    clearAllForm() {
      this.goodsForm = {
        putAway: 1,
        name: "", //名称
        desc: "", //简介
        originPrice: "", //原价
        nowPrice: "", //现价
        num: "", //会员卡积分
        checkedReco: 0, //商家推荐位开关
        area: "", //产地
        year: "", //年份
        goodWeight: 0, //商品排序
        recoWeight: 0, //商家推荐位排序
        recoImageUrl: "", //推荐位图
        thumImageUrl: "", //缩略图
        detailImageUrl: "", //详情图
        tableData: [], //套餐中渲染单品数据
        goodsIdList: [], //所有已选择的商品对应的id

        skuObj: {
          specName: "", //规格
          priceUnitOrigin: "", //规格原价
          priceUnitActual: "", //规格现价
        },

        //新增商品规格
        dynamicValidateForm: {
          domains: [],
        },
        skuCodeArr: [], //要删除的规格和套餐单品id数组
      };
    },

    //标签页切换事件
    handleClick(tab) {
      //获取当前点击的标签页所对应的接口里的种类下标
      this.titleArrList.forEach((item) => {
        if (item.typeName == tab.name) {
          this.activeNum = item.type;
        }
      });
      this.clearAllForm();
    },

    //删除商品操作
    async removeGoods(ids) {
      const { data: res } = await remove(ids);
      if (res.code === 200) {
        this.getGoodsInfo();
        this.$message.success("删除成功");
      }
    },

    //单个商品删除
    handleDelete(id) {
      this.$confirm("确认要删除此商品吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.removeGoods(id);
        })
        .catch(() => {});
    },

    //获取所有商品信息
    async getGoodsInfo() {
      this.wrapLoading = true;
      let data = {
        current: this.currentPage,
        name: this.searchName,
        size: this.pagesize,
        type: this.value,
      };

      const { data: res } = await getList(data);
      if (res.code === 200) {
        this.dataListCount = res.data.total; //总数据条数
        this.goodsData = res.data.records; //所有数据
        this.requestStatus = true; //防抖开关
        this.wrapLoading = false;
      }
    },

    //售罄单个商品
    handleSellOut(goodsId, isSellOut) {
      let status = -1,
        txt = "";
      if (isSellOut === 0) {
        status = 1;
        txt = "确认要售罄吗？";
      }
      if (isSellOut === 1) {
        status = 0;
        txt = "确认取消售罄吗？";
      }
      let data = {
        goodsId,
        status,
      };
      this.$confirm(txt, "提示", {
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await sellOutGoods(data);
          if (res.code === 200) {
            this.$message.success(res.msg);
            this.getGoodsInfo();
          }
        })
        .catch(() => {});
    },

    //验证表单
    checkFormInfo() {
      if (!this.goodsForm.name) {
        this.$message.error("请输入商品名称");
        return;
      } else if (
        this.goodsForm.checkedReco === 1 &&
        !this.goodsForm.recoImageUrl
      ) {
        this.$message.error("请上传商家推荐位图片");
        return;
      } else if (!this.goodsForm.thumImageUrl) {
        if (this.activeNum == 11) {
          this.$message.error("请选择会员卡缩略图");
        } else {
          this.$message.error("请上传商品缩略图");
        }
        return;
      } else if (!this.goodsForm.detailImageUrl && this.activeNum != 11) {
        this.$message.error("请上传商品详情图");
        return;
      } else {
        if (this.activeNum == 1) {
          if (this.goodsForm.tableData.length === 0) {
            this.$message.error("请选择套餐内的商品");
            return;
          } else if (!this.goodsForm.nowPrice) {
            this.$message.error("请输入套餐现单价");
            return;
          } else if (!this.goodsForm.originPrice) {
            this.$message.error("请输入套餐原单价");
            return;
          } else if (+this.goodsForm.originPrice < +this.goodsForm.nowPrice) {
            this.$message.error("套餐现单价不能大于原单价");
            return;
          } else {
            this.allRegRight = true;
          }
        } else if (this.activeNum == 11) {
          if (!this.goodsForm.num) {
            this.$message.error("请输入会员卡积分");
            return;
          } else if (!this.goodsForm.originPrice) {
            this.$message.error("请输入会员卡原价");
            return;
          } else if (!this.goodsForm.nowPrice) {
            this.$message.error("请输入会员卡现价");
            return;
          } else {
            this.allRegRight = true;
          }
        } else {
          if (this.goodsForm.dynamicValidateForm.domains.length === 0) {
            this.$message.error("请至少输入一种商品规格");
            return;
          } else {
            let arr = this.goodsForm.dynamicValidateForm.domains;
            for (let i = 0; i < arr.length; i++) {
              if (+arr[i].priceUnitActual > +arr[i].priceUnitOrigin) {
                this.$message.error("规格现价不能大于原价");
                this.allRegRight = false;
                break;
              } else {
                this.allRegRight = true;
              }
            }
          }
        }
      }
    },

    //商品里的确认操作按钮
    submitSetGoodsInfo() {
      this.checkFormInfo();
      if (this.allRegRight) {
        this.setGoodsInfo();
      }
    },

    //添加/修改商品
    async setGoodsInfo() {
      if (this.activeNum != 1 && this.activeNum != 11) {
        this.getSpecFirstVal();
      }

      let data = {
        status: this.goodsForm.putAway,
        listPicture: this.goodsForm.thumImageUrl,
        name: this.goodsForm.name,
        originalPrice: this.goodsForm.originPrice,
        isRecommend: this.goodsForm.checkedReco,
        description: this.goodsForm.desc,
        type: this.activeNum,
        productionPlace: this.goodsForm.area,
        deleteSkuIds: this.goodsForm.skuCodeArr.join(","),
        sort: this.goodsForm.goodWeight,
        id: this.goodId,
        infoPicture: this.goodsForm.detailImageUrl,
        presentPrice: this.goodsForm.nowPrice,
        integral: this.goodsForm.num,
        recommendPicture: this.goodsForm.recoImageUrl,
        recommendPictureSort: this.goodsForm.recoWeight,
        productionYear: this.goodsForm.year,
        goodsSkuList:
          this.activeNum == 1
            ? this.goodsForm.tableData
            : this.activeNum == 11
            ? []
            : this.goodsForm.dynamicValidateForm.domains,
      };

      if (this.isUpdate) {
        const { data: res } = await update(data);
        if (res.code === 200) {
          this.getGoodsInfo();
          this.handleCancel();
          this.$message.success("修改成功");
          this.allRegRight = false;
        }
      } else {
        const { data: res } = await add(data);
        if (res.code === 200) {
          this.getGoodsInfo();
          this.handleCancel();
          this.$message.success("添加成功");
          this.allRegRight = false;
        }
      }
    },

    //获取规格中的第一个值
    getSpecFirstVal() {
      this.goodsForm.originPrice =
        this.goodsForm.dynamicValidateForm.domains[0].priceUnitOrigin;
      this.goodsForm.nowPrice =
        this.goodsForm.dynamicValidateForm.domains[0].priceUnitActual;
    },

    //商品编辑
    async handleEdit(id) {
      const { data: result } = await getDetail(id);
      if (result.code === 200) {
        let res = result.data;

        this.isUpdate = true; //启用编辑模式
        this.dialogVisible = true; //对话框打开
        this.goodId = id; //获取商品操作的ID
        this.activeNum = res.type; //获取操作的分类下标

        //根据返回的商品分类下标展示其对应的分类名称
        this.options.forEach((item) => {
          if (item.value === res.type) {
            this.activeName = item.label;
          }
        });

        //商品信息回显
        this.goodsForm = {
          putAway: res.status, //是否下架
          name: res.name, //名称
          desc: res.description, //简介
          originPrice: res.originalPrice, //原价
          nowPrice: res.presentPrice, //现价
          num: res.integral, //会员卡积分
          checkedReco: res.isRecommend, //商家推荐位开关
          area: res.productionPlace, //产地
          year: res.productionYear, //年份
          goodWeight: res.sort, //商品排序
          recoWeight: res.recommendPictureSort, //商家推荐位排序
          recoImageUrl: res.recommendPicture, //推荐位图
          thumImageUrl: res.listPicture, //缩略图
          detailImageUrl: res.infoPicture, //详情图

          skuObj: {
            specName: "", //规格
            priceUnitOrigin: "", //规格原价
            priceUnitActual: "", //规格现价
          },

          tableData: res.goodsSkuList, //套餐中渲染单品数据

          //商品规格
          dynamicValidateForm: {
            domains: res.goodsSkuList,
          },

          skuCodeArr: [],
          goodsIdList: res.goodsSkuList.map((item) => item.itemId), //套餐的已选择单品ID
        };
      }
    },
  },

  mounted() {
    this.getGoodsInfo(); //请求首页数据
  },
};
</script>


<style lang="scss" scoped>
.head-handle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;

  .left-handle {
    // float: left;

    /deep/.el-button + .el-button {
      margin-left: 0;
    }
  }

  .right-handle {
    // float: right;

    .handle-input {
      width: 170px;
      display: inline-block;
    }

    .mr10 {
      margin-right: 10px;
    }
  }
}

.goodsList::after {
  height: 0;
  width: 12.5%;
  min-width: 190px;
  content: "";
}

.goodsList {
  display: flex;
  flex-wrap: wrap;
  .goods-box {
    box-sizing: border-box;
    width: 190px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 0 20px 30px;

    .checkbox {
      position: absolute;
      top: -1px;
      right: 0;
    }

    > img {
      width: 90%;
      height: 180px;
      border-radius: 2px;
    }

    .goods-detail {
      width: 90%;

      > h4 {
        font-size: 14px;
        margin: 8px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .goods-price {
        font-size: 13px;
        margin-bottom: 8px;
        // float: left;
        display: flex;

        > span {
          margin-right: 6px;
        }
      }

      .goods-handle {
        display: flex;
        justify-content: space-around;
        // justify-content: space-between;

        // .el-button--small,
        // .el-button--small.is-round {
        //   padding: 9px 24px;
        // }
      }
    }
  }
}

/deep/.show-type-dialog {
  .el-dialog {
    width: 55%;

    .add-classify-title {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .add-classify-title::before {
      display: inline-block;
      content: "";
      width: 4px;
      height: 20px;
      margin-right: 10px;
      background-color: #999;
    }

    .el-checkbox {
      margin-bottom: 20px;
    }
  }
}

.page {
  text-align: right;
  margin: 20px 0;
}

/deep/.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
}

/deep/.el-upload--picture-card {
  background-color: #fff;
}

/deep/.el-dialog {
  width: 70%;
}

/deep/.el-form-item__content {
  margin-left: 0 !important;
}

/deep/.el-dialog__header {
  padding: 0;
}
</style>
