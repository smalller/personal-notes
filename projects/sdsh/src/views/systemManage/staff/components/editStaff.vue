<template>
  <el-drawer v-model="drawer" title="编辑员工" custom-class="drawer-box" :before-close="handleClose">
    <el-form model class="filter-box" label-position="right" label-width="120px">
      <el-form-item label="姓名：">
        <el-input v-model="dataObj.userName" clearable placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="dataObj.account" clearable placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="登录密码：">
        <el-input v-model="dataObj.password" type="password" placeholder="请输入登录密码" show-password />
      </el-form-item>
      <el-form-item label="确认登录密码：">
        <el-input v-model="dataObj.rePassword" type="password" placeholder="请输入登录密码" show-password />
      </el-form-item>
      <el-form-item label="角色：">
        <el-select v-model="dataObj.roleId" placeholder="选择角色">
          <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="所带班级：">
        <el-select v-model="dataObj.classList" placeholder="选择班级" multiple>
          <el-option-group v-for="group in classList" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-option-group>
        </el-select>
        <!-- <el-select v-model="dataObj.classList" placeholder="选择班级" multiple>
          <el-option-group v-for="group in classList" :key="group.id" :label="group.gradeName">
            <el-option v-for="item in group.children" :key="item.id" :label="item.className" :value="item.id" />
          </el-option-group>
        </el-select> -->
      </el-form-item>
    </el-form>
    <div class="botom-btn-box">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { merchantClassList } from "@/views/informManage/informNotice/api";
import { ElMessage } from "element-plus";
import { roleList, addStaff, staffDetail, updateStaff, gradeTree } from "../api";
import md5 from 'js-md5'

export interface Setup {
  drawer: Ref<boolean>;
  handleClose: () => void;
  handleOpen: (index: number, res?: number) => void;
  dataObj: Ref<any>;
  gradeList: Ref<any>;
  classList: Ref<any>;
  selectGradeArr: Ref<any>;
  selectClassArr: Ref<any>;
  handleSave: () => Promise<void>;
  batchUploadComplete: (res: string[]) => void;
  flag: Ref<number>;
  rolesList: Ref<any>;
}
export default defineComponent({
  name: "",
  components: {},
  setup(props, { emit }) {
    const drawer = ref<boolean>(false);
    const dataObj = ref<any>({
      userName: "",
      account: "",
      password: "",
      rePassword: "",
      roleId: "",
      classList: [],
    });
    const gradeList = ref<any>([]);
    const classList = ref<any>([]);
    const selectGradeArr = ref<any>([]);
    const selectClassArr = ref<any>([]);
    const flag = ref<number>(-1);
    const rolesList = ref<any>([]);

    const initData = (): void => {
      emit("updateComplete");
      dataObj.value = {
        userName: "",
        account: "",
        password: "",
        rePassword: "",
        roleId: "",
        classList: "",
      };
      classList.value = []
      drawer.value = false;
    };

    // 关闭抽屉回调
    const handleClose = (): void => {
      initData();
    };

    // 角色列表
    async function getRoleList() {
      const { code, data } = await roleList();
      if (+code === 1000) {
        rolesList.value = data.list;
      }
    }

    // 打开抽屉
    const handleOpen = (index: number, res?: number): void => {
      getMerchantClassList();
      getRoleList();
      flag.value = index;
      if (flag.value === 2) {
        getStaffDetail(res as number);
      }
      drawer.value = true;
    };

    // 获取班级列表
    const getMerchantClassList = async (): Promise<void> => {
      const { code, data } = await merchantClassList();
      if (+code === 1000) {
        tranClassListCon(data.list);
      }
    };

    // 将返回的班级列表格式转换成组件所需要的格式
    const tranClassListCon = (data: any[]) => {
      let gradeArr = [] as any;
      for (let i = 0; i < data.length; i++) {
        if (!gradeArr.includes(data[i].gradeName)) {
          gradeArr.push(data[i].gradeName);
        }
      }

      for (let i = 0; i < gradeArr.length; i++) {
        const obj = {
          label: gradeArr[i],
          options: [],
        };
        classList.value.push(obj);
      }

      for (let i = 0; i < classList.value.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (classList.value[i].label === data[j].gradeName) {
            const obj = {
              value: data[j].id,
              label: data[j].className,
            };
            classList.value[i].options.push(obj);
          }
        }
      }
    };

    const handleSave = async (): Promise<void> => {
      const reqData = JSON.parse(JSON.stringify(dataObj.value))

      if (reqData.password !== reqData.rePassword) {
        ElMessage.error("两次输入密码不一致");
        return;
      }

      if (reqData.password && reqData.rePassword) {
        reqData.password = md5(JSON.parse(JSON.stringify(reqData.password)))
        reqData.rePassword = md5(JSON.parse(JSON.stringify(reqData.rePassword)))
      }

      if (flag.value === 1) {
        const { code } = await addStaff(reqData);
        if (+code === 1000) {
          emit("editComplete");
          ElMessage.success("新增成功");
          initData();
        }
      } else {
        const { code } = await updateStaff(reqData);
        if (+code === 1000) {
          emit("editComplete");
          ElMessage.success("修改成功");
          initData();
        }
      }
    };

    // 获取角色详情
    async function getStaffDetail(id: number) {
      const { code, data } = await staffDetail(id);
      if (+code === 1000) {
        dataObj.value = data;
        // 转换所带班级列表
        let classList: number[] = []
        data.classList.forEach((item) => {
          if (item.checked) {
            classList.push(item.classId)
          }
        })
        dataObj.value.classList = classList
        console.log(222, dataObj.value.classList);

      }
    }

    return {
      drawer,
      handleClose,
      handleOpen,
      dataObj,
      gradeList,
      selectGradeArr,
      handleSave,
      classList,
      selectClassArr,
      flag,
      md5,
      rolesList,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-form-item__content {
  .el-input {
    width: 300px;
  }
}

.send-obj {
  display: flex;
  margin-bottom: 18px;

  .title {
    min-width: 120px;
    font-size: 14px;
    padding-right: 12px;
    padding-top: 7px;
    box-sizing: border-box;
    text-align: right;
  }
}

.botom-btn-box {
  text-align: right;
  margin-top: 20px;
}
</style>
