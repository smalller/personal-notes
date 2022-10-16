<template>
  <el-drawer custom-class="createElBox" title="新增收费" v-model="visible" @close="close">
    <div class="createEl">
      <el-form :model="formData" :rules="rules" ref="formEl">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="formData.projectName" />
        </el-form-item>
        <el-form-item label="选择名单对象" prop="codeType">
          <el-radio-group v-model="formData.codeType">
            <el-radio label="1" value="1">按年级</el-radio>
            <el-radio label="2" value="2">按班级</el-radio>
          </el-radio-group>
          <el-row class="selectGrade" style="width: 100%" v-if="+formData.codeType === 1">
            <el-checkbox-group v-model="selectGrade">
              <el-checkbox  v-for="item in gradeList" :key="item.key" :label="item.key">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <div class="selectClass" v-if="+formData.codeType === 2">
            <el-select v-model="gradeId" @change="gradeChange">
              <el-option v-for="item in gradeList" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
            <el-transfer v-model="selectClass" :titles="['未选班级', '已选班级']"
                         :button-texts="['移除', '添加']"
                         :format="{
                          noChecked: '${total}',
                          hasChecked: '${checked}/${total}',
                        }"
                         :data="classList"
            ></el-transfer>
          </div>

        </el-form-item>
        <el-form-item label="金额选项设置" prop="nameProjectItemDtos">
          <el-table :data="nameProjectItemDtos">
            <el-table-column label="收费项目名称">
              <template #default="{ row}">
                <el-input v-model="row.itemName" />
              </template>
            </el-table-column>
            <el-table-column label="收费方式">
              <template #default="{ row }">
                <el-select v-model="row.chargeType">
