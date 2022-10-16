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
              infantInfo.headerImgUrl || require('@/assets/infant-avatar.png')
            "
            alt=""
          />
        </div>
        <div class="user-info">
          <div class="top-info">
            <span class="name">{{ infantInfo.name || "暂无名称" }}</span>
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
        <span class="title">学籍信息</span>
        <ui-button style="height: auto" @click="handleExport" type="text">
          <ui-icon icon="icon-a-31"></ui-icon>
          导出学籍
        </ui-button>
      </div>
      <schoolRollInfo
        :studentId="studentId"
        :infantInfo="infantInfo"
      ></schoolRollInfo>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { InfantTableList } from "../index";
import Message from "@/themes/message";
import { downloadZipPost } from "@/base/common";
import schoolRollInfo from "@/components/SchoolRollInfo.vue";
import micell from "micell";

export default defineComponent({
  props: {
    index: String, // 1-现有幼儿，2-毕业幼儿，3-退园幼儿
  },
  components: {
    schoolRollInfo,
  },
  setup() {
    const drawerStatus = ref(false);
    const infantInfo = ref({} as InfantTableList); //传过来的幼儿信息
    const studentId = ref("");

    // 关闭抽屉回调
    const handleClose = (): void => {
      drawerStatus.value = false;
    };

    // 打开抽屉
    const handleOpen = (res: InfantTableList): void => {
      infantInfo.value = res;
      studentId.value = res.id;
      drawerStatus.value = true;
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
      handleOpen,
      drawerStatus,
      infantInfo,
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

      .title {
        font-size: 16px;
        color: #222;
      }

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
