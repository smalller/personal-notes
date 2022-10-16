<template>
  <ui-modal
    v-model:visible="manageClass.open"
    @close="handleClose"
    @ok="handleOption"
    :title="manageClass.title"
    :width="manageClass.width"
    :tips="false"
  >
    <div>
      <p v-for="(item, index) in showText" :key="index" class="body-text">
        {{ index + 1 + "." }} {{ item }}
      </p>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Message from "@/themes/message";
import { useStore } from "vuex";
import bus from "@/Layout/bus";
import {
  DelClassList,
  graduateClass,
  addClassTeacher,
} from "@/api/classManage";
import { staticData } from "../index";
interface addClass {
  title: string;
  width: string | number;
  open: boolean;
}
interface classDemo {
  id: string;
  // width: string | number;
  // open: boolean;
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
    const manageClass = ref({
      title: "",
      width: 500,
      open: false,
      type: "",
      class: "",
      info: [],
      teacher: {
        classId: "",
        id: "",
        title: "",
      },
    });
    const showText = ref([] as Array<string>);
    const handleOpen = (type: string, res?: any) => {
      if (type == "del") {
        manageClass.value.title =
          res.length > 1
            ? `确定将勾选的 ${res.length}个 班级删除吗？`
            : `确定将勾选的 ${res[0].name}班 删除吗？`;
        manageClass.value.type = type;
        manageClass.value.open = true;
        manageClass.value.info as Array<any>;
        manageClass.value.info = res;
        showText.value = staticData.delTips;
      } else if (type == "graduate") {
        manageClass.value.title = `确定将 ${res.name}班 毕业吗？`;
        manageClass.value.type = type;
        manageClass.value.open = true;
        manageClass.value.class = res.id;
        showText.value = staticData.graduateTips;
      } else if (type == "teacher") {
        console.log(res);
        manageClass.value.title = `确定移除班级老师 ${res.name} 吗？`;
        manageClass.value.type = type;
        manageClass.value.open = true;
        manageClass.value.teacher = res;
        showText.value = staticData.moveTips;
      }
    };
    const handleOption = async () => {
      if (manageClass.value.type == "del" && manageClass.value.info.length) {
        let delList = ref([] as Array<string>);
        delList.value.length = 0;
        manageClass.value.info.map((item: classDemo) =>
          delList.value.push(item?.id)
        );
        let { code } = await DelClassList(delList.value);
        if (+code === 0) {
          Message.success("班级删除成功！");
          manageClass.value.open = false;
          bus.$emit("editClass", true); // 通知更新表格
          ctx.emit("update");
        }
      } else if (
        manageClass.value.type == "graduate" &&
        manageClass.value.class
      ) {
        let { code } = await graduateClass(manageClass.value.class);
        if (+code === 0) {
          Message.success("该班级已毕业！");
          manageClass.value.open = false;
          bus.$emit("editClass", true); // 通知更新表格
          ctx.emit("update");
        }
      } else if (
        manageClass.value.type == "teacher" &&
        manageClass.value.teacher
      ) {
        let data = ref({
          clazzId: manageClass.value.teacher?.classId,
          employeeId: manageClass.value.teacher?.id,
          enableStatus: 9,
          schoolId: $store.state.user.schoolId,
          title: manageClass.value.teacher?.title,
        });
        let { code } = await addClassTeacher(data);
        if (+code === 0) {
          Message.success("移除教师成功！");
          manageClass.value.open = false;
          ctx.emit("update");
        }
      }
    };
    return { manageClass, handleOpen, staticData, showText, handleOption };
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
      margin-top: -5px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      .form-icon {
        width: 30px;
        margin: 15px 0px 0px 10px;
        cursor: pointer;
      }
    }
  }
}
.body-text {
  color: #f56060;
  font-size: 14px;
}
.ui-form-item-box {
  height: 35px;
  // margin-bottom: 20px;
}
</style>
