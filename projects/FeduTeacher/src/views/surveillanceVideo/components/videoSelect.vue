<template>
  <ui-modal
    width="800"
    v-model:visible="visible"
    :title="`${title} 绑定视频`"
    class="videoSelect"
    @ok="ok"
    okText="保存"
  >
    <div class="videoSelectHead">
      <div>
        <div>
          <span>场景</span>
          <ui-select
            v-model="sceneIds"
            @change="queryAllVideo"
          >
            <ui-select-option
              label="全部"
              value=""
            ></ui-select-option>
            <ui-select-option
              v-for="item in sceneList"
              :key="item.id"
              :label="item.scene"
              :value="item.id"
            ></ui-select-option>
          </ui-select>
        </div>
        <ui-input
          style="width: 200px; margin-left: 16px"
          placeholder="输入摄像头名称"
          icon="icon-a-101"
          v-model="videoName"
        ></ui-input>
      </div>
      <div>
        <!--        <span>排序</span>-->
        <!--        <ui-select placeholder="排序方式">-->
        <!--          <ui-select-option label="按名称排序" value="1"></ui-select-option>-->
        <!--        </ui-select>-->
      </div>
    </div>
    <div class="videoSelectContent scroll">
      <div
        class="videoSelectItem"
        v-show="+props.videoType === 0"
        v-for="(item, index) in videoSelectList"
        :key="index"
        :class="{ active: selected.includes(item.ipcId) }"
        @click="select(item)"
      >
        <div>
          <div></div>
          <div class="selectIcon">
            <ui-icon icon="icon-a-63"></ui-icon>
          </div>
          <img
            :src="item.coverPictureUrl"
            alt=""
          />
        </div>
        <span>{{ item.ipcName }}</span>
      </div>
      <div
        class="videoSelectItem"
        v-show="+props.videoType === 1"
        v-for="(item, index) in videoSelectList"
        :key="index"
        :class="{ active: selected.includes(item.id) }"
        @click="select(item)"
      >
        <div>
          <div></div>
          <div class="selectIcon">
            <ui-icon icon="icon-a-63"></ui-icon>
          </div>
          <img
            :src="item.coverPictureUrl"
            alt=""
          />
        </div>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <template #tips>
      <div class="tipsBox">
        <ui-button @click="allSelect">全选</ui-button>
        <p>
          已选
          <span>{{ selected.length }}</span>
          项
        </p>
      </div>
    </template>
  </ui-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import {
  getSchoolAllVideo,
  queryAllScene,
  queryEvCamera,
} from "@/api/surveillanceVideo";

export default defineComponent({
  name: "videoSelect",
  emits: {
    ok: null,
  },
  props: {
    isPlace: {
      type: Boolean,
      default: false,
    },
    videoType: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const visible = ref(false);
    const title = ref("");
    const videoSelectList = ref([] as Array<any>);
    const saveVideoList = ref([] as any[]);
    let selected = ref([] as string[]);
    const videoName = ref("");
    let sceneList = ref([] as any);
    const sceneIds = ref("");
    const ok = () => {
      context.emit("ok", {
        list: selected.value,
        classId: dataId,
      });
      visible.value = false;
      selected.value = [];
    };
    let dataId: string;
    const open = (name: string, list: string[] = [], id: string) => {
      console.log(list);
      title.value = name;
      selected.value = list;
      visible.value = true;
      sceneIds.value = "";
      if (id) {
        dataId = id;
      }
      queryAllVideo();
      queryScene();
    };

    watch(videoName, () => {
      searchNameVideo();
    });

    /**
     * 查询所有场景
     */
    const queryScene = () => {
      queryAllScene().then((res) => {
        if (res.code === 0) {
          console.log(res);
          sceneList.value = res.data;
        }
      });
    };

    const searchNameVideo = () => {
      if (!videoName.value) {
        videoSelectList.value = saveVideoList.value;
      } else {
        videoSelectList.value = saveVideoList.value.filter((item) => {
          if (item.ipcName && item.ipcName.indexOf(videoName.value) > -1) {
            return item;
          }
        });
      }
    };

    /**
     * 查询学校所有监控视频
     */
    const queryAllVideo = () => {
      if (+props.videoType === 0) {
        getSchoolAllVideo({ sceneId: sceneIds.value }).then((res) => {
          if (res.code === 0) {
            videoSelectList.value = res.data;
            saveVideoList.value = res.data;
          }
        });
      } else {
        queryEvCamera({ sceneId: sceneIds.value }).then((res) => {
          if (res.code === 0) {
            videoSelectList.value = res.data.list;
            saveVideoList.value = res.data.list;
          }
        });
      }
    };

    /**
     * 全选
     */
    const allSelect = () => {
      if (selected.value.length === videoSelectList.value.length) {
        selected.value = [];
      } else {
        selected.value = [];
        videoSelectList.value.forEach((item) => {
          if (+props.videoType === 0) {
            selected.value.push(item.ipcId);
          } else {
            selected.value.push(item.id);
          }
        });
      }
    };
    /**
     * 选择视频
     * @param ipcId
     */
    const select = (item: any) => {
      if (+props.videoType === 0) {
        if (selected.value.includes(item.ipcId)) {
          selected.value = selected.value.filter(
            (id: string) => item.ipcId !== id
          );
        } else {
          selected.value.push(item.ipcId);
        }
      } else {
        if (selected.value.includes(item.id)) {
          selected.value = selected.value.filter(
            (id: string) => item.id !== id
          );
        } else {
          selected.value.push(item.id);
        }
      }
    };
    return {
      ok,
      visible,
      open,
      select,
      title,
      selected,
      videoSelectList,
      allSelect,
      searchNameVideo,
      videoName,
      sceneList,
      sceneIds,
      queryAllVideo,
      props,
    };
  },
});
</script>

<style scoped lang="less">
.videoSelect {
  .videoSelectHead {
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
      span {
        color: #999999;
        margin-right: 6px;
      }
    }
  }
  .videoSelectContent {
    margin-top: 14px;
    overflow-y: auto;
    max-height: 420px;
    display: grid;
    grid-template-rows: repeat(auto-fill, 91px);
    grid-template-columns: repeat(5, 122px);
    grid-row-gap: 14px;
    grid-column-gap: 30px;
    padding-right: 2px;
    padding-left: 1px;
    .videoSelectItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      > div {
        width: 124px;
        height: 70px;
        border: 1px solid #bfbfbf;
        box-sizing: border-box;
        position: relative;
        > div {
          transition: all 0.3s;
          position: absolute;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: none;
          background: rgba(0, 0, 0, 0.5);
        }
        .selectIcon {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 24px;
          height: 24px;
          background: #ff9900;
          display: none;
          justify-content: center;
          align-items: center;
          .icon {
            width: 10px;
            height: 8px;
            fill: #ffffff;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      span {
        margin-top: 5px;
        font-size: 12px;
        font-weight: 400;
        color: #222222;
      }
      &:hover {
        div {
          border-color: #707070;
          div {
            display: block;
          }
          .selectIcon {
            display: none;
          }
        }
      }
      &.active {
        div {
          border-color: #707070;
          div {
            display: block;
          }
          .selectIcon {
            display: flex;
          }
        }
      }
    }
  }
  .tipsBox {
    display: flex;
    align-items: center;
    p {
      margin-left: 10px;
      span {
        color: #222222;
      }
    }
  }
}
</style>
