<template>
  <div>
    <div class="phone">
      <div class="phone-show">
        <div class="phone-header">
          <img
            style="width: 95%; height: 30px"
            src="../../../assets/images/title.png"
          />
        </div>
        <div class="phone-content">
          <div class="news-content" v-html="phoneInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      news: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        phoneNews: {},
        phoneInfo: '',
      }
    },
    mounted() {
      this.setContent()
    },
    methods: {
      //处理富文本图片样式
      setContent() {
        if (this.news.content !== undefined) {
          this.phoneNews = { ...this.news }
          let r = RegExp(/<[img]+\s+(.*?)(?<id>\w*?)[\s'"](.*?)>/g)
          let matchres = this.phoneNews.content.match(r) //返回数组['<img ... />','<img ... />']
          if (matchres) {
            matchres.forEach((item, index) => {
              let len = item.length
              let _str =
                item.slice(0, len - 1) + 'style="width:100%;text-align:center;"' //追加之后的img
              this.phoneNews.content = this.phoneNews.content.replace(
                item,
                _str
              )
            })
          }
          this.phoneInfo = `<html> <head> <style type=\"text/css\"> body{text-align: justify; margin:0px; padding-left:13.5px; padding-right:13.5px; padding-bottom:13.5px; padding-top:13.5px;} p{font-size: 8px; font-family: PingFang SC; line-height: 27px; letter-spacing: 0.5px; color: #707070; opacity: 1;} h1,h2,h3,h4,h5,h6{font-size: 9px; font-family: PingFang SC; font-weight: 500; line-height: 26px; color: #1D1D1D; letter-spacing: 0.5px; opacity: 1;} </style> </head> <body><span style='font-size: 12.5px; letter-spacing: 0.25px; font-family: PingFang SC; font-weight: 600; line-height: 29px; color: #1D1D1D; opacity: 1;'>${this.phoneNews.title}</span>${this.phoneNews.content}</body>`
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .phone {
    width: 340px;
    height: 650px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
  }
  .phone-show {
    background: url('../../../assets/images/phone.png');
    background-size: cover;
    width: 309px;
    height: 641px;
    padding: 8px 10px;
    margin: auto;
  }
  .phone-header {
    border-radius: 38px;
    position: relative;
  }
  .phone-content {
    width: 290px;
    height: 545px;
    overflow: scroll;
    overflow-x: hidden;
    padding: 13.5px;
  }

  .news-content {
    width: 100%;
    overflow: hidden;
    background-size: cover;
  }
  .news-content .ql-align-justify {
    width: 100%;
  }
  .circle-noise img {
    width: 100%;
  }
  .news-title {
    text-align: center;
  }
</style>
