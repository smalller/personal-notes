import Vue from 'vue';

Vue.filter('editorText', function (data) {
  return data.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
})

Vue.filter('removeBlank', function (data) {
  // eslint-disable-next-line no-control-regex
  return data.replace(/\s[\x00-\xff]*/g, '')
})

//手机号
Vue.filter("phoneNum", function (oldVal) {
  let newVal = oldVal.replace(oldVal.slice(3, 7), "****");
  return newVal;
});

//店铺类型
Vue.filter("shopType", function (oldVal) {
  let newVal = "";
  switch (oldVal) {
    case 1:
      newVal = "夜店";
      break;
    case 2:
      newVal = "清吧";
      break;
    case 3:
      newVal = "ktv";
      break;
  }
  return newVal;
});

//座位类型
Vue.filter("seatType", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '无要求';
      break;
    case 1:
      newVal = '卡座';
      break;
    case 2:
      newVal = '散台';
      break;
    case 3:
      newVal = '独立高脚凳';
      break;
  }
  return newVal;
})

//星期几
Vue.filter("dayOfWeek", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 1:
      newVal = '星期一';
      break;
    case 2:
      newVal = '星期二';
      break;
    case 3:
      newVal = '星期三';
      break;
    case 4:
      newVal = '星期四';
      break;
    case 5:
      newVal = '星期五';
      break;
    case 6:
      newVal = '星期六';
      break;
    case 7:
      newVal = '星期日';
      break;
  }
  return newVal;
})

//座位类型
Vue.filter("conType", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '预定桌';
      break;
    case 1:
      newVal = 'AA拼单';
      break;
    case 2:
      newVal = '抢座';
      break;
    case 3:
      newVal = '会员卡';
      break;
    case 4:
      newVal = '线下添单';
      break;
  }
  return newVal;
})

//是否为会员与收藏本店
Vue.filter("yesOrNo", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '否';
      break;
    case 1:
      newVal = '是';
      break;
  }
  return newVal;
})

//支付方式
Vue.filter("payType", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '支付宝支付';
      break;
    case 1:
      newVal = '微信支付';
      break;
    case 2:
      newVal = '会员卡支付';
      break;
    case 3:
      newVal = '优惠券支付';
      break;
    case 4:
      newVal = '现金支付';
      break;
  }
  return newVal;
})

//推荐类型/品牌
Vue.filter("recommendBrand", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 1:
      newVal = '商家店铺';
      break;
    case 2:
      newVal = '活动';
      break;
  }
  return newVal;
})

//店铺定位
Vue.filter("shopLoca", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 1:
      newVal = '夜店';
      break;
    case 2:
      newVal = '清吧';
      break;
    case 3:
      newVal = 'ktv';
      break;
  }
  return newVal;
})

//包间属性
Vue.filter("roomAttr", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case '1':
      newVal = '预定桌';
      break;
    case '2':
      newVal = 'AA拼单';
      break;
  }
  return newVal;
})

//包间属性
Vue.filter("roomType", function (oldVal, ktvTypeOpt) {
  let newVal = '';
  ktvTypeOpt.forEach(item => {
    if (oldVal == item.id) {
      newVal = item.name;
    }
  })
  return newVal;
})

//支付状态
Vue.filter("payStatus", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '未支付';
      break;
    case 1:
      newVal = '已支付';
      break;
  }
  return newVal;
})

//退款子订单状态
Vue.filter("refundOrderStatus", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '待上桌';
      break;
    case 1:
      newVal = '已上桌';
      break;
    case 2:
      newVal = '已售罄';
      break;
    case 3:
      newVal = '待付款';
      break;
    case 4:
      newVal = '已退款';
      break;
  }
  return newVal;
})

//订单状态
Vue.filter("statusOrder", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '待支付';
      break;
    case 1:
      newVal = '已接单';
      break;
    case 2:
      newVal = '已拒绝';
      break;
    case 3:
      newVal = '未到店';
      break;
    case 4:
      newVal = '已到店';
      break;
    case 5:
      newVal = '有追单';
      break;
    case 6:
      newVal = '已离店';
      break;
    case 7:
      newVal = '退款中';
      break;
    case 8:
      newVal = '待接单';
      break;
  }
  return newVal;
})

//支付类型
Vue.filter("payWay", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '支付宝';
      break;
    case 1:
      newVal = '微信';
      break;
    case 2:
      newVal = '会员积分';
      break;
    case 3:
      newVal = '优惠券支付';
      break;
    case 4:
      newVal = '现金支付';
      break;
    case 5:
      newVal = '线下支付';
      break;
  }
  return newVal;
})



//性别
Vue.filter("sex", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '未设置';
      break;
    case 1:
      newVal = '男';
      break;
    case 2:
      newVal = '女';
      break;
  }
  return newVal;
})

//是否实名认证
Vue.filter("isCertification", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '否';
      break;
    case 1:
      newVal = '是';
      break;

  }
  return newVal;
})

//审核状态
Vue.filter("recomType", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '待审核';
      break;
    case 2:
      newVal = '已拒绝';
      break;
    case 4:
      newVal = '已通过';
      break;
  }
  return newVal;
})

//商家上下架状态
Vue.filter("putawayStatus", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 1:
      newVal = '审核店铺下线申请';
      break;
    case 2:
      newVal = '审核店铺上线申请';
      break;
    case 3:
      newVal = '正常状态';
      break;
  }
  return newVal;
})

//订单类型
Vue.filter("typeOrder", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '预定桌';
      break;
    case 1:
      newVal = 'AA拼单';
      break;
    case 2:
      newVal = '抢座';
      break;
    case 3:
      newVal = '会员卡';
      break;
    case 4:
      newVal = '线下添单';
      break;
    case 99:
      newVal = '未知';
      break;
  }
  return newVal;
})

//营业状态
Vue.filter("statusBusiness", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '启用';
      break;
    case 1:
      newVal = '禁用';
      break;
    case 10:
      newVal = '下线审核中';
      break;
    case 11:
      newVal = '上线审核中';
      break;
  }
  return newVal;
})

//商家申请状态
Vue.filter("statusBusiness2", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '申请上架';
      break;
    case 1:
      newVal = '申请下架';
      break;
    case 10:
      newVal = '下架审核中';
      break;
    case 11:
      newVal = '上架审核中';
      break;
  }
  return newVal;
})

//商家状态
Vue.filter("statusBusiness3", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '下架';
      break;
    case 1:
      newVal = '上架';
      break;
    case 10:
      newVal = '下架审核中';
      break;
    case 11:
      newVal = '上架审核中';
      break;
  }
  return newVal;
})



//推荐位状态
Vue.filter("statusRecommend", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '设为推荐位';
      break;
    case 1:
      newVal = '解除推荐位';
      break;
    case 10:
      newVal = '取消推荐审核中';
      break;
    case 11:
      newVal = '推荐审核中';
      break;
  }
  return newVal;
})

//用户状态
Vue.filter("statusRestrict", function (oldVal) {
  let newVal = '';
  switch (oldVal) {
    case 0:
      newVal = '正常';
      break;
    case 1:
      newVal = '已禁言';
      break;
    case 2:
      newVal = '已封号';
      break;
    case 3:
      newVal = '已冻结';
      break;
  }
  return newVal;
})


// 价格保留两位
Vue.filter("returnFloat", function (value) {
  if (value) {
    // eslint-disable-next-line no-redeclare
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
      value = '￥' + value.toString() + ".00";
      return value;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = '￥' + value.toString() + "0";
      } else {
        value = '￥' + value.toString();
      }
      return value;
    }
  } else {
    return '￥' + 0 + '.' + "00"
  }

})
