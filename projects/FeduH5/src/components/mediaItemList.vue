<template>
  <div class="mediaItemList">
    <div class="userInfo">
      <div class="nameBox">
        <img
          :src="info.createUserHeadPortrait"
          alt=""
        />
        <span>{{ info.createUserName }}</span>
      </div>
      <div class="titleBox">
        <div>
          <span>{{ info.albumName }}</span>
          <img
            :style="{ transform: `rotate(${detailsInfoShow ? '180deg' : 0})` }"
            @click="detailsInfoShow = !detailsInfoShow"
            src="../assets/image/mediaDetails/jiantou.png"
            alt=""
          />
        </div>
        <div>
          <img
            src="../assets/image/mediaDetails/play.png"
            alt=""
          />
          <span>{{ info.views }}</span>
          <span>{{ info.publishTime }}</span>
        </div>
      </div>
      <div
        class="textBox"
        v-show="detailsInfoShow"
        v-text="info.introduce"
      ></div>
    </div>
    <div class="listBox">
      <div
        class="item"
        v-for="(item, index) in list"
        :class="{ active: index + 1 === itemIndex }"
        @click="selectItem(item, index + 1)"
        @touchEnd="selectItem(item, index)"
        :key="item.id"
      >
        <div class="sortTitle">
          <span>{{ index + 1 }}</span>
          <span
            v-if="source!=='cms'"
            v-show="info.isFree || item.isFree"
          >{{
            +info.type === 1 ? '试看' : '试听'
          }}</span>
        </div>
        <div class="titleBox">
          <div class="title">
            <span>{{ item.name }}</span>
          </div>
          <div class="info">
            <img
              src="../assets/image/mediaDetails/time.png"
              alt=""
            />
            <span>{{ getTime(item.length) }}</span>
            <span>{{ item.author }}</span>
          </div>
        </div>
        <div
          v-if="source!=='cms'"
          class="lock"
          v-show="!item.isFree && !info.isFree"
        >{{source}}</div>
      </div>
    </div>
    <madel
      ref="madel"
      :params="appParams"
    ></madel>
  </div>
</template>

