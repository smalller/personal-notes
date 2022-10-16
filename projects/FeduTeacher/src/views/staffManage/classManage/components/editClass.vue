<template>
  <ui-modal
    v-model:visible="addClass.open"
    @close="handleClose"
    @ok="handleAdd"
    :title="addClass.title"
    :width="addClass.width"
    :tips="true"
  >
    <div class="body-text-box">
      <div class="form-box">
        <ui-form
          :model="ruleForm"
          :rules="rules"
          ref="formCheck"
          label-width="110"
        >
          <ui-form-item label="班徽" prop="changedClass">
            <div class="class-img">
              <div class="form-img">
                <ui-icon icon="icon-a-1" class="form-icon"></ui-icon>
              </div>
              <img src="" />
            </div>
          </ui-form-item>
          <ui-form-item label="班级名称" prop="changedClass">
            <ui-input style="width: 80%"></ui-input>
          </ui-form-item>
          <ui-form-item label="所在年级" prop="changedClass">
            <div style="display: flex">
              <ui-select
                filterable
                style="width: 80%"
                v-model="ruleForm.changedClass"
                placeholder="请选择要转入的班级"
                class="select-box"
              >
                <ui-select-option
                  v-for="item in selectClassList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </ui-select-option>
              </ui-select>
              <!-- <div style="margin-left: 5px">
                <ui-button type="text-primary" icon="icon-a-81"
                  >新增年级</ui-button
                >
              </div> -->
            </div>
          </ui-form-item>
          <ui-form-item label="建班时间" prop="changedClass">
            <ui-input style="width: 80%"></ui-input>
          </ui-form-item>
        </ui-form>
      </div>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

interface ruleForm {
  classIcon: string;
  className: string;
  classGrade: string;
  classTime: string;
}
interface addClass {
  title: string;
  width: string | number;
  open: boolean;
}
export default defineComponent({
  props: {
    className: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    type: {
      type: String,
    },
  },
  setup(props) {
    const classMode = ref({
      className: props.className,
      width: props.width,
      type: props.type,
    });
    //初始化班级数据
    const ruleForm: ruleForm = {
      classIcon: "",
      className: "",
      classGrade: "",
      classTime: "",
    };
    //获取年级信息
    const classList = ref([
      {
        label: "大班",
        value: "1",
      },
      {
        label: "中班",
        value: "2",
      },
      {
        label: "小班",
        value: "3",
      },
    ]);
    //添加班级
    const addClass: addClass = {
      title: "编辑班级信息",
      width: 600,
      open: true,
    };

    //关闭弹窗
    const handleClose = () => {
      console.log("1");
    };
    //确认添加班级
    const handleAdd = () => {
      console.log("1");
    };
    return {
      classMode,
      ruleForm,
      classList,
      addClass,
      handleClose,
      handleAdd,
    };
  },
});
</script>
<style lang="less" scoped>
.body-text-box {
  margin-top: 20px;
  .form-box {
    margin-bottom: 30px;
    .form-img {
      width: 48px;
      height: 48px;
      background: #fafafa;
      border-radius: 4px;
      margin-bottom: -30px;
      .form-icon {
        width: 30px;
        margin: 15px 0px 0px 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
