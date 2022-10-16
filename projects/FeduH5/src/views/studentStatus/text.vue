<template>
<div class="studentText">
  <my-head title="填报说明" @leftClick="backClick"></my-head>
  <div class="textContent">
    <div class="textItem">
      <div class="textTitle">联动校验说明</div>
      <div class="textList">
        <div class="textListItem">
          <div class="textLeft">A</div>
          <div class="textRight">当身份证件类型为“身份证”时，国籍/地区只能是中国。</div>
        </div>
        <div class="textListItem">
          <div class="textLeft">B</div>
          <div class="textRight">当是否残疾幼儿为“否”时，残疾幼儿类别不需填写。</div>
        </div>
        <div class="textListItem">
          <div class="textLeft">C</div>
          <div class="textRight">当身份证件类型为“其它”时，身份证件号码为非必填选项。</div>
        </div>
        <div class="textListItem">
          <div class="textLeft">D</div>
          <div class="textRight">当监护人身份证件类型为“其它”时，监护人身份证件号码为非必填选项。</div>
        </div>
        <div class="textListItem">
          <div class="textLeft">E</div>
          <div class="textRight">当国籍/地区为非中国国籍时，“户口地”、“非农业户口类型”、“是否独生子女”、“是否进城务工人员子女”、“残疾幼儿类别”、“民族”、“户口性质”、“出生所在地”、“是否留守儿童”为不可填。</div>
        </div>
      </div>
    </div>
    <div class="textItem">
      <div class="textTitle">校验说明</div>
      <div class="textList">
        <div class="textListItem">
          <div class="textLeft">A</div>
          <div class="textRight">出生日期不可大于当前日期。</div>
        </div>
        <div class="textListItem">
          <div class="textLeft">B</div>
          <div class="textRight">入园日期不可大于当前日期。</div>
        </div>
      </div>
    </div>
    <div class="textItem">
      <div class="textTitle">填写注意事项</div>
      <div class="textList">
        <div class="textListItem">
          <div class="textLeft">A</div>
          <div class="textRight">“户口所在地”以及“出生所在地”，填写行政区划对应的码值，请参照“出生所在地以及户口所在地对照表"填写。</div>
        </div>
        <div class="textListItem">
          <div class="textLeft">B</div>
          <div class="textRight">填写时性别与身份证号码必须一致。</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MyHead from "@/views/userCamera/component/head";
export default {
  name: "text",
  components: {MyHead},
  methods: {
    backClick() {
      this.$router.back()
    }
  }
}
</script>

<style  lang="less">
.studentText {
  .textContent {
    box-sizing: border-box;
    padding: 18px 16px;
    .textItem{
      margin-bottom: 40px;
      .textTitle{
        padding: 0 16px;
        height: 34px;
        border-radius: 28px;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #FFFFFF;
        display: inline-flex;
      }
      .textList{
        margin-top: 20px;
        .textListItem{
          display: flex;
          margin-bottom: 16px;
          .textLeft{
            width: 27px;
            height: 27px;
            border-radius: 50%;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;

          }
          .textRight{
            font-size: 14px;
            color: #1C1C1C;
            flex: 1;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      &:nth-child(1) {
        .textTitle{
          background: #FF9F3D;
        }
        .textList{
          .textListItem{
            .textLeft{
              background: #FFF1DE;
              color: #FF9F3D;
            }
          }
        }
      }
      &:nth-child(2) {
        .textTitle{
          background: #4FA8F9;
        }
        .textList{
          .textListItem{
            .textLeft{
              background: #E8F4FF;
              color: #4FA8F9;
            }
          }
        }
      }
      &:nth-child(3) {
        .textTitle{
          background: #42C7C6;
        }
        .textList{
          .textListItem{
            .textLeft{
              background: #E7FEFD;
              color: #42C7C6;
            }
          }
        }
      }
    }
  }
}
</style>
