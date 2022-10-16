<template>
  <basic-container>
    <div class="container" v-loading="wrapLoading">
      <!-- 左边区域 -->
      <div class="left-wrap">
        <h4>
          <span>店铺信息</span>
          <template>
            <el-button
              :disabled="putawayStatus == 10 || putawayStatus == 11"
              type="primary"
              v-if="isReadonly && putawayStatus !== ''"
              @click="putawayStore"
              >{{ putawayStatus | putawayStatus }}</el-button
            >
            <el-button
              type="primary"
              v-if="isReadonly && putawayStatus == 0"
              @click="editShopInfo"
              >编辑</el-button
            >
            <el-button type="success" @click="submitShopInfo" v-if="!isReadonly"
              >保存</el-button
            >
            <el-button @click="cancelSubmit" v-if="!isReadonly">取消</el-button>
          </template>
        </h4>

        <!-- 店铺基本信息 -->
        <div class="shop-info clearfix">
          <div class="left-info" v-loading="imgLoading.loading2">
            <p>店铺logo</p>
            <template v-if="isReadonly">
              <template v-if="logoImageUrl">
                <img :src="showImgPrefix + logoImageUrl" class="avatar" />
              </template>
              <template v-else>暂无</template>
            </template>
            <el-upload
              v-else
              class="avatar-uploader"
              action="1"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadAvatarFile"
              :show-file-list="false"
              :on-error="uploadError"
            >
              <img
                v-if="logoImageUrl"
                :src="showImgPrefix + logoImageUrl"
                class="avatar"
              />
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span style="display: block; margin-top: 10px">（154X154）</span>
          </div>
          <div class="right-info">
            <p class="shop-name">
              <span>店名</span>
              <el-input
                maxlength="20"
                v-model="shopName"
                placeholder="请输入店名（20字以内）"
                :readonly="isReadonly"
                clearable
              ></el-input>
            </p>
            <p class="shop-brief">
              <span>店铺简介</span>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入店铺简介"
                v-model="shopBrief"
                :readonly="isReadonly"
                maxlength="120"
                show-word-limit
              ></el-input>
            </p>
          </div>
        </div>

        <!-- 店铺定位 -->
        <div class="shop-loca">
          <p>店铺定位</p>
          <div>
            <span class="shop-loca-span">{{
              shopLocaIndex | shopLocaShow
            }}</span>
          </div>
        </div>

        <div class="store-phone">
          <p>商家电话：</p>
          <p>{{ phoneOwner || "暂无" }}</p>
        </div>

        <!-- 客服电话 -->
        <div class="service-phone">
          <p>客服电话</p>
          <!-- 回显 -->
          <template>
            <div
              class="show-box"
              v-for="(item, index) in servicePhoneArr"
              :key="index"
            >
              <el-input
                :onkeyup="
                  (servicePhoneArr[index] = servicePhoneArr[index].replace(
                    /^(-1+)|[^\d]+/g,
                    ''
                  ))
                "
                v-model="servicePhoneArr[index]"
                placeholder="客服电话"
                style="width: 30%; margin-right: 10px"
                :readonly="isReadonly"
                clearable
              ></el-input>
              <el-button
                v-if="!isReadonly"
                type="danger"
                @click="deleteServicePhone(item, index)"
                >删除</el-button
              >
            </div>
          </template>

          <!-- 新增 -->
          <template v-if="!isReadonly && servicePhoneArr.length < 3">
            <div style="margin-bottom: 10px">
              <el-input
                :onkeyup="
                  (servicePhone = servicePhone.replace(/^(-1+)|[^\d]+/g, ''))
                "
                v-model="servicePhone"
                placeholder="客服电话"
                style="width: 30%; margin-right: 10px"
                clearable
              ></el-input>
              <el-button type="primary" @click="addServicePhone"
                >添加</el-button
              >
            </div>
            <span style="font-size: 12px; color: #f00"
              >*输入完电话后，点击添加按钮视为添加成功</span
            >
          </template>
        </div>

        <!-- 店铺营业时间，人均消费，类型 -->
        <div class="shop-div">
          <div class="shop-div1">
            <!-- 店铺营业时间 -->
            <div class="bussiness-hours">
              <p>店铺营业时间</p>
              <div class="time-select">
                <el-time-select
                  v-model="startBussTime"
                  :readonly="isReadonly"
                  :picker-options="{
                    start: '00:00',
                    step: '00:10',
                    end: '23:50',
                  }"
                  placeholder="开始"
                ></el-time-select>
                <span>~</span>
                <el-time-select
                  v-model="endBussTime"
                  :readonly="isReadonly"
                  :picker-options="{
                    start: '00:00',
                    step: '00:10',
                    end: '23:50',
                  }"
                  placeholder="结束"
                ></el-time-select>
              </div>
            </div>
            <!-- 店铺人均消费 -->
            <div class="per-con">
              <p>店铺人均消费</p>
              <el-input
                type="number"
                v-model="perCon"
                placeholder="人均消费"
                style="width: 70%; margin-right: 6px"
                :readonly="isReadonly"
                min="0"
              >
                <template slot="append">￥/人</template>
              </el-input>
            </div>
          </div>
          <div class="shop-div2">
            <!-- 店铺类型 -->
            <div class="shop-type">
              <p>
                店铺类型
                <span>（用于客户筛选出本店）</span>
              </p>
              <div class="type-box">
                <div v-if="isReadonly">
                  <template v-if="shopTypeOptStrArr.length !== 0">
                    <span
                      v-for="(item, index) in shopTypeOptStrArr"
                      :key="index"
                      class="shop-type-span"
                      >{{ item }}</span
                    >
                  </template>
                  <template v-else>暂无</template>
                </div>
                <div v-else>
                  <span
                    ref="shopTypeSpan"
                    v-for="(item, index) in shopTypeOpt"
                    :key="index"
                    @click="checkType($event, item)"
                    >{{ item }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 店铺地址 -->
        <div class="shop-address">
          <p>店铺地址</p>
          <div v-if="isReadonly" class="shop-add clearfix">
            <template v-if="searchAddress">
              <div>
                <span>{{ province }}</span>
                <span>{{ city }}</span>
                <span>{{ district }}</span>
                <span>{{ searchAddress }}</span>
                <span>{{ trustAddress }}</span>
              </div>
            </template>
            <template v-else>暂无</template>
          </div>
          <div v-else>
            <mapCom @child-data="childData" :mapList="mapList"></mapCom>
          </div>
        </div>
      </div>

      <!-- 右边区域 -->
      <div class="right-wrap">
        <!-- 商品文本域部分 -->
        <div class="shop-desc">
          <!-- 商品店面简介 -->
          <div class="shop-brief">
            <span>商城简介</span>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入商品店面简介"
              v-model="goodsBrief"
              :readonly="isReadonly"
              maxlength="60"
              show-word-limit
            ></el-input>
          </div>

          <!-- 订单最晚保留时间 -->
          <div v-if="shopLocaIndex != 3" class="last-time">
            <p>晚于最晚到店时间订单的保留分钟数</p>
            <div>
              <el-select
                clearable
                v-model="latestRetainTime"
                placeholder="最晚保留时间（分钟）"
                :disabled="isReadonly"
              >
                <el-option
                  v-for="(item, index) in timeQuanArr"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- 店铺所有展示图 -->
        <div class="shop-info">
          <!-- banner展示图 -->
          <div class="banner-box" v-loading="imgLoading.loading">
            <p>店铺顶部展示图</p>
            <div v-if="isReadonly">
              <template v-if="bannerShowBox.length !== 0">
                <div v-for="(item, index) in bannerShowBox" :key="index">
                  <!-- 如果匹配到mp4的视频就不回显到图片标签里 -->
                  <img
                    :src="showImgPrefix + item"
                    v-if="item.search(/.mp4/i) == -1"
                  />
                </div>
                <!-- 回显视频 -->
                <video controls v-for="item in bannerVideo" :key="item">
                  <source :src="showImgPrefix + item" />
                  您的浏览器版本太低，请升级。
                </video>
              </template>
              <template v-else>暂无</template>
            </div>
            <el-upload
              class="banner-show-box"
              v-else
              multiple
              action="1"
              list-type="picture-card"
              :before-upload="beforeBannerUpload"
              :http-request="uploadBannerFiles"
              :on-remove="bannerRemove"
              :file-list="bannerImgBox"
              :on-error="uploadError"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <span
              style="
                word-break: break-all;
                display: block;
                width: 76%;
                font-size: 12px;
                margin-top: 10px;
              "
              >（*请上传尺寸大小为351*181，格式为jpg/jpeg/png/mp4的图片或视频，最多一个视频）</span
            >
          </div>

          <!-- 商家布局图 -->
          <div
            class="overall-box"
            v-loading="imgLoading.loading5"
            v-if="shopLocaIndex != 3"
          >
            <p>商家布局图</p>
            <template v-if="isReadonly">
              <template v-if="logoImageUrl">
                <img :src="showImgPrefix + overallImageUrl" class="avatar" />
              </template>
              <template v-else>暂无</template>
            </template>
            <el-upload
              v-else
              class="avatar-uploader"
              action="1"
              :before-upload="beforeImgUpload"
              :http-request="uploadOverallFile"
              :show-file-list="false"
              :on-error="uploadError"
            >
              <img
                v-if="!!overallImageUrl"
                :src="showImgPrefix + overallImageUrl"
                class="avatar"
              />
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {
  getDetail,
  update,
  updateBusinessStatus,
  uploadFile,
  getLabelList,
} from "@/api/store/store";
import mapCom from "@/components/map/map";

export default {
  components: {
    mapCom,
  },

  data() {
    return {
      storeBusiness: this.$store.state.storeBusiness,
      wrapLoading: false, //加载开关
      allRegRight: false, //全部验证通过的开关
      imgLoading: {
        loading: false,
        loading2: false,
        loading3: false,
        loading4: false,
        loading5: false,
        loading6: false,
      },

      //传给地图子组件的值
      mapList: {
        width: "100%",
        height: "300px",
        status: true,
        city: "",
        searchAddress: "",
        trustAddress: "",
        longitude: -1, //经度
        latitude: -1, //纬度
      },

      showImgPrefix: this.$imgHead, //回显图片/视频的前缀
      isReadonly: true, //编辑信息开关
      putawayStatus: "", //店铺的申请上下架状态
      recoType: "", //申请推荐位状态

      logoImageUrl: "", //店铺logo
      shopName: "", //店铺名称
      shopBrief: "", //店铺简介
      shopLocaIndex: "", //店铺定位下标
      phoneOwner: "", //商家电话
      startBussTime: "", //开始营业时间
      endBussTime: "", //结束营业时间

      province: "", //省
      city: "", //市
      district: "", //区县
      districtCode: "", //区县编码
      searchAddress: "", //地址搜索框里的值
      trustAddress: "", //输入的详细地址
      longitude: -1, //经度
      latitude: -1, //纬度

      servicePhoneArr: [], //客户电话回显数组
      servicePhone: "", //客服电话

      shopTypeOptStrArr: [], //回显已经选择的店铺类型
      shopTypeOpt: [], //所有店铺类型

      perCon: "", //人均消费
      goodsBrief: "", //商品店面简介
      latestRetainTime: "", //晚于最晚保留时间的订单保留分钟数
      timeQuanArr: [
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
        "110",
        "120",
      ],

      bannerShowBox: [], //要上传的banner图集和回显的banner图集（回显在自定义的位置）
      bannerImgBox: [], //要回显的banner图集（只能显示在上传图集的容器中）
      bannerVideo: [], //回显banner视频
      ktvBannerImgBox: [], //回显ktv包间示意图（上传图集容器中）
      overallImageUrl: "", //商家布局图
    };
  },

  watch: {
    //根据包间示意图的个数，来显示与隐藏上传图标
    "presentKtvInfo.sketchMap": {
      handler() {
        if (!this.isReadonly && this.shopLocaIndex == 3) {
          this.imgUploadWatch(".ktv-banner", this.presentKtvInfo.sketchMap, 3);
        }
      },
      deep: true,
    },

    //根据上传的banner图个数，来显示与隐藏上传图标
    bannerShowBox: {
      handler() {
        if (!this.isReadonly) {
          this.imgUploadWatch(".banner-show-box", this.bannerShowBox, 5);
        }
      },
      deep: true,
    },
  },

  methods: {
    //接收地图子组件传过来的参数
    childData(data) {
      if (data) {
        this.longitude = data.location.lng;
        this.latitude = data.location.lat;
        this.province = data.ad_info.province;
        this.city = data.ad_info.city;
        this.district = data.ad_info.district;
        this.districtCode = data.ad_info.adcode;
        this.searchAddress = data.title;
        this.trustAddress = data.trustAddress;
      }
    },

    //验证所有输入的值
    checkFormInfo() {
      if (!this.shopName) {
        this.$message.error("请输入店铺名称");
        return;
      } else if (!this.shopBrief) {
        this.$message.error("请输入店铺简介");
        return;
      } else if (!this.logoImageUrl) {
        this.$message.error("请上传店铺logo");
        return;
      } else if (!this.shopLocaIndex) {
        this.$message.error("请选择店铺定位");
        return;
      } else if (this.servicePhoneArr.length == 0) {
        this.$message.error("请输入客服电话");
        return;
      } else if (!this.startBussTime) {
        this.$message.error("请选择开始营业时间");
        return;
      } else if (!this.endBussTime) {
        this.$message.error("请选择结束营业时间");
        return;
      } else if (this.shopTypeOptStrArr.length === 0) {
        this.$message.error("请选择店铺类型");
        return;
      } else if (!this.perCon) {
        this.$message.error("请输入店铺人均消费");
        return;
      } else if (this.$regular.money(this.perCon) === false) {
        this.$message.error("请输入正确格式的店铺人均消费");
        return;
      } else if (!this.searchAddress) {
        this.$message.error("请输入地址");
        return;
      } else if (!this.trustAddress) {
        this.$message.error("请输入详细地址");
        return;
      } else if (!this.goodsBrief) {
        this.$message.error("请输入商品店名简介");
        return;
      } else if (!this.latestRetainTime && this.shopLocaIndex != 3) {
        this.$message.error("请选择晚于最晚到店时间订单的保留分钟数");
        return;
      } else if (this.bannerShowBox.length == 0) {
        this.$message.error("请上传店铺顶部展示图");
        return;
      } else if (!this.overallImageUrl && this.shopLocaIndex != 3) {
        this.$message.error("请上传商家布局图");
        return;
      } else {
        let arr = this.servicePhoneArr;
        for (let i = 0; i < arr.length; i++) {
          if (this.$regular.phone(arr[i]) === false) {
            this.$message.error("电话号码格式不正确，请重新输入");
            this.allRegRight = false;
            break;
          } else {
            this.allRegRight = true;
          }
        }
      }
    },

    //申请上架店铺/下架店铺
    putawayStore() {
      if (this.putawayStatus !== 10 && this.putawayStatus !== 11) {
        let txt = "",
          businessStatus = -1;

        if (this.putawayStatus == 1) {
          txt =
            "是否向平台申请下线店铺，为保证呈现给用户的数据准确性，下线成功后需重新提交上线店铺审核，通过后则能在App展示";
          businessStatus = 10;
        }

        if (this.putawayStatus == 0) {
          txt =
            "是否向平台申请上线店铺，为保证呈现给用户的数据准确性，上线成功后需再次申请下线店铺才能进行资料变更";
          businessStatus = 11;
        }

        let data = {
          businessStatus,
        };

        this.$confirm(txt, "提示", {
          type: "warning",
        })
          .then(() => {
            updateBusinessStatus(data)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message.success("申请成功");
                  this.getStoreInfo();
                }
              })
              .catch((err) => {
                this.$message.error(err.msg);
              });
          })
          .catch(() => {});
      }
    },

    //申请商家推荐
    storeRecommend() {
      if (this.recoType == 1) {
        this.$confirm("确定要申请商家推荐吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            this.$get("/merchant/store/recommend/storeRecommend").then(
              (res) => {
                if (res.code === 0) {
                  this.$message.success("申请成功，请等待审核");
                }
              }
            );
          })
          .catch(() => {});
      }
    },

    // 上传头像之前的验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 <= 1; //限制文件大小

      //限制上传文件格式
      if (!isJPG && !isPNG) {
        this.$message.error("上传logo只能是 JPG / PNG 格式");
        return false;
      }

      //限制上传文件大小
      if (!isLt2M) {
        this.$message.error("logo大小不能超过 1MB");
        return false;
      }
    },

    //上传banner图之前的验证
    beforeBannerUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isMP4 = file.type === "video/mp4";
      const isLt2M = file.size / 1024 / 1024 <= 1; //限制文件大小

      //限制上传文件格式
      if (!isJPG && !isPNG && !isMP4) {
        this.$message.error("上传文件只能是 JPG / PNG / MP4 格式");
        return false;
      }

      //限制上传文件大小
      if (isJPG || isPNG) {
        if (!isLt2M) {
          this.$message.error("图片大小不能超过 1MB");
          return false;
        }
      }

      if (file.type === "video/mp4") {
        //限制上传视频个数
        let isVideo = false;
        this.bannerShowBox.forEach((item) => {
          if (
            item.replace(/.+\./, "") == "mp4" ||
            item.replace(/.+\./, "") == "MP4"
          ) {
            isVideo = true;
            return;
          }
        });

        if (isVideo) {
          this.$message.error("最多只能上传1个短视频");
          return false;
        }

        //限制上传视频时长
        return new Promise((resolve, reject) => {
          this.getVideoTime(file).then((res) => {
            if (res > 15) {
              this.$message.error("视频时长请控制在15秒以内");
              reject();
            } else {
              resolve();
            }
          });
        });
      }
    },

    //获取视频时长
    getVideoTime(file) {
      let url = URL.createObjectURL(file);
      let audioElement = new Audio(url);
      let duration;
      return new Promise((resolve) => {
        audioElement.addEventListener("loadedmetadata", () => {
          duration = audioElement.duration; //视频时长/s
          resolve(duration);
        });
      });
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

    //上传logo
    async uploadAvatarFile(file) {
      this.imgLoading.loading2 = true;
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        this.logoImageUrl = res.data.name;
        this.$message.success("上传成功");
        this.imgLoading.loading2 = false;
      } else {
        this.imgLoading.loading2 = false;
      }
    },

    //上传banner图
    async uploadBannerFiles(file) {
      this.imgLoading.loading = true;
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        //将url添加到上传容器中
        this.bannerShowBox.push(res.data.name);
        //将url添加到视图容器里
        let obj = {
          url: this.showImgPrefix + res.data.name,
        };
        this.bannerImgBox.push(obj);
        this.showBannerVideo(); //回显视频
        this.$message.success("上传成功");
        this.imgLoading.loading = false;
      } else {
        this.imgLoading.loading = false;
      }
    },

    //回显banner图集（回显在上传图集的容器中）
    showBannerImg() {
      this.bannerImgBox = [];

      //给每张图片加上前缀
      let pictureArr = this.bannerShowBox.map((item) => {
        return (item = this.showImgPrefix + item);
      });

      //存入对象，回显到页面上
      pictureArr.forEach((item) => {
        let obj = {
          url: item,
        };
        this.bannerImgBox.push(obj);
      });
    },

    //回显banner视频（回显在自定义的位置）
    showBannerVid() {
      this.bannerVideo = [];
      this.bannerShowBox.forEach((item) => {
        if (item.search(/.mp4/i) !== -1) {
          this.bannerVideo.push(item);
        }
      });
    },

    // 删除banner图集
    bannerRemove(file) {
      this.bannerShowBox.forEach((item, i) => {
        if (this.showImgPrefix + item == file.url) {
          this.bannerShowBox.splice(i, 1); //删除上传容器中的
          this.bannerImgBox.splice(i, 1); //删除视图上的
        }
      });
    },

    //上传商家布局图
    async uploadOverallFile(file) {
      this.imgLoading.loading5 = true;
      const { data: res } = await uploadFile(file);
      if (res.code === 200) {
        this.overallImageUrl = res.data.name;
        this.$message.success("上传成功");
        this.imgLoading.loading5 = false;
      } else {
        this.imgLoading.loading5 = false;
      }
    },

    //图片上传失败时
    uploadError() {
      this.$message.error("上传失败");
    },

    //点击编辑时，回显banner图集里的视频
    showBannerVideo() {
      this.$nextTick(() => {
        let showImgList = document.querySelectorAll(
          ".banner-show-box ul li img"
        ); //获取所有回显的img节点
        showImgList.forEach((item) => {
          //匹配所有链接是mp4格式的
          if (item.src.search(/.mp4/i) !== -1) {
            //重新创建一个video节点，并添加上相关属性
            let newEle = document.createElement("video");
            newEle.controls = "controls";
            newEle.style = `width:100%;height:100%`;
            newEle.innerHTML = `<source :src="${this.showImgPrefix}${item.src}" />您的浏览器版本太低，请升级。`;
            item.parentNode.replaceChild(newEle, item); //在该节点的父节点上替换掉之前的img节点，换成video
          }
        });
      });
    },

    //给地图子组件传值（编辑店铺时）
    sendInfoToMap() {
      this.mapList.searchAddress = this.searchAddress;
      this.mapList.trustAddress = this.trustAddress;
      this.mapList.city = this.city;
      this.mapList.longitude = Number(this.longitude);
      this.mapList.latitude = Number(this.latitude);
    },

    //点击编辑后的操作
    editShopInit() {
      this.isReadonly = false;
    },

    //编辑商铺信息
    editShopInfo() {
      this.editShopInit(); //点击编辑后的操作
      this.showAllTypeAndSelType(); //回显所有店铺包括已经选择的店铺
      this.sendInfoToMap(); //给地图子组件传值（回显地址信息）
      this.showBannerVideo(); //回显banner图集里的视频
      this.imgUploadWatch(".banner-show-box", this.bannerShowBox, 5); //根据上传的banner图个数，来显示与隐藏上传图标
    },

    //回显所有店铺包括已经选择的店铺
    showAllTypeAndSelType() {
      this.$nextTick(() => {
        this.shopTypeOptStrArr.forEach((item) => {
          this.$refs.shopTypeSpan.forEach((ele) => {
            if (ele.innerHTML == item) {
              ele.classList.add("shop-type-span"); //回显原有类型对应的样式
            }
          });
        });
      });
    },

    //请求成功后，处理的操作
    requestSuccessInit(txt) {
      this.getStoreInfo();
      this.$message.success(txt);
      this.isReadonly = true;
      this.allRegRight = false;
    },

    //不让传过去的banner集合的第一个值为.mp4格式
    bannerVideoSort() {
      if (this.bannerShowBox.length !== 0) {
        const index = this.bannerShowBox[0].indexOf("mp4");
        if (index !== -1) {
          [this.bannerShowBox[0], this.bannerShowBox[1]] = [
            this.bannerShowBox[1],
            this.bannerShowBox[0],
          ];
        }
      }
    },

    //修改店铺
    submitShopRequest() {
      this.wrapLoading = true;
      this.bannerVideoSort();

      //要传的值
      let data = {
        logo: this.logoImageUrl,
        name: this.shopName,
        descriptionStore: this.shopBrief,
        type: this.shopLocaIndex,
        phoneService: this.servicePhoneArr.join(","),
        startTime: this.startBussTime,
        endTime: this.endBussTime,
        consumption: this.perCon,
        descriptionMall: this.goodsBrief,
        retainMinutes: this.shopLocaIndex == 3 ? "20" : this.latestRetainTime,
        picture: this.bannerShowBox.join(","),
        photoLayout: this.overallImageUrl,
        province: this.province,
        city: this.city,
        district: this.district,
        searchAddress: this.searchAddress,
        trustAddress: this.trustAddress,
        districtCode: this.districtCode,
        labels: [...new Set(this.shopTypeOptStrArr)].join(","), //去重并转换
        location: `${this.longitude},${this.latitude}`,
      };

      update(data)
        .then((res) => {
          if (res.data.code === 200) {
            this.requestSuccessInit("修改成功");
          }
        })
        .finally(() => {
          this.wrapLoading = false;
        });
    },

    //保存按钮
    submitShopInfo() {
      this.checkFormInfo(); //验证所有输入的值
      if (this.allRegRight) {
        this.submitShopRequest(); //新增/修改店铺
      }
    },

    //取消保存按钮
    cancelSubmit() {
      this.isReadonly = true;
      this.getStoreInfo(); //重新获取商店数据
    },

    //获取经纬度
    getlonlat(lonlat) {
      lonlat = lonlat.split(",");
      this.longitude = lonlat[0];
      this.latitude = lonlat[1];
    },

    //添加客服电话
    addServicePhone() {
      if (this.$regular.phone(this.servicePhone) === false) {
        this.$message.error("电话格式不正确，请重新输入");
      } else {
        this.servicePhoneArr.push(this.servicePhone);
      }
      this.servicePhone = "";
    },

    //删除客服电话
    deleteServicePhone(item) {
      const index = this.servicePhoneArr.indexOf(item);
      if (index !== -1) {
        this.servicePhoneArr.splice(index, 1);
      }
    },

    //回显店铺数据
    getStoreInfo() {
      this.wrapLoading = true;
      getDetail()
        .then((res) => {
          if (res.data.code === 200) {
            let result = res.data.data;
            this.phoneOwner = result.phoneOwner;
            this.putawayStatus = result.statusBusiness;
            this.logoImageUrl = result.logo;
            this.shopName = result.name;
            this.shopBrief = result.descriptionStore;
            this.shopLocaIndex = result.type;
            this.servicePhoneArr =
              result.phoneService == "" ? [] : result.phoneService.split(",");
            this.startBussTime = result.startTime;
            this.endBussTime = result.endTime;
            this.perCon = result.consumption;
            this.goodsBrief = result.descriptionMall;
            this.latestRetainTime = result.retainMinutes;
            this.bannerShowBox =
              result.picture === "" ? [] : result.picture.split(",");
            this.overallImageUrl = result.photoLayout;
            this.province = result.province;
            this.city = result.city;
            this.district = result.district;
            this.searchAddress = result.searchAddress;
            this.trustAddress = result.trustAddress;
            this.districtCode = result.districtCode;
            this.shopTypeOptStrArr =
              result.labels.split(",") == "" ? [] : result.labels.split(",");

            //获取经纬度
            this.getlonlat(result.location);

            //回显banner图集
            this.showBannerImg();

            //回显视频banner
            this.showBannerVid();
          }
        })
        .finally(() => {
          this.wrapLoading = false;
        });
    },

    //选择店铺类型
    checkType(e, item) {
      if (!e.target.className) {
        e.target.classList.add("shop-type-span");
        this.shopTypeOptStrArr.push(item);
      } else {
        e.target.classList.remove("shop-type-span");
        const index = this.shopTypeOptStrArr.indexOf(item);
        if (index !== -1) {
          this.shopTypeOptStrArr.splice(index, 1);
        }
      }
      console.log("店铺类型", this.shopTypeOptStrArr);
    },

    //获取所有店铺标签
    getLabelList() {
      getLabelList().then((res) => {
        if (res.data.code === 200) {
          this.shopTypeOpt = res.data.data;
        }
      });
    },

    //监听上传图片个数，显示与隐藏上传图标
    imgUploadWatch(dom, eleArr, len) {
      this.$nextTick(() => {
        let addPic = document.querySelector(
          `${dom} .el-upload.el-upload--picture-card`
        );
        if (addPic !== null) {
          if (eleArr.length > len) {
            addPic.style.display = "none";
          } else {
            addPic.style.display = "inline-block";
          }
        }
      });
    },
  },

  created() {
    this.getStoreInfo();
    this.getLabelList();
  },
};
</script>


