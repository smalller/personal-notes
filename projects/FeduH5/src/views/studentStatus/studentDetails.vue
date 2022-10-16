<template>
  <div class="studentDetails">
    <my-head
      title="学籍录入"
      @leftClick="backClick"
    >
      <template #right>
        <!--        <div class="headBtn">填报说明</div>-->
      </template>
    </my-head>
    <div class="studentDetailsContent">
      <div class="infoContent">
        <div class="infoTitle">
          <span>户籍信息</span>
        </div>
        <div class="infoBody">
          <van-form
            validate-first
            label-width="100"
            input-align="right"
            ref="form"
          >

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.nationality"
              :rules="[{ required: true, message: '请选择国籍/地区' }]"
              label="国籍"
              placeholder="请选择"
              right-icon="arrow"
              @click="nationalityShow = true"
            />
            <van-popup
              v-model="nationalityShow"
              style="overflow-x: hidden"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('国籍',excelData)"
                @confirm="selectNationality"
                @cancel="nationalityShow = false"
              />
              <!--              <van-index-bar style="height: 100vh;overflow-y: auto">-->
              <!--                 <van-cell-->
              <!--                    @click="selectNationality(country)"-->
              <!--                    v-for="country in hotCity"-->
              <!--                    :key="country"-->
              <!--                    :title="country"-->
              <!--                  />-->
              <!--                <div-->
              <!--                  v-for="item in cityList"-->
              <!--                  :key="item.key"-->
              <!--                >-->
              <!--                  <van-index-anchor :index="item.key" />-->
              <!--                  <van-cell-->
              <!--                    @click="selectNationality(country)"-->
              <!--                    v-for="country in item.data"-->
              <!--                    :key="country"-->
              <!--                    :title="country"-->
              <!--                  />-->
              <!--                </div>-->
              <!--              </van-index-bar>-->
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.nation"
              label="民族"
              :disabled="!isChina"
              right-icon="arrow"
              :rules="[{ required: isChina, message: '请选择民族' }]"
              :placeholder="!isChina?'不可填':'请选择'"
              @click="nationShow = true"
            />
            <van-popup
              v-model="nationShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('民族',excelData)"
                @confirm="selectNation"
                @cancel="nationShow = false"
              />
              <!--              <van-index-bar style="height: 100vh;overflow-y: auto">-->
              <!--                <div-->
              <!--                  v-for="item in cityList"-->
              <!--                  :key="item.key"-->
              <!--                >-->
              <!--                  &lt;!&ndash; <van-index-anchor  :index="item.key" /> &ndash;&gt;-->
              <!--                  <van-cell-->
              <!--                    v-for="item in getExcelData('民族', excelData)"-->
              <!--                    :key="item"-->
              <!--                    @click="selectNation(item)"-->
              <!--                    :title="item"-->
              <!--                  />-->
              <!--                </div>-->
              <!--              </van-index-bar>-->
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.overSeas"
              label="港澳台侨外"
              placeholder="请选择"
              right-icon="arrow"
              @click="overSeasShow = true"
            />
            <van-popup
              v-model="overSeasShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('港澳台侨外',excelData)"
                @confirm="selectOverSeas"
                @cancel="overSeasShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.birthPlace"
              label="出生所在地"
              :disabled="!isChina"
              :rules="[{ required: isChina, message: '请选择出生所在地' }]"
              :placeholder="!isChina?'不可填':'请选择'"
              right-icon="arrow"
              @click="birthPlaceShow = true"
            />
            <van-popup
              v-model="birthPlaceShow"
              position="bottom"
            >
              <van-area
                title="出生所在地"
                :area-list="areaList"
                @confirm="selectBirthPlace"
                @cancel="birthPlaceShow = false"
                value="110101"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.nativePlace"
              label="籍贯"
              placeholder="请选择"
              right-icon="arrow"
              @click="nativePlaceShow = true"
            />
            <van-popup
              v-model="nativePlaceShow"
              position="bottom"
            >
              <van-area
                title="出生所在地"
                :area-list="areaList"
                @confirm="selectNativePlace"
                @cancel="nativePlaceShow = false"
                value="110101"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.huKouNature"
              label="户口性质"
              :disabled="!isChina"
              :placeholder="!isChina?'不可填':'请选择'"
              right-icon="arrow"
              @click="HuKouNatureShow = true"
            />
            <van-popup
              v-model="HuKouNatureShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('户口性质',excelData)"
                @confirm="selectHuKouNature"
                @cancel="HuKouNatureShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.huKouType"
              label="非农业户口类型"
              :rules="!isChina||formData.huKouInfoPos.huKouNature ==='农业户口'?[]:[{ required: isChina, message: '请选择是否为非农业户口类型' }]"
              :placeholder="!isChina||formData.huKouInfoPos.huKouNature ==='农业户口'?'不可填':'请选择'"
              :disabled="!isChina||formData.huKouInfoPos.huKouNature ==='农业户口'"
              right-icon="arrow"
              @click="HuKouTypeShow = true"
            />
            <van-popup
              v-model="HuKouTypeShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('非农业户口类型',excelData)"
                @confirm="selectHuKouType"
                @cancel="HuKouTypeShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.huKouLocation"
              label="户口所在地"
              :disabled="!isChina"
              :rules="[{ required: isChina, message: '请选择户口所在地' }]"
              :placeholder="!isChina?'不可填':'请选择'"
              right-icon="arrow"
              @click="HuKouLocationShow = true"
            />
            <van-popup
              v-model="HuKouLocationShow"
              position="bottom"
            >
              <van-area
                title="标题"
                :area-list="areaList"
                @confirm="selectHuKouLocation"
                @cancel="HuKouLocationShow = false"
                value="110101"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.huKouInfoPos.actualAddress"
              label="现住址"
              placeholder="请选择"
              right-icon="arrow"
              @click="actualAddressShow = true"
            />
            <van-popup
              v-model="actualAddressShow"
              position="bottom"
            >
              <van-area
                title="标题"
                :area-list="areaList"
                @confirm="selectActualAddress"
                @cancel="actualAddressShow = false"
                value="110101"
              />
            </van-popup>

            <van-field
              label="现详细住址"
              v-model="formData.huKouInfoPos.actualDetailAddress"
              placeholder="请输入"
              @blur="focusOrBlur($event, 'blur')"
              @focus="focusOrBlur($event, 'focus')"
            />

          </van-form>
        </div>
      </div>

      <div class="infoContent">
        <div class="infoTitle">
          <span>家庭信息</span>
        </div>
        <div class="infoBody">
          <van-form
            validate-first
            ref="form2"
            label-width="200"
            input-align="right"
          >
            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.studyMode"
              label="就读方式"
              :rules="[{ required: true, message: '请选择就读方式' }]"
              placeholder="请选择"
              right-icon="arrow"
              @click="studyModeShow = true"
            />
            <van-popup
              v-model="studyModeShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('就读方式',excelData)"
                @confirm="selectStudyMode"
                @cancel="studyModeShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.isOnlyChild"
              :rules="[{ required: isChina, message: '请选择是否独生子女' }]"
              :disabled="!isChina"
              label="是否独生子女"
              :placeholder="!isChina?'不可填':'请选择'"
              right-icon="arrow"
              @click="isOnlyChildShow = true"
            />
            <van-popup
              v-model="isOnlyChildShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="userTypes"
                @confirm="selectIsOnlyChild"
                @cancel="isOnlyChildShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.isLeftBehindChild"
              :rules="[{ required: isChina, message: '请选择是否留守儿童' }]"
              label="是否留守儿童"
              right-icon="arrow"
              :disabled="!isChina"
              :placeholder="!isChina?'不可填':'请选择'"
              @click="isLeftBehindChildShow = true"
            />
            <van-popup
              v-model="isLeftBehindChildShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('是否留守儿童',excelData)"
                @confirm="selectIsLeftBehindChild"
                @cancel="isLeftBehindChildShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.isPeasantWorker"
              :rules="[{ required: isChina, message: '请选择是否进城务工人员子女' }]"
              label="是否进城务工人员子女"
              :disabled="!isChina"
              :placeholder="!isChina?'不可填':'请选择'"
              right-icon="arrow"
              @click="isPeasantWorkerShow = true"
            />
            <van-popup
              v-model="isPeasantWorkerShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="userTypes"
                @confirm="selectIsPeasantWorker"
                @cancel="isPeasantWorkerShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.healthStatus"
              label="健康状况"
              :rules="[{ required: true, message: '请选择健康状况' }]"
              placeholder="请选择"
              right-icon="arrow"
              @click="healthStatusShow = true"
            />
            <van-popup
              v-model="healthStatusShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('健康状况',excelData)"
                @confirm="selectHealthStatus"
                @cancel="healthStatusShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.isDisabledChild"
              label="是否残疾幼儿"
              :rules="[{ required: true, message: '请选择是否残疾幼儿' }]"
              placeholder="请选择"
              right-icon="arrow"
              @click="isDisabledChildShow = true"
            />
            <van-popup
              v-model="isDisabledChildShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="userTypes"
                @confirm="selectIsDisabledChild"
                @cancel="isDisabledChildShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.disabilityLevel"
              label="残疾幼儿类别"
              :disabled="formData.familyInfoPos.isDisabledChild !== '是'"
              :placeholder="formData.familyInfoPos.isDisabledChild !== '是'?'不可填':'请选择'"
              right-icon="arrow"
              @click="disabilityLevelShow = true"
            />
            <van-popup
              v-model="disabilityLevelShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('残疾幼儿类别',excelData)"
                @confirm="selectDisabilityLevel"
                @cancel="disabilityLevelShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.familyInfoPos.isOrphan"
              label="是否孤儿"
              placeholder="请选择"
              right-icon="arrow"
              :rules="[{ required: true, message: '请选择是否孤儿' }]"
              @click="isOrphanShow = true"
            />
            <van-popup
              v-model="isOrphanShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="userTypes"
                @confirm="selectIsOrphan"
                @cancel="isOrphanShow = false"
              />
            </van-popup>
          </van-form>
        </div>
      </div>

      <div class="infoContent">
        <div class="infoTitle">
          <span>第一监护人</span>
        </div>
        <div class="infoBody">
          <van-form
            validate-first
            ref="form3"
            input-align="right"
          >
            <van-field
              label="姓名"
              name="stuGuardianName"
              v-model="formData.stuGuardian.name"
              :rules="[{ required: true, message: '请填写姓名' }]"
              placeholder="请输入"
            />

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.stuGuardian.nation"
              :rules="[{ required: true, message: '请选择民族' }]"
              label="民族"
              placeholder="请选择"
              right-icon="arrow"
              @click="stuGuardianNationShow = true"
            />

            <van-popup
              v-model="stuGuardianNationShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('民族',excelData)"
                @confirm="selectStuGuardianNation"
                @cancel="stuGuardianNationShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.stuGuardian.familyRels"
              label="与幼儿关系"
              placeholder="请选择"
              right-icon="arrow"
              :rules="[{ required: true, message: '请选择与幼儿关系' }]"
              @click="stuGuardianFamilyRelsShow = true"
            />
            <van-popup
              v-model="stuGuardianFamilyRelsShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="familyRelList"
                @confirm="stuGuardianFamilyRels"
                @cancel="stuGuardianFamilyRelsShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.stuGuardian.cerType"
              label="身份证件类型"
              placeholder="请选择"
              right-icon="arrow"
              :rules="[{ required: true, message: '请选择身份证件类型' }]"
              @click="stuGuardianCerTypeShow = true"
            />
            <van-popup
              v-model="stuGuardianCerTypeShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('监护人身份证件类型',excelData)"
                @confirm="stuGuardianCerType"
                @cancel="stuGuardianCerTypeShow = false"
              />
            </van-popup>

            <van-field
              label="证件号码"
              :rules="formData.stuGuardian.cerType==='居民身份证'?[{ required: true, message: '请输入证件号码' },{pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message: '请输入正确的号码'}]:[]"
              v-model="formData.stuGuardian.certNo"
              placeholder="请输入"
              @blur="focusOrBlur($event, 'blur')"
              @focus="focusOrBlur($event, 'focus')"
            />

            <van-field
              label="工作单位"
              v-model="formData.stuGuardian.workUnit"
              placeholder="请输入"
              @blur="focusOrBlur($event, 'blur')"
              @focus="focusOrBlur($event, 'focus')"
            />

            <van-field
              label="联系电话"
              :rules="[{ required: true, message: '请输入联系电话' },{pattern:/^[1]([3-9])[0-9]{9}$/,message:'请输入正确的手机号'}]"
              v-model="formData.stuGuardian.mobile"
              placeholder="请输入"
              @blur="focusOrBlur($event, 'blur')"
              @focus="focusOrBlur($event, 'focus')"
            />

          </van-form>
        </div>
      </div>

      <div class="infoContent">
        <div
          class="infoTitle"
          @click="isShowStuGuardian2 = true"
        >
          <span>第二监护人</span>
          <span
            class="titleBtn"
            v-if="!isShowStuGuardian2"
          >选填</span>
        </div>
        <div
          class="infoBody"
          v-if="isShowStuGuardian2"
        >
          <van-form
            validate-first
            input-align="right"
          >
            <van-field
              label="姓名"
              v-model="formData.stuGuardian2.name"
              :rules="[{ required: true, message: '请填写姓名' }]"
              placeholder="请输入"
            />

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.stuGuardian2.nation"
              :rules="[{ required: true, message: '请选择民族' }]"
              label="民族"
              placeholder="请选择"
              right-icon="arrow"
              @click="stuGuardian2NationShow = true"
            />

            <van-popup
              v-model="stuGuardian2NationShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('民族',excelData)"
                @confirm="selectStuGuardian2Nation"
                @cancel="stuGuardian2NationShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.stuGuardian2.familyRels"
              label="与幼儿关系"
              placeholder="请选择"
              right-icon="arrow"
              :rules="[{ required: true, message: '请选择与幼儿关系' }]"
              @click="stuGuardian2FamilyRelsShow = true"
            />
            <van-popup
              v-model="stuGuardian2FamilyRelsShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="familyRelList"
                @confirm="stuGuardian2FamilyRels"
                @cancel="stuGuardian2FamilyRelsShow = false"
              />
            </van-popup>

            <van-field
              readonly
              clickable
              name="picker"
              :value="formData.stuGuardian2.cerType"
              label="身份证件类型"
              placeholder="请选择"
              right-icon="arrow"
              :rules="[{ required: true, message: '请选择身份证件类型' }]"
              @click="stuGuardian2CerTypeShow = true"
            />
            <van-popup
              v-model="stuGuardian2CerTypeShow"
              position="bottom"
            >
              <van-picker
                show-toolbar
                :columns="getExcelData('监护人身份证件类型',excelData)"
                @confirm="stuGuardian2CerType"
                @cancel="stuGuardian2CerTypeShow = false"
              />
            </van-popup>

            <van-field
              label="证件号码"
              :rules="formData.stuGuardian2.cerType==='居民身份证'?[{ required: true, message: '请输入证件号码' },{pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message: '请输入正确的号码'}]:[]"
              v-model="formData.stuGuardian2.certNo"
              placeholder="请输入"
              @blur="focusOrBlur($event, 'blur')"
              @focus="focusOrBlur($event, 'focus')"
            />

            <van-field
              label="工作单位"
              v-model="formData.stuGuardian2.workUnit"
              placeholder="请输入"
              @blur="focusOrBlur($event, 'blur')"
              @focus="focusOrBlur($event, 'focus')"
            />

            <van-field
              label="联系电话"
              :rules="[{ required: true, message: '请输入联系电话' },{pattern:/^[1]([3-9])[0-9]{9}$/,message:'请输入正确的手机号'}]"
              v-model="formData.stuGuardian2.mobile"
              placeholder="请输入"
              @blur="focusOrBlur($event, 'blur')"
              @focus="focusOrBlur($event, 'focus')"
            />

          </van-form>
        </div>
      </div>
      <div
        class="nextBtn"
        @click="save"
      >提交</div>
      <apple-bar />
    </div>
  </div>
