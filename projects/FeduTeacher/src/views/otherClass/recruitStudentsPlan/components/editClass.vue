<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    width="480"
    :tips="false"
  >
    <div class="body-text-box">
      <div class="form-box">
        <div class="left-form">
          <ui-form
            :model="ruleForm"
            :rules="staticData.editClassRules"
            ref="editClassFormCheck"
            label-width="90"
          >
            <ui-form-item label="班徽">
              <div class="class-img">
                <div @click="showCropper = true">
                  <div class="form-img" v-if="!ruleForm.clazzImg">
                    <ui-icon icon="icon-a-1" class="form-icon"></ui-icon>
                  </div>
                  <img v-else class="form-img" :src="ruleForm.clazzImg" />
                </div>
                <ui-avatar-cropper
                  style="float: left"
                  v-if="showCropper"
                  @cancelImg="showCropper = false"
                  @sendImgInfo="getImgInfo"
                ></ui-avatar-cropper>
              </div>
            </ui-form-item>
            <!-- <ui-form-item label="兴趣课程" prop="clazzName">
              <ui-input
                v-model="ruleForm.clazzName"
                placeholder="请选择兴趣课程"
              ></ui-input>
            </ui-form-item> -->
            <ui-form-item label="班级名称" prop="clazzName">
              <ui-input
                v-model="ruleForm.clazzName"
                placeholder="请输入班级名称"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="满班人数" prop="classNum">
              <ui-input
                v-model="ruleForm.classNum"
                style="width: 72px"
              ></ui-input>
              人
            </ui-form-item>
            <ui-form-item label="班主任">
              <div class="flex">
                <ui-input
                  class="w-200"
                  :readonly="true"
                  placeholder="请选择班主任"
                  v-model="ruleForm.headmaster"
                ></ui-input>
                <ui-button @click="selectTeacher('选择班主任')">选择</ui-button>
              </div>
            </ui-form-item>
            <ui-form-item label="默认教室">
              <ui-select
                class="w-200"
                v-model="ruleForm.defaultRoom"
                placeholder="请选择默认教室"
              >
                <ui-select-option
                  v-for="item in classList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </ui-select-option>
              </ui-select>
              <ui-button @click="handleAdd">新增</ui-button>
            </ui-form-item>
            <!-- <ui-form-item label="授课教师">
              <ui-input
                class="w-200"
                :readonly="true"
                placeholder="请选择授课教师"
                v-model="ruleForm.teacher"
              ></ui-input>
              <ui-button @click="selectTeacher('选择授课教师')">选择</ui-button>
            </ui-form-item>
            <ui-form-item label="计划课时">
              <ui-input
                class="w-200"
                placeholder="计划课时，仅作参考"
                v-model="ruleForm.classNum"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="建班时间">
              <ui-date-picker
                style="width: 200px"
                v-model="ruleForm.createTime"
                type="date"
                placeholder="请选择建班时间"
              >
              </ui-date-picker>
            </ui-form-item> -->
          </ui-form>
        </div>
      </div>
    </div>
  </ui-modal>
  <cms-upload ref="cmsUpload" />
  <editRoom ref="editRoomCom" @updateComplete="getClassList"></editRoom>
  <selectTeacherList
    ref="selectTeacherListCom"
    @chooseHeadmaster="chooseHeadmaster"
  ></selectTeacherList>
  <!-- @chooseTeacher="chooseTeacher" -->
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { staticData } from "../index";
import micell from "micell";
import Message from "@/themes/message";
import CmsUpload from "@/base/cmsUpload.vue";
import { addClass } from "@/api/recruitStudentsPlan";
import { queryClazzRoom } from "@/api/classroomManage";
import editRoom from "@/views/educManage/classroomManage/components/EditRoom.vue";
import selectTeacherList from "./selectTeacherList.vue";
import bus from "@/Layout/bus";

