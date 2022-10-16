<template>
  <InfantGraduate ref="infantGraduateCom"></InfantGraduate>
  <ParentsManage ref="parentManageCom" index="1"></ParentsManage>
  <BindTimeCard ref="bindTimeCardCom"></BindTimeCard>
  <EditInfant ref="editInfantCom"></EditInfant>
  <ui-table :data="TABLE_DATA" @selectChange="selectChange" :checkbox="true">
    <ui-table-column label="幼儿姓名">
      <template #default="{ row }">
        <div class="name-box">
          <img
            class="avatar"
            :src="
              row.headerImgUrl
                ? row.headerImgUrl
                : require('@/assets/infant-avatar.png')
            "
            alt=""
          />
          <span>{{ row.name || "-" }}</span>
        </div>
      </template>
    </ui-table-column>
    <ui-table-column prop="contacts" label="家长电话"> </ui-table-column>
    <ui-table-column label="性别">
      <template #default="{ row }">
        <span>{{ row.sex === 1 ? "男" : "女" }}</span>
      </template>
    </ui-table-column>
    <ui-table-column prop="birthTime" label="出生年月"></ui-table-column>
    <ui-table-column prop="clazzName" label="所在班级"></ui-table-column>
    <ui-table-column label="入驻App" tips=" ">
      <template #default="{ row }">
        <ui-tag :type="row.settleApp === '1' ? 'success' : 'danger'">
          {{ row.settleApp === "1" ? "已入驻" : "未入驻" }}
        </ui-tag>
      </template>
    </ui-table-column>
    <ui-table-column label="入园时间">
      <template #default="{ row }">
        <span>{{
          row.createTime ? dayjs(row.createTime).format("YYYY-MM-DD") : ""
        }}</span>
      </template>
    </ui-table-column>
    <ui-table-column label="人脸录入状态">
      <template #default="{ row }">
        <el-tag :type="+row.faceStatus === 0 ? 'danger' : ''">{{
          +row.faceStatus === 0 ? "未录入" : "已录入"
        }}</el-tag>
      </template>
    </ui-table-column>
    <ui-table-column prop="age" label="操作" align="right">
      <template #default="{ row }">
        <ul class="handle-box">
          <!--          <li>-->
          <!--            <ui-button type="text-blue" @click="photo(row)">拍照</ui-button>-->
          <!--          </li>-->
          <!--          <li>-->
          <!--            <ui-button type="text-blue" @click="uploadImg(row)">上传</ui-button>-->
          <!--          </li>-->
          <li>
            <ui-button type="text-blue" @click="handleEdit(row)"
              >编辑</ui-button
            >
          </li>
          <li>
            <ui-button type="text-blue" @click="parentsManage(row)"
              >家长管理</ui-button
            >
          </li>
          <li>
            <ui-button type="text-blue" @click="bindTimeCard(row)"
              >绑定考勤卡</ui-button
            >
          </li>
          <li>
            <ui-button type="text-blue" @click="handleCurrcet(row)"
              >正音</ui-button
            >
          </li>
          <li>
            <ui-button type="text-blue" @click="handleGraduate(row)"
              >毕业</ui-button
            >
          </li>
        </ul>
      </template>
    </ui-table-column>
  </ui-table>
  <image-clip ref="imgClip" @close="close" />
  <camera ref="camera" @close="close" />
  <currectSpell ref="currectSpellCom"></currectSpell>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import EditInfant from "./EditInfant.vue";
import BindTimeCard from "@/components/BindTimeCard.vue";
import ParentsManage from "./ParentsManage.vue";
import micell from "micell";
import InfantGraduate from "./InfantGraduate.vue";
import { InfantTableList } from "../util";
import Camera from "../component/camera/camera.vue";
import ImageClip from "../component/imageClip/index.vue";
import bus from "@/Layout/bus";
import dayjs from "dayjs";
import currectSpell from "./CurrectSpell.vue";

export default defineComponent({
  components: {
    ImageClip,
    Camera,
    EditInfant,
    BindTimeCard,
    ParentsManage,
    InfantGraduate,
    currectSpell,
  },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange"],
  setup(props, cxt) {
    const TABLE_DATA = computed(() => props.data);

    const editInfantCom = ref(null);
    const bindTimeCardCom = ref(null);
    const parentManageCom = ref(null);
    const infantGraduateCom = ref(null);
    const currectSpellCom = ref(null);

    const imgClip = ref(null);
    const camera = ref(null);
    const cmsUpload = ref(null);
    let activeUser: any;
    const close = () => {
      bus.$emit("editInfantComplete", true);
    };
    // 勾选行事件
    const selectChange = (res: InfantTableList): void => {
      cxt.emit("selectChange", res);
    };

    // 编辑幼儿
    const handleEdit = (res: InfantTableList): void => {
      (editInfantCom.value as any).handleOpen(2, res);
    };

    // 家长管理/学籍列表
    const parentsManage = (res: InfantTableList): void => {
      (parentManageCom.value as any).handleOpen(res);
    };

    // 绑定考勤卡
    const bindTimeCard = (res: InfantTableList): void => {
      (bindTimeCardCom.value as any).handleOpen(2, res);
    };

    // 毕业
    const handleGraduate = (res: InfantTableList): void => {
      (infantGraduateCom.value as any).handleOpen(res);
    };

    //上传
    const uploadImg = (res: InfantTableList): void => {
      activeUser = res;
      (imgClip.value as any).init(
        {
          width: 1000,
          height: 1400,
        },
        res
      );
      // (imgClip.value as any).setImgSize(500, 700);
    };

    const photo = (res: InfantTableList): void => {
      activeUser = res;
      (camera.value as any).init(res);
    };

    // 正音
    function handleCurrcet(res: InfantTableList) {
      (currectSpellCom.value as any).handleOpen(res);
    }

    return {
      photo,
      handleEdit,
      parentsManage,
      bindTimeCard,
      uploadImg,
      editInfantCom,
      selectChange,
      TABLE_DATA,
      bindTimeCardCom,
      parentManageCom,
      micell,
      handleGraduate,
      infantGraduateCom,
      imgClip,
      camera,
      cmsUpload,
      close,
      dayjs,
      currectSpellCom,
      handleCurrcet,
    };
  },
});
</script>
<style lang="less" scoped>
.handle-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > li {
    margin-left: 16px;
  }
}

.name-box {
  display: flex;
  align-items: center;
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

.not-submit {
  font-size: 14px;
  color: #f56060;
}
</style>
