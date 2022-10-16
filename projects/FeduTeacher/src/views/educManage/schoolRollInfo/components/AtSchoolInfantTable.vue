<template>
  <div class="school-infant-table">
    <schoolRollDetail ref="schoolRollDetailCom" index="1"></schoolRollDetail>
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
      <ui-table-column label="入园时间">
        <template #default="{ row }">
          <span>{{
            row.createTime ? dayjs(row.createTime).format("YYYY-MM-DD") : ""
          }}</span>
        </template>
      </ui-table-column>
      <ui-table-column label="幼儿寸照">
        <template #default="{ row }">
          <ui-tag :type="+row.setSchoolRoll === 1 ? 'success' : 'danger'">{{
            +row.setSchoolRoll === 1 ? "已提交" : "未提交"
          }}</ui-tag>
        </template>
      </ui-table-column>
      <ui-table-column label="学籍信息">
        <template #default="{ row }">
          <ui-tag :type="+row.setSchoolRoll === 1 ? 'success' : 'danger'">{{
            +row.setSchoolRoll === 1 ? "已提交" : "未提交"
          }}</ui-tag>
        </template>
      </ui-table-column>
      <ui-table-column label="短信提醒">
        <template #default="{ row }">
          <div class="remind-box">
            <span
              :style="{ color: +row.setSchoolRoll === 1 ? '#BFBFBF' : '#222' }"
              >{{ row.smsCount || 0 }}</span
            >
            <span class="shu">|</span>
            <template v-if="+row.setSchoolRoll === 1">
              <span class="remind-btn">提醒</span>
            </template>
            <template v-else>
              <template v-if="planSendList.indexOf(row.id) !== -1">
                <span class="remind-btn">发送中</span>
                <img class="loading-img" src="@/assets/loading.png" alt="" />
              </template>
              <template v-else-if="+row.smsMessage === 0">
                <span class="remind-btn can-send" @click="handleRemind(row)"
                  >提醒</span
                >
              </template>
              <template v-else-if="row.smsMessage === 'OK'">
                <span
                  class="remind-btn"
                  @mouseenter="showEmptyDataIndex = row.id"
                  @mouseout="showEmptyDataIndex = ''"
                  >已提醒</span
                >
                <img src="@/assets/true.png" alt="" />
                <div
                  class="is-empty-data"
                  v-show="
                    showEmptyDataIndex === row.id && row.smsMessage === 'OK'
                  "
                >
                  <span>当天只能发1次</span>
                </div>
              </template>
              <template v-else>
                <span class="remind-btn can-send" @click="handleRemind(row)"
                  >重发</span
                >
                <img src="@/assets/reload.png" alt="" />
              </template>
            </template>
          </div>
        </template>
      </ui-table-column>
      <ui-table-column prop="age" label="操作" align="right">
        <template #default="{ row }">
          <ul class="handle-box">
            <li>
              <ui-button
                :disabled="+row.setSchoolRoll !== 1"
                type="text-blue"
                @click="viewSchoolRollDetail(row)"
                >详情</ui-button
              >
            </li>
          </ul>
        </template>
      </ui-table-column>
    </ui-table>
    <logoutIdentity
      ref="logoutIdentityCom"
      @handleSure="handleSure"
      :width="420"
    >
      <p class="body-text">每位家长当天只能发送1次短信且不能撤销，请慎重！</p>
    </logoutIdentity>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import schoolRollDetail from "./SchoolRollDetail.vue";
import micell from "micell";
import { InfantTableList } from "../index";
import { remindOne } from "@/api/schoolRollInfo";
import Message from "@/themes/message";
import dayjs from "dayjs";
import logoutIdentity from "@/components/logoutIdentity.vue";
import bus from "@/Layout/bus";

export default defineComponent({
  components: {
    schoolRollDetail,
    logoutIdentity,
  },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange", "updateList"],
  setup(props, cxt) {
    const TABLE_DATA = computed(() => props.data);
    const schoolRollDetailCom = ref(null);
    const logoutIdentityCom = ref(null);
    const targetInfo = ref();
    const showEmptyDataIndex = ref(""); // 当前鼠标移入的目标
    const planSendList = ref([] as string[]); //即将要发送的列表

    // 勾选行事件
    const selectChange = (res: InfantTableList): void => {
      console.log(res.length);
      cxt.emit("selectChange", res);
    };

    // 确定短信提醒操作
    async function handleSure() {
      planSendList.value.push(targetInfo.value.id);
      remindOne(targetInfo.value.schoolName, [targetInfo.value.id])
        .then((res) => {
          if (+res.code === 0) {
            setTimeout(() => {
              Message.success("提醒信息发送成功");
            }, 2000);
          }
        })
        .finally(() => {
          setTimeout(() => {
            planSendList.value = [];
            cxt.emit("updateList");
          }, 2000);
        });
    }

    // 短信提醒
    const handleRemind = async (res: InfantTableList): Promise<void> => {
      planSendList.value = [];
      targetInfo.value = res;
      (logoutIdentityCom.value as any).handleOpen(
        `确定向 ${targetInfo.value.name} 的家长发送短信吗？`
      );
    };

    // 家长管理/学籍列表
    const viewSchoolRollDetail = (res: InfantTableList): void => {
      (schoolRollDetailCom.value as any).handleOpen(res);
    };

    onMounted(() => {
      // 批量发送信息
      bus.$on("updateSendStatus", (res: string[]) => {
        planSendList.value = res;
      });
    });

    onUnmounted(() => {
      bus.$off("updateSendStatus");
    });

    return {
      handleRemind,
      viewSchoolRollDetail,
      selectChange,
      TABLE_DATA,
      schoolRollDetailCom,
      micell,
      dayjs,
      handleSure,
      logoutIdentityCom,
      showEmptyDataIndex,
      planSendList,
    };
  },
});
</script>
<style lang="less">
.school-infant-table {
  .body-text {
    font-size: 14px;
    color: #f56060;
    margin-bottom: 10px;
  }

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

  td .ui-table-column-box {
    overflow: inherit;
  }

  .remind-box {
    display: flex;
    align-items: center;
    position: relative;

    .shu {
      color: #bfbfbf;
      margin: 0 4px;
    }

    img {
      margin-left: 10px;
      width: 20px;
      height: 20px;
    }

    .remind-btn {
      cursor: pointer;
      color: #bfbfbf;
      // width: 44px;
    }

    .can-send {
      color: #4fa8f9;
    }

    .loading-img {
      width: 24px;
      height: 24px;
      animation: rotating 1s linear infinite;
    }

    .is-empty-data {
      position: absolute;
      top: -52px;
      left: -20px;
      font-size: 14px;
      text-align: center;
      line-height: 36px;
      color: #222;
      z-index: 99;
      width: 122px;
      height: 36px;
      background: #ffffff;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 3px;

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
          left: 64px;
          margin-left: -10px;
          border: 10px solid transparent;
          border-top: 10px solid #fff;
        }
      }
    }
  }
}
</style>
