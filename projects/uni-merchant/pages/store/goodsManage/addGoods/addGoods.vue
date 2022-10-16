<template>
	<view @click="closeDialog">
		<navBar :navigateUrl="'../goodsManage'">{{goodsKindIndex == 1 ? '添加套餐' : '添加单品'}}</navBar>
		<u-modal v-model="modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modalContent"
		 @confirm="resModalHandle" @cancel="resCancelModal"></u-modal>
		<view class="top-menu-wrap">
			<view class="choose-type-btn" @click="handleSelClassify">{{classifyName || '请选择商品种类'}}</view>
			<u-select v-model="showClassifyList" confirm-color="#67a8fc" cancel-color="#000" :safe-area-inset-bottom="true"
			 :list="classifyList" @confirm="resultClassify"></u-select>
		</view>
		<view class="has-navBar" v-if="goodsKindIndex !== 0">
			<view class="good-basic-info">
				<view class="left-title" :style="{'width' : goodsKindIndex == 11 ? '160rpx' : '128rpx'}">
					<view class="title good-name">
						<text v-if="goodsKindIndex == 1">套餐名称</text>
						<text v-else-if="goodsKindIndex == 11">会员卡名称</text>
						<text v-else>商品名称</text>
					</view>
					<view class="title good-brief">
						<text v-if="goodsKindIndex == 1">套餐简介</text>
						<text v-else-if="goodsKindIndex == 11">会员卡简介</text>
						<text v-else>商品简介</text>
					</view>
					<view class="title">
						<text>是否下架</text>
					</view>
					<view class="title good-weight">
						<text>权重值</text>
					</view>
					<template v-if="goodsKindIndex == 11">
						<view class="title good-spec" >
							<text>会员卡积分</text>
						</view>
						<view class="title good-price" >
							<text>会员卡原价</text>
						</view>
						<view class="title good-price" >
							<text>会员卡现价</text>
						</view>
					</template>
				</view>
				<view class="right-input">
					<view class="good-name-box">
						<view class="input">
							<input type="text" v-model="goodName" placeholder="请输入商品名称" placeholder-style="color:rgb(192, 196, 204)" />
						</view>
					</view>
					<view class="good-brief">
						<view class="input">
							<u-input :custom-style="{
								'padding' : '8rpx 24rpx',
								'border' : '2rpx solid rgba(103, 168, 252, 1)',
								'border-radius': '16rpx',
								'box-sizing' : 'border-box',
								'font-size' : '32rpx',
								}"
							 height="186" v-model="goodBrief" type="textarea" :auto-height="true" placeholder="请添加商品简介" />
						</view>
					</view>
					<view>
						<u-switch v-model="putAway" active-color="#fcbd5c"></u-switch>
					</view>
					<view class="good-weight">
						<view class="input">
							<input type="number" v-model="goodWeight" placeholder="权重" placeholder-style="color:rgb(192, 196, 204)" />
						</view>
					</view>
					<template v-if="goodsKindIndex == 11">
						<view class="good-spec" >
							<view class="input">
								<input type="number" maxlength="10" v-model="originalPrice" placeholder="会员卡积分(积分1:1人民币)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
						<view class="good-price">
							<view class="input">
								<input type="number" maxlength="10" v-model="statisticalPrice" placeholder="会员卡原价 (如:100.00)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
						<view class="good-price">
							<view class="input">
								<input type="number" maxlength="10" v-model="presentPrice" placeholder="会员卡现价 (如:100.00)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
					</template>
				</view>
			</view>
			
			<view class="good-spec-wrap" v-if="goodsKindIndex != 11 && goodsKindIndex != 1">
				<view class="good-spec" v-for="(item,index) in goodSpecList" :key="index">
					<view class="left">
						<view class="good-spec">
							<text>商品规格</text>
							<view class="input">
								<input type="text" maxlength="4" v-model="item.specName" placeholder="请输入规格(如:一瓶)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
						<view class="good-price">
							<text>商品原价</text>
							<view class="input">
								<input maxlength="10" type="number" v-model="item.originalPrice" placeholder="请输入商品原价(如:20.00)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
						<view class="good-price">
							<text>商品现价</text>
							<view class="input">
								<input maxlength="10" type="number" v-model="item.statisticalPrice" placeholder="请输入商品现价(如:20.00)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
						<view v-if="typeof item.sellOut === 'boolean'">
							<text>是否售罄</text>
							<u-switch v-model="item.sellOut" active-color="#fcbd5c"></u-switch>
						</view>
					</view>
					<view class="right" @click="deleteGoodSpec(item)">
						<text class="iconfont icon-btn">&#xe84c;</text>
					</view>
				</view>
				<view class="good-spec">
					<view class="left">
						<view class="good-spec">
							<text>商品规格</text>
							<view class="input">
								<input type="text" maxlength="4" v-model="goodSpec" placeholder="请输入规格(如:一瓶)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
						<view class="good-price">
							<text>商品原价</text>
							<view class="input">
								<input maxlength="10" type="number" v-model="goodPrice" placeholder="请输入商品原价(如:89.00)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
						<view class="good-price">
							<text>商品现价</text>
							<view class="input">
								<input maxlength="10" type="number" v-model="goodNowPrice" placeholder="请输入商品现价(如:89.00)" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
					</view>
					<view class="right" @click="addGoodSpec">
						<text class="iconfont icon-btn">&#xe614;</text>
					</view>
				</view>
			</view>
			
			<view class="combo-add-goods-box" v-if="goodsKindIndex == 1" >
				<view class="add-goods-box">
					<view class="add-good-box">
						<text class="title">添加商品</text>
						<view class="input">
							<input type="text" v-model="addComboGood" placeholder="请选择套餐所包含的单品" placeholder-style="color:rgb(192, 196, 204)" @input="addCombo" @focus="addCombo" />
							<view class="select-goods-list" v-if="showChooseComboGoodSwitch">
								<scroll-view scroll-y class="scroll-view" v-if="comboSelectGoodsList.length > 0">
									<view v-for="(item,index) in comboSelectGoodsList" :key="index" class="good" @click.stop="chooseComboGood(item)">{{item.name}}</view>
								</scroll-view>
								<view v-if="nothingComboInfo">无单品信息</view>
							</view>
						</view>
					</view>
					<view class="goods-list" v-for="(item,index) in comboGoodsList" :key="index">
						<view class="good-name">
							<text class="title">商品名称</text>
							<view class="input">
								<input type="text" v-model="item.goodsName" disabled />
							</view>
						</view>
						<view class="good-num">
							<text class="title">数量</text>
							<view>
								<u-number-box v-model="item.number" @change="changeGoodNum" :min="1" :input-width="100" :input-height="52"></u-number-box>
							</view>
							<view class="delete-btn" @click="deleteComboGood(item.goodsId)">
								<text class="iconfont icon-btn">&#xe84c;</text>
							</view>
						</view>
					</view>
				</view>
				<view class="good-oldPrice">
					<text class="title">套餐原价</text>
					<view class="price-input">
						<input maxlength="10" type="number" v-model="originalPrice" />
					</view>
					<!-- <text class="title">￥{{originalPrice || '0.00'}}</text> -->
				</view>
				<view class="good-nowPrice">
					<text class="title">套餐现价</text>
					<view class="price-input">
						<input maxlength="10" type="number" v-model="comboNewPrice" />
					</view>
				</view>
			</view>

			<view class="good-images">
				<view class="good-img-main">
					<view class="title">
						<text>商品图</text>
						<text class="sec-title">(用于商店列表商品展示 80*80)</text>
					</view>
					<view class="img-show" v-if="goodsKindIndex != 11 && goodShowImg">
						<image :src="showImgPrefix + goodShowImg" @click="showImage(goodShowImg)" mode=""></image>
						<view class="delete-btn" v-if="goodShowImg" @click="deleteStoreLogo(1)"></view>
					</view>
					<view class="file-upload" v-if="goodsKindIndex != 11 && !goodShowImg" @click="chooseImage(1,'480upx','480upx')"></view>
					<view class="vip-card-box" v-if="goodsKindIndex == 11">
						<view class="list" v-for="(item,index) in vipCardList" :key="index" @click="chooseVipCard(item.picture)">
							<image :src="showImgPrefix + item.picture" mode="" :class="[item.picture === goodShowImg ? 'shadow' : '']"></image>
						</view>
					</view>
				</view>
				<view class="good-img-detail" v-if="goodsKindIndex != 11">
					<view class="title">
						<text>商品详情图</text>
						<text class="sec-title">（200*200）</text>
					</view>
					<view class="img-show" v-if="goodDetailImg">
						<image :src="showImgPrefix + goodDetailImg" @click="showImage(goodDetailImg)" mode=""></image>
						<view class="delete-btn" v-if="goodDetailImg" @click="deleteStoreLogo(2)"></view>
					</view>
					<view class="file-upload" v-if="!goodDetailImg" @click="chooseImage(2,'480upx','480upx')"></view>
				</view>
				<view class="good-img-recom" v-if="goodsKindIndex != 11">
					<view class="title">
						<text>商品推荐位</text>
						<text class="sec-title">（120*160）</text>
					</view>
					<view class="botm-handle">
						<view class="img-show" v-if="goodRecommImg">
							<image :src="showImgPrefix + goodRecommImg" @click="showImage(goodRecommImg)" mode=""></image>
							<view class="delete-btn" v-if="goodRecommImg" @click="deleteStoreLogo(3)"></view>
						</view>
						<view class="file-upload" v-if="!goodRecommImg && goodRecomSwitch" @click="chooseImage(3,'480upx','640upx')"></view>
						<view class="right-handle">
							<view class="sec-title">
								<text>是否将该商品设置为推荐商品</text>
							</view>
							<u-switch v-model="goodRecomSwitch" active-color="#fcbd5c" @change="resSwitch"></u-switch>
						</view>
					</view>
				</view>
				<!-- <view class="store-banner">
					<view class="title">
						<text>店铺宣传图</text>
						<text class="sec-title">（非必传，用于商店商品宣传 351*130）</text>
					</view>
					<view class="img-show" v-if="goodBannerImg">
						<image :src="showImgPrefix + goodBannerImg" @click="showImage(goodBannerImg)" mode=""></image>
						<view class="delete-btn" v-if="goodBannerImg" @click="deleteStoreLogo(4)"></view>
					</view>
					<view class="file-upload" v-if="!goodBannerImg" @click="chooseImage(4,'702upx','260upx')"></view>
				</view> -->
			</view>
		
		</view>
		<view class="tab-handle" v-if="goodsKindIndex !== 0">
			<view class="cancel" @click="handleCancel">
				<text>取消</text>
			</view>
			<view class="complete" @click="submitSetGoodsInfo">
				<text>完成</text>
			</view>
		</view>
		<view v-else class="empty-data">
			<image src="../../../../static/images/empty_data.png" mode="widthFix"></image>
		</view>
		
		<yq-avatar @upload="chooseImageComplete" ref="avatar" ></yq-avatar>
	</view>
