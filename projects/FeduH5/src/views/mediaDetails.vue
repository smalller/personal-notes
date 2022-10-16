<template>
  <open-app-box v-if="source !== 'cms'" :params="appParams">
    <div class="videoBox">
      <div class="contentBox">
        <mp3 ref="mp3" v-show="+info.type === 2" @next="next" @pre="pre"></mp3>
        <mp4 ref="mp4" v-show="+info.type === 1"></mp4>
      </div>
      <media-item-list ref="mediaItemList" @change="itemChange" :info="info"  :list="list"></media-item-list>
    </div>
  </open-app-box>
   <div class="videoBox" v-else>
      <div class="contentBox">
        <mp3 ref="mp3" v-show="+info.type === 2" @next="next" @pre="pre"></mp3>
        <mp4 ref="mp4" v-show="+info.type === 1"></mp4>
      </div>
      <media-item-list ref="mediaItemList" @change="itemChange" :info="info"  :list="list"></media-item-list>
    </div>
</template>

<script>
import OpenAppBox from "@/layout/openApp";
import MediaItemList from "@/components/mediaItemList";
import Mp3 from "@/components/mp3";
import Mp4 from "@/components/mp4";
import qs from "qs";

export default {
  name: "mediaDetails",
  components: {Mp4, Mp3, MediaItemList, OpenAppBox},
  data() {
    return {
      list: [],
      info: {},
      appParams: {},
      source: ''
    }
  },
  methods: {
    itemChange({src,isFree=false, itemId=''}) {
      this.appParams = {
        albumId: this.info.id,
        albumItemId: itemId,
        type: this.info.type
      }
      const el = this.$refs[+this.info.type===1?'mp4':'mp3'];
      el.setPlay(src, this.info)
    },
    next() {
      this.$refs.mediaItemList.next()
    },
    pre() {
      this.$refs.mediaItemList.pre()
    },
    getDetails(id, itemId) {
     Promise.all([
          this.request(`${process.env["VUE_APP_BASE_API"]}/mamserver/mediaAlbum/unAccess/getMediaAlbumById`, {
        id: id,
      }),
        this.request(`${process.env["VUE_APP_BASE_API"]}/mamserver/mediaAlbumItem/unAccess/getItems/${id}`, {
          isAdmin: true
        })
      ]).then(data => {
        const [res,resItem] = data
        this.info = res.data
        this.list = resItem.data
        if (itemId) {
          if(this.list.find(item => item.id === itemId)) {
            this.$refs.mediaItemList.select(itemId)
          } else {
            if(this.list.length>0) {
              this.$refs.mediaItemList.select(this.list[0].id)
            }
          }
        } else {
          if(this.list.length>0) {
            this.$refs.mediaItemList.select(this.list[0].id)
          }
        }
      })


    },
    request(url, data = {}, headers = {}) {
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
  },
  created() {
    const url = location.href.split('?')[1]
    const params = qs.parse(url)
    // window.params = params
    this.source = params.type
    if (params?.id) {
      this.getDetails(params.id, params.itemId)
    }
  }
}
</script>

<style scoped lang="less">
.videoBox {
  .contentBox {
  }
}
</style>
