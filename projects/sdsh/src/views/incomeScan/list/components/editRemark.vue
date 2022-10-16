<template>
<el-dialog :model-value="visible" title="更新备注" width="500px" @close="close">
  <el-row>
<!--    <el-input :autosize="{ minRows: 5, maxRows: 6 }" v-model="remark" type="textarea" />-->
    <el-form>
      <el-form-item v-for="(item, index) in formList" :key="index" :label="item.registerName">
        <el-input v-model="item.registerValue" />
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-button type="primary" @click="updateText">确定</el-button>
    <el-button @click="close">取消</el-button>
  </el-row>
</el-dialog>
</template>

<script lang="ts" setup>
import {defineEmits, defineExpose, ref} from "vue";
import {ElMessage} from "element-plus";
import {updateRemark} from "@/views/incomeScan/list/api";

const emit = defineEmits(['success'])
const visible = ref(false);
const remark = ref('');
const moId = ref();
const formList = ref<any[]>([]);
const open = (id: number, text: string) => {
  console.log(text, id)
  formList.value = []
  visible.value = true;
  moId.value = id;
  // remark.value = text;
  let list:any[] = [];
  try {
    list = JSON.parse(text)
    list.forEach(item => {
      formList.value.push({
        registerName: item.registerName,
        registerValue: item.registerValue
      })
    })
  } catch {
    list = [];
    formList.value = list;
  }

}
const close = () => {
  visible.value = false;
  formList.value = []
}

const updateText = () => {
  if(JSON.stringify(formList.value).trim() === '') {
    ElMessage.warning('请输入备注')
  } else {
    updateRemark({
      moId: moId.value,
      remark: JSON.stringify(formList.value)
    }).then(res => {
      if(+res.code === 1000) {
        emit('success');
        close();
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
}

defineExpose({
  open
})


</script>

<style scoped>

</style>
