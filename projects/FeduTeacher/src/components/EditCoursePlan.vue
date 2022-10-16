<template>
  <div class="edit-course-plan-box">
    <ui-modal
      v-model:visible="modalStatus"
      @close="handleClose"
      @ok="handleSure"
      :title="title"
      width="530"
      :tips="false"
    >
      <div class="body-text-box">
        <div class="form-box">
          <div class="left-form">
            <div class="course-box">
              <div class="img-box">
                <img
                  :src="courseInfo.pic || require('@/assets/staff-avatar.png')"
                  alt=""
                />
              </div>
              <div class="info">
                <p>{{ courseInfo.courseName }}</p>
                <span>课节 {{ courseInfo.sectionNums }}</span>
              </div>
            </div>
            <ui-form
              :model="ruleForm"
              :rules="validateData.rules"
              ref="formCheck"
              label-width="82"
            >
              <ui-form-item label="课程价格" prop="price">
                <ui-input
                  style="width: 210px"
                  v-model="ruleForm.price"
                  placeholder="价格"
                ></ui-input
                >&nbsp;
                <span style="color: #666666; font-size: 14px">元</span>
              </ui-form-item>

              <ui-form-item label="授课老师" prop="teacherName">
                <ui-input
                  style="width: 210px"
                  v-model="ruleForm.teacherName"
                  placeholder="请输入授课老师"
                ></ui-input>
              </ui-form-item>
              <ui-form-item label="上课时间" prop="content">
                <ui-input
                  width="100%"
                  height="80"
                  type="textarea"
                  placeholder="请输入上课时间"
                  v-model="ruleForm.content"
                ></ui-input>
              </ui-form-item>
              <ui-form-item
                label="所属计划"
                prop="planId"
                v-if="editFlag !== 1"
              >
                <ui-select
                  v-if="planList"
                  style="width: 100%"
                  v-model="ruleForm.planId"
                  placeholder="请选择所属计划"
                >
                  <ui-select-option
                    v-for="item in planList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </ui-select-option>
                </ui-select>
              </ui-form-item>
            </ui-form>
          </div>
        </div>
      </div>
    </ui-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { validateData } from "@/utils/common";
import Message from "@/themes/message";
import { queryPlan, addCourse } from "@/api/recruitStudentsPlan";
import bus from "@/Layout/bus";

export default defineComponent({
  components: {},
  setup() {
    const formCheck = ref(null);
    const modalStatus = ref(false);
    const title = ref("");
    const editFlag = ref(0); //1-修改操作，2-新增操作
    const planList = ref();
    let ruleForm = ref({
      price: "",
      teacherName: "",
      content: "",
      planId: "",
      id: "",
      courseId: "",
    });

    const courseInfo = ref({
      pic: "",
      courseName: "",
      sectionNums: "",
    });

    // 打开模态框
    const handleOpen = (index: number, res: any, backId?: string) => {
      getPlanList();

      if (index === 1) {
        title.value = "编辑计划内课程";
        editFlag.value = 1;
        ruleForm.value = Object.assign({}, res);

        const {
          price,
          teacherName,
          content,
          planId,
          pic,
          courseName,
          sectionNums,
          id,
          courseId,
        } = res;
        ruleForm.value = {
          price: String(price),
          teacherName,
          content,
          planId,
          id,
          courseId,
        };
        courseInfo.value = {
          pic,
          courseName,
          sectionNums,
        };
      } else {
        title.value = "添加课程到计划";
        editFlag.value = 2;

        const { pic, courseName, sectionNums, id } = res;
        ruleForm.value.courseId = id;

        courseInfo.value = {
          pic,
          courseName,
          sectionNums,
        };
      }

      modalStatus.value = true;
    };

    // 获取列表内容
    const getPlanList = async (): Promise<void> => {
      const { code, data } = await queryPlan(1, 999999);
      if (+code === 0) {
        planList.value = data.list;
      }
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
      initData();
    };

    // 初始化表单
    const initData = (): void => {
      ruleForm.value = {
        price: "",
        teacherName: "",
        content: "",
        planId: "",
        id: "",
        courseId: "",
      };
    };

    // 新增/修改招生计划
    const editCourse = async (): Promise<void> => {
      let obj = {},
        txt = "";
      if (editFlag.value === 1) {
        obj = ruleForm.value;
        txt = "修改成功";
      } else {
        const { courseId, price, teacherName, content, planId } =
          ruleForm.value;
        obj = {
          courseId,
          price,
          teacherName,
          content,
          planId,
        };
        txt = "新增成功";
      }
      const { code } = await addCourse(obj);
      if (+code === 0) {
        Message.success(txt);
        modalStatus.value = false;
        initData();
        bus.$emit("editCoursePlanComplete");
      }
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log("验证通过");
          editCourse();
        } else {
          console.log("验证失败");
        }
      });
    };

    return {
      modalStatus,
      title,
      ruleForm,
      handleClose,
      handleSure,
      handleOpen,
      formCheck,
      validateData,
      planList,
      editFlag,
      courseInfo,
    };
  },
});
</script>

<style lang="less">
.el-select-dropdown__item {
  width: 385px !important;
}

.edit-course-plan-box {
  .body-text-box {
    font-size: 14px;
    margin: 20px 0 40px 0;

    .form-box {
      display: flex;
      justify-content: space-between;

      .left-form {
        flex-grow: 1;

        .course-box {
          background: #f2f2f2;
          border-radius: 6px;
          padding: 12px;
          display: flex;
          margin-bottom: 20px;

          .img-box {
            width: 140px;
            height: 80px;
            margin-right: 20px;

            > img {
              width: 140px;
              height: 80px;
              border: 1px solid rgba(0, 0, 0, 0.05);
              border-radius: 4px;
              object-fit: cover;
            }
          }

          .info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            > p {
              font-size: 16px;
              color: #222;
            }

            > span {
              font-size: 14px;
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>
