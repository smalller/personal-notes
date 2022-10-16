<template>
  <div class="studentFile">
    <div class="notice">
      <h1 style="color:#ffffff">学籍信息</h1>
      <span @click="active++">学籍信息仅用于幼儿园建立幼儿学籍档案</span>
    </div>
    <div class="student-content">
      <el-card
        style="margin-top:20px;"
        v-if="active == 0"
      >
        <div>
          <span>基本信息</span>
          <div class="student-img">
            <img
              :src="imgData.attach?imgData.attach:img"
              @click="$refs.imgcut.inputImg()"
            />
            <imgCut
              ref="imgcut"
              :token="token"
              :id="userId"
              @getImgData="getImgData"
            ></imgCut>
            <span v-show="!imgData.data">请上传一寸证件照</span>
          </div>
        </div>
        <van-form @submit="saveData">
          <van-field
            readonly
            v-model="formData.studentName"
            label='姓名'
            placeholder="请输入幼儿姓名"
          />
          <van-field
            readonly
            v-model="formData.studentName"
            label='姓名拼音'
            placeholder="请输入幼儿姓名"
          />
          <van-field
            name="radio"
            label="性别"
          >
            <template #input>
              <van-radio-group
                style="margin-top:15px;padding-bottom: 15px;border-bottom:1px solid #eee;margin-bottom: 20px;"
                v-model="formData.stuSex"
                direction="horizontal"
                disabled
              >
                <van-radio name="1">
                  <template #default>
                    <span>男</span>
                    <img
                      style="width:20px;margin:0px 0 -5px 5px"
                      src=".././assets/student/boy.png"
                    />
                  </template>
                </van-radio>
                <van-radio name="2"> <template #default>
                    <span>女</span>
                    <img
                      style="width:20px;margin:0px 0 -5px 5px"
                      src=".././assets/student/girl.png"
                    />
                  </template></van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            v-model="formData.birthTime"
            readonly
            label="出生年月"
            placeholder="请选择出生年月"
            right-icon="arrow"
          />
          <van-field
            v-model="formData.clazzName"
            readonly
            label="血型"
            placeholder="请选择"
            right-icon="arrow"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="身份证件类型"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            readonly
            v-model="formData.studentName"
            label='证件号码'
            placeholder="请输入幼儿姓名"
          />
        </van-form>
      </el-card>

      <el-card
        style="margin-top:20px;"
        v-if="active == 0"
      >
        <van-field
          v-model="formData.clazzName"
          readonly
          label="班级"
          placeholder="请选择"
          right-icon="arrow"
        />
        <van-field
          v-model="formData.clazzName"
          readonly
          label="入院日期"
          placeholder="请选择"
          right-icon="arrow"
        />
      </el-card>
      <el-card
        style="margin-top:20px;"
        v-if="active == 1"
      >
        <div>
          <span>户籍信息</span>
        </div>
        <van-form @submit="saveData">
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="国籍"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="民族"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="港澳台侨外"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="出生所在地"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="籍贯"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="户口性质"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="非农业户口类型"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="户口所在地"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="现住址"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="现详细地址"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            readonly
            v-model="formData.studentName"
            label='现详细地址'
            placeholder="请输入"
          />
        </van-form>
      </el-card>
      <el-card
        style="margin-top:20px;"
        v-if="active == 1"
      >
        <div>
          <span>家庭信息</span>
        </div>
        <van-form @submit="saveData">
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="就读方式"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="是否独生子女"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="是否留守儿童"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="是否进城务工人员子女"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="健康状况"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="是否残疾幼儿"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="残疾幼儿类别"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="是否孤儿"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
        </van-form>
      </el-card>
      <el-card
        style="margin-top:20px;"
        v-if="active == 1"
      >
        <div>
          <span>第一监护人</span>
        </div>
        <van-form @submit="saveData">
          <van-field
            readonly
            v-model="formData.studentName"
            label='姓名'
            placeholder="请输入"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="民族"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="与幼儿关系"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            label="身份证件类型"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <van-field
            readonly
            v-model="formData.studentName"
            label='证件号码'
            placeholder="请输入"
          />
          <van-field
            readonly
            v-model="formData.studentName"
            label='工作单位'
            placeholder="选填"
          />
          <van-field
            readonly
            v-model="formData.studentName"
            label='联系电话'
            placeholder="选填"
          />
        </van-form>
      </el-card>
      <!-- <div class="info">
        <span class="info-title">姓名</span>
        <van-field
          readonly
          v-model="formData.studentName"
          placeholder="请输入幼儿姓名"
        />
        <span class="info-title">性别</span>
        <van-radio-group
          style="margin-top:15px;padding-bottom: 15px;border-bottom:1px solid #eee;margin-bottom: 20px;"
          v-model="formData.stuSex"
          direction="horizontal"
          disabled
        >
          <van-radio name="1">
            <template #default>
              <span>男</span>
              <img
                style="width:20px;margin:0px 0 -5px 5px"
                src="../assets/student/boy.png"
              />
            </template>
          </van-radio>
          <van-radio name="2"> <template #default>
              <span>女</span>
              <img
                style="width:20px;margin:0px 0 -5px 5px"
                src="../assets/student/girl.png"
              />
            </template></van-radio>
        </van-radio-group>
        <span class="info-title">出生年月</span>
        <van-field
          v-model="formData.birthTime"
          readonly
          placeholder="请选择出生年月"
          right-icon="arrow"
        />
        <span class="info-title">班级</span>
        <van-field
          v-model="formData.clazzName"
          readonly
          placeholder="请选择班级"
          right-icon="arrow"
        />
      </div>

      <div
        class="student-list"
        v-if="showNext"
      >
        <van-form @submit="saveData">
          <span class="info-title">民族</span>
          <van-field
            v-model="formData.nation"
            name="用户名"
            placeholder="请填写民族"
            :rules="[{ required: true}]"
          />
          <span class="info-title">幼儿户口所在地</span>
          <van-field
            v-model="formData.huKou"
            @click="setAddress('0')"
            placeholder="请选择"
            readonly
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <span class="info-title">详细户口地址</span>
          <van-field
            v-model="formData.huKouAddress"
            placeholder="请填写详细户口地址"
            :rules="[{ required: true}]"
          />
          <span class="info-title">实际居住地址</span>
          <van-field
            v-model="formData.actualAddress"
            placeholder="请选择"
            @click="setAddress('1')"
            readonly
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <span class="info-title">详细居住地址</span>
          <van-field
            v-model="formData.actualDetailAddress"
            name="用户名"
            placeholder="请填写详细居住地址"
            :rules="[{ required: true}]"
          />
          <span class="info-title">港澳台侨外</span>
          <van-field
            v-model="formData.nationality"
            placeholder="请选择"
            @click="showNation = true"
            readonly
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <span class="info-title">是否独生子女</span>
          <van-field
            v-model="formData.isOnlyChild"
            @click="selectType('0')"
            placeholder="请选择"
            readonly
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <span class="info-title">是否留守儿童</span>
          <van-field
            v-model="formData.isLeftBehindChild"
            @click="selectType('1')"
            placeholder="请选择"
            right-icon="arrow"
            readonly
            :rules="[{ required: true}]"
          />
          <span class="info-title">是否进城务工人员子女</span>
          <van-field
            v-model="formData.isPeasantWorker"
            @click="selectType('2')"
            placeholder="请选择"
            readonly
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <span class="info-title">健康状况</span>
          <van-field
            v-model="formData.healthStatus"
            @click="showStatus = true"
            readonly
            placeholder="请选择"
            right-icon="arrow"
            :rules="[{ required: true}]"
          />
          <div
            v-for="(item,index) in formData.stuGuardian"
            :key="index"
          >
            <div class="connect">
              <span class="connect-title">{{index === 0 ? '第一监护人信息':'第二监护人信息'}}</span>
            </div>
            <div>
              <span class="info-title">姓名</span>
              <van-field
                v-model="item.name"
                placeholder="请填写真实姓名"
                :rules="[{ required: index=== 0 ? true : false}]"
              />
              <span class="info-title">与幼儿关系</span>
              <van-field
                v-model="item.familyRels"
                @click="getChildRel(index)"
                placeholder="请选择与幼儿关系"
                readonly
                right-icon="arrow"
                :rules="[{required: index=== 0 ? true : false}]"
              />
              <span class="info-title">联系电话</span>
              <van-field
                v-model="item.mobile"
                placeholder="请填写联系电话"
                :rules="[{ required: index=== 0 ? true : false}]"
              />
              <span class="info-title">身份证号</span>
              <van-field
                v-model="item.certNo"
                placeholder="请填写身份证号"
                :rules="[{ required: index=== 0 ? true : false}]"
              />
              <span class="info-title">工作单位(选填)</span>
              <van-field
                v-model="item.workUnit"
                placeholder="请填写工作单位"
              />
            </div>
          </div>
          <div class="footer">

            <van-button
              class="add-button"
              v-show="formData.stuGuardian.length === 1"
              @click="addGuardian"
            >
              <div style="display:flex;margin-top:10px;">
                <img
                  style="    display: block; width: 20px;height: 20px;margin-top: 5px;"
                  src="../assets/student/add.png"
                />
                <span style="margin-left:5px;margin-top:-5px">继续添加监护人</span>
              </div>
            </van-button>

            <div style="margin: 16px;">
              <van-button
                round
                block
                class="save-btn"
                native-type="submit"
              >提交学籍</van-button>
            </div>
          </div>

        </van-form>
      </div> -->
    </div>

    <van-popup
      v-model="showSelect"
      position="bottom"
    >
      <van-picker
        title="请选择"
        show-toolbar
        :columns="select"
        @confirm="getSelect"
        @cancel="showSelect = false"
      />
    </van-popup>
    <van-popup
      v-model="showArea"
      position="bottom"
    >
      <van-area
        :area-list="areaList"
        @confirm="getAddress"
        @cancel="showArea = false"
      />
    </van-popup>
    <van-popup
      v-model="showNation"
      position="bottom"
    >
      <van-picker
        title="请选择"
        show-toolbar
        :columns="nationList"
        @confirm="getNation"
        @cancel="showNation = false"
      />
    </van-popup>
    <van-popup
      v-model="showStatus"
      position="bottom"
    >
      <van-picker
        title="请选择"
        show-toolbar
        :columns="statusList"
        @confirm="getStatus"
        @cancel="showStatus = false"
      />
    </van-popup>
    <van-popup
      v-model="showRel"
      position="bottom"
    >
      <van-picker
        title="请选择"
        show-toolbar
        :columns="relList"
        @confirm="getRel"
        @cancel="showRel = false"
      />
    </van-popup>
  </div>
