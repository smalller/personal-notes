<template>
  <!-- 园所新增编辑 -->
  <div class="informationEdit">
    <el-form
      ref="dataForm"
      :model="editData"
      label-width="120px"
      style="margin-bottom: 30px"
    >
      <!-- 基础信息-->
      <el-row>
        <h2 :style="{ marginBottom: '20px' }">
          {{ type === 0 ? '新增' : '修改' }}园所
        </h2>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="name"
            :rules="filterRules({ required: true, msg: '名称不可为空' })"
            label="园所名称"
          >
            <el-input
              v-model="editData.name"
              placeholder="请输入"
              maxlength="40"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="abutment"
            :rules="filterRules({ required: true, msg: '对接负责人不可为空' })"
            label="对接负责人"
          >
            <el-input
              v-model="editData.abutment"
              placeholder="请输入"
              maxlength="40"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="contactName"
            label="联系人姓名"
            :rules="filterRules({ required: true, msg: '姓名不可为空' })"
          >
            <el-input
              v-model="editData.contactName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="contactMobile"
            label="联系人手机号"
            :rules="
              filterRules({
                required: true,
                type: 'mobile',
                msg: '手机号不能为空',
              })
            "
          >
            <el-input
              v-model="editData.contactMobile"
              placeholder="请输入"
              maxlength="13"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div>
          <el-form-item
            prop="proId"
            label="所在省市"
            style="width: 250px"
            :rules="filterRules({ required: true, msg: '请选择省' })"
          >
            <div style="display: inline-flex">
              <el-select
                v-model="editData.proId"
                placeholder="请选择省"
                style="width: 150px"
                @change="proChange"
              >
                <el-option
                  v-for="(item, index) in city_list"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                v-if="cList.length"
                v-model="editData.cityId"
                placeholder="请选择市"
                style="width: 150px"
                @change="cityChange"
              >
                <el-option
                  v-for="(item, index) in cList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>

              <el-select
                v-if="areaList.length"
                v-model="editData.areId"
                style="width: 150px"
                placeholder="请选择区"
              >
                <el-option
                  v-for="(item, index) in areaList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <!-- <el-form-item
            v-if="cList.length"
            prop="cityId"
            style="width: 250px"
            :rules="
              filterRules({
                required: true,
                msg: '请选择市',
              })
            "
          >

          </el-form-item>
          <el-form-item
            v-if="areaList.length"
            prop="areId"
            style="width: 250px"
            :rules="
              filterRules({
                required: true,
                msg: '请选择区',
              })
            "
          >

          </el-form-item> -->
        </div>
      </el-row>
      <el-row>
        <el-form-item
          prop="time"
          label="开通时间"
          :rules="
            filterRules({
              required: true,
              msg: '请选择开通时间',
            })
          "
        >
          <el-date-picker
            v-model="editData.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
  import { getAllAreaById, getAreaById } from '@/cms/api/commonArea'
  import { mapGetters } from 'vuex'
  import { addSchool, updateSchool } from '@/cms/api/information'
  export default {
    name: 'InformationEdit',
    data() {
      return {
        editData: {
          time: [],
          name: '', //园所姓名
          id: '', //园所id
          contactName: '', //联系人姓名
          contactMobile: '', //联系人手机号
          proId: '', //省id
          cityId: '', //市级id
          areId: '', //区id
          abutment: '',
        }, //提交的数据
        type: 0, //默认为新增 1 编辑
        cList: [], //城市列表
        areaList: [], //区域列表
      }
    },
    computed: {
      ...mapGetters({
        city_list: 'code_list/city_list',
      }),
    },
    mounted() {
      const vm = this
    },
    methods: {
      //选择省
      proChange(e) {
        console.log(e)
        const vm = this
        vm.editData.cityId = ''
        vm.editData.areId = ''
        vm.cList.splice(0)
        vm.areaList.splice(0)
        let direct = vm.city_list.find((item) => item.id === e).directly
        return getAllAreaById(e.toString()).then((res) => {
          console.log('查询的城市', res)
          if (+res.code === 0) {
            if (+direct === 1) {
              vm.editData.cityId = res.data.info[0].id
              vm.cityChange(res.data.info[0].id)
              return
            }
            vm.cList = res.data.info
          }
        })
      },
      //城市变化
      cityChange(e) {
        const vm = this
        vm.editData.areId = ''
        vm.areaList.splice(0)
        return getAllAreaById(e.toString()).then((res) => {
          console.log('查询的区域', res)
          if (+res.code === 0) {
            vm.areaList = res.data.info
          }
        })
      },
      //时间变化
      timeChange(e) {
        console.log(e)
      },
      //保存或修改
      save() {
        const vm = this
        vm.$refs.dataForm.validate((valid) => {
          if (valid) {
            let { proId, cityId, areId, time } = vm.editData
            let { city_list, areaList, cList } = vm
            let [beginDate, endDate] = time
            let proName = city_list.find((item) => +item.id === +proId).name
            let city = cList.find((item) => +item.id === +cityId)
            let cityName = ''
            city && (cityName = city.name)
            let areaName = areaList.find((item) => +item.id === +areId).name
            let address = proName + cityName + areaName
            let areaId = [proId, cityId, areId].join(',')
            let obj = Object.assign(
              { beginDate, endDate, address, areaId },
              vm.editData
            )
            console.log(obj)
            obj.agentCompanyId = vm.$cookie.get(`${firmId}_company_id`)
            if (+vm.type === 0) {
              addSchool(obj).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success(res.msg)
                  vm.$emit('close')
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            } else {
              updateSchool(obj, obj.id).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success(res.msg)
                  vm.$emit('close')
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            }
          }
        })
      },
      //编辑时初始化数据
      init(data) {
        const vm = this
        vm.type = 1
        let time = [data.beginDate, data.endDate]
        let [a, b, c] = data.areaId.split(',')
        Promise.all([vm.proChange(a), vm.cityChange(b)]).finally(() => {
          vm.editData.proId = a.toString()
          vm.editData.cityId = b.toString()
          vm.editData.areId = c.toString()
        })
        // vm.proChange(a)
        // vm.cityChange(b)
        for (let key in vm.editData) {
          Object.keys(data).forEach((k) => {
            if (k === key) {
              vm.editData[key] = data[key]
            }
          })
        }
        console.log(vm.editData)
        vm.$forceUpdate()
        vm.editData.time = time
      },
    },
  }
</script>

<style lang="scss">
  .el-dialog__header {
    padding: 0 !important;
  }
  .informationEdit {
    .dialog-footer {
      text-align: right;
    }
  }
</style>
