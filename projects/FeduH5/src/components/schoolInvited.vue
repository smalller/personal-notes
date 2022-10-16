<template>
  <div class="content">
    <van-popup
      v-model="showPicker"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div v-if="showPicker">
        <van-datetime-picker
          v-model='relWkibedat'
          type="date"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        >
        </van-datetime-picker>
      </div>
    </van-popup>
    <div class="jsy-content">
      <div class="work-content">
        <div>
          <div class="jmRight">
            <p :style="{color:theme.formColor}">宝贝姓名：</p>
            <input
              type="text"
              v-model="dataForm.stuName"
              :style="{border: '1px solid ' + theme.inputColor + '',background: theme.inputBg,color:theme.formNameColor}"
            />
          </div>
          <div class="jmRight">
            <p :style="{color:theme.formColor}">出生日期：</p>
            <input
              type="text"
              @click="setTime"
              @focus="forbid"
              v-model="dataForm.stuBirthday"
              :style="{border: '1px solid ' + theme.inputColor + '',background: theme.inputBg,color:theme.formNameColor}"
            />
          </div>
          <div class="radio-box">
            <p :style="{color:theme.formColor}">宝贝性别：</p>
            <div style="    width: 60%;
    display: flex;
    margin-top: -5px;">
              <div
                class="input-box"
                v-for="(item, index) in radios"
                :key="item.id"
              >
                <label class="radio"><input
                    v-model="dataForm.sex"
                    :value="item.value"
                    @click="check(index)"
                    type="radio"
                  >
                  <div style="width:50px;display:flex">
                    <img
                      class="radio-img"
                      :src=" item.isChecked? theme.active:theme.unActive"
                    >
                    <span :style="{color:theme.formNameColor}">{{ item.label }}</span>
                  </div>

                </label>
              </div>
            </div>
          </div>
          <div class="jmRight">
            <p :style="{color:theme.formColor}">家长电话：</p>
            <input
              type='text'
              oninput="this.value=this.value.replace(/[^0-9.]+/,'');"
              v-model="dataForm.mobile"
              :style="{border: '1px solid ' + theme.inputColor + '',background: theme.inputBg,color:theme.formNameColor}"
            />
          </div>
          <div
            class="ljjm"
            @click="submit"
            :style="{background: theme.btColor}"
          >立即报名</div>
        </div>
      </div>
    </div>

    <div
      class="jsy-footer"
      :style="{backgroundImage:'url(' + theme.footer + ')'}"
    ></div>

  </div>

</template>

<script>
import axios from "axios";

