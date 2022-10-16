<template>
  <div id="bind-card-box">
    <ui-modal
      v-model:visible="modalStatus"
      @close="handleClose"
      :title="username + ' 绑定考勤卡'"
      width="600"
      :showClose="false"
      :tips="false"
      :buttonShow="false"
    >
      <div class="body-text-box">
        <div class="bind-card-box">
          <p>卡号</p>
          <p class="input-box">
            <ui-input
              v-model="cardId"
              maxlength="40"
              placeholder="请输入考勤卡卡号"
            ></ui-input>
            <ui-select
              v-model="familyUserId"
              style="margin-left: 10px"
              v-if="userIdentity === 3"
            >
              <ui-select-option
                v-for="item in familyList"
                :key="item.id"
                :value="item.familyUserId"
                :label="`${item.familyName}-${item.familyRels.describe}`"
              />
            </ui-select>
            <ui-button type="primary" class="bind-btn" @click="handleBindCard"
              >绑定</ui-button
            >
          </p>
        </div>
        <!--        <div class="bind-card-box" v-if="userIdentity === 2">-->
        <!--          <p>选择家长</p>-->
        <!--          <div class="selectParent">-->
        <!--            <ui-select>-->
        <!--              <ui-select-option-->
        <!--                v-for="item in familyList"-->
        <!--                :key="item.id"-->
        <!--                :item="item.id"-->
        <!--                :label="`${item.familyName}-${item.familyRels.describe}`"-->
        <!--              />-->
        <!--            </ui-select>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="yet-bind-card-box">
          <p>已绑定卡号</p>
          <div>
            <ul v-if="yetBindCardList.length > 0">
              <li v-for="item in yetBindCardList" :key="item.innerNumber">
                <div>
                  {{ item.outNumber }}
                </div>
                <div>
                  {{ item.familyRel }}
                </div>
                <div
                  :style="{ color: item.enableStatus == 9 ? '#F56060' : '' }"
                >
                  {{ cardStatus(item.enableStatus) }}
                </div>
                <div>
                  <ui-button type="text-blue" @click="handleLoss(item)">{{
                    handleCardStatus(item.enableStatus)
                  }}</ui-button>
                </div>
              </li>
            </ul>
            <span v-else>未绑定考勤卡</span>
          </div>
        </div>
        <div class="userPhoto">
          <p>人脸照片</p>
          <div>
            <div class="photoBox">
              <div class="photo">
                <img :src="userPhoto" v-show="userPhoto" alt="" />
                <ui-icon v-show="!userPhoto" icon="icon-a-81" />
              </div>
              <div class="photo">
                <ui-button @click="uploadImg">上传照片</ui-button>
                <ui-button type="primary" @click="photo">拍摄</ui-button>
              </div>
            </div>
            <div class="tipsBox">
              <p>
                提示：上传面部照片且只支持jpg格式，640*480≤分辨率≥1920*1080，大小不超过1M，限传4张
              </p>
            </div>
          </div>
        </div>
      </div>
    </ui-modal>
    <SureLossCard
      ref="sureLossCardCom"
      @updateCardList="handleGetCardList"
    ></SureLossCard>
    <image-clip ref="imgClip" @close="close" />
    <camera ref="camera" @close="close" />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import SureLossCard from "./SureLossCard.vue";
import { StaffTableList } from "@/views/staffManage/teachingManage/util";
import { InfantTableList } from "@/views/staffManage/infantManage/util";
import { getCardList, bindUser, closeCard } from "@/api/common";
import Message from "@/themes/message";
import ImageClip from "@/views/staffManage/infantManage/component/imageClip/index.vue";
import Camera from "@/views/staffManage/infantManage/component/camera/camera.vue";
import bus from "@/Layout/bus";
import { getOneByStu } from "@/api/attendanceManagement";
import { parentListInfo } from "@/api/infantManage";
import { ElMessage } from "element-plus";