<style lang="scss" scoped>
@media screen and (min-width: 1300px) {
  .container {
    box-sizing: border-box;
    display: flex;
    padding: 20px;
  }

  .left-wrap {
    width: 50%;
    height: 100%;
    margin-right: 50px;

    .shop-info {
      .left-info {
        width: 30%;
      }

      .right-info {
        width: 70%;
      }
    }
  }

  .right-wrap {
    height: 100%;
    width: 50%;
  }
}

@media screen and (max-width: 1300px) {
  .left-wrap {
    .shop-info {
      .left-info {
        width: 20%;
      }

      .right-info {
        width: 80%;
      }
    }
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

  .store-phone {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
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

.right-wrap {
  .shop-desc {
    margin-bottom: 50px;

    .shop-brief {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      > span {
        min-width: 80px;
      }
    }

    .last-time {
      > p {
        margin-bottom: 10px;
      }
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

  .shop-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    img {
      border-radius: 6px !important;
    }

    video {
      border-radius: 6px !important;
    }

    .banner-box {
      width: 50%;
      /deep/ .el-upload-list--picture-card .el-upload-list__item {
        transition: none;
      }

      > div {
        img {
          width: 170px;
          height: 100px;
          margin: 0 10px 10px 0;
        }

        video {
          width: 170px;
          height: 100px;
          margin: 0 10px 10px 0;
        }

        div {
          display: inline-block;
        }
      }

      > p {
        margin-bottom: 10px;
      }
    }

    .overall-box {
      width: 20%;

      > p {
        margin-bottom: 10px;
      }

      > img {
        width: 160px;
        height: 200px;
      }

      /deep/.el-upload--text {
        width: 160px;
        height: 200px;
        line-height: 200px;

        > img {
          width: 160px;
          height: 200px;
        }
      }
    }

    .rowNum-box {
      width: 30%;

      div {
        > p {
          margin-bottom: 10px;
        }

        > img {
          width: 200px;
          height: 120px;
        }
      }

      div.top {
        margin-bottom: 50px;
      }

      /deep/ .el-upload--text {
        width: 200px;
        height: 120px;
        line-height: 120px;
      }

      /deep/.el-upload--text > img {
        width: 200px;
        height: 120px;
      }
    }
  }

  .shop-seat {
    display: flex;

    .left-box {
      margin-right: 30px;

      .seat-title {
        display: flex;
        justify-content: space-between;
        width: 400px;
        margin-bottom: 20px;

        > p {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
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
        margin-bottom: 20px;
      }

      .add-floor {
        margin-bottom: 20px;
      }
    }

    .right-box {
      .min-charge {
        align-items: flex-start;
        .day-mincom {
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          padding: 16px 0;
          width: 100%;
          white-space: nowrap;
          > div {
            margin-bottom: 16px;
            font-size: 14px;
            display: flex;
            justify-content: space-around;
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

.el-tag + .el-tag {
  margin-left: 10px;
}

.el-tag--small {
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
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

// .seat {
//     display: block;
//     width: 20px;
//     height: 20px;
//     border-radius: 4px;
//     background-color: #fff;
//     margin-bottom: 10px;
//     margin-right: 10px;
//     cursor: pointer;
//     border: 1px solid #ddd;
// }

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
