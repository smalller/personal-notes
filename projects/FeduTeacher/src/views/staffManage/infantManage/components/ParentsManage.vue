<template>
  <el-drawer
    custom-class="drawer-box"
    v-model="drawerStatus"
    :before-close="handleClose"
    destroy-on-close
    z-index="99"
  >
    <div class="container">
      <div class="top-box">
        <div class="avatar">
          <img
            :src="
              infantInfo.headerImgUrl
                ? infantInfo.headerImgUrl
                : require('@/assets/infant-avatar.png')
            "
            alt=""
          />
        </div>
        <div class="user-info">
          <div class="top-info">
            <span class="name">{{ infantInfo.name || "暂无名称" }}</span>
            <span class="icon"
              ><ui-icon icon="icon-a-52" @click="editUserInfo"></ui-icon
            ></span>
          </div>
          <div class="bottom-info">
            <span>{{ infantInfo.clazzName }}</span>
            <span>入园时间：{{ infantInfo.createTime || "暂无" }}</span>
            <span v-if="index != '1'"
              >{{ index === "2" ? "毕业" : "退园" }}时间：{{
                (index === "2"
                  ? infantInfo.graduateTime
                  : infantInfo.retreatTime) || "暂无"
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="top-tab-box">
        <TopType
          :topTypeList="staticData.parentManagePageTopType"
          @changeTopType="changeTopType"
          :current="currentType"
        ></TopType>
        <ui-button
          style="height: auto"
          @click="handleExport"
          type="text"
          v-show="currentType === 1"
        >
          <ui-icon icon="icon-a-31"></ui-icon>
          导出学籍
        </ui-button>
      </div>
      <schoolRollInfo
        v-if="currentType === 1"
        :studentId="studentId"
        :infantInfo="infantInfo"
      ></schoolRollInfo>
      <div class="content-box" v-if="currentType === 2">
        <div class="list-box">
          <ul v-if="renderList.length !== 0">
            <li class="li-box" v-for="item in renderList" :key="item.id">
              <div class="user-box">
                <div class="parent-relation">
                  <span>{{ infantInfo.name }}</span>
                  <span>{{ item.familyRels.describe || "-" }}</span>
                </div>
              </div>
              <div class="botom-box">
                <div class="img-box">
                  <img
                    :src="
                      item.familyHeadImg
                        ? item.familyHeadImg
                        : require('@/assets/staff-avatar.png')
                    "
                    alt=""
                  />
                </div>
                <ul class="botom-box-li parent-list">
                  <li>真实姓名：{{ item.familyName || "-" }}</li>
                  <li>民族：{{ tranNation(item.nation) || "-" }}</li>
                  <li>联系电话：{{ item.familyTelephone || "-" }}</li>
                  <li>身份证号：{{ item.certNo || "-" }}</li>
                  <li>亲属关系：{{ item.familyRels.describe || "-" }}</li>
                  <li>常住地址：{{ item.liveAdress || "-" }}</li>
                  <li>
                    性别：{{ +item.familySex === 1 ? "男" : "女" || "-" }}
                  </li>
                  <li>个性签名：{{ item.personSign || "-" }}</li>
                  <li>出生年月：{{ item.userBirthday || "-" }}</li>
                </ul>
              </div>
            </li>
          </ul>
          <span class="no-data" v-else>暂无家长信息</span>
        </div>
      </div>
    </div>
  </el-drawer>
  <EditInfant ref="editInfantCom"></EditInfant>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import EditInfant from "./EditInfant.vue";
import { parentListInfo } from "@/api/infantManage";
import { useStore } from "vuex";
import bus from "@/Layout/bus";
import TopType from "@/components/TopType.vue";
import { staticData, InfantTableList } from "../util";
import { TopTypeListItem } from "@/utils/common";
import Message from "@/themes/message";
import { downloadZipPost } from "@/base/common";
import schoolRollInfo from "@/components/SchoolRollInfo.vue";
import micell from "micell";

export default defineComponent({
  props: {
    index: String, // 1-现有幼儿，2-毕业幼儿，3-退园幼儿
  },
  components: {
    EditInfant,
    TopType,
    schoolRollInfo,
  },
  setup() {
    const $store = useStore();
    const nationList = $store.state.commonData.nationList;
    const editInfantCom = ref(null);
    const drawerStatus = ref(false);
    const infantInfo = ref({} as InfantTableList); //传过来的幼儿信息
    const renderList = ref([]) as any;
    const studentId = ref("");
    const currentType = ref(2);

    // 关闭抽屉回调
    const handleClose = (): void => {
      drawerStatus.value = false;
      currentType.value = 2;
      renderList.value = [];
    };

    // 获取家长信息列表
    const getParentListInfo = async (): Promise<void> => {
      const { code, data } = await parentListInfo(studentId.value);
      if (+code === 0) {
        renderList.value = data.list;
      }
    };

    // 打开抽屉
    const handleOpen = (res: InfantTableList): void => {
      infantInfo.value = res;
      studentId.value = res.id;
      getParentListInfo();
      drawerStatus.value = true;
    };

    // 编辑幼儿信息
    const editUserInfo = (): void => {
      (editInfantCom.value as any).handleOpen(2, infantInfo.value);
    };

    // 关闭抽屉
    bus.$on("updateParentList", (res: boolean) => {
      res && (drawerStatus.value = false);
    });

    // 民族枚举转换
    const tranNation = (nationId: string): string => {
      let nationName = "";
      nationList.forEach((item: any) => {
        if (item.codeInfoValue === nationId) {
          nationName = item.codeInfoName;
        }
      });
      return nationName;
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      currentType.value = res.value;
      currentType.value === 2 && getParentListInfo();
    };

    // 导出幼儿学籍信息
    function handleExport() {
      if (infantInfo.value.schoolRollId) {
        downloadZipPost(
          process.env.VUE_APP_BASE_API + `/schools/api/schoolRoll/downZip`,
          `${infantInfo.value.schoolName}-${
            infantInfo.value.name
          }-${micell.date.format(new Date(), "YYYY-MM-DD")}`,
          [infantInfo.value.schoolRollId]
        );
      } else {
        Message.warning("暂无学籍信息可导出");
      }
    }

    return {
      handleClose,
      editUserInfo,
      editInfantCom,
      handleOpen,
      drawerStatus,
      infantInfo,
      renderList,
      tranNation,
      staticData,
      changeTopType,
      currentType,
      handleExport,
      studentId,
    };
  },
});
</script>
<style lang="less">
.drawer-box {
  width: 960px !important;

  .shu {
    width: 3px;
    height: 14px;
    background: #ff9f3d;
    margin-right: 8px;
  }

  .container {
    width: 100%;
    padding: 0 40px 40px 40px;

    .type-item {
      font-size: 16px;
    }

    .top-tab-box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        padding: 0;
      }
    }

    .content-box {
      margin-top: 15px;
    }

    .top-box {
      display: flex;
      margin-bottom: 30px;

      .avatar {
        width: 60px;
        height: 60px;
        margin-right: 15px;
        > img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }

      .user-info {
        .top-info {
          margin-bottom: 7px;
          display: flex;
          align-items: center;
          .name {
            font-size: 24px;
            color: #222;
            margin-right: 14px;
          }
          .icon {
            line-height: 0;
            font-size: 16px;
            color: #9a9a9a;
            cursor: pointer;
            &:hover {
              color: #ff9900;
            }
          }
        }

        .bottom-info {
          font-size: 14px;
          color: #999;
          > span {
            margin-right: 20px;
          }
        }
      }
    }

    .list-box {
      .no-data {
        font-size: 14px;
        color: #666666;
      }

      ul > li.li-box {
        border: 1px solid #e8e8e8;
        border-bottom: none;
        &:last-child {
          border-bottom: 1px solid #e8e8e8;
        }

        .user-box {
          height: 52px;
          padding: 15px 24px;
          box-sizing: border-box;
          background-color: #fafafa;
          border-bottom: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
          .parent-relation {
            font-size: 16px;
            color: #222;
            > span {
              margin-right: 10px;
            }
          }
        }

        .guardian-box {
          padding: 18px 24px;
          color: #222;
          font-size: 14px;

          ul {
            display: flex;
            flex-wrap: wrap;

            > li {
              margin-bottom: 12px;
              width: 50%;
            }
          }
        }

        .botom-box {
          display: flex;
          padding: 18px 24px 20px 24px;
          background-color: #fff;
          font-size: 14px;
          color: #222;

          .school-roll-img-box {
            margin-right: 24px;
            > img {
              width: 106px;
              height: 148px;
              object-fit: cover;
              border: 1px solid rgba(0, 0, 0, 0.05);
            }
          }

          .img-box {
            margin-right: 30px;
            > img {
              width: 80px;
              height: 80px;
              border-radius: 50%;
            }
          }

          .botom-box-li {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            li {
              width: 50%;
            }

            li:nth-child(2n-1) {
              width: 252px;
            }

            li:nth-child(2n) {
              flex-grow: 1;
            }
          }

          .school-roll li {
            margin-bottom: 12px;
          }

          .parent-list li {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