interface BindCardBaseData {
  modalStatus: boolean;
  username: string;
}

interface YetBindCardList {
  innerNumber: string;
  outNumber: string;
  enableStatus: number;
  familyRel: string;
  [key: string]: any;
}

export default defineComponent({
  components: {
    Camera,
    ImageClip,
    SureLossCard,
  },

  setup() {
    const imgClip = ref(null);
    const camera = ref(null);
    const sureLossCardCom = ref(null);
    const cardId = ref("");
    const userPhoto = ref("");
    const familyUserId = ref("");
    const baseData: BindCardBaseData = reactive({
      modalStatus: false,
      username: "",
    });
    const yetBindCardList = ref([] as Array<YetBindCardList>);
    let userIdentity = ref(-1); // 1-老师 2-学生
    const userInfo = ref({} as StaffTableList | InfantTableList); //传过来的用户信息

    // 获取考勤卡列表
    async function handleGetCardList(): Promise<void> {
      let opt = {};
      if (userIdentity.value === 1) {
        opt = {
          userId: userInfo.value.userId,
        };
      } else {
        opt = {
          studentId: userInfo.value.id,
        };
      }
      const { code, data } = await getCardList(opt);
      if (+code === 0) {
        yetBindCardList.value = data;
      }
    }

    const cardStatus = (status: number) => {
      switch (status) {
        case 1:
          return "已绑定";
        case 9:
          return "已挂失";
        default:
          return "未知状态";
      }
    };

    const close = () => {
      queryStudentPhoto();
      // bus.$emit("editInfantComplete", true);
    };

    const handleCardStatus = (status: number) => {
      switch (status) {
        case 1:
          return "挂失";
        case 9:
          return "恢复绑定";
      }
    };
    const identitys = ref(-1);
    // 打开模态框
    const handleOpen = (
      identity: number,
      res: StaffTableList | InfantTableList
    ) => {
      identitys.value = identity;
      userPhoto.value = "";
      userInfo.value = res;
      if (+identity === 1) {
        userIdentity.value = 1;
      } else if (+identity === 2) {
        userIdentity.value = 3;
        queryStudentParent();
      }

      queryStudentPhoto();
      handleGetCardList();
      baseData.username = (res as StaffTableList | InfantTableList).name;
      baseData.modalStatus = true;
    };
    const familyList = ref<any[]>([]);
    //查询学生家长信息
    const queryStudentParent = () => {
      parentListInfo(userInfo.value.id).then((res) => {
        if (+res.code === 0) {
          familyList.value = res.data.list;
          if (familyList.value.length > 0) {
            familyUserId.value = familyList.value[0].familyUserId;
          }
        }
      });
    };

    //查询学生考勤人脸信息
    const queryStudentPhoto = () => {
      getOneByStu({
        studentId: userInfo.value.id,
      }).then((res) => {
        console.log(res);
        if (+res.code === 0) {
          if (res.data?.images?.length > 0) {
            userPhoto.value = res.data.images[0];
          }
        }
      });
    };

    // 绑定考勤卡
    async function handleBindCard(): Promise<void> {
      if (!cardId.value) {
        Message.error("请输入考勤卡卡号");
        return;
      }
      let data = {};
      if (userIdentity.value === 1) {
        data = {
          identity: userIdentity.value,
          userId: userInfo.value.userId,
          outNumber: cardId.value,
        };
      } else {
        if (familyUserId.value.trim() === "") {
          ElMessage.warning("必须选择家长!");
          return;
        }
        const familyUser = familyList.value.find(
          (item) => item.familyUserId === familyUserId.value
        );
        data = {
          identity: userIdentity.value,
          studentId: userInfo.value.id,
          outNumber: cardId.value,
          familyUserId: familyUserId.value,
          userName: familyUser.familyName,
        };
      }

      const { code } = await bindUser(data);
      if (+code === 0) {
        Message.success("绑定成功");
        handleGetCardList();
      }
      cardId.value = "";
    }

    // 恢复绑定考勤卡
    async function handleChangeCradStatus(outNumber: string): Promise<void> {
      const { code } = await closeCard({ outNumber });
      if (+code === 0) {
        handleGetCardList();
        Message.success("恢复绑定成功");
      }
    }

    // 挂失/恢复绑定
    const handleLoss = (item: any) => {
      if (+item.enableStatus === 9) {
        handleChangeCradStatus(item.outNumber);
      } else {
        const { outNumber } = item;
        const opt = {
          outNumber,
          name: userInfo.value.name,
          phone:
            userIdentity.value === 1
              ? userInfo.value.mobile
              : userInfo.value.contacts,
        };
        (sureLossCardCom.value as any).handleOpen(opt);
      }
    };

    // 关闭弹窗
    const handleClose = () => {
      baseData.modalStatus = false;
      cardId.value = "";
      familyUserId.value = "";
      familyList.value = [];
      bus.$emit("editInfantComplete", true);
    };

    //上传
    const uploadImg = (): void => {
      // if (familyList.value === 0) {
      //   Message.warning("暂无数据可导出");
      // }
      (imgClip.value as any).init(
        {
          width: 1000,
          height: 1400,
        },
        userInfo.value,
        identitys.value
      );
      // (imgClip.value as any).setImgSize(500, 700);
    };
    //拍照
    const photo = (): void => {
      (camera.value as any).init(userInfo.value, identitys.value);
    };

    return {
      ...toRefs(baseData),
      cardId,
      imgClip,
      camera,
      userPhoto,
      handleClose,
      handleOpen,
      yetBindCardList,
      handleLoss,
      sureLossCardCom,
      cardStatus,
      handleCardStatus,
      handleBindCard,
      handleGetCardList,
      close,
      uploadImg,
      photo,
      userIdentity,
      familyList,
      familyUserId,
    };
  },
});
</script>

