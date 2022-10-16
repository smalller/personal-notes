<template>
  <ui-modal
    v-model:visible="visible"
    :title="title"
    width="700"
    okText="保存"
    class="addOrEditPlace"
    @ok="ok"
  >
    <ui-form ref="form" :rules="rule" :model="formData">
      <ui-form-item label="场景名称" prop="scene">
        <ui-input
          v-model="formData.scene"
          style="width: 320px"
          placeholder="输入场景名称"
        ></ui-input>
      </ui-form-item>
      <ui-form-item label="开放日期">
        <ui-checkbox-group v-model="formData.openDays">
          <ui-checkbox label="0">周日</ui-checkbox>
          <ui-checkbox label="1">周一</ui-checkbox>
          <ui-checkbox label="2">周二</ui-checkbox>
          <ui-checkbox label="3">周三</ui-checkbox>
          <ui-checkbox label="4">周四</ui-checkbox>
          <ui-checkbox label="5">周五</ui-checkbox>
          <ui-checkbox label="6">周六</ui-checkbox>
        </ui-checkbox-group>
      </ui-form-item>
      <ui-form-item class="timePickerBox" label="开放时间">
        <div>
          <el-time-picker
            is-range
            v-model="amTime"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            :disabled-hours="() => (isPmTime ? makeRange(13, 23) : [])"
          >
          </el-time-picker>
          <ui-button
            icon="icon-a-81"
            type="text-primary"
            v-if="!isPmTime"
            @click="addTime"
            >新增时间</ui-button
          >
        </div>
        <div v-show="isPmTime">
          <el-time-picker
            is-range
            v-model="pmTime"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            :disabled-hours="() => makeRange(0, 12)"
          >
          </el-time-picker>
          <ui-button type="text" @click="deleteTime">删除</ui-button>
        </div>
      </ui-form-item>
      <!--      <ui-form-item label="已绑定视频">-->
      <!--        <div>-->
      <!--          <span-->
      <!--            v-if="videoLIst.length === 0"-->
      <!--            style="color: #f56060; font-size: 14px"-->
      <!--            >还未绑定视频</span-->
      <!--          >-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <ui-button type="primary" @click="openVideoList">选择视频</ui-button>-->
      <!--        </div>-->
      <!--      </ui-form-item>-->
      <!--      <ui-form-item label="已绑定班级">-->
      <!--        <div>-->
      <!--          <span v-if="!selectClass" style="color: #f56060; font-size: 14px"-->
      <!--            >还未绑定班级</span-->
      <!--          >-->
      <!--          <span v-else style="font-size: 14px; color: #222222">{{-->
      <!--            selectClass-->
      <!--          }}</span>-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <ui-button type="primary" @click="openClassList">选择班级</ui-button>-->
      <!--        </div>-->
      <!--      </ui-form-item>-->
    </ui-form>
  </ui-modal>
  <video-select ref="videoSelect"></video-select>
  <class-select ref="classSelect" @ok="getSelectClass"></class-select>
</template>

<script lang="ts">
import Message from "@/themes/message";
import { defineComponent, reactive, ref } from "vue";
import VideoSelect from "@/views/surveillanceVideo/components/videoSelect.vue";
import ClassSelect from "@/views/surveillanceVideo/components/classSelect.vue";
import micell from "micell";
import { saveScene } from "@/api/surveillanceVideo";
import { FormTable } from "@/base/interface.ts";
import dayjs from "dayjs";
interface openTimes {
  endTime: string;
  startTime: string;
}

interface PlaceData {
  id?: string;
  clazzIds?: string[];
  openDays: string[];
  openTimes?: openTimes[];
  scene: string;
  sceneId?: string;
  sceneName?: string;
  devNames?: string;
  clazzNames?: string;
  amStartTime?: string;
  amEndTime?: string;
  pmStartTime?: string;
  pmEndTime?: string;
}

