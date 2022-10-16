<template>
  <div class="home">
    <span class="join">
      <p style="color: red">*</p>
      申请入驻
    </span>
    <van-form @submit="submit">
      <span class="item-name">园所名称</span>
      <van-field
        style="margin-buttom：20px"
        v-model="ruleFrom.name"
        name="园所名称"
        placeholder="请输入园所名称"
        :border="true"
      />
      <span class="item-name">所在地区</span>

      <van-field
        readonly
        clickable
        name="area"
        :value="value"
        placeholder="点击选择省市区"
        @click="showArea = true"
      />
      <span class="item-name">详细地址</span>

      <van-field
        v-model="ruleFrom.address"
        name="详细地址"
        placeholder="请输入详细地址"
      />
      <span class="item-name">联系人</span>

      <van-field
        v-model="ruleFrom.contactName"
        name="联系人"
        placeholder="请输入联系人"
      />
      <span class="item-name">联系电话</span>

      <van-field
        v-model="ruleFrom.contactMobile"
        name="联系电话"
        placeholder="请输入联系电话"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          native-type="submit"
          class="save-button"
        >提交</van-button>
      </div>
    </van-form>
    <van-popup
      v-model="showArea"
      position="bottom"
    >
      <van-area
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showArea = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { areaList } from "@vant/area-data";
import axios from "axios";
export default {
  data() {
    return {
      ruleFrom: {
        name: "",
        areaId: "",
        address: "",
        contactMobile: "",
        contactName: "",
      },
      value: "",
      showArea: false,
      areaList,
    };
  },
  methods: {
    onConfirm(values) {
      console.log(values);
      this.value = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("/");
      this.ruleFrom.areaId = this.value;
      this.showArea = false;
    },
    submit() {
      console.log(this.ruleFrom, "122112");
      if (this.ruleFrom.name === "") {
        this.$message.warning("园所名称不能为空");
        return;
      }
      if (this.ruleFrom.address === "") {
        this.$message.warning("详细地址不能为空");
        return;
      }
      if (this.ruleFrom.contactName === "") {
        this.$message.warning("联系人不能为空");
        return;
      }
      if (this.ruleFrom.areaId === "") {
        this.$message.warning("地区不能为空");
        return;
      }
      if (
        !/^((13[0-9])|(14[0-9])|(15([0-9]))|(16([0-9]))|(17([0-9]))|(18[0-9]))|(19([0-9]))\d{8}$/.test(
          this.ruleFrom.contactMobile
        )
      ) {
        this.$message.warning("请填写正确的11位手机号码");
        return;
      }
      axios
        .post(
          "https://api.v2.jinshuy.com/schools/unAccess/door/nurseryRegister",
          this.ruleFrom
        )
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.$message.success("提交成功");
            this.ruleFrom.name = "";
            this.ruleFrom.address = "";
            this.ruleFrom.contactName = "";
            this.ruleFrom.contactMobile = "";
            this.ruleFrom.areaId = "";
            this.value = ''
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((err) => {
          this.$message.warning(err.message);
        });
    },
  },
};
</script>

<style scoped lang="less">
.home {
  width: 95%;
  margin-top: 30px;
  text-align: left;
  .join {
    width: 90%;
    display: flex;
    margin-left: 10px;
    font-size: 16px;
    font-weight: 800;
    color: #111111;
    opacity: 1;
  }
  .item-name {
    display: block;
    margin-top: 20px;
    margin-left: 20px;
    width: 80px;
    height: 28px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 0px;
    color: #111111;
    opacity: 1;
  }
  .van-cell {
    border: 1px solid #d6d6d6 !important;
    border-radius: 5px !important;
    margin-left: 20px !important;
    width: 95% !important;
  }
  .save-button {
    width: 60%;
    height: 40px;
    margin: auto;
    margin-top: 80px;
    background: #edeef0;
    opacity: 1;
    border-radius: 6px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 0px;
    color: #111111;
    opacity: 1;
  }
}
</style>
