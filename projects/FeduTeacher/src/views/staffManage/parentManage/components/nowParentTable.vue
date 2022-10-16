<template>
  <div class="parent-manage-table">
    <EditParent ref="editParentCom"></EditParent>
    <openMonitoring ref="openMonCom"></openMonitoring>
    <ui-table :data="TABLE_DATA" @selectChange="selectChange" :checkbox="true">
      <ui-table-column label="家长姓名">
        <template #default="{ row }">
          <div class="name-box">
            <img
              class="avatar"
              :src="
                row.headPortraitUrl
                  ? row.headPortraitUrl
                  : require('@/assets/staff-avatar.png')
              "
              alt=""
            />
            <span>{{ row.userName }}</span>
          </div>
        </template>
      </ui-table-column>
      <ui-table-column prop="mobile" label="手机号"> </ui-table-column>
      <ui-table-column prop="stuClazz" label="幼儿及班级"> </ui-table-column>
      <ui-table-column label="监控到期时间">
        <template #default="{ row }">
          <span v-if="row.cameraExpireTime">{{ row.cameraExpireTime }}</span>
          <!-- <ui-button
            type="text-blue"
            v-if="row.cameraExpireTime"
            @click="handleSetMon(row)"
            >{{ row.cameraExpireTime }}</ui-button
          > -->
          <span v-else>未开通</span>
        </template>
      </ui-table-column>
      <ui-table-column label="开通监控">
        <template #default="{ row }">
          <div class="switch-box">
            <el-switch
              disabled
              @mouseenter="showEmptyData(row.userId)"
              v-model="row.cameraStatus"
              :active-value="true"
              :inactive-value="false"
              :before-change="beforeChangeMon"
              @click="handleClick(row)"
            ></el-switch>
            <div
              class="is-empty-data"
              v-show="showEmptyDataIndex === row.userId"
            >
              <span>请联系金树丫运营人员操作</span>
            </div>
          </div>
        </template>
      </ui-table-column>
      <ui-table-column label="操作" align="right">
        <template #default="{ row }">
          <ul class="handle-box">
            <li>
              <ui-button type="text-blue" @click="handleEdit(row)"
                >详情</ui-button
              >
            </li>
          </ul>
        </template>
      </ui-table-column>
    </ui-table>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import EditParent from "./EditParent.vue";
import micell from "micell";
import { parentTableList } from "../index";
import openMonitoring from "./OpenMonitoring.vue";
import { onCamera, selectUserById } from "@/api/parentManage";
import Message from "@/themes/message";
import bus from "@/Layout/bus";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    EditParent,
    openMonitoring,
  },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange"],
  setup(props, cxt) {
    const TABLE_DATA = computed(() => props.data);
    const showEmptyDataIndex = ref(""); // 当前鼠标移入的目标
    const editParentCom = ref(null);
    const openMonCom = ref(null);
    const tableRow = ref();
    let timer = -1;

    // 勾选行事件
    const selectChange = (res: Array<parentTableList>): void => {
      cxt.emit("selectChange", res);
    };

    // 家长详情
    async function getParentDetail(userId: string) {
      const { code, data } = await selectUserById(userId);
      if (+code === 0) {
        data.userSex = +data.userSex === 1 ? "男" : "女";
        return Promise.resolve(data);
      }
    }

    // 查看家长详情信息
    const handleEdit = (res: parentTableList): void => {
      getParentDetail(res.userId).then((data) => {
        (editParentCom.value as any).handleOpen(data);
      });
    };

    // 点击开关获取当前正在点击的行信息
    function handleClick(row: any) {
      tableRow.value = row;
    }

    // 关闭监控操作
    const handleCloseMon = async (userId: string): Promise<boolean> => {
      let obj = {
        cameraStatus: false,
        expireTime: null,
        userId,
      };
      const { code } = await onCamera([obj]);
      if (+code === 0) {
        Message.success("关闭成功");
        bus.$emit("editParentComplete", true); // 通知更新表格
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    };

    // 操作开关
    function beforeChangeMon() {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (+tableRow.value.cameraStatus === 0) {
            (openMonCom.value as any).handleOpen([tableRow.value]);
            return resolve(false);
          } else {
            handleCloseMon(tableRow.value.userId).then((res) => {
              return resolve(res);
            });
          }
        }, 50);
      });
    }

    // 点击监控时间设置监控
    function handleSetMon(row: any) {
      if (row.cameraStatus === true) {
        (openMonCom.value as any).handleOpen([row], 1);
      }
    }

    // 展示禁止操作提示
    function showEmptyData(id: string) {
      clearTimeout(timer);
      showEmptyDataIndex.value = id;
      timer = setTimeout(() => {
        showEmptyDataIndex.value = "";
      }, 2000);
    }

    return {
      handleEdit,
      selectChange,
      editParentCom,
      TABLE_DATA,
      micell,
      beforeChangeMon,
      openMonCom,
      handleClick,
      handleSetMon,
      dayjs,
      showEmptyDataIndex,
      showEmptyData,
    };
  },
});
</script>
<style lang="less">
.parent-manage-table {
  .handle-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > li {
      margin-left: 16px;
    }
  }

  .limits-box {
    > span {
      margin-right: 12px;
      &:last-child {
        margin-right: 0;
      }
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

  td .ui-table-column-box {
    overflow: inherit;
  }

  .switch-box {
    position: relative;
    .is-empty-data {
      position: absolute;
      top: -52px;
      left: -76px;
      font-size: 14px;
      text-align: center;
      line-height: 36px;
      color: #222;
      z-index: 99;
      background: #ffffff;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      width: 198px;
      height: 36px;

      > span {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;

        &::before {
          display: block;
          content: "";
          width: 0;
          position: absolute;
          bottom: -20px;
          left: 98px;
          margin-left: -10px;
          border: 10px solid transparent;
          border-top: 10px solid #fff;
        }
      }
    }
  }
}
</style>
