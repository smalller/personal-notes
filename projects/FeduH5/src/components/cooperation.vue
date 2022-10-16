<template>
  <div class="cooperation">
    <div class="center">
      <div class="item">
        <img
          src="@/assets/image/1.png"
          alt=""
        />
        <div class="rightBox">
          <p class="itemTitle">深耕教育行业</p>
          <p class="itemCenter">
            深耕教育行业12年<br />专注行业信息化的建设与发展<br />了解行业深层次的痛点与需求
          </p>
        </div>
      </div>
      <div class="item item2">
        <img
          src="@/assets/image/2.png"
          alt=""
        />
        <div class="rightBox">
          <p class="itemTitle">完善服务支撑</p>
          <p class="itemCenter">
            高效敏捷的运营团队<br />及时为代理商提供产品问题<br />解决方案和技术支撑
          </p>
        </div>
      </div>
      <div class="item item3">
        <img
          src="@/assets/image/3.png"
          alt=""
        />
        <div class="rightBox">
          <p class="itemTitle">技术实力雄厚</p>
          <p class="itemCenter">
            核心团队成员均来自<br />知名互联网公司<br />技术实力雄厚
          </p>
        </div>
      </div>
      <div class="item item2">
        <img
          style="width: 50vw; height: 35vw"
          src="@/assets/image/4.png"
          alt=""
        />
        <div class="rightBox">
          <p class="itemTitle">品牌诚信保障</p>
          <p class="itemCenter">
            诚信经营品牌保障<br />持续高收益<br />技术升级产品，实力雄厚
          </p>
        </div>
      </div>
    </div>
    <div class="jiameng">
      <div class="jiamengCenter">
        <div class="jmLeft">
          <p>加盟需求</p>
          <p>
            1、拥有现成的客户资源, 在签约区域内至少已服务30家视频幼儿园。 <br />
            2、专职销售团队, 每个区域内至少拥有3人以上专职人员。 <br />
            3、具有合法营业执照和独立法人代表, 有良好的商业信誉和口碑。<br />
            4、认同金树丫的产品价值和文化理念, 愿意长期合作。
          </p>
        </div>
        <div class="jmRight">
          <input
            type="text"
            v-model="dataForm.name"
            placeholder="请输入姓名"
          />
          <input
            type="text"
            v-model="dataForm.mobile"
            placeholder="请输入联系电话"
          />
          <div
            class="ljjm"
            @click="submit"
          >立即加盟</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dataForm: {
        mobile: "",
        name: "",
      },
    };
  },
  mounted() {
    document.getElementById('testInput').addEventListener('input', function (e) {
      var value = e.target.value;
    });
  },
  methods: {
    submit() {
      if (this.dataForm.name === "") {
        this.$message.warning("姓名不能为空");
        return;
      }
      if (
        !/^((13[0-9])|(14[0-9])|(15([0-9]))|(16([0-9]))|(17([0-9]))|(18[0-9]))|(19([0-9]))\d{8}$/.test(
          this.dataForm.mobile
        )
      ) {
        this.$message.warning("请填写正确的11位手机号码");
        return;
      }
      axios
        .post(
          "https://api.v2.jinshuy.com/schools/unAccess/door/agentRegister",
          this.dataForm
        )
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.$message.success("提交成功");
            this.dataForm.name = "";
            this.dataForm.mobile = "";
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.cooperation {
  width: 97%;
  .center {
    width: 100%;
    margin: auto;
    // .title{
    //   text-align: center;
    //   font-size: 20px;
    //   padding: 17px 0;
    //   margin:0;
    // }
    .item {
      overflow: hidden;
      width: 95%;
      margin-top: 11vw;
      margin-left: 5px;
      margin-right: 5px;
      img {
        border: 1px dashed #ccc;
        width: 50vw;
        height: 35vw;
        float: left;
      }
      .rightBox {
        .itemTitle {
          padding-top: 34px;
          font-weight: 600;
          text-align: right;
          margin: 0;
          font-size: 18px;
          color: #1e1e1e;
        }
        .itemCenter {
          color: #6e6e6e;
          font-size: 12px;
          text-align: right;
        }
      }
    }
    .item2 {
      margin-top: 11vw;

      widows: 95%;
      margin-left: 5px;
      margin-right: 5px;
      img {
        float: right;
        width: 50vw;
        height: 35vw;
      }
      .itemTitle {
        padding-left: 17px;
        text-align: left !important;
      }
      .itemCenter {
        padding-left: 17px;
        text-align: left !important;
      }
    }
    .item3 {
      margin-top: 11vw;

      widows: 95%;
      margin-left: 5px;
      margin-right: 5px;
      .itemTitle {
        padding-top: 10px;
      }
      img {
        width: 50vw;
        height: 35vw;
      }
    }
  }
  .jiameng {
    margin-top: 24px;
    width: 100%;
    .jiamengCenter {
      width: 100%;
      text-align: left;
      margin-left: 10px;
      .jmLeft {
        width: 100%;
        // float: left;
        p:nth-child(1) {
          margin-top: 40px;
          margin-bottom: 30px;
          font-size: 26px;
          color: #1e1e1e;
        }
        p:nth-child(2) {
          font-size: 10px;
          line-height: 25px;
          font-weight: 700;
          color: #6e6e6e;
        }
      }
      .jmRight {
        width: 100%;
        text-align: center;
        input {
          outline: none;
          font-size: 10px;
          margin-top: 50px;
          margin-left: -5px;
          margin-bottom: 0px;
          padding-left: 15px;
          width: 80%;
          height: 39px;

          background: #fafafb;

          border: 2px solid #b4b4b4;
          opacity: 1;
          border-radius: 28px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 0px;
          color: #b4b4b4;
        }
        .ljjm {
          cursor: pointer;
          margin: auto;
          margin-top: 60px;
          margin-bottom: 20px;
          width: 40%;
          height: 40px;
          background: #fbd646;
          opacity: 1;
          border-radius: 6px;
          text-align: center;
          line-height: 40px;
        }
      }
    }
  }
}
</style>