<!--                  <el-option label="自定义" value="1" />-->
                  <el-option label="设定收费金额" value="2" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="收费金额">
              <template #default="{ row}">
                <el-input type="number" v-model="row.chargeMoney" />
              </template>
            </el-table-column>
            <el-table-column label="是否必交">
              <template #default="{ row}">
                <el-switch v-model="row.required" active-value="1" active-text="是" inactive-value="0" inactive-text="不是" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index}" >

              <el-button type="danger" @click="deleteNameProjectItemDtos($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="success" @click="addNameProjectItemDtos">新增收费项目</el-button>
        </el-form-item>
        <el-form-item label="收费时间" prop="times">
          <el-date-picker
              type="daterange"
              v-model="formData.times"
              @change="timerChange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择截止时间"
          />
        </el-form-item>
        <el-form-item label="分账账户">
          <div style="display: flex" class="fzzhBox" v-for="(item, index) in formData.funChargeRateBos" :key="index">
            <div class="label">分账账户</div>
            <div class="value">
              <el-select v-model="item.id">
                <el-option v-for="data in splitList" :key="data.id" :value="data.id" :label="data.outAcntNm" v-show="!formData.funChargeRateBos.find(n => n.id ===data.id)" />
              </el-select>
            </div>
            <div class="label">分账比例（万分比）</div>
            <div class="value">
              <el-input placeholder="请输入万分比" v-model="item.rate" style="width: 200px"/>
            </div>
            <el-button type="danger" @click="delFunChargeRateBos(index)">删除</el-button>
          </div>
          <el-button type="success" v-if="formData.funChargeRateBos.length<splitList.length" @click="addFunChargeRateBos">增加分账账户</el-button>
          <el-button type="success" v-else @click="toAddFunCharge">新增分账账户</el-button>
        </el-form-item>
        <el-form-item label="收费说明(备注)">
          <el-input v-model="formData.remark" type="textarea" />
        </el-form-item>
      </el-form>

      <div>
        <el-button type="primary" @click="openPreview">预览</el-button>
        <el-button type="primary" @click="sendFormData('3')">保存草稿</el-button>
        <el-button type="success" @click="sendFormData('2')">发布</el-button>
        <el-button @click="close">返回</el-button>
      </div>
    </div>
  </el-drawer>
  <el-drawer title="预览" v-model="previewVisible" @close="previewVisible = false">
    <el-descriptions title="" border :column="1" direction="horizontal">
      <el-descriptions-item label="项目名称">{{ formData.projectName }}</el-descriptions-item>
      <el-descriptions-item label="名单对象">{{ +formData.codeType===2?'班级':'年级' }}</el-descriptions-item>
      <el-descriptions-item label="名单对象">{{ +formData.codeType===1?selectGrade:selectClass }}</el-descriptions-item>
      <el-descriptions-item label="名单列表"></el-descriptions-item>
      <el-descriptions-item label="金额选项">
        <el-table :data="nameProjectItemDtos">
          <el-table-column label="收费项目名称" prop="itemName"/>
          <el-table-column label="收费方式" prop="chargeType"/>
          <el-table-column label="收费金额" prop="chargeMoney"/>
          <el-table-column label="是否必交" prop="required">
            <template #default="{row}">{{+row.required===1?'是':'否'}}</template>
          </el-table-column>
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item label="收费时间">{{ dayjs(formData.beginTime).format('YYYY-MM-DD HH:mm:ss') }} -
        {{ dayjs(formData.endTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">{{formData.remark}}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>


<script setup lang="ts">
import dayjs from "dayjs";
import {defineEmits, defineExpose, reactive, ref} from "vue";
import {createPay, getClassList, getGradeList} from "@/views/incomeList/detail/api";
import {CreateUserPay, NameProjectItemDtos} from "@/views/incomeList/detail/data";
import {FormRules} from "element-plus/es";
import {ElMessage} from "element-plus";
import {funSplitOkList, queryProjectInfo} from "@/views/incomeList/list/api";
import {useRouter} from "vue-router";

const router = useRouter()

const emit = defineEmits(['success'])

const openType = ref('add')
const visible = ref(false)
const previewVisible = ref(false)
const selectType = ref('1')
const gradeList = ref<any[]>([])
const gradeId = ref<number>()
const classList = ref<any>([])

const selectGrade = ref([])
const selectClass = ref([])
const formData = reactive<CreateUserPay>({
  beginTime: '',
  endTime: '',
  codeType: '1',
  projectName: '',
  relationIds: '',
  remark: '',
  status: '2',
  nameProjectItemDtos: [],
  times: [],
  funChargeRateBos: []
})

const nameProjectItemDtos = ref<NameProjectItemDtos[]>([])

const open = (data:any) => {
  openType.value = 'add'
  if(data) {
    openType.value = 'edit'
    // console.log(data)
    // formData.times = [data.beginTime, data.endTime];
    // formData.projectName = data.projectName;
    // formData.id = data.id
    getInfo(data.id)
  }
  visible.value = true
}

const close = () => {
  visible.value = false
  reset()
}

const openPreview = () => {
  previewVisible.value = true
}

const reset = () => {
  formData.beginTime= '';
  formData.endTime= '';
  formData.codeType= '1';
  formData.projectName= '';
  formData.relationIds= '';
  formData.remark= '';
  formData.status= '';
  formData.nameProjectItemDtos= [];
  formData.times= [];
  formData.funChargeRateBos = []
  nameProjectItemDtos.value = [];
}

const splitList = ref([]);

//获取分账账户列表
const getSplitList = () => {
  funSplitOkList(1,99, {}).then(res => {
    if(+res.code === 1000) {
      console.log(res)
      splitList.value = res.data
    }
  })
}
getSplitList()

//添加分账账户
const addFunChargeRateBos = () => {
  formData.funChargeRateBos.push({
    id: '',
    rate: ''
  })
}

//新增分账账户

const toAddFunCharge = () => {
  router.push('/income/subAccount')
}

//获取详情
const getInfo = (id: number) => {
  queryProjectInfo(id).then(res => {
    if (+res.code === 1000) {
     console.log(res.data)
      formData.projectName = res.data.projectName;
      formData.times = [res.data.beginTime, res.data.endTime];
      formData.remark= res.data.remark;
      formData.nameProjectItemDtos = res.data.nameProjectItemDtos;
      nameProjectItemDtos.value = res.data.nameProjectItemDtos;
      formData.codeType = res.data.codeType;
      formData.relationIds = res.data.relationIds;
    }
  })
}

const delFunChargeRateBos = (i:number) => {
  formData.funChargeRateBos = formData.funChargeRateBos.filter((item, index) => index!== i)
}

const getGrade = () => {
  getGradeList().then(res => {
    if(+res.code === 1000) {
      gradeList.value = res.data.map(item => ({
        key: item.gradeId,
        label: item.gradeName
      }))
      if(gradeList.value.length>0) {
        gradeChange(gradeList.value[0].key)
      }
    }
  })
}
getGrade()

const getClass = (id: number) => {
  getClassList(id).then(res => {
    if(+res.code === 1000) {
      classList.value = res.data.list.map(item => ({
        key: item.id,
        label: item.className
      }))
    }
  })
}
const gradeChange = (e:number) => {
  gradeId.value = e
  selectClass.value = []
  getClass(e)
}

const rules = reactive<FormRules>({
  projectName: [
    {
      required: true, message: '请输入项目名称', trigger: 'blur'
    }
  ],
  codeType: [
    {
      required: true, message: '请选择名单对象', trigger: 'blur'
    }
  ],
  times: [
    {
      required: true, message: '请选择收费时间', trigger: 'blur'
    }
  ],
  nameProjectItemDtos: [
    {
      required: true, message: '请添加金额选项', trigger: 'blur'
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value.length === 0) {
          callback(new Error('请添加金额选项'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
})


const timerChange = (e) => {
  // console.log(e)
  if(e) {

  formData.beginTime = dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss')
  formData.endTime = dayjs(e[1]).format('YYYY-MM-DD') + ' 23:59:59'
  } else {
    formData.beginTime = '';
    formData.endTime = '';
  }
}

const addNameProjectItemDtos = () => {
  nameProjectItemDtos.value.push({
    chargeMoney: 0,
    chargeType: '2',
    itemName: '',
    required: '1'
  })
}

const deleteNameProjectItemDtos = (index:number) => {
  nameProjectItemDtos.value = nameProjectItemDtos.value.filter((item, i)=> i !==index)
}


const formEl = ref(null)
const sendFormData = (status:string) => {
  formData.nameProjectItemDtos = nameProjectItemDtos.value;
  if(formData.codeType === '1') {
    formData.relationIds = selectGrade.value.join(',')
  }
  if(formData.codeType === '2') {
    formData.relationIds = selectClass.value.join(',')
  }
  (formEl.value as any).validate(valid => {
    if(valid) {

      if(openType.value === 'add') {
        formData.status = status
        createUserPay()
      }
      if(openType.value === 'edit'){
        editUserPay()
      }
    }
  })
}

const createUserPay = () => {
  console.log(123)
  createPay(formData).then(res => {
    if(+res.code === 1000) {
      ElMessage.success('添加成功')
      emit('success');
      close();
    }
  })
}

const editUserPay = () => {
  console.log(333)
}

defineExpose({
  open
})
</script>

<style lang="scss">
.createElBox {
  width: 70vw !important;
}
</style>
