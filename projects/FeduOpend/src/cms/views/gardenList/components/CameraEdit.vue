<template>
  <!-- 摄像头新增或编辑 -->
  <div class="informationEdit common">
    <el-form
      ref="dataForm"
      :model="editData"
      label-width="160px"
      style="margin-bottom: 30px"
    >
      <!--      基础信息-->
      <el-row style="margin: 30px 0">
        <h2>{{ type === 0 ? '新增' : '修改' }}摄像头</h2>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item label="所属幼儿园">
            <span>{{ schoolData.name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="clazzIds"
            :rules="filterRules({ required: true, msg: '班级不可为空' })"
            label="所属班级"
          >
            <el-select
              v-model="editData.clazzIds"
              multiple
              placeholder="请选择班级"
            >
              <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="cameraType"
            :rules="
              filterRules({ required: true, msg: '请选择是否加入明厨亮灶' })
            "
            label="是否加入明厨亮灶"
          >
            <div>
              <el-radio-group v-model="editData.cameraType" size="small">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="startTime"
            :rules="filterRules({ required: true, msg: '时间设置不可为空' })"
            label="开放时间"
          >
            <div>
              <el-time-picker
                v-model="editData.startTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="开始时间"
              ></el-time-picker>
              <el-time-picker
                v-model="editData.stopTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="结束时间"
              ></el-time-picker>
              <!-- <el-time-picker
                v-model="time"
                is-range
                format="HH:mm"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              ></el-time-picker> -->
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="areaPath"
            :rules="filterRules({ required: true, msg: '场景名称不可为空' })"
            label="场景名称"
          >
            <el-input
              v-model="editData.areaPath"
              placeholder="2-10个字符"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="name"
            :rules="filterRules({ required: true, msg: '摄像头名称不可为空' })"
            label="摄像头名称"
          >
            <el-input
              v-model="editData.name"
              placeholder="2-10个字符"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!--      <el-row>-->
      <!--        <el-col :span="11">-->
      <!--          <el-form-item prop="addType" label="添加方式">-->
      <!--            <el-radio-group v-model="editData.addType">-->
      <!--              <el-radio label="1">单个设备</el-radio>-->
      <!--            </el-radio-group>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row>
        <el-col :span="11">
          <el-form-item label="协议类型">
            <p>GB28181</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="type"
            label="设备类型"
            :rules="filterRules({ required: true, msg: '请选择设备类型' })"
          >
            <el-select v-model="editData.type" placeholder="请选择设备类型">
              <el-option
                v-for="(item, index) in deviceType"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="vendor"
            label="厂商"
            :rules="filterRules({ required: true, msg: '请选择厂商' })"
          >
            <el-select v-model="editData.vendor" placeholder="请选择厂商">
              <el-option
                v-for="(item, index) in origin"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="name"
            label="设备名称"
            :rules="filterRules({ required: true, msg: '设备名称不可为空' })"
          >
            <el-input v-model="editData.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item prop="gbId" label="设备国际ID">
            <el-input
              v-model="editData.gbId"
              placeholder="国际ID自动生成中..."
              maxlength="46"
              :readonly="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item prop="ip" label="设备IP">
            <el-input
              v-model="editData.ip"
              placeholder="示例：2.2.2.2"
              maxlength="46"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item prop="port" label="端口">
            <el-input
              v-model="editData.port"
              placeholder="示例：8080"
              maxlength="46"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="directoryId"
            label="所属目录"
            :rules="filterRules({ required: true, msg: '所属目录不能为空' })"
          >
            <el-select
              v-model="editData.directoryId"
              placeholder="请选择所属目录"
              @change="spaceChange"
            >
              <el-option
                v-for="(item, index) in spaceList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="username"
            label="设备用户名"
            :rules="filterRules({ required: true, msg: '请输入设备用户名' })"
          >
            <el-input
              v-model="editData.username"
              placeholder="请输入"
              maxlength="46"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="password"
            label="设备密码"
            :rules="filterRules({ required: true, msg: '请输入设备密码' })"
          >
            <el-input
              v-model="editData.password"
              placeholder="请输入"
              maxlength="46"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item prop="e" label="经纬度获取">
            <el-radio-group v-model="editData.autoPos">
              <el-radio :label="true">订阅(自动获取)</el-radio>
              <el-radio :label="false">录入</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!editData.autoPos">
        <el-col :span="6">
          <el-form-item
            prop="longitude"
            label="经度"
            :rules="
              filterRules({
                required: true,
                msg: '经度不可为空',
              })
            "
          >
            <el-input
              v-model="editData.longitude"
              placeholder="103.28621(经度)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            prop="latitude"
            label="纬度"
            :rules="
              filterRules({
                required: true,
                msg: '纬度不可为空',
              })
            "
          >
            <el-input
              v-model="editData.latitude"
              placeholder="95.38206(纬度)"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="editData.autoPos">
        <el-col :span="6">
          <el-form-item
            prop="posInterval"
            label="订阅调频"
            :rules="
              filterRules({
                required: true,
                msg: '频率不可为空',
                type: 'num',
              })
            "
          >
            <el-input
              v-model="editData.posInterval"
              size="small"
              placeholder="请输入"
              maxlength="2"
              oninput="if(value>60)value=60"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <p style="line-height: 32px; padding-left: 7px">秒</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item prop="autoStart" label="添加后拉流">
            <el-switch v-model="editData.autoStart"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item prop="description" label="设备描述">
            <el-input
              v-model="editData.description"
              type="textarea"
              placeholder="请输入"
              :autosize="true"
              maxlength="2000"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.isEdit = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </div>
</template>

<script>
  import { getAllClass } from '@/cms/api/class'
  // import { mapGetters } from 'vuex'
  import {
    getSpaceList,
    camereAdd,
    camereUpdate,
    getGbId,
  } from '@/cms/api/camera'
  export default {
    props: {
      schoolData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        editData: {
          schoolId: this.schoolData.id,
          autoStart: false, //是否自动开启推流
          autoPos: true,
        }, //提交的数据
        type: 0, //0为新增 1位编辑 默认新增
        deviceType: [
          { name: '摄像头', id: 'ipc' },
          { name: '平台', id: 'platform' },
          { name: '智能设备', id: 'ied' },
        ], //设备类型
        origin: ['海康', '大华'], //厂商
        spaceList: [], //所属目录
        radio3: '',
        time: '',
        classList: [],
        classId: [],
      }
    },
    computed: {},
    mounted() {
      const vm = this
      setTimeout(() => {
        //查询空间ID
        if (+vm.type === 0) {
          getGbId().then((res) => {
            if (+res.code === 0) {
              vm.editData.gbId = res.data
            }
          })
        }
      }, 1000)
      //查询空间列表
      vm.getClass()
      vm.getSpace()
    },
    methods: {
      spaceChange(e) {
        // let vm = this
        // let gbId = vm.spaceList.find((item) => item.id === e).gbId
        // vm.editData.gbId = gbId
      },
      //获取空间列表
      getSpace() {
        let params = {
          pageSize: 999,
          pageNo: 1,
        }
        return getSpaceList(params).then((res) => {
          if (+res.code === 0) {
            this.spaceList = res.data.list || []
          }
        })
      },
      //获取学校班级数据
      async getClass() {
        await getAllClass(this.schoolData.id).then((res) => {
          if (+res.code === 0) {
            this.classList = res.data.list
          }
        })
      },
      //保存或修改
      save() {
        const vm = this
        vm.$refs.dataForm.validate((valid) => {
          if (valid) {
            let obj = Object.assign(
              { groupId: vm.editData.directoryId },
              vm.editData
            )
            obj.cameraType = obj.cameraType + ''
            if (+vm.type === 0) {
              camereAdd(obj).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success(res.msg || '添加成功')
                  vm.$emit('close')
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            } else {
              camereUpdate(obj, obj.id).then((res) => {
                if (+res.code === 0) {
                  vm.$message.success(res.msg || '保存成功')
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
      async init(data) {
        const vm = this
        vm.type = 1
        vm.editData = data
        vm.editData.schoolId = this.schoolData.id
        vm.editData.cameraType = data.cameraType.index
        vm.$forceUpdate()
      },
    },
  }
</script>

<style scoped></style>