export default defineComponent({
  components: {
    CmsUpload,
    editRoom,
    selectTeacherList,
  },
  emits: ["editPlanComplete"],
  setup(props, { emit }) {
    const editClassFormCheck = ref(null);
    const cmsUpload = ref(null);
    const imgClip = ref(null);
    const modalStatus = ref(false);
    const title = ref("");
    const editFlag = ref(1); //1-新增操作，2-修改操作
    const classList = ref([] as any);
    const editRoomCom = ref(null);
    const selectTeacherListCom = ref(null);

    let ruleForm = ref({
      courseId: "",
      planId: "",
      clazzImg: "",
      clazzName: "",
      classNum: "",
      headmasterId: "",
      headmaster: "",
      defaultRoom: "",
      // teacherId: "",
      // teacher: "",
      // classNum: 0,
      // createTime: "",
    });

    const coverImgUrl = ref("");

    const showCropper = ref(false);

    // 打开模态框
    const handleOpen = (index: number, res?: any) => {
      if (index === 1) {
        title.value = "创建班级";
        editFlag.value = 1;
        ruleForm.value.planId = res.planId;
        ruleForm.value.courseId = res.courseId;
      } else {
        title.value = "编辑班级";
        editFlag.value = 2;
      }
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 转换时间格式
    // const selectDate = () => {
    //   if (ruleForm.value.createTime) {
    //     ruleForm.value.createTime = micell.date.format(
    //       ruleForm.value.createTime as Date | string,
    //       "YYYY-MM-DD"
    //     );
    //   }
    // };

    // 新增班级
    async function handleAddClass() {
      const { code } = await addClass(ruleForm.value);
      if (+code === 0) {
        modalStatus.value = false;
        Message.success("新增成功");
        bus.$emit("updateEditClassComplete"); // 通知更新列表数据
        initRuleForm();
      }
    }

    // 修改班级
    async function handleUpdateClass() {
      const { code } = await addClass(ruleForm.value);
      if (+code === 0) {
        modalStatus.value = false;
        Message.success("修改成功");
        initRuleForm();
      }
    }

    // 初始化数据
    function initRuleForm() {
      ruleForm.value = {
        courseId: "",
        planId: "",
        clazzImg: "",
        clazzName: "",
        classNum: "",
        headmasterId: "",
        headmaster: "",
        defaultRoom: "",
        // teacherId: "",
        // teacher: "",
        // classNum: 0,
        // createTime: "",
      };
    }

    // 确认按钮
    const handleSure = () => {
      (editClassFormCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log("验证通过");
          // selectDate();
          if (editFlag.value === 1) {
            handleAddClass();
          } else {
            handleUpdateClass();
          }
        } else {
          console.log("验证失败");
        }
      });
    };

    const getImgInfo = (data: any) => {
      if (data) {
        ruleForm.value.clazzImg = data.attach;
        showCropper.value = false;
      }
    };

    const getClassList = async (): Promise<void> => {
      const { code, data } = await queryClazzRoom();
      if (+code === 0) {
        classList.value = data.list;
      }
    };
    getClassList();

    // 新增教室
    function handleAdd() {
      (editRoomCom.value as any).handleOpen(1);
    }

    // 选择老师
    function selectTeacher(title: string) {
      (selectTeacherListCom.value as any).handleOpen(title);
    }

    // 选择班主任
    function chooseHeadmaster(res: any) {
      ruleForm.value.headmasterId = res.id;
      ruleForm.value.headmaster = res.name;
    }

    // 选择教师
    // function chooseTeacher(res: any) {
    //   ruleForm.value.teacherId = res.id;
    //   ruleForm.value.teacher = res.name;
    // }

    return {
      modalStatus,
      title,
      ruleForm,
      handleClose,
      handleSure,
      handleOpen,
      editClassFormCheck,
      staticData,
      imgClip,
      cmsUpload,
      coverImgUrl,
      showCropper,
      getImgInfo,
      classList,
      editRoomCom,
      handleAdd,
      getClassList,
      selectTeacher,
      selectTeacherListCom,
      chooseHeadmaster,
      // chooseTeacher,
    };
  },
});
</script>

<style lang="less" scoped>
.body-text-box {
  font-size: 14px;
  margin: 20px 0 40px 0;

  .form-box {
    display: flex;
    justify-content: space-between;

    .left-form {
      flex-grow: 1;

      .flex {
        display: flex;
      }

      .w-200 {
        width: 200px;
        margin-right: 10px;
      }

      .form-img {
        width: 48px;
        height: 48px;
        background: #fafafa;
        border-radius: 4px;
        margin-top: -10px;
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.1);
        .form-icon {
          width: 30px;
          margin: 15px 0px 0px 10px;
          cursor: pointer;
        }
      }

      .img-box {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        cursor: pointer;

        .icon {
          fill: #dfdfdf;
          width: 24px;
          height: 20px;
        }
      }
    }
  }
}
</style>