</template>

<script>

import axios from "axios";
import { areaList } from '@vant/area-data';
import imgCut from '../components/imgCut.vue'


export default {
  components: {
    imgCut
  },
  data() {
    return {
      areaList,
      active: 0,
      steps: [
        {
          value: 0,
          name: "基本信息",
        },
        {
          value: 1,
          name: "户籍信息",
        },
        {
          value: 2,
          name: "家庭信息",
        },
        {
          value: 3,
          name: "监护人信息",
        },
        {
          value: 4,
          name: "完成",
        },
      ],
      formData: {
        stuSex: "1",
        studentName: "",
        actualAddress: "",               // 实际居住地址
        actualDetailAddress: "",         // 详细地址
        birthTime: "", // 出生年月
        clazzId: "",                     // 班级
        clazzName: "",                     // 班级
        createInfo: "",
        createUser: "",
        description: "",
        remark: "",
        updateInfo: "",
        updateTime: "",
        updateUser: "",
        version: 0,
        enableStatus: 1,
        headerImg: "",                 // 证件照
        healthStatus: "",              // 健康状态
        huKou: "",                     // 户口所在地
        huKouAddress: "",             // 详细地址
        id: "",
        studentId: "",
        isLeftBehindChild: '',             // 是否为留守儿童
        isOnlyChild: '',                  // 是否为独生子女
        isPeasantWorker: '',             // 是否进城务工人员子女
        nation: "",                  // 民族
        nationality: "",            // 港澳台侨外
        schoolId: "",
        stuGuardian: [    // 监护人
          {
            certNo: "",  // 监护人身份证号
            familyRels: "", // 幼儿关系
            mobile: "", // 监护人电话
            name: "", // 监护人姓名
            workUnit: "" // 工作单位
          }
        ],
      },
      imgBoy: require('.././assets/student/boy.png'),
      imgGirl: require('.././assets/student/girl.png'),
      showNext: false,
      connect: [{
        certNo: "",  // 监护人身份证号
        familyRels: "", // 幼儿关系
        mobile: "", // 监护人电话
        name: "", // 监护人姓名
        workUnit: "" // 工作单位
      }],
      imgData: {},
      select: ['否', '是'
      ],
      selectName: "",
      img: require('../assets/student/student.png'),
      addType: '',
      nationList: ['非港澳台侨', '香港同胞', '香港同胞亲属', '澳门同胞',
        '澳门同胞亲属', '台湾同胞', '台湾同胞亲属', '华侨', '侨眷', '归侨',
        '归侨子女', '归国留学人员', '非华裔中国人', '外籍华裔人', '外国人', '其它'],
      showNation: false,
      showStatus: false,
      statusList: ['健康或良好', '一般或较弱', '有慢性病', '残疾'],
      relList: ['父子（父女）', '母子（母女）', '祖孙', '其他'],
      showArea: false,
      showSelect: false,
      childIndex: '',
      showRel: false,
      stuId: "",
      token: "",
      userId: "",
      selectVisible: false
    };
  },
  created() {

  },
  mounted() {
    if (window.location.search) {
      this.stuId = this.UrlParamHash('studentId')
      this.userId = this.UrlParamHash('userId')
      this.token = this.UrlParamHash('token')
      if (this.token) {
        this.getStudentFile()
      } else {
        this.$message.warning("获取信息失败!");
      }
    }
  },
  methods: {
    getStudentFile() {
      if (this.token) {
        let url = `${process.env['VUE_APP_BASE_API']}/schools/api/schoolRoll/queryByStu/${this.stuId}`
        axios
          .get(url, {
            headers: {
              token: this.token,
              userId: this.userId,
            }
          })
          .then((res) => {
            if (+res.data.code === 0) {
              console.log(res.data)
              this.formData = { ...res.data.data }
              this.imgData.attach = res.data.data.headerImg
            } else {
              this.getStudentInfo()
            }
          });
      }
    },
    getRel(data) {
      if (data) {
        this.formData.stuGuardian[this.childIndex].familyRels = data
        this.showRel = false
      }
    },
    getChildRel(data) {
      console.log(data)
      if (data !== undefined) {
        this.childIndex = data
        this.showRel = true;
      }
    },
    addGuardian() {
      this.formData.stuGuardian = [...this.formData.stuGuardian, ...this.connect]
    },
    //检查是否上传照片
    checkImg() {
      if (this.imgData.attach) {
        this.showNext = true;
      } else {
        this.$message.warning("请先上传证件照")
      }
    },
    // 获取学生信息
    getStudentInfo() {
      if (this.token) {
        let url = `${process.env['VUE_APP_BASE_API']}/schools/api/student/${this.stuId}`
        axios
          .get(url, {
            headers: {
              token: this.token,
              userId: this.userId,
            }
          })
          .then((res) => {
            if (+res.data.code === 0) {
              let { name, clazzName, clazzId, birthTime, schoolId } = res.data.data
              console.log(name)
              this.formData.studentName = name
              this.formData.clazzId = clazzId
              this.formData.clazzName = clazzName
              this.formData.birthTime = birthTime
              this.formData.schoolId = schoolId
              this.formData.studentId = this.stuId
            }
          });
      }
    },
    getStatus(data) {
      if (data) {
        this.formData.healthStatus = data
        this.showStatus = false
      }
    },
    getNation(data) {
      if (data) {
        this.formData.nationality = data
        this.showNation = false
      }
    },
    //打开地址选择
    setAddress(data) {
      if (data) {
        this.showArea = true;
        this.addType = data
        console.log(data, '选择地址')
      }
    },
    // 获取地址信息
    getAddress(data) {
      if (data) {
        let add = data
          .filter((item) => !!item)
          .map((item) => item.name)
          .join('/');
        if (this.addType == '0') {
          this.formData.huKou = add
        } else if (this.addType == '1') {
          this.formData.actualAddress = add
        }
        this.showArea = false
      }

    },
    //选择
    selectType(data) {
      if (data) {
        this.showSelect = true;
        this.selectName = data
      }
    },
    //获取选择数据
    getSelect(data) {
      if (data) {
        this.showSelect = false;
        if (this.selectName == '0') {
          this.formData.isOnlyChild = data
        } else if (this.selectName == '1') {
          this.formData.isLeftBehindChild = data
        } else if (this.selectName == '2') {
          this.formData.isPeasantWorker = data
        }
      }
    },
    UrlParamHash(queryName) {
      let query = decodeURI(window.location.search.substring(1))//将url转码
      let vars = query.split("&");//分割字符串，将url切割成数组形式的对象
      for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }//如果匹配输出结果
      }
      return null;
    },
    saveData() {
      if (this.token) {
        this.formData.headerImg = this.imgData.data
        console.log(JSON.stringify(this.formData))
        let data = {}
        data = { ...this.formData }
        axios({
          url: `${process.env['VUE_APP_BASE_API']}/schools/api/schoolRoll/save`,
          method: "put",
          data,
          headers: {
            token: this.token,
            userId: this.userId,
            schoolId: this.formData.schoolId
          },
        }).then((res) => {
          if (+res.data.code === 0) {
            this.$message.success("提交成功！")
            setTimeout(() => {
              if (micell.ua.isAndroid()) {
                window.WebViewJavascriptBridge.closeWindow()
              }
              if (micell.ua.isIOS()) {
                window.webkit.messageHandlers.closeWindow.postMessage("closeWindow")
              }
            }, 2000)
          }
        });
      }
    },
    getImgData(data) {
      if (data) {
        console.log(data)
        this.imgData = { ...data };
      }
    },

    showImgTypeSelect() { }

  },
  computed: {},
};
</script>
<style lang="less">
.show-box {
  width: 960px;
  height: 100%;
  background: linear-gradient(0deg, #46d2e8, #008fbc);
  box-shadow: 0px 2px 8px 0px;
}
.el-textarea__inner {
  height: 120px !important;
}
&::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  position: absolute;
  right: 0;
}
&::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  width: 6px;
  height: 90px;
  background-color: #bfbfbf;
  border-radius: 4px;
}
&::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 34, 68, 0.01);
  border-radius: 4px;
  background: rgba(0, 34, 68, 0);
}

