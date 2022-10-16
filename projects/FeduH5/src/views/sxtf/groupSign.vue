<template>
 <div class="signUp">
   <div class="signUpHead"><img src="./static/img.jpg"  alt=""/></div>
<!--   <div class="hotBox">-->
<!--     <div class="hot">-->
<!--        <image src="../static/image/hot.png" mode=""></image>-->
<!--        <text>已有</text>-->
<!--       <div class="textBox"><text>3078</text></div>-->
<!--        <text>人参加活动</text>-->
<!--      </div>-->
<!--    </div>-->
<!--   <van-form @submit="toSignInfo">-->
<!--     <van-field-->
<!--         v-model="username"-->
<!--         name="用户名"-->
<!--         label="用户名"-->
<!--         placeholder="用户名"-->
<!--         :rules="[{ required: true, message: '请填写用户名' }]"-->
<!--     />-->
<!--     <van-field-->
<!--         v-model="username"-->
<!--         name="用户名"-->
<!--         label="用户名"-->
<!--         placeholder="用户名"-->
<!--         :rules="[{ required: true, message: '请填写用户名' }]"-->
<!--     />-->
<!--     <van-field-->
<!--         v-model="username"-->
<!--         name="用户名"-->
<!--         label="用户名"-->
<!--         placeholder="用户名"-->
<!--         :rules="[{ required: true, message: '请填写用户名' }]"-->
<!--     />-->
<!--     <van-field-->
<!--         v-model="password"-->
<!--         type="password"-->
<!--         name="密码"-->
<!--         label="密码"-->
<!--         placeholder="密码"-->
<!--         :rules="[{ required: true, message: '请填写密码' }]"-->
<!--     />-->
<!--     <div style="margin: 16px;" class="btnBox">-->
<!--       <van-button round block type="info" native-type="submit">立即报名</van-button>-->
<!--     </div>-->
<!--   </van-form>-->
   <div class="formBox">
     <div class="formItem">
       <div class="itemTitle">
         <span>赛区</span>
         <span>*</span>
       </div>
       <div class="itemContent">
         <input @click="selectCityShow = true" readonly v-model="formData.division" placeholder="请选择赛区" />
         <van-popup v-model="selectCityShow" round position="bottom">
           <van-cascader
               title="请选择所在地区"
               :options="city"
               @close="selectCityShow = false"
               @finish="selectDivision"
           />
         </van-popup>
       </div>
     </div>
     <div class="formItem">
       <div class="itemTitle">
          <span>单位名称</span>
          <span>*</span>
        </div>
       <div class="itemContent"><input v-model="formData.companyName" placeholder="请填写单位名称" /></div>
      </div>
     <div class="formItem">
       <div class="itemTitle">
          <span>联系人姓名</span>
          <span>*</span>
        </div>
       <div class="itemContent"><input v-model="formData.contactsName" placeholder="请填写联系人姓名" /></div>
      </div>
     <div class="formItem">
       <div class="itemTitle">
          <span>联系人职务</span>
          <span>*</span>
        </div>
       <div class="itemContent"><input v-model="formData.contactsPost" placeholder="请填写联系人职务" /></div>
      </div>
     <div class="formItem">
       <div class="itemTitle">
          <span>联系人电话</span>
          <span>*</span>
        </div>
       <div class="itemContent"><input type="number" v-model="formData.contactsPhone" placeholder="请填写联系人电话" /></div>
      </div>
    </div>
   <div class="btnBox"><button type="default" @click="toSignInfo">立即报名</button></div>
  </div>
</template>

<script>
import qs from 'qs';
import city from "./city";
export default {
  components: {
  },
  data() {
    return {
      city: city,
      selectCityShow: false,
      formData: {
        companyName: '', //单位名称
        contactsName: '', //联系人姓名
        contactsPhone: '', //联系人电话
        contactsPost: '', //联系人职务
        division: '', //赛区
      }
    };
  },
  methods: {
    reset() {
      this.formData = {
        companyName: '', //单位名称
        contactsName: '', //联系人姓名
        contactsPhone: '', //联系人电话
        contactsPost: '', //联系人职务
        division: '', //赛区
      }
    },
    selectDivision(e) {
      this.formData.division = e.selectedOptions[0].text+"-"+e.selectedOptions[1].text
      console.log(this.formData.division)
      this.selectCityShow = false
    },
    // 前往上传报名照片页面
    toSignInfo() {
      if (!this.formData.division) {
        vant.Toast({
          message: '请选择赛区',
          position: 'bottom',
        });
        return;
      }
      if (!this.formData.companyName) {
        vant.Toast({
          message: '请输入单位名称',
          position: 'bottom',
        });
        return;
      }
      if (!this.formData.contactsName) {
        vant.Toast({
          message: '请输入联系人姓名',
          position: 'bottom',
        });
        return;
      }
      if (!this.formData.contactsPost) {
        vant.Toast({
          message: '请输入联系人职务',
          position: 'bottom',
        });
        return;
      }
      if (!this.formData.contactsPhone) {
        vant.Toast({
          message: '请输入联系人电话',
          position: 'bottom',
        });
        return;
      }

      this.$request('/schools/api/sxApplet/unAccess/register',{
        method: 'post',
        data: this.formData
      }).then(res => {
        if(+res.code === 0) {
          vant.Toast.success('提交信息成功')
        } else {
          vant.Toast.fail(res.msg)
        }
      })
    }
  }
};
</script>

<style lang="less">
.signUp {
  width: 100vw;
  .signUpHead {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .hotBox {
    width: 100%;
    padding-top: 18px;
    padding-bottom: 26px;
    display: flex;
    justify-content: center;
    .hot {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 36px;
      background: #fff7e2;
      border-radius: 37px;
      img {
        width: 30px;
        height: 30px;
        margin-right: 4px;
      }
      > span {
        font-weight: 500;
        color: #ff7d6b;
        font-size: 14px;
      }
      .textBox {
        margin: 0 4px;
        height: 28px;
        background: #ff7d6b;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 0 6px;
        font-weight: bold;
        color: #ffffff;
        font-size: 18px;
      }
    }
  }
  .formBox {
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    margin-top:26px;
    .formItem {
      margin-bottom: 16px;
      .itemTitle {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        span {
          font-weight: bold;
          color: #6c6c6c;
          font-size: 16px;
          &:nth-child(2) {
            color: #ff3014;
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
      .itemContent{
        margin-top: 8px;
        margin-bottom:16px;
        input{
          height: 44px;
          width: 100%;
          border-radius: 6px;
          border: 1px solid #E3E3E3;
          box-sizing: border-box;
          padding: 0 16px;
        }
      }
    }
  }
  .btnBox {
    margin-top: 26px;
    padding: 0 15px;
    box-sizing: border-box;
    button {
      width: 100%;
      height: 44px;
      background: linear-gradient(270deg, #f6a13e 0%, #fec685 100%);
      border-radius: 22px;
      font-weight: 500;
      color: #ffffff;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      &::after {
        border: none;
      }
    }
  }
}
</style>