export default defineComponent({
  name: "AddOrEditPlace",
  components: { ClassSelect, VideoSelect },
  emits: {
    close: null,
  },
  setup: function (props, context) {
    const title = ref("新增场景");
    const visible = ref(false);
    const amTime = ref<any[]>([]);
    const pmTime = ref<any[]>([]);
    const isPmTime = ref(false);
    const videoLIst = ref([]);
    const videoSelect = ref(null);
    const classSelect = ref(null);
    const form = ref(null);
    const isEdit = ref(false);
    const rule = reactive({
      scene: [{ required: true, message: "请输入场景名称", trigger: "blur" }],
    });
    //场景参数
    let formData: PlaceData = reactive({
      clazzIds: [],
      openDays: [],
      scene: "",
      id: "",
      openTimes: [],
    });

    /**
     * 打开新增或编辑窗口
     * @param data
     */
    const open = (data: PlaceData) => {
      title.value = "新增场景";
      isEdit.value = false;
      isPmTime.value = false;
      formData.scene = "";
      formData.id = "";
      formData.clazzIds = [];
      formData.openDays = ["1", "2", "3", "4", "5"];
      formData.openTimes = [];
      selectClass.value = "";
      const day = micell.date.format(dayjs().toDate(), "YYYY-MM-DD");
      amTime.value = [
        dayjs(day + " 08:00:00").toDate(),
        dayjs(day + " 18:00:00").toDate(),
      ];
      pmTime.value = [];
      if (data) {
        // console.log(data);
        // console.log(JSON.parse(data.openDays as unknown as string));
        formData.scene = data.sceneName || "";
        formData.id = data.sceneId || "";
        formData.openDays =
          JSON.parse(data.openDays as unknown as string) || [];
        selectClass.value = data.clazzNames || "";
        formData.clazzIds =
          JSON.parse(data.clazzIds as unknown as string) || [];
        const day = micell.date.format(dayjs().toDate(), "YYYY-MM-DD");
        if (data.amStartTime && data.amEndTime) {
          amTime.value = [
            dayjs(day + " " + data.amStartTime).toDate(),
            dayjs(day + " " + data.amEndTime).toDate(),
          ];
        }
        if (data.pmStartTime && data.pmEndTime) {
          isPmTime.value = true;
          pmTime.value = [
            dayjs(day + " " + data.pmStartTime).toDate(),
            dayjs(day + " " + data.pmEndTime).toDate(),
          ];
        }

        title.value = "编辑场景";
        isEdit.value = true;
      }
      visible.value = true;
    };
    const addTime = () => {
      isPmTime.value = true;
      const day = micell.date.format(dayjs().toDate(), "YYYY-MM-DD");
      amTime.value = [
        dayjs(day + " 08:00:00").toDate(),
        dayjs(day + " 12:59:00").toDate(),
      ];
      pmTime.value = [
        dayjs(day + " 13:00:00").toDate(),
        dayjs(day + " 18:00:00").toDate(),
      ];
    };
    const deleteTime = () => {
      isPmTime.value = false;

      pmTime.value = [];
    };

    const selectClass = ref("");
    interface clazz {
      name: string;
      id: string;
    }
    /**
     * 获取已选择的班级
     * @param list
     */
    const getSelectClass = (list: clazz[]) => {
      selectClass.value = list.map((item) => item.name).join(",");
      formData.clazzIds = list.map((item) => item.id);
    };

    const ok = () => {
      // console.log(amTime.value);
      if (!amTime.value) {
        Message.warning("请选择开放时间");
        return;
      }
      const data = amTime.value.find((i) => i === "");
      if (amTime.value.length > 1 && !data) {
        formData.openTimes = [
          {
            startTime: micell.date.format(amTime.value[0], "HH:mm:ss"),
            endTime: micell.date.format(amTime.value[1], "HH:mm:ss"),
          },
        ];
        if (isPmTime.value) {
          formData.openTimes.push({
            startTime: micell.date.format(pmTime.value[0], "HH:mm:ss"),
            endTime: micell.date.format(pmTime.value[1], "HH:mm:ss"),
          });
        }
      }

      (form.value as unknown as FormTable).validate((valid: boolean) => {
        if (valid) {
          saveScene(formData).then((res) => {
            if (res.code === 0) {
              visible.value = false;
              context.emit("close");
            }
          });
        }
      });
    };
    const makeRange = (start: number, end: number) => {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    };
    /**
     * 打开视频选择弹窗
     */
    const openVideoList = () => {
      if (videoSelect?.value) {
        (videoSelect.value as any).open("学校大门", []);
      }
    };
    /**
     * 打开班级选择弹窗
     */
    const openClassList = () => {
      if (classSelect?.value) {
        (classSelect.value as any).open(formData.scene, formData.clazzIds);
      }
    };
    return {
      title,
      visible,
      amTime,
      pmTime,
      isPmTime,
      videoLIst,
      videoSelect,
      classSelect,
      formData,
      form,
      rule,
      selectClass,
      makeRange,
      open,
      addTime,
      deleteTime,
      ok,
      openVideoList,
      openClassList,
      getSelectClass,
    };
  },
});
</script>

<style lang="less">
.addOrEditPlace {
  .el-checkbox {
    margin-right: 20px !important;
  }
  .timePickerBox {
    > div {
      > div {
        margin-bottom: 14px;
        .ui-button-text {
          color: #bfbfbf;
        }
        button {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