.isActive {
  .el-step__head {
    color: #ffffff;
    .el-step__icon {
      background: #ff9900 !important;
      border-color: #ff9900;
    }
  }
}

.active {
  .el-step__head {
    color: #ffffff;
    .el-step__icon {
      background: #ff9900 !important;
      border-color: #ff9900;
    }
  }
}
.unActive {
  .el-step__head {
    color: #666666;
    .el-step__icon {
      background: #fce9d7 !important;
      border-color: #fce9d7;
    }
  }
}
.rotationtiao {
  span {
    width: 80px;
    margin-left: -18px;
    display: block;
    margin-top: 10px;
  }
}
.active-icon {
  width: 9px;
  height: 9px;
  background: #fff564;
  border-radius: 50%;
  opacity: 1;
}
</style>
<style  lang="less" scoped>
.studentFile {
  width: 100%;
  background: url("../assets/student/back.png") no-repeat #ff9f3d;
  background-size: 100% auto;
  .step {
    padding-top: 10px;
    background-color: #ffffff;
  }
  .notice {
    padding: 10px;
    width: 100%;
    height: 100px;

    span {
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 2px;
      opacity: 1;
    }
  }

  .student-content {
    width: 98%;
    margin: auto;
    border-radius: 10px;
    .title {
      margin-left: 10px;
      font-size: 24px;
      font-weight: 600;
      line-height: 67px;
      color: #1c1c1c;
      letter-spacing: 3px;
      opacity: 1;
    }
    .info {
      margin: 20px;
    }
    .info-title {
      font-size: 15px;
      font-weight: 400;
      color: #8a8a8a;
    }
    .student-img {
      margin: auto;
      img {
        // width: 100px;
        display: block;
        margin: auto;
        width: 130px;
        height: 180px;
        object-fit: cover;
        background: #ff8888;
        opacity: 1;
        border-radius: 12px;
      }
      span {
        width: 130px;
        display: block;
        margin: auto;
        margin-top: 10px;
      }
    }
    .submit {
      width: 100%;
      .submit-button {
        width: 85%;
        height: 55px;
        background: #ffaa53;
        opacity: 1;
        border-radius: 9px;
        font-size: 16px;
        color: #ffffff;
        display: block;
        margin: auto;
        margin-bottom: 10px;
      }
    }
    .student-list {
      margin: 20px;
    }
    .connect {
      width: 100vw;
      margin: 0px;
      height: 40px;
      margin-left: -20px;
      margin-bottom: 20px;
      background: #f6f7f9;
      .connect-title {
        display: block;
        margin-left: 20px;
        padding-top: 15px;
        font-size: 15px;
        font-weight: 500;
        color: #1c1c1c;
        opacity: 1;
      }
    }
    .footer {
      width: 100vw;
      background: #f6f7f9;
      height: 300px;
      padding-top: 10px;
      margin-left: -20px;
      .add-button {
        margin-top: 20px;
        background: #ffffff;
        opacity: 1;
        width: 100%;
        height: 65px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 600;
        line-height: 46px;
        color: #afafb4;
      }
      .save-btn {
        opacity: 1;
        width: 100%;
        height: 55px;
        font-size: 16px;
        font-family: PingFang SC;
        color: #ffffff;
        font-weight: 500;
        line-height: 46px;
        background: #ffaa53;
        opacity: 1;
        border-radius: 9px;
      }
    }
    .form {
      background-color: #ffffff;
      margin-top: 50px;
      height: 60vh;
    }
  }

  .van-cell {
    height: 45px;
    margin-top: 5px;
    text-align: right;
    margin-bottom: 20px;
    padding: 10px 0 0 0;
    border-bottom: 1px solid #eee;
    /deep/.van-cell__title {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 46px;
      color: #25262b;
      opacity: 1;
      margin-top: -10px;
      display: block;
    }
    /deep/.van-field__control {
      font-size: 14px;
      font-weight: 400;
      opacity: 1;
    }
  }
}
</style>