</template>

<script>
import MyHead from "@/views/userCamera/component/head";
import AppleBar from "@/components/appleBar";
import country from '@/base/country.js'
import { areaList } from '@vant/area-data';
import { mapGetters } from 'vuex';
import qs from "qs";

export default {
  name: "studentDetails",
  components: { AppleBar, MyHead },
  data() {
    return {
      id: '',
      isChina: true,
      cityList: country.cityList,
      hotCity: country.hotCity,
      areaList: areaList,
      formData: {
        huKouInfoPos: {},
        familyInfoPos: {},
        stuGuardian: {},
        stuGuardian2: {}
      },
      nationalityShow: false,
      birthPlaceShow: false,
      overSeasShow: false,
      nationShow: false,
      nativePlaceShow: false,
      HuKouNatureShow: false,
      HuKouTypeShow: false,
      HuKouLocationShow: false,
      actualAddressShow: false,
      studyModeShow: false,
      isOnlyChildShow: false,
      isLeftBehindChildShow: false,
      isPeasantWorkerShow: false,
      healthStatusShow: false,
      isDisabledChildShow: false,
      disabilityLevelShow: false,
      isOrphanShow: false,
      stuGuardianNationShow: false,
      stuGuardianFamilyRelsShow: false,
      stuGuardianCerTypeShow: false,
      stuGuardian2NationShow: false,
      stuGuardian2FamilyRelsShow: false,
      stuGuardian2CerTypeShow: false,
      userTypes: ['是', '否'],
      familyRelList: ['爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '哥哥', '姐姐', '舅舅'],
      isShowStuGuardian2: false,
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getStudentStatus()
  },
  computed: {
    ...mapGetters(['excelData', 'studentInfo', 'userId', 'token'])
  },
  methods: {
    focusOrBlur(ev, type) {
      console.log(ev.style, '99999999999999')
      if (type === 'focus') {
        ev.target.style.position = 'sticky'
      } else if (type === 'blur') {
        ev.target.style.position = 'none'
      }
    },
    backClick() {
      this.$router.back()
    },
    getExcelData: (key, data = []) => {
      return data.find(item => item.key === key)?.data || []
    },
    onFailed() { },
    //国籍选择
    selectNationality(val) {
      console.log(val)
      this.formData.huKouInfoPos.nationality = val
      this.isChina = this.formData.huKouInfoPos.nationality.indexOf('中国') > -1
      this.nationalityShow = false;
    },
    //民族选择
    selectNation(val) {
      this.formData.huKouInfoPos.nation = val;
      this.nationShow = false
    },
    //港澳台侨外选择
    selectOverSeas(val) {
      console.log(val)
      this.formData.huKouInfoPos.overSeas = val;
      // this.$set(this.formData.huKouInfoPos,'overSeas',val);
      this.overSeasShow = false
    },
    //出生地选择
    selectBirthPlace(val) {
      console.log(val)
      this.formData.huKouInfoPos.birthPlace = val.map(item => item.name).join('-')
      this.birthPlaceShow = false
    },
    //籍贯选择
    selectNativePlace(val) {
      this.formData.huKouInfoPos.nativePlace = val.map(item => item.name).join('-');
      this.nativePlaceShow = false
    },
    //户口性质选择
    selectHuKouNature(val) {
      console.log(val)
      this.formData.huKouInfoPos.huKouNature = val
      this.HuKouNatureShow = false
      if (val === '农业户口') {
        this.formData.huKouInfoPos.huKouType = ''
      }
    },
    //非农业户口类型选择
    selectHuKouType(val) {
      this.formData.huKouInfoPos.huKouType = val
      this.HuKouTypeShow = false
    },
    //户口所在地选择
    selectHuKouLocation(val) {
      this.formData.huKouInfoPos.huKouLocation = val.map(item => item.name).join('-')
      this.HuKouLocationShow = false
    },
    //现住址选择
    selectActualAddress(val) {
      this.formData.huKouInfoPos.actualAddress = val.map(item => item.name).join('-')
      this.actualAddressShow = false
    },
    //就读方式选择
    selectStudyMode(val) {
      this.formData.familyInfoPos.studyMode = val
      this.studyModeShow = false
    },
    //是否独生子女
    selectIsOnlyChild(val) {
      this.formData.familyInfoPos.isOnlyChild = val
      this.isOnlyChildShow = false
    },
    //是否留守儿童
    selectIsLeftBehindChild(val) {
      this.formData.familyInfoPos.isLeftBehindChild = val
      this.isLeftBehindChildShow = false
    },
    //是否进城务工人员子女
    selectIsPeasantWorker(val) {
      this.formData.familyInfoPos.isPeasantWorker = val
      this.isPeasantWorkerShow = false
    },
    //健康状况选择
    selectHealthStatus(val) {
      this.formData.familyInfoPos.healthStatus = val
      this.healthStatusShow = false
    },
    //是否残疾幼儿
    selectIsDisabledChild(val) {
      this.formData.familyInfoPos.isDisabledChild = val
      this.isDisabledChildShow = false
      if (val === '否') {
        this.formData.familyInfoPos.disabilityLevel = ''
      }
    },
    //残疾幼儿类别选择
    selectDisabilityLevel(val) {
      this.formData.familyInfoPos.disabilityLevel = val
      this.disabilityLevelShow = false
    },
    //是否孤儿
    selectIsOrphan(val) {
      this.formData.familyInfoPos.isOrphan = val
      this.isOrphanShow = false
    },
    //第一监护人民族选择
    selectStuGuardianNation(val) {
      this.formData.stuGuardian.nation = val
      this.stuGuardianNationShow = false
    },
    //第一监护人与幼儿关系选择
    stuGuardianFamilyRels(val) {
      this.formData.stuGuardian.familyRels = val
      this.stuGuardianFamilyRelsShow = false
    },
    //第一监护人身份证件类型选择
    stuGuardianCerType(val) {
      this.formData.stuGuardian.cerType = val
      this.stuGuardianCerTypeShow = false
    },
    //第二监护人民族选择
    selectStuGuardian2Nation(val) {
      this.formData.stuGuardian2.nation = val
      this.stuGuardian2NationShow = false
    },
    //第二监护人与幼儿关系选择
    stuGuardian2FamilyRels(val) {
      this.formData.stuGuardian2.familyRels = val
      this.stuGuardian2FamilyRelsShow = false
    },
    //第二监护人身份证件类型选择
    stuGuardian2CerType(val) {
      this.formData.stuGuardian2.cerType = val
      this.stuGuardian2CerTypeShow = false
    },
    selectUserType() { },
    save() {
      // this.$refs.form.validate().then(() => {
      //   this.$refs.form2.validate().then(() => {
      //     this.$refs.form3.validate().then(() => {

      //       })
      //   })
      // })

      Promise.all([this.$refs.form.validate(), this.$refs.form2.validate(), this.$refs.form3.validate()]).then(() => {
        this.formData.id = this.id
        this.formData.enableStatus = 1
        this.$request('/schools/api/schoolRoll/save', {
          method: 'put',
          'data': this.formData
        }).then(res => {
          console.log(res)
          if (+res.code === 0) {
            this.$router.push({
              name: 'studentInfo',
              query: {
                studentId: this.studentInfo.studentId,
                id: res.data
              }
            })
          } else {
            vant.Notify({ type: 'warning', message: res.msg });
          }
        })
      }).catch(err => {
        console.log(err)
        vant.Toast({
          message: '缺少参数',
          position: 'bottom',
        })
      })
    },

    getStudentStatus() {
      console.log(this.studentInfo)
      this.$request(`/schools/api/schoolRoll/queryByStu/${this.studentInfo.studentId}`, {
        method: 'get'
      }).then(res => {
        if (+res.code === 0) {
          this.formData = JSON.parse(JSON.stringify(res.data))
          this.imgUrl = res.data.headerImg
          this.formData.headerImg = res.data.headerId
          if (!this.formData?.huKouInfoPos) {
            this.formData.huKouInfoPos = {}
          } else {
            if (this.formData.huKouInfoPos?.nationality) {
              this.isChina = this.formData.huKouInfoPos.nationality.indexOf('中国') > -1
            }
          }
          if (!this.formData?.familyInfoPos) {
            this.formData.familyInfoPos = {}
          }
          if (!this.formData?.stuGuardian) {
            this.formData.stuGuardian = {}
          }
          if (!this.formData?.stuGuardian2) {
            this.formData.stuGuardian2 = {}
          }
        }
      })
    },
  },

}
</script>

<style  lang="less">
.studentDetails {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .nextBtn {
    margin-top: 14px;
    width: 100%;
    height: 55px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ff8100;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    &:active {
      background: rgba(255, 255, 255, 0.9);
    }
  }
  .van-field--disabled {
    pointer-events: none;
  }
  .van-field__error-message {
    position: absolute;
    bottom: -18px;
  }
  .van-field__label {
    font-size: 16px;
    font-weight: 500;
    color: #1c1c1c;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
  .van-field {
    height: 50px;
    line-height: 30px;
    // position: sticky;
    bottom: 0;
    .van-field__right-icon {
      color: #c4c4c6;
      position: absolute;
      right: -20px;
    }
  }
  .headBtn {
    color: #ff9f3d;
    font-size: 16px;
  }
  .studentDetailsContent {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    background: #ff9f3d;
    padding: 10px 16px;
    .infoContent {
      //padding: 18px 16px;
      background: #ffffff;
      border-radius: 10px;
      margin-bottom: 10px;
      overflow: hidden;
      transition: all 0.5s;
      .infoTitle {
        padding: 14px 16px;
        display: flex;
        align-items: center;
        position: relative;
        background: linear-gradient(
          90deg,
          rgba(255, 159, 61, 0.16) 0%,
          rgba(255, 115, 62, 0.16) 100%
        );
        span {
          color: #1c1c1c;
          font-weight: bold;
          font-size: 20px;
        }
        &::before {
          content: "";
          display: inline-block;
          width: 3px;
          height: 20px;
          background: #ff9f3d;
          border-radius: 4px;
          margin-right: 5px;
        }
        .titleBtn {
          position: absolute;
          right: 16px;
          font-weight: 400;
          color: #666666;
          font-size: 16px;
        }
      }
      .infoBody {
        background: #ffffff;
        padding: 0 16px;
      }
    }
  }
}
</style>
