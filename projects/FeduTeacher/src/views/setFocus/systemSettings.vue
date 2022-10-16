<template>
  <div class="systemSettings">
    <div>
      <ui-card>
        <div class="title">
          <span>{{ route.name }}</span>
        </div>
        <div class="item">
          <div class="labelTitle">学校信息</div>
          <div class="itemContent">
            <div class="contentItem">
              <div class="itemLeft">学校标志</div>
              <div class="itemRight">
                <img class="img" @click="openImg" :src="imgUrl" alt="" />
              </div>
            </div>
            <div class="contentItem">
              <div class="itemLeft">学校名称</div>
              <div class="itemRight">{{ schoolDetails.schoolName }}</div>
            </div>
          </div>
        </div>
        <!--        <div class="item">-->
        <!--          <div class="labelTitle">学校管理</div>-->
        <!--          <div class="itemContent">-->
        <!--            <div class="contentItem">-->
        <!--              <div class="itemLeft">允许评论</div>-->
        <!--              <div class="itemRight">-->
        <!--                当前为开启状态，动态、新闻、活动全部可以评论-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </ui-card>
    </div>
  </div>
  <ui-image-clip ref="imgClip" @getData="getClipIMg"></ui-image-clip>
  <cms-upload ref="upload"></cms-upload>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Message from "@/themes/message";
import CmsUpload from "@/base/cmsUpload.vue";
import { QueryLogo, UpdateLogo } from "@/api/setFocus";

export default defineComponent({
  components: { CmsUpload },
  setup() {
    const $store = useStore();
    const route = useRoute();
    const imgClip = ref(null);
    const upload = ref(null);
    const imgUrl = ref("");
    const schoolDetails = computed(() => {
      return $store.state.user.schoolList.find((item: any) => {
        if ($store.state.user.schoolId === item.schoolId) {
          return item;
        }
      });
    });

    const openImg = () => {
      (imgClip.value as any).init({
        width: 400,
        height: 400,
        size: 1024,
      });
    };
    interface ImgResponse {
      url: string;
      blob: Blob;
    }
    const getClipIMg = (res: ImgResponse) => {
      const file = new File([res.blob], "123.png", {
        type: res.blob.type,
      });
      interface ImgRes {
        data: string;
        url: string;
      }
      (upload.value as any).uploadImageFile(file).then((res: ImgRes) => {
        imgUrl.value = res.url;
        UpdateLogo({
          logo: res.data,
        }).then((res) => {
          if (res.code === 0) {
            Message.success("更换学校logo成功");
            (imgClip.value as any).close();
          }
        });
      });
    };

    const getSchoolLogo = () => {
      QueryLogo().then((res) => {
        if (res.code === 0) {
          imgUrl.value = res.data;
        }
      });
    };
    getSchoolLogo();

    return {
      route,
      imgClip,
      imgUrl,
      schoolDetails,
      openImg,
      getClipIMg,
      upload,
    };
  },
});
</script>

<style lang="less" scoped>
.systemSettings {
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
  }
  .item {
    border-top: 1px solid #e8e8e8;
    padding-top: 24px;
    margin-top: 24px;
    display: flex;
    .labelTitle {
      width: 124px;
      font-size: 16px;
      font-weight: 400;
      color: #222222;
    }
    .itemContent {
      flex: 1;
      .contentItem {
        display: flex;
        .itemLeft {
          display: flex;
          align-items: center;
          width: 80px;
          font-size: 14px;
          font-weight: 400;
          color: #222222;
        }
        .itemRight {
          flex: 1;
        }
      }
    }
  }
  .img {
    width: 90px;
    height: 90px;
  }
}
</style>