<style lang="less">
#bind-card-box {
  .ui-modal-footer {
    margin-top: 0 !important;
  }

  .body-text-box {
    margin-top: 26px;
    font-size: 14px;
    color: #222;

    .bind-card-box {
      .input-box {
        display: flex;
        margin: 5px 0 20px 0;

        .bind-btn {
          margin-left: 10px;
          width: 90px;
          height: 32px;
        }
      }
    }

    .yet-bind-card-box {
      margin-top: 20px;
      > div {
        margin-top: 5px;
        padding: 15px;
        border: 1px solid #d9d9d9;
        background-color: #fafafa;
        border-radius: 3px;

        > ul > li {
          display: flex;
          justify-content: space-between;
          align-items: center;

          > div:last-child {
            width: 20%;
            text-align: right;
          }
        }
      }
    }
    .selectParent {
      margin-top: 4px;
    }
    .userPhoto {
      margin-top: 20px;
      > div {
        margin-top: 8px;
        .photoBox {
          display: flex;
          .photo {
            margin-right: 20px;
            width: 110px;
            height: 146px;
            border-radius: 4px;
            box-sizing: border-box;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px #d9d9d9 solid;
            &:last-child {
              border: 1px #d9d9d9 dashed;
              display: flex;
              justify-content: center;
              flex-direction: column;
              padding: 0 20px;
              > button {
                padding: 6px 10px;
                font-size: 12px;
                &:last-child {
                  margin-top: 20px;
                }
              }
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .icon {
              font-size: 36px;
              fill: #7e7d7d;
            }
            .closeBtn {
              width: 16px;
              height: 16px;
              background: #000000;
              opacity: 0.5;
              border-radius: 4px;
              position: absolute;
              top: 0;
              right: 0;
            }
          }
        }
        .tipsBox {
          margin-top: 14px;
          p {
            font-size: 12px;
            color: #f56060;
          }
        }
      }
    }
  }
}
</style>