<script>
import Madel from '@/components/madel';
import qs from "qs";
import {getWeChatAppId} from "@/api/common";
export default {
  name: 'mediaItemList',
  components: { Madel },
  data() {
    return {
      itemIndex: 0,
      detailsInfoShow: false,
      appParams: {},
      source: '',
      activeItem: null,
      wxInfo: {},
      isWeChatReady: false
    };
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    list: {
      handler: function () {
        const list = this.list.filter((item) => item.isFree);
        if (list.length > 0) {
          this.list.forEach((item, index) => {
            if (item.id === list[0].id) {
              this.selectItem(item, index + 1);
            }
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    test(item, index) {
      console.log(item, index)
      console.log(this.selectItem)
      this.itemIndex = index;
      this.selectItem(item, index)

      if(micell.ua.isWeChat()) {
        // wx.updateAppMessageShareData({
        //   title: item.name, // 分享标题
        //   desc: item.name, // 分享描述
        //   link: `${location.origin}${location.pathname}?id=${item.mediaAlbumId}&itemId=${item.id}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: item.cover, // 分享图标
        //   success: function () {
        //     // 设置成功
        //   }
        // })
        // wx.updateTimelineShareData({
        //   title: item.name, // 分享标题
        //   link: `${location.origin}${location.pathname}?id=${item.mediaAlbumId}&itemId=${item.id}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: item.cover, // 分享图标
        //   success: function () {
        //     // 设置成功
        //   }
        // })
      }
    },
    selectItem(item, index) {
      // console.log(item, index)
      this.itemIndex = index;
      this.activeItem = item
      //
      //
      if (this.source === "cms") {
        this.$emit('change', {
          src: item.mediaPath,
          isFree: item.isFree,
          itemId: item.id,
        });
        return
      }


      const appParams = {
        albumId: this.info.id,
        albumItemId: item.id,
        type: this.info.type
      };
      this.appParams = appParams
      if (this.info.isFree) {
        this.$emit('change', {
          src: item.mediaPath,
          isFree: item.isFree,
          itemId: item.id,
        });
      } else {
        if (item.isFree) {
          this.$emit('change', {
            src: item.mediaPath,
            isFree: item.isFree,
            itemId: item.id,
          });
        } else {
          this.$refs.madel.open();
        }
      }
    },
    next() {
      this.itemIndex++;
      if (this.itemIndex >= this.list.length) {
        this.itemIndex = this.list.length;
      }
      this.selectItem(this.list[this.itemIndex - 1], this.itemIndex);
    },
    pre() {
      this.itemIndex--;
      if (this.itemIndex <= 1) {
        this.itemIndex = 1;
      }
      this.selectItem(this.list[this.itemIndex - 1], this.itemIndex);
    },
    select(id) {
      setTimeout(() => {
        console.log(id, this.list);
        this.list.forEach((item, index) => {
          if (id === item.id) {
            this.selectItem(item, index + 1);
          }
        });
      }, 500);
    },
    getTime(num) {
      // num = num / 1000
      let day = Math.floor(num / (24 * 3600));
      let hour = Math.floor((num % (24 * 3600)) / 3600);
      let minuts = Math.floor((num % 3600) / 60);
      let second = Math.floor(num % 60);
      if (second.toString().length < 2) {
        second = '0' + second.toString();
      }
      if (minuts.toString().length < 2) {
        minuts = '0' + minuts.toString();
      }
      if (hour.toString().length < 2) {
        hour = '0' + hour.toString();
      }
      return day > 0
        ? `${day}天 ${hour}:${minuts}:${second}`
        : hour > 0
          ? `${hour}:${minuts}:${second}`
          : `${minuts}:${second}`;
      // return `${day}天 ${hour}:${minuts}:${second}`
    },
  },
  created() {
    const url = location.href.split('?')[1]
    const params = qs.parse(url)

    this.source = params.type
  }
};
</script>

<style scoped lang="less">
.mediaItemList {
  border-top: 1px solid #f2f2f2;
  .userInfo {
    margin-top: 14px;
    margin-bottom: 32px;
    padding: 0 16px;
    box-sizing: border-box;
    .nameBox {
      display: flex;
      align-items: center;
      img {
        width: 25px;
        height: 25px;
        background: #f4bd45;
        border-radius: 50%;
      }
      span {
        margin-left: 6px;
        font-size: 14px;
        color: #1c1c1c;
      }
    }
    .titleBox {
      margin-top: 20px;
      > div {
        display: flex;
        align-items: center;
        &:nth-child(1) {
          justify-content: space-between;
          span {
            font-size: 16px;
            font-weight: bold;
            color: #1c1c1c;
          }
          img {
            width: 10px;
            height: 6px;
          }
        }
        &:nth-child(2) {
          margin-top: 10px;
          span {
            margin-right: 18px;
            font-size: 10px;
            color: #c1c1c1;
          }
          img {
            margin-right: 4px;
            width: 10px;
            height: 10px;
          }
        }
      }
    }
    .textBox {
      padding: 4px 0;
      display: flex;
      justify-content: flex-start;
      font-size: 16px;
    }
  }
  .listBox {
    padding: 0 16px;
    border-top: 1px solid #f2f2f2;
    .item {
      padding: 16px 0;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      align-items: center;
      .sortTitle {
        display: flex;
        flex-direction: column;
        width: 40px;
        min-width: 40px;
        span {
          &:nth-child(1) {
            font-size: 16px;
            color: #6a6a6a;
            font-weight: 400;
          }
          &:nth-child(2) {
            font-size: 10px;
            color: #15c4f2;
          }
        }
      }
      .titleBox {
        flex: 1;
        .title {
          margin-bottom: 10px;
          display: flex;
          justify-content: flex-start;
          span {
            text-align: left;
            font-size: 16px;
            font-weight: 400;
            color: #6a6a6a;
          }
        }
        .info {
          display: flex;
          align-items: center;
          span {
            margin-right: 18px;
            font-size: 10px;
            color: #c1c1c1;
          }
          img {
            margin-right: 4px;
            width: 10px;
            height: 10px;
          }
        }
      }
      .lock {
        width: 20px;
        height: 20px;
        background: url("../assets/image/mediaDetails/lock.png");
        background-size: 100% 100%;
      }
      &.active {
        .titleBox {
          .title {
            span {
              color: #ffaa53;
            }
          }
        }
      }
    }
  }
}
</style>
