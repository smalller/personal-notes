<template>
  <!-- 摄像头新增或编辑 -->
  <div class="informationEdit common">
    <el-form
      ref="dataForm"
      :model="editData"
      label-width="120px"
      style="margin-bottom: 30px"
    >
      <!--      基础信息-->
      <el-row style="margin: 30px 0">
        <h2>{{ type === 0 ? '新增' : '修改' }}摄像头</h2>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item prop="schoolId" label="所属幼儿园">
            <el-input v-model="editData.schoolId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="areaPath"
            :rules="filterRules({ required: true, msg: '位置不可为空' })"
            label="所在位置"
          >
            <el-select
              v-model="editData.areaPath"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in areaPathList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
          <el-form-item
            prop="gbId"
            label="设备国际ID"
            :rules="filterRules({ required: true, msg: '设备国际ID不可为空' })"
          >
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
              maxlength="40"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            prop="password"
            label="设备用户密码"
            :rules="filterRules({ required: true, msg: '请输入设备密码' })"
          >
            <el-input
              v-model="editData.password"
              placeholder="请输入"
              maxlength="40"
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
          <p style="padding-left: 7px; line-height: 32px">秒</p>
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
import { mapGetters } from 'vuex'
import {
  getSpaceList,
  camereAdd,
  camereUpdate,
  getGbId,
} from '@/cms/api/camera'
export default {
  data() {
    return {
      editData: {
        schoolId: this.$parent.params.schoolId,
        autoStart: false, //是否自动开启推流
        autoPos: true,
      }, //提交的数据
      type: 0, //0为新增 1位编辑 默认新增
      deviceType: [
        { name: '摄像头', id: 'ipc' },
        { name: '平台', id: 'platform' },
        { name: '智能设备', id: 'ied' },
      ], //设备类型
      origin: ['海康'], //厂商
      spaceList: [], //所属目录
      areaPathList: [],
    }
  },
  computed: {},
  mounted() {
    const vm = this
    setTimeout(() => {
      //查询空间ID
      if (+vm.type === 0) {
        getGbId().then((res) => {
          console.log(res)
          if (+res.code === 0) {
            vm.editData.gbId = res.data
          }
        })
      }
    }, 1000)
    //查询空间列表
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
          this.spaceList = res.data || []
        }
      })
    },
    //保存或修改
    save() {
      const vm = this
      vm.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log(vm.editData)
          let obj = Object.assign(
            { groupId: vm.editData.directoryId },
            vm.editData
          )
          if (+vm.type === 0) {
            camereAdd(obj).then((res) => {
              console.log(res)
              if (+res.code === 0) {
                vm.$message.success(res.msg || '添加成功')
                vm.$emit('close')
              } else {
                vm.$message.warning(res.msg || '接口错误')
              }
            })
          } else {
            camereUpdate(obj, obj.id).then((res) => {
              console.log(res)
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
    init(data) {
      const vm = this
      vm.type = 1
      vm.editData = data
      vm.editData.schoolId = vm.$parent.params.schoolId
      console.log(vm.editData)
      vm.$forceUpdate()
    },
  },
}
</script>

<style scoped></style>