</template>

<script>
	import {chooseImage} from '../../../../common/js/upload.js'
	
	export default {
		data() {
			return {
				showImgPrefix: this.$imgHead,
				
				tabs: ['酒水', '小吃', '其他', '会员卡'], //标签页数组
				modalShow: false, //模态框开关
				modalContent: '', //模态框要展示的内容
				
				goodsKindIndex: 0, //当前标签页下标

				//商品种类 1-套餐 2-威士忌 3-白兰地 4-伏特加 5-香槟 6-红酒 7-啤酒 8-鸡尾酒 9-小吃 10-其它 11-会员卡
				classifyList: [
					{
						value: '1',
						label: '套餐'
					},
					{
						value: '2',
						label: '威士忌'
					},
					{
						value: '3',
						label: '白兰地'
					},
					{
						value: '4',
						label: '伏特加'
					},
					{
						value: '5',
						label: '香槟'
					},
					{
						value: '6',
						label: '红酒'
					},
					{
						value: '7',
						label: '啤酒'
					},
					{
						value: '8',
						label: '鸡尾酒'
					},
					{
						value: '9',
						label: '小吃'
					},
					{
						value: '10',
						label: '其它'
					},
					{
						value: '11',
						label: '会员卡'
					},
					{
						label: '果酒',
						value: '12'
					},
					{
						label: '利口酒',
						value: '13'
					},
					{
						label: '朗姆酒',
						value: '14'
					},
					{
						label: '金酒',
						value: '15'
					},
					{
						label: '其他酒类',
						value: '16'
					},
					{
						label: '米酒',
						value: '17'
					}
				],
				
				classifyName: '', //当前选中的分类对象
				showClassifyList: false, //展示酒水分类下拉框的开关
				putAway : false,	//上下架
				goodName: '', //商品名称
				goodBrief: '', //商品简介
				goodWeight: 0, //商品权重
				goodSpec: '', //添加规格里的商品规格
				goodPrice: '', //添加规格里的商品原价
				goodNowPrice : '',	//添加规格里的商品现价
				presentPrice : '',	//会员卡现价
				originalPrice : '',	//商品原价（规格中最低的售价）/会员卡积分/套餐单品原价之和
				statisticalPrice : '',	//会员卡原价
				goodSpecList : [],//商品规格数组
				
				addComboGood : '',	//添加单品输入的关键词
				showChooseComboGoodSwitch : false,	//套餐选择单品下拉框的开关
				nothingComboInfo : false,	//套餐里有无单品的标杆
				comboSelectGoodsList : [],	//所有查询出来的单品数据
				comboGoodsList : [], //当前套餐已有的单品集合
				comboGoodsIdList : [],	//已选择的单品的id存储数组（作用：选择的商品将不再展示在搜索框中）
				comboNewPrice : '',	//套餐现价
				
				goodRecomSwitch: false, //商品推荐位申请开关
				goodShowImg : '',	//商品展示图
				goodDetailImg : '',	//商品详情图
				goodRecommImg : '',	//商品推荐位图
				goodBannerImg : '',	//店铺宣传banner图
				
				vipCardList : [],	//vip卡片图列表
				
				allRegRight : false,	//验证表单的标杆
				
				antiStatus: true, //获取套餐单品防抖标杆

				uploadType : -1, //当前上传的哪个区域的图片
			}
		},

		methods: {			
			//删除单品
			deleteComboGood(id) {
				 this.comboGoodsList.forEach((item,i) => {
					 if(item.goodsId == id) {
						this.comboGoodsList.splice(i,1);
						
						//在所已选择的单品id中移除当前单品的id
						this.comboGoodsIdList.forEach((ele, i) => {
							if (item.goodsId == ele) {
								this.comboGoodsIdList.splice(i, 1);
								this.changeGoodNum();
							}
						});
					 }
					 
				 })
			},
			
			//在下拉框中选择单品
			chooseComboGood(item) {
				this.showChooseComboGoodSwitch = false;	//关闭下拉框
				this.addComboGood = '';	//清空输入框
				
				let chooseGood = Object.assign({},item);
				
				//这一步是为了把对象中的键name中改成goodsName
				chooseGood.goodsName = chooseGood.name;
				chooseGood.goodsId = chooseGood.id;
				delete chooseGood.name;
				delete chooseGood.id;
				chooseGood.number = 1;
				
				let goodsId = chooseGood.goodsId;
				
				//将选择的单品传到单品列表中
				this.comboGoodsList.push(chooseGood);
				
				//将选择的单品ID传到已选择单品的ID数组中
				this.comboGoodsIdList.push(chooseGood.goodsId);
				this.changeGoodNum();
				
			},

			//套餐添加单品
			addCombo() {
				if(this.antiStatus) {
					this.antiStatus = false;
					// this.$showLoading('请求中');
					this.nothingComboInfo = false;
					this.comboSelectGoodsList = [];
					
					let data = {
						goodsIdList: this.comboGoodsIdList,
						name : this.addComboGood
					}
					
					// if(this.addComboGood) {
						this.$post('/merchant/store/goods/setMealSelectGoodsList',data).then(res => {
							if(res.code === 0) {
								this.comboSelectGoodsList = res.data;
								if(res.data.length === 0) {
									this.nothingComboInfo = true;
								}
								this.showChooseComboGoodSwitch = true;
							} else {
								this.$errToast(res.msg);
							}
						}).finally(() => {
							// uni.hideLoading();
							this.antiStatus = true;
						})
						
					// } 
					// else {
					// 	this.comboSelectGoodsList = [];
					// }
				}
			},
			
			//关闭选择单品弹窗
			closeDialog() {
				this.showChooseComboGoodSwitch = false;
			},

			//更改商品数量（计算套餐价格）
			changeGoodNum() {
				//计算套餐原价（所有单品原价之和）
				this.originalPrice = this.comboGoodsList.map(item => item.originalPrice * item.number).reduce((prev,item) => prev + item,0).toFixed(2);
				
				//计算套餐现价（所有单品现价之和）
				this.comboNewPrice = this.comboGoodsList.map(item => item.presentPrice * item.number).reduce((prev,item) => prev + item,0).toFixed(2);
			},

			//获取规格中最低的商品售价（原价）
			getOriginalPrice() {
				let originalPriceArr = this.goodSpecList.map(item => item.originalPrice);
				this.originalPrice = Math.min(...originalPriceArr);
			},
		
			//验证表单
			checkFormInfo() {
				if (!this.goodName) {
					this.$errToast('请输入商品名称');
					return;
				} else if(!this.goodShowImg) {
					if (this.goodsKindIndex == 11) {
						this.$errToast('请选择会员卡缩略图');
					} else {
						this.$errToast('请上传商品图');
					}
					return;
				} else if(!this.goodDetailImg && this.goodsKindIndex != 11) {
					this.$errToast('请上传商品详情图');
					return;
				}else if (this.goodRecomSwitch === true && !this.goodRecommImg) {
					this.$errToast('请上传商品推荐位图片');
					return;
				} else {
					if (this.goodsKindIndex == 1) {
						if (this.comboGoodsList.length === 0) {
							this.$errToast('请选择套餐内的商品');
							return;
						} else if (!this.comboNewPrice) {
							this.$errToast('请输入套餐现价');
							return;
						} else if (!this.originalPrice) {
							this.$errToast('请输入套餐原价');
							return;
						} else if (+this.originalPrice < +this.comboNewPrice) {
							this.$errToast('套餐现价不能大于原价');
							return;
						} else {
							this.allRegRight = true;
						}
					} else if (this.goodsKindIndex == 11) {
						if (!this.originalPrice) {
							this.$errToast('请输入会员卡积分');
							return;
						} else if (!this.statisticalPrice) {
							this.$errToast('请输入会员卡原价');
							return;
						} else if (!this.presentPrice) {
							this.$errToast('请输入会员卡现价');
							return;
						} else {
							this.allRegRight = true;
						}
					} else {
						if (this.goodSpecList.length === 0) {
							this.$errToast('请至少输入一种商品规格');
							return;
						} else {
							let arr = this.goodSpecList;
							for (let i = 0; i < arr.length; i++) {
								if (+arr[i].statisticalPrice > +arr[i].originalPrice) {
									this.$errToast('规格现价不能大于原价');
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
					this.modalContent = '是否保存当前页面';
					this.modalShow = true;
				}
			},
			
			//模态框的确认按钮
			resModalHandle() {
				if(this.modalContent === '是否放弃编辑当前页面') {
					uni.navigateTo({
						url:'../goodsManage'
					})
				} else {
					this.handleAdd();
				}
			},
			
			//模态框的取消按钮
			resCancelModal() {
				this.allRegRight = false;
			},

			//添加商品
			handleAdd() {
				//获取规格中最低的商品售价（原价）
				if(this.goodsKindIndex != 11 && this.goodsKindIndex != 1) this.getOriginalPrice();
				
				this.goodSpecList.forEach(item => {
					item.sellOut = item.sellOut === true ? 1 : 0;
				})
				
				let data = {
					putAway : this.putAway === true ? 1 : 0,
					type : this.goodsKindIndex,
					name : this.goodName,
					synopsis : this.goodBrief,
					goodsSort : this.goodWeight,
					skuList : this.goodSpecList,
					listPicture : this.goodShowImg,
					infoPicture : this.goodDetailImg,
					recommendPicture : this.goodRecommImg,
					// recommendAdPicture : this.goodBannerImg,
					recommendAdStatus : this.goodBannerImg === '' ? 2 : 1,
					recommendStatus : this.goodRecomSwitch === true ? 1 : 2,
					originalPrice : this.originalPrice,  //会员卡积分/商品原价/套餐单品原价之和
					presentPrice : this.presentPrice, //会员卡现价
					statisticalPrice : this.goodsKindIndex == 1 ? this.comboNewPrice : this.goodsKindIndex == 11 ? this.statisticalPrice : '',
					setMealGoodsList : this.comboGoodsList,	//套餐单品数组
				}
				
				console.log("新增时传的值",data)
				this.$post('/merchant/store/goods/save',data).then(res => {
					if(res.code === 0) {
						uni.showToast({
							title: '新增成功',
							duration: 1000,
							success : ()=> {
								setTimeout(() => {
									uni.navigateTo({
										url:'../goodsManage'
									})
								},1000)
							}
						});
					}
				})
			},
			
			//取消编辑按钮
			handleCancel() {
				this.modalContent = '是否放弃编辑当前页面';
				this.modalShow = true;
			},
			
			//商品推荐位开关操作
			resSwitch(status) {
				if(!status) this.goodRecommImg = "";
			},
			
			//选择图片成功后的回调
			chooseImageComplete(res) {
				this.uploadImage(this.uploadType, res.path);
			},
			
			//选择图片并上传（type:判断是上传的什么图片）
			chooseImage(type,selWidth,selHeight) {
				this.uploadType = type;
				this.$refs.avatar.fChooseImg(undefined,{
					selWidth,
					selHeight,
					stretch : 'longSel',
					inner : true
				});
			},
			
			//上传图片
			uploadImage(type, data) {
				this.$showLoading('上传中');
				this.$file_post(this.$fileUpload, data).then(res => {
					if (res.code === 0) {
						if (type === 1) this.goodShowImg = res.data;
						if (type === 2) this.goodDetailImg = res.data;
						if (type === 3) this.goodRecommImg = res.data;
						// if (type === 4) this.goodBannerImg = res.data;
					}
					uni.hideLoading();
				})
				.catch((err) => {
					uni.hideLoading();
					this.$errToast('上传失败');
				});
			},
			
			// 预览图片
			showImage(image) {
				// 单张预览
				let imgArr = [];
				imgArr.push(this.showImgPrefix + image);
			
				uni.previewImage({
					urls: imgArr,
					current: image,
				});
			},
			
			//移除当前图片
			deleteStoreLogo(type) {
				if (type === 1) this.goodShowImg = "";
				if (type === 2) this.goodDetailImg = "";
				if (type === 3) this.goodRecommImg = "";
				// if (type === 4) this.goodBannerImg = "";
			},
			
			//添加商品规格
			addGoodSpec() {
				if (!this.goodSpec) {
					this.$errToast('请输入商品规格名称');
				} else if (!this.$money(this.goodPrice)) {
					this.$errToast('请输入正确的规格原价');
				} else if (!this.$money(this.goodNowPrice)) {
					this.$errToast('请输入正确的规格现价');
				} else if(+this.goodNowPrice > +this.goodPrice) {
					this.$errToast('规格现价不能大于原价');
				} else {
					this.goodSpecList.push({
						specName: this.goodSpec, //规格名称
						originalPrice: this.goodPrice, //规格原价
						statisticalPrice : this.goodNowPrice,	//新增的原价
						presentPrice: '', //规格现价
						sellOut : false
					})
					
					this.goodSpec = '';
					this.goodPrice = '';
					this.goodNowPrice = '';
				}
			},

			//删除商品规格
			deleteGoodSpec(item) {
				const index = this.goodSpecList.indexOf(item);
				if(index !== -1) {
					this.goodSpecList.splice(index,1);
				}
			},
			
			//选择会员卡商品图
			chooseVipCard(item) {
				this.goodShowImg = item;
			},
			
			//点击分类下拉框模块
			handleSelClassify() {
				this.showClassifyList = true;
			},

			//获取选择的商品分类
			resultClassify(res) {
				this.clearForm();	//清空表单
				this.classifyName = res[0].label;
				this.goodsKindIndex = res[0].value;
				
				//获取会员卡列表
				if(this.goodsKindIndex == 11) {
					this.$get('/merchant/store/goods/getVipPhoto').then(res => {
						if(res.code === 0) {
							this.vipCardList = res.data;
						}
					})
				}
			},

			//清空所有表单属性值
			clearForm() {
				this.putAway = false;
				this.goodName = '';
				this.goodBrief = '';
				this.goodWeight = 0;
				this.goodSpec = '';
				this.goodPrice = '';
				this.presentPrice = '';
				this.originalPrice = '';
				this.statisticalPrice = '';
				this.goodSpecList = [];
				this.goodRecomSwitch = false,
				this.goodShowImg = '';
				this.goodDetailImg = '';
				this.goodRecommImg = '';
				// this.goodBannerImg = '';
				this.allRegRight = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.empty-data {
		image {
			margin-top: 240rpx;
			width: 100%;
			height: auto;
		}
	}
	
	.has-navBar {
		padding: 240rpx 24rpx 96rpx;
	}

	.title {
		font-size: 32rpx;
		font-weight: 400;
	}

	.sec-title {
		color: rgba(153, 153, 153, 1);
	}

	.top-menu-wrap {
		width: 100%;
		margin-top: 88rpx;
		padding: 28rpx 24rpx;
		background-color: #fff;
		box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.1);
		position: fixed;
		z-index: 99;
		
		.choose-type-btn {
			width: 100%;
			height: 74rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 36rpx;
			border-radius: 16rpx;
			background-color: #6AA9FD;
		}

	}

	.input {
		input {
			border: 2rpx solid rgba(103, 168, 252, 1);
			height: 74rpx;
			padding: 8rpx 24rpx;
		}
	}

	.good-basic-info {
		display: flex;
		margin-bottom: 48rpx;

		.left-title {
			width: 128rpx;
			margin-right: 24rpx;
			text-align: right;

			.title {
				margin-bottom: 78rpx;
			}

			.title:last-child {
				margin-bottom: 0;
			}

			.good-brief {
				margin-bottom: 190rpx;
			}

			.good-sort {
				margin-bottom: 0;
			}

		}

		.right-input {
			flex-grow: 1;

			>view {
				margin-bottom: 48rpx;
			}

			>view:last-child {
				margin-bottom: 0;
			}

			.good-name-box {
				display: flex;
				justify-content: space-between;

				.input {
					input {
						width: 302rpx;
					}
				}

				.classify {
					position: relative;

					.btn {
						color: #fff;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 32rpx;
						font-weight: 400;
						border-radius: 16rpx;
						width: 208rpx;
						height: 74rpx;
						color: #000;
						border: 2rpx solid rgba(103, 168, 252, 1);
						background-color: #fff;
						position: relative;
					}

					.classify-list-wrap {
						display: none;
						position: absolute;
						top: 88rpx;
						width: 208rpx;
						background-color: #fff;
						border: 2rpx solid rgba(103, 168, 252, 1);
						border-radius: 16rpx;
						z-index: 88;

						.classify-list {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 100%;
							height: 70rpx;
						}
					}
				}

			}

			.good-brief {
				display: flex;

				.title {
					margin-right: 24rpx;
				}

				.input {
					flex-grow: 1;
				}

			}

			.good-weight {
				.input {
					input {
						text-align: center;
						width: 146rpx;
					}
				}
			}

		}
	}

	.good-spec-wrap {
		.good-spec {
			display: flex;
			margin-bottom: 48rpx;
			
			.left {
				margin-right: 24rpx;
				
				>view {
					display: flex;
					margin-bottom: 24rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					>text {
						font-size: 32rpx;
						margin-right: 24rpx;
					}
					
					.input {
						width: 422rpx;
						height: 74rpx;
					}
				}
			}
			
			.right {
				width: 104rpx;
				height: 270rpx;
				background-color: #6AA9FD;
				border-radius: 12rpx;
				display: flex;
				justify-content: center;
				align-items: center;	
				color: #fff;
				
				.icon-btn {
					color: #fff;
					font-size: 32rpx;
				}
				
			}
			
		}
		
	}
	
	.combo-add-goods-box {
		margin-bottom: 48rpx;
		font-size: 32rpx;
		
		.add-goods-box {
			border: 2rpx solid #67A8FC;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 24rpx;
			
			.title {
				width: 128rpx;
				margin-right: 24rpx;
				text-align: right;
			}
			
			.input {
				flex: 1;
			}
			
			.add-good-box {
				display: flex;
				margin-bottom: 24rpx;
				
				.input {
					position: relative;
					
					input {
						margin-bottom: 8rpx;
					}
					
					.select-goods-list {
						width: 502rpx;
						height: 282rpx;
						border: 2rpx solid #67A8FC;
						border-radius: 16rpx;
						position: absolute;
						background-color: #fff;
						z-index: 6;
						padding: 12rpx 24rpx;
						
						.good {
							margin-bottom: 12rpx;
							
							&:last-child {
								margin-bottom: 0;
							}
						}
						
						.scroll-view {
							height: 100%;
						}
					}
				}
			}
			
			.goods-list {
				margin-bottom: 24rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				.icon-btn {
					color: #fff;
					font-size: 28rpx;
				}
				
				.good-name {
					margin-bottom: 24rpx;
				}
				
				> view {
					display: flex;
				}
				
				.delete-btn {
					margin-left: 48rpx;
					width: 52rpx;
					height: 52rpx;
					background-color: #67A8FC;
					border-radius: 12rpx;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				
			}
		}
		
		.good-oldPrice {
			margin-bottom: 48rpx;
			
			// .title {
			// 	margin-right: 24rpx;
			// }
		}
		
		.good-nowPrice,.good-oldPrice {
			display: flex;
			
			.title {
				margin-right: 28rpx;
			}
			
			.price-input {
				position: relative;
				display: flex;
				align-items: center;
			
				input {
					width: 252rpx;
					height: 64rpx;
					padding-left: 60rpx;
					border: 2rpx solid #67A8FC;
					border-radius: 12rpx;
					box-sizing: border-box;
				}
			}
			
			.price-input::after {
				display: block;
				content: "￥";
				color: #fff;
				width: 52rpx;
				height: 64rpx;
				line-height: 64rpx;
				background-color: #67a8fc;
				border-top-right-radius: 12rpx;
				border-bottom-right-radius: 12rpx;
				text-align: center;
				position: absolute;
				border-radius: 0;
				border-top-left-radius: 12rpx;
				border-bottom-left-radius: 12rpx;
				top: 0;
				left: 0;
			}
	
		}
		
	
	}

	.good-images {
		.title {
			margin-bottom: 24rpx;
		}

		>view {
			margin-bottom: 48rpx;
			
			.img-show {
				position: relative;
				
				image {
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}
				
				.delete-btn {
					background: url(../../../../static/icon/delete.png);
					width: 50rpx;
					height: 50rpx;
					background-size: 100%;
					position: absolute;
					right: 10rpx;
					top: 10rpx;
				}
			}
		}

		.good-img-main {
			.file-upload,.img-show {
				width: 256rpx;
				height: 256rpx;
			}
			
			.vip-card-box {
				.list {
					width: 550rpx;
					height: 270rpx;
					margin-bottom: 24rpx;
					
					image {
						width: 100%;
						height: 100%;
						border-radius: 16rpx;
					}
					
					.shadow {
						box-shadow: 0 2px 4px 0 #999;
					}
				}
			}
		}

		.good-img-detail {
			.file-upload,.img-show {
				width: 256rpx;
				height: 256rpx;
				// height: 320rpx;
			}
		}

		.good-img-recom {
			.botm-handle {
				display: flex;

				.file-upload,.img-show {
					width: 256rpx;
					height: 256rpx;
					margin-right: 48rpx;
				}

				.right-handle {
					.sec-title {
						margin-bottom: 24rpx;

						text {
							font-size: 24rpx;
							font-weight: 400;
							color: rgba(153, 153, 153, 1);
						}
					}
				}
			}


		}

		.store-banner {
			margin-bottom: 104rpx;

			.file-upload,.img-show {
				height: 220rpx;
			}
		}

	}

	.tab-handle {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 96rpx;
		z-index: 2;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, 0.1);
		
		
		font-size: 32rpx;
		font-weight: 400;
		
		.cancel {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			background-color: #fff;
		}
		
		.complete {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			background-color: rgba(103, 168, 252, 1);
			
			text {
				color: #fff;
			}
		}
	}
	
</style>
