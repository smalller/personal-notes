<template>
  <ui-modal
    v-model:visible="addClass.open"
    @close="handleClose"
    @ok="handleAdd"
    :title="addClass.title"
    :width="addClass.width"
    :tips="true"
  >
    <div class="classList" v-if="addClass.open">
      <ui-avatar-cropper
        v-if="showCropper"
        @cancelImg="showCropper = false"
        @sendImgInfo="getImgInfo"
      ></ui-avatar-cropper>
      <div class="list-box" v-for="(item, index) in formList" :key="item.uuid">
        <ui-form
          :model="item"
          :ref="formCheck"
          :rules="validate.rule"
          label-width="110"
        >
          <ui-form-item label="班徽">
            <div
              @click="openShow(index)"
              class="form-img"
              v-if="!item.classImgUrl"
            >
              <ui-icon icon="icon-a-1" class="form-icon"></ui-icon>
            </div>
            <img
              @click="openShow(index)"
              class="form-img"
              v-if="item.classImgUrl"
              :src="item.classImgUrl"
            />
          </ui-form-item>
          <ui-form-item label="班级名称" prop="name">
            <ui-input v-model="item.name" style="width: 80%"></ui-input>
          </ui-form-item>
          <ui-form-item label="所在年级" prop="grade">
            <ui-select
              filterable
              style="width: 80%"
              v-model="item.grade"
              placeholder="请选择年级"
              class="select-box"
              @change="setGrade(index, item)"
            >
              <ui-select-option
                v-for="(items, index) in gradeList"
                :key="index"
                :label="items.codeInfoName"
                :value="items.codeInfoValue"
              >
              </ui-select-option>
            </ui-select>
          </ui-form-item>

          <ui-form-item>
            <ui-button
              v-show="index !== 0"
              style="margin-left: 10px; color: #bfbfbf; margin-top: -10px"
              type="text"
              @click="delClass(index, item.uuid)"
              >删除</ui-button
            >
          </ui-form-item>
        </ui-form>
      </div>
      <ui-button
        type="text"
        style="margin-left: 5px; color: #ff9900"
        @click="addNewClass"
        >+ 继续新增班级</ui-button
      >
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Message from "@/themes/message";
import { useStore } from "vuex";
import { validate, ruleForm } from "../index";
import micell from "micell";
import { AddClassList } from "@/api/classManage";
import { FormTable } from "@/base/interface";

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
  emits: ["update"],
  setup(props, ctx) {
    const $store = useStore();
    const gradeList = $store.state.commonData.gradeList; // 年级列表
    const formList = ref([
      {
        classImgUrl: "",
        clazzImg: "",
        name: "",
        grade: "",
        uuid: micell.uuid(),
        gradeLabel: "",
        schoolId: $store.state.user.schoolId,
      },
    ]);
    //添加班级
    const addClass = reactive({
      title: "批量新增班级",
      width: 700,
      open: false,
    });
    const addNewClass = () => {
      formList.value.push({
        clazzImg: "",
        name: "",
        grade: "",
        classImgUrl: "",
        uuid: micell.uuid(),
        gradeLabel: "",
        schoolId: $store.state.user.schoolId,
      });
    };
    //关闭弹窗
    const handleClose = () => {
      addClass.open = false;
      formDom.clear();
      formList.value = [
        {
          clazzImg: "",
          name: "",
          grade: "",
          classImgUrl: "",
          uuid: micell.uuid(),
          gradeLabel: "",
          schoolId: $store.state.user.schoolId,
        },
      ];
    };
    //打开弹窗
    const handleOpen = () => {
      addClass.open = true;
    };
    //初始化表单参数
    const formDom = new Map();
    const formCheck = (el: any) => {
      if (el?.model?.uuid && !formDom.get(el.model.uuid)) {
        formDom.set(el.model.uuid, el);
      }
    };
    //判断表单
    const status = ref(false);
    const checkFrom = (): Promise<boolean[]> => {
      status.value = false;
      let arr: Promise<boolean>[] = [];

      formDom.forEach((item) => {
        arr.push(check(item));
      });
      return Promise.all(arr);
    };
    //表单验证
    const check = (item: FormTable): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        item.validate((valid: boolean) => {
          valid ? resolve(valid) : reject(false);
        });
      });
    };
    //确认添加班级
    const handleAdd = async () => {
      try {
        await checkFrom();
        let { code } = await AddClassList(formList.value);
        if (+code === 0) {
          Message.success("班级添加成功");
          addClass.open = false;
          formList.value = [
            {
              clazzImg: "",
              name: "",
              grade: "",
              classImgUrl: "",
              uuid: micell.uuid(),
              gradeLabel: "",
              schoolId: $store.state.user.schoolId,
            },
          ];
          ctx.emit("update");
        }
      } catch {
        Message.warning("表单填写错误！");
      }
    };

    //删除班级
    const delClass = (index: number, uuid: string): void => {
      if (index) {
        formDom.delete(uuid);
        formList.value.splice(index, 1);
      }
    };
    //打开截图工具
    const selectIndex = ref(0);
    const openShow = (index: number) => {
      if (index !== undefined) {
        showCropper.value = true;
        selectIndex.value = index;
      }
    };
    //获取图片信息
    const showCropper = ref(false);
    const getImgInfo = (data: any) => {
      if (data) {
        formList.value[selectIndex.value].classImgUrl = data.attach;
        formList.value[selectIndex.value].clazzImg = data.data;
        showCropper.value = false;
      }
    };
    //设置班级名称
    const setGrade = (index: number, item: ruleForm) => {
      let data = ref("");
      gradeList.filter((items: any) => {
        if (items.codeInfoValue === item.grade) {
          data.value = items.codeInfoName;
        }
      });
      formList.value[index].gradeLabel = data.value;
    };
    return {
      addClass,
      handleClose,
      handleAdd,
      handleOpen,
      addNewClass,
      formList,
      gradeList,
      delClass,
      showCropper,
      getImgInfo,
      openShow,
      validate,
      formCheck,
      setGrade,
    };
  },
});
</script>
<style lang="less" scoped>
.classList {
  max-height: 600px;
  overflow-y: auto;
  .list-box {
    margin-top: 15px;
    padding-bottom: 0px;
    // margin-left: -30px;

    border-bottom: 1px solid #e8e8e8;
    div {
      display: flex;
    }
    > div {
      height: 60px;
      display: grid;
      // grid-template-rows: repeat(auto-fill, 40px);
      grid-template-columns: 100px 220px 260px 30px;
      grid-row-gap: 4px;
      grid-column-gap: 4px;
    }
    .form-img {
      width: 48px;
      height: 48px;
      background: #fafafa;
      border-radius: 4px;
      margin-top: -10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      .form-icon {
        width: 30px;
        margin: 15px 0px 0px 10px;
        cursor: pointer;
      }
    }
  }
}

.ui-form-item-box {
  height: 35px;
  // margin-bottom: 20px;
}
</style>
