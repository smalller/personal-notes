<template>
  <screen-box class="notice" title="通知公告">
    <div class="noticeData scroll">
      <ul>
        <li class="noticeItem" v-for="item in list" :key="item.id">
          <span>· {{ item.title }}</span>
          <span class="time">{{ item.createTime }}</span>
        </li>
      </ul>
    </div>
  </screen-box>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ScreenBox from "@/views/largeScreen/components/screenBox.vue";
import { getNoticeList } from "@/api/reviewManage";

export default defineComponent({
  name: "notice",
  components: { ScreenBox },
  setup() {
    interface Notice {
      title: string;
      createTime: string;
    }
    const list = ref<Notice[]>([]);
    const getNotice = () => {
      getNoticeList(1, 40, {}).then((res) => {
        if (+res.code === 0) {
          console.log(res);
          list.value = res.data.list;
          startNotice();
        }
      });
    };
    getNotice();
    let timer: number;
    const startNotice = () => {
      if (timer) {
        clearInterval(timer);
        timer = 0;
      }
      timer = setInterval(() => {
        const item = list.value.splice(0, 1);
        list.value.push(item[0]);
      }, 1000);
    };
    return { list };
  },
});
</script>

<style scoped lang="less">
.notice {
  // height: 40%;
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
