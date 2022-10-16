<template>
  <div class="videoItem">
    <img
      class="videoBg"
      v-if="+info.onlineStatus === 1 || +props.videoType === 1"
      :src="info.coverPictureUrl"
      alt=""
    />
    <img
      v-if="+info.onlineStatus === 1 || +props.videoType === 1"
      class="playBtn"
      @click="play"
      src="@/assets/images/playBtn.svg"
    />
    <div class="videoBg" v-if="+info.onlineStatus === 0">
      <ui-icon icon="icon-a-zu230"></ui-icon>
      <span>无法开启视频</span>
      <p>请先检查网络后刷新，仍无法开启请联系客服</p>
    </div>
    <div class="refreshBtn" @click="refreshBtn" v-if="+info.onlineStatus === 0">
      <ui-icon icon="icon-a-zu1698"></ui-icon>
      <span>刷新</span>
    </div>
    <div
      class="videoInfo"
      :class="{ warning: !info.sceneId }"
      @click="editVideoInfo"
    >
      <div>
        <span v-if="+props.videoType === 1">{{ info.name }}</span>
        <span v-if="+props.videoType === 0">{{ info.ipcName }}</span>

        <ui-icon icon="icon-a-52"></ui-icon>
        <span v-show="!info.sceneId"> 还未绑定场景</span>
      </div>
      <div></div>
    </div>
    <ui-modal
      title="编辑摄像头"
      okText="保存"
      :width="498"
      @ok="saveEditDevice"
      v-model:visible="editVideoInfoModalStatus"
    >
      <ui-form :data="form" label-width="82">
        <ui-form-item label="通道ID">
          <ui-input
            v-if="+props.videoType === 0"
            disabled
            placeholder=""
            v-model="form.ipcId"
          ></ui-input>
          <ui-input
            v-if="+props.videoType === 1"
            disabled
            placeholder=""
            v-model="form.id"
          ></ui-input>
        </ui-form-item>
        <ui-form-item label="摄像头名称">
          <ui-input
            v-if="+props.videoType === 0"
            disabled
            placeholder=""
            v-model="form.ipcName"
          ></ui-input>
          <ui-input
            v-if="+props.videoType === 1"
            disabled
            placeholder=""
            v-model="form.name"
          ></ui-input>
        </ui-form-item>

        <ui-form-item label="所属场景" prop="type">
          <ui-select v-model="form.sceneId" style="width: 100%">
            <ui-select-option label="未绑定" value=""></ui-select-option>
            <ui-select-option
              v-for="item in sceneList"
              :key="item.id"
              :label="item.scene"
              :value="item.id"
            ></ui-select-option>
          </ui-select>
        </ui-form-item>
      </ui-form>

      <template #tips>
        提示：带<span style="color: #f56060">&nbsp;*&nbsp; </span
        >号必填。没有场景去“场景管理”新增
      </template>
    </ui-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import {
  editDevice,
  refreshDevice,
  editEvDevice,
} from "@/api/surveillanceVideo";
import Message from "@/themes/message";

export default defineComponent({
  emits: {
    play: null,
    edit: null,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    videoType: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
    sceneList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    // console.log(props, "1111111111111111111111");
    const sceneList = ref([] as any);
    const form = reactive({
      ipcName: "22",
      ipcId: "1",
      sceneId: "1",
      id: "",
      name: "",
    });
    //摄像头信息编辑弹窗显示状态
    const editVideoInfoModalStatus = ref(false);
    /**
     * 打开编辑摄像头信息弹窗
     */
    const editVideoInfo = (): void => {
      if (+props.videoType === 1) {
        form.id = props.info.id;
        form.name = props.info.name;
        form.sceneId = props.info.sceneId;
      } else {
        form.ipcName = props.info.ipcName;
        form.ipcId = props.info.ipcId;
        form.sceneId = props.info.sceneId;
      }
      editVideoInfoModalStatus.value = true;
    };

    /**
     * 点击播放按钮
     */
    const play = (): void => {
      context.emit("play", props.info);
    };

    /**
     * 刷新按钮
     */
    const refreshBtn = (): void => {
      refreshDevice({
        id: props.info.ipcId,
      }).then((res) => {
        if (res.code === 0) {
          context.emit("edit");
          Message.success("刷新成功");
        } else {
          Message.warning(res.msg);
        }
      });
    };

    /**
     * 保存编辑信息
     */
    const saveEditDevice = (): void => {
      console.log(form);
      if (+props.videoType === 1) {
        editEvDevice(form).then((res) => {
          if (res.code === 0) {
            context.emit("edit");
            editVideoInfoModalStatus.value = false;
          }
        });
      } else {
        editDevice(form).then((res) => {
          if (res.code === 0) {
            context.emit("edit");
            editVideoInfoModalStatus.value = false;
          }
        });
      }
    };

    return {
      editVideoInfo,
      editVideoInfoModalStatus,
      play,
      form,
      saveEditDevice,
      refreshBtn,
      props,
    };
  },
});
</script>

<style scoped lang="less">
.videoItem {
  box-sizing: border-box;
  width: 370px;
  height: 208px;
  border: 1px solid #d9d9d9;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .videoBg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .icon {
      width: 38px;
      height: 30px;
      fill: #f56060;
    }
    span {
      margin-top: 10px;
      color: #f56060;
      font-size: 12px;
    }
    p {
      margin-top: 10px;
      font-size: 12px;
      color: #999999;
    }
  }
  .refreshBtn {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    width: 76px;
    height: 32px;
    opacity: 1;
    background: #ff9900;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      width: 14px;
      height: 14px;
      fill: #ffffff;
    }
    span {
      font-size: 14px;
      margin-left: 4px;
      color: #ffffff;
    }
  }
  .playBtn {
    cursor: pointer;
    width: 46px;
    height: 46px;
    opacity: 0.8;
    border-radius: 50%;
    user-select: none;
  }
  .videoInfo {
    white-space: nowrap;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    &.warning {
      background: #f56060;
    }
    .icon {
      fill: #ffffff;
      width: 12px;
      margin-left: 10px;
      margin-right: 5px;
    }
    span {
      font-size: 14px;
      color: #ffffff;
    }
  }
}
</style>
