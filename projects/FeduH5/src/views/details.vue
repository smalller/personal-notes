<template>
  <div class="details">
    <open-app-head v-show="type !=='cms'"></open-app-head>
    <share-details
      :data="data"
      v-if="type === 1"
    ></share-details>
    <recipes-details
      :data="data"
      v-else-if="type === 2"
    ></recipes-details>
    <dynamic
      :data="data"
      v-else-if="type===3"
    ></dynamic>
    <ingredients
      :data="data"
      v-else-if="type === 4"
    ></ingredients>
    <video-details
      :data="data"
      v-else-if="type === 5"
    ></video-details>
    <div class="footer">
      <span @click="openWeb">
        了解金树丫 →
      </span>
    </div>
  </div>
</template>

<script>
import OpenAppHead from "@/components/openAppHead";
import qs from 'qs'
import ShareDetails from "@/components/shareDetails";
import RecipesDetails from "@/components/recipesDetails";
import VideoDetails from "@/components/videoDetails";
import Dynamic from "@/components/dynamic";
import Ingredients from "@/components/ingredients";

export default {
  name: "details",
  components: { Ingredients, Dynamic, VideoDetails, RecipesDetails, ShareDetails, OpenAppHead },
  data() {
    return {
      type: 1,
      data: {},
      params: {},
      url: {
        '1': '/mamserver/appShare/queryShareArticleInfoById',
        '2': '/mamserver/appShare/queryShareRecipeInfoById',
        '3': '/mamserver/appShare/queryShareDynamicInfoById',
        '4': '/mamserver/appShare/queryShareFoodInfoById',
        '5': '/mamserver/api/liveVideo/queryById'
      }
    }
  },
  methods: {
    getDetails(shareId) {
      this.request(`${process.env["VUE_APP_BASE_API"]}${this.url[this.type]}/${shareId}`, {
        userId: this?.params?.userId ? this.params.userId : ''
      }).then(res => {
        if (+res.code === 0 && res?.data) {
          this.data = res.data
        } else {
          vant.Dialog.alert({
            message: res.msg,
          }).then(() => {
            window.close();
          });
        }
      })
    },
    request(url, data, headers = {}) {
      return new Promise((resolve, reject) => {
        if (JSON.stringify(data) !== '{}') {
          url += `?${qs.stringify(data)}`
        }
        fetch(url, {
          method: 'get',
          headers: headers
        }).then(res => {
          resolve(res.json())
        }).catch(err => {
          reject(err)
        })
      })
    },
    openWeb() {
      location.href = 'https://www.jinshuy.com'
    }
  },
  created() {
    const url = location.href.split('?')[1]
    const params = qs.parse(url)
    window.params = params
    this.type = +params.type
    this.params = params
    if (params?.shareId) {
      this.getDetails(params.shareId, params.userId)
    }
  }
}
</script>

<style scoped lang="less">
.details {
  position: relative;
  padding-top: 44px;
  padding-bottom: 44px;
  .footer {
    bottom: 0;
    border-top: 4px #f2f2f2 solid;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    background: #ffffff;
    span {
      font-size: 14px;
      color: #0099ff;
    }
  }
}
</style>
