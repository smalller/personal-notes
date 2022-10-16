<template>
  <screen-box :right-btn="true" class="notice" title="通知公告">
    <div class="noticeData scroll">
      <ul>
        <li v-for="item in list" :key="item.id" class="noticeItem">
          <span>· {{ item.title }}</span>
          <span class="time">{{ item.createTime }}</span>
        </li>
      </ul>
    </div>
  </screen-box>
</template>

<script>
  import ScreenBox from './screenBox.vue'
  import { getNoticeList } from '@/cms/api/largeScreen/index.js'

  export default {
    name: 'Notice',
    components: { ScreenBox },
    data() {
      return {
        list: [
          {
            title: '阿萨德高考历史多看几个还看啥点火开关和',
            createTime: '2021-08-16 13:20',
          },
          {
            title: '阿萨德高考历史多看几个还看啥点火开关和',
            createTime: '2021-08-16 13:20',
          },
          {
            title: '阿萨德高考历史多看几个还看啥点火开关和',
            createTime: '2021-08-16 13:20',
          },
        ],
        timer: '',
      }
    },
    mounted() {
      // this.getNotice()
    },
    methods: {
      getNotice() {
        getNoticeList(1, 40, {}).then((res) => {
          if (+res.code === 0) {
            this.list = res.data.list
            this.startNotice()
          }
        })
      },
      startNotice() {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = 0
        }
        this.timer = setInterval(() => {
          if (this.list.length > 0) {
            const item = this.list.splice(0, 1)
            this.list.push(item[0])
          } else {
            this.list = []
          }
        }, 1000)
      },
    },
  }
</script>

<style scoped lang="scss">
  .notice {
    width: 100%;
    .noticeData {
      height: calc(100% - 0.5rem);
      position: relative;
      overflow-y: hidden;
      box-sizing: border-box;
      ul {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
      .noticeItem {
        margin-top: 0.13rem;
        color: #acd3fc;
        font-size: 0.13rem;
        list-style: disc inside;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          &:first-child {
            list-style: disc inside;
          }
        }
        .time {
          color: #24a9c2;
          font-size: 0.13rem;
        }
      }
    }
  }
</style>