export default {
  props: {
    school: {
      type: Object,
      default: () => {
        return {}
      }
    },
    theme: {
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  components: {},
  data() {
    return {
      isShow: false,
      type: 1,
      dataForm: {
        sex: "1",
      },
      radios: [
        {
          label: "男",
          value: 1,
          isChecked: true,
        },
        {
          label: "女",
          value: 0,
          isChecked: false,
        },
      ],
      radio: "",
      showPicker: false,
      relWkibedat: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    };
  },
  mounted() {
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
  },
  methods: {
    setTime() {
      this.showPicker = true;
    },
    forbid() {
      //禁止软键盘弹出
      document.activeElement.blur();
    },
    check(index) {
      this.dataForm.sex = 1;
      this.radios.forEach((item) => {
        item.isChecked = false;
      });
      this.dataForm.sex = this.radios[index].value;
      this.radios[index].isChecked = true;
    },
    onConfirm(val) {
      let year = val.getFullYear();
      let month = val.getMonth() + 1;
      let day = val.getDate();
      let hour = val.getHours();
      let minute = val.getMinutes();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`;
      }
      if (hour >= 0 && hour <= 9) {
        hour = `0${hour}`;
      }
      if (minute >= 0 && minute <= 9) {
        minute = `0${minute}`;
      }
      this.dataForm.stuBirthday = `${year}-${month}-${day}`;
      this.showPicker = false;
    },
    submit() {
      let status = true;
      console.log(this.dataForm)
      if (this.dataForm.stuName == undefined) {
        this.$message.warning("幼儿姓名不能为空");
        status = false;
        return;
      }
      if (this.dataForm.sex == undefined) {
        this.$message.warning("幼儿性别不能为空");
        status = false;
        return;
      }
      if (this.dataForm.stuBirthday == undefined) {
        this.$message.warning("幼儿出生日期不能为空");
        status = false;
        return;
      }
      if (
        !/^((13[0-9])|(14[0-9])|(15([0-9]))|(16([0-9]))|(17([0-9]))|(18[0-9]))|(19([0-9]))\d{8}$/.test(
          this.dataForm.mobile
        )
      ) {
        status = false;
        this.$message.warning("请填写正确的11位手机号码");
        return;
      }
      this.dataForm.schoolId = this.school.schoolId;
      this.dataForm.admissionsId = this.school.id
      console.log(this.dataForm)
      if (status) {
        axios
          .post(
            `${process.env["VUE_APP_BASE_API"]}/schools/unAccess/stusign/save`,
            this.dataForm
          )
          .then((res) => {
            console.log(res);
            if (res.data.code === 0) {
              this.$message.success("提交成功");
              this.dataForm = {};
              this.$router.push("/");
            } else {
              this.$message.warning(res.data.msg);
            }
          });
      }
    },
  },
};
</script>

<style scoped lang="less">
// .jsy-head {
//   background: url("../assets/school/sun.png") no-repeat;
//   width: 100%;
//   height: ;
//   margin-top: 25px;
//   background-size: 95% 75%;
//   filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/sun.png',sizingMethod='scale');
// }
.school {
  display: inline-flex;
  margin-top: 10%;
}
.school-name {
  font-size: 22px;
  font-weight: 400;
  color: #1c1c1c;
  letter-spacing: 1px;
  border-bottom: 3px solid #f1c929;
  height: 45px;
  margin: auto;
}
.work-content {
  width: 98%;
  margin-top: 20px;
  padding-left: 10%;
  p {
    display: block;
    margin-bottom: 15px;
    font-size: 22px;
    font-weight: 500;
    // color: #ff8000;
  }
  span {
    display: block;
    font-size: 18px;
    font-weight: 400;
  }
}
.jmRight {
  width: 100%;
  text-align: center;
  display: flex;
  p {
    font-size: 18px;
    font-weight: 400;
  }
  input {
    outline: none;
    font-size: 16px;
    margin-left: -5px;
    margin-bottom: 20px;
    padding-left: 15px;
    margin-top: -5px;
    width: 65%;
    height: 39px;
    background: #ffffff;
    // border: 2px solid #ffbb77;
    opacity: 1;
    border-radius: 28px;
  }
  // .ljjm {
  //   cursor: pointer;
  //   margin: auto;
  //   margin-bottom: 20px;
  //   margin-left: 20%;
  //   margin-top: 20px;
  //   width: 60%;
  //   height: 50px;
  //   color: #ffffff;
  //   font-size: 20px;
  //   opacity: 1;
  //   border-radius: 10px;
  //   text-align: center;
  //   padding-top: 5px;
  //   line-height: 40px;
  // }
}
.jsy-footer {
  background: no-repeat;
  width: 100%;
  height: 235px;
  background-size: 100% 100%;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/footer.png',sizingMethod='scale');
}

.radio-box {
  width: 90%;
  text-align: center;
  display: flex;
  margin-bottom: 10px;
  p {
    font-size: 18px;
    font-weight: 400;
  }
}

.input-box {
  display: flex;
  margin-left: 30px;
  margin-top: 10px;
  span {
    display: block;
    margin-left: 5px;
    font-size: 16px;
    margin-top: -5px;
  }

  .radio input[type="radio"] {
    position: absolute;
    width: 0;
    height: 0;
  }

  input[type="radio"]:after {
    content: "";
    // background-image: url("../assets/school/unCheck.png");
    background-size: 20px 20px;
    width: 20px;
    height: 20px;
    position: absolute;
    z-index: 100;
    left: -30px;
    top: -5px;
  }

  input[type="radio"]:checked:after {
    // background-image: url("../assets/school/check.png");
    background-size: 18px 18px;
    width: 18px;
    height: 18px;
  }
}
.radio-img {
  background-size: 20px 20px;
  width: 15px;
  height: 15px;
  // position: absolute;
  z-index: 100;
  // left: -30px;
  // top: -5px;
}
// .input-box {
//   display: flex;
//   margin-left: 30px;
//   margin-top: 10px;
//   span {
//     font-size: 16px;
//     display: block;
//     margin-left: 5px;
//     margin-top: -5px;
//   }
// }
.ljjm {
  cursor: pointer;
  margin: auto;
  margin-bottom: 20px;
  margin-left: 20%;
  margin-top: 30px;
  width: 50%;
  height: 50px;
  color: #ffffff;
  font-size: 20px;
  opacity: 1;
  border-radius: 10px;
  text-align: center;
  padding-top: 5px;
  line-height: 40px;
}
</style>
