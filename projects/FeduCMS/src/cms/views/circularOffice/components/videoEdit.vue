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
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item prop="clazzId" label="所属班级">
            <el-select v-model="editData.clazzId" @change="chooseClass">
              <el-option value="" label="全部"></el-option>
              <el-option
                v-for="(item, index) in classList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="openCookHouse"
            :rules="
              filterRules({ required: true, msg: '请选择是否加入明厨亮灶' })
            "
            label="是否加入明厨亮灶"
          >
            <div>
              <el-radio-group v-model="editData.openCookHouse" size="small">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="amOpenStartTime"
            :rules="filterRules({ required: true, msg: '时间设置不可为空' })"
            label="上午开放时间"
          >
            <div>
              <el-time-picker
                v-model="editData.amOpenStartTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="开始时间"
              ></el-time-picker>
              <el-time-picker
                v-model="editData.amOpenEndTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="结束时间"
              ></el-time-picker>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item
            prop="pmOpenStartTime"
            :rules="filterRules({ required: true, msg: '时间设置不可为空' })"
            label="下午开放时间"
          >
            <div>
              <el-time-picker
                v-model="editData.pmOpenStartTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="开始时间"
              ></el-time-picker>
              <el-time-picker
                v-model="editData.pmOpenEndTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="结束时间"
              ></el-time-picker>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="margin-right: 10px">
          <el-form-item prop="areaPath" label="场景名称">
            <el-select
              v-model="editData.sceneId"
              placeholder="请选择场景"
              @change="chooseScene"
            >
              <el-option label="移除场景" value=""></el-option>
              <el-option
                v-for="item in sceneList"
                :key="item.id"
                :label="item.scene"
                :value="item.id"
              ></el-option>
            </el-select>
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
  import request from '@/utils/request'
  import { getAllClass } from '@/cms/api/class'
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
          id: '',
          amOpenStartTime: '',
          amOpenEndTime: '',
          pmOpenStartTime: '',
          pmOpenEndTime: '',
          clazzId: '',
          clazzNames: '',
          sceneId: '',
          areaPath: '',
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
        }, //提交的数据
        type: 0, //0为新增 1位编辑 默认新增
        value1: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
        classList: [],
        classId: [],
        sceneList: [],
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
    },
    methods: {
      // 记录选择班级得名称
      chooseClass() {
        // console.log(id)
        let str = '全部'
        for (let item of this.classList) {
          if (item.id === this.editData.clazzId) {
            str = item.name
          }
        }
        console.log(str)
        this.editData.clazzNames = str
      },
      chooseScene() {
        for (let item of this.sceneList) {
          if (item.id === this.editData.sceneId) {
            this.editData.areaPath = item.scene
          }
        }
      },
      async getScene() {
        await request({
          url: '/schools/api/scene/query',
          method: 'get',
          params: {
            pageNo: 1,
            pageSize: 999,
            enableStatus: 1,
            schoolId: sessionStorage.getItem('zdyjb_schoolId'),
          },
        }).then((res) => {
          if (+res.code === 0) {
            this.sceneList = res.data.list
          } else {
            this.$message.warning(res.msg || '接口错误')
          }
        })
      },
      //获取学校班级数据
      async getClass() {
        await getAllClass(sessionStorage.getItem('zdyjb_schoolId')).then(
          (res) => {
            if (+res.code === 0) {
              this.classList = res.data.list
              console.log(this.classList)
            }
          }
        )
      },
      //保存或修改
      save() {
        const vm = this
        vm.$refs.dataForm.validate((valid) => {
          vm.editData.clazzIds = !vm.editData.clazzId
            ? []
            : [vm.editData.clazzId]
          delete vm.editData.cameraType
          if (valid) {
            request({
              url: '/facility/device/updateIpcEdit',
              method: 'post',
              data: vm.editData,
            }).then((res) => {
              if (+res.code === 0) {
                // this.sceneList = res.data.list
                this.$parent.isEdit = false
                this.$message.success('保存成功')
                this.$parent.list()
              } else {
                this.$message.warning(res.msg || '接口错误')
              }
            })
          }
        })
      },
      //编辑时初始化数据
      init(data) {
        console.log(data, '99999999999')
        const vm = this
        vm.getClass()
        vm.getScene()
        if (data?.clazzIds?.length > 0) {
          data.clazzId = data?.clazzIds[0] || ''
        }
        vm.editData = Object.assign({}, data)

        vm.editData.schoolId = sessionStorage.getItem('zdyjb_schoolId')
        // vm.editData.openCookHouse = parseInt(data.openCookHouse)
        vm.$forceUpdate()
      },
    },
  }
</script>

<style scoped></style>
