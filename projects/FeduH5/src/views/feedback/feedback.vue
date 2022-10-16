<template>
  <div class="feedback">
    <my-head
        title="投诉反馈"
        @leftClick="backClick"
        closeBtn
        @closeClick="backClick"
    >
      <template #right>
        <div class="headBtn" @click="onClickRight">反馈列表</div>
      </template>
    </my-head>
    <div class="contentData">
      <div class="selectProblem">
        <div class="label">选择问题类型（必填）</div>
        <div class="content">

          <div class="typeItem" @click="selectType(item)" :class="{active: item === type}"
               v-for="item in typeList" :key="item">{{ item }}
          </div>
        </div>
      </div>
      <div class="problemInfo">
        <div class="label">问题描述（必填）</div>
        <div class="content">
          <textarea v-model="problemInfo" placeholder="必填， 请描述您出现问题的详细场景，便于我们更好地为您解决问题"></textarea>
        </div>
      </div>
      <div class="imgBox">
        <div class="imgItem" v-for="(item, index) in imgList" :key="item.data">
          <img :src="item.src" @click="reviewImg(imgList,index)" alt="">
          <div class="showDetailBtn" @click="deleteImg(item.data)">x</div>
        </div>
        <div class="uploadBtn" v-if="imgList.length<9" @click="selectImg">
          <img src="@/assets/image/plus_b.png" alt="">
        </div>
      </div>
    </div>
    <div class="btnBox">
      <div class="btn" @click="submit">提交反馈</div>
    </div>

  </div>
</template>

<script>
import MyHead from "../../views/userCamera/component/head";
import {uploadFile} from '@/base/upload.js'

export default {
  name: "feedback",
  components: {MyHead},
  data() {
    return {
      type: '',
      typeList: ['功能问题', '使用问题', '意见反馈', '投诉'],
      problemInfo: '',
      imgList: [],
      look: false
    }
  },
  created() {
    if (this.$route.query?.userId) {
      this.$store.dispatch('setUserId', this.$route.query.userId)
    }
    if (this.$route.query?.token) {
      this.$store.dispatch('setToken', this.$route.query.token)
    }
  },
  methods: {
    reviewImg(list, index) {
      vant.ImagePreview({
        images: list.map(item => item.src),
        startPosition: index,
        closeable: true,
      })
    },
    onClickRight() {
      this.$router.push('/feedback/list')
    },
    selectType(type) {
      this.type = type
    },
    submit() {
      if (!this.type) {
        vant.Dialog.alert({
          title: '提示',
          message: '请选择问题类型',
          confirmButtonColor: '#FF9F3D',
          theme: 'round-button',
        }).then(() => {
          // on close
        });
        return
      }
      if (!this.problemInfo?.trim()) {
        vant.Dialog.alert({
          title: '提示',
          message: '请填写问题描述',
          confirmButtonColor: '#FF9F3D',
          theme: 'round-button',
        }).then(() => {
          // on close
        });
        return
      }
      if(this.look) {
        return;
      }
      this.look = true;
      this.$request('/schools/feedback/submit', {
        method: 'post',
        data: Object.assign({
          message: this.problemInfo,
          type: this.type,
          images: this.imgList.map(item => item.data),
          mode: '投诉反馈',
        }, this.$route.query)
      }).then(res => {
        if (+res.code === 0) {
          this.$router.push('/feedback/success')
        } else {
          vant.Notify({ type: 'warning', message: res.msg });
        }
      }).finally(() => {
        this.look = false
      })


    },
    selectImg() {
      const input = document.createElement('input');
      input.accept = '.png,.jpg,.jpeg,';
      document.body.appendChild(input);
      input.name = "file";
      input.style.opacity = 0;
      input.style.position = 'fixed';
      input.style.top = 0;
      input.style.left = 0;
      input.type = 'file';
      input.multiple = false;
      input.onchange = () => {
        if (input.files.length > 0) {
          // console.log(input.files)
          uploadFile(input.files[0]).then(res => {
            this.imgList.push(res);

          }).finally(() => {
            document.removeChild(input)
          })
        }
      }
      input.click()
    },
    deleteImg(id) {
      this.imgList = this.imgList.filter(item => item.data !== id)
    },
    backClick() {
      if (micell.ua.isWeChat()) {
        document.addEventListener('WeixinJSBridgeReady', function () {
          WeixinJSBridge.call('closeWindow');
        }, false);

        WeixinJSBridge.call('closeWindow');
      }

      if (micell.ua.isAndroid()) {
        window.WebViewJavascriptBridge.closeWindow()
      } else {
        window.webkit.messageHandlers.closeWindow.postMessage("closeWindow")
      }
    },
  }
}
</script>

<style lang="less">
@import 'index.less';
</style>
