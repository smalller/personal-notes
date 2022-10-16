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
        <template v-if="previewUrl">
          <iframe
            class="iframe"
            :src="previewUrl"
            frameborder="0"
            scrolling="auto"
          ></iframe>
        </template>
        <template v-else>
          <div class="phone-content">
            <div class="news-content" v-html="phoneInfo" />
            <div class="pic-content">
              <div v-for="(item, index) in pictureList" :key="index">
                <img
                  class="img-list"
                  :src="item"
                  @click="handleChangeImg($event)"
                />
              </div>
            </div>
            <div v-if="+phoneNews.dynamicType === 2" class="video-content">
              <video
                v-if="showVideoPath !== ''"
                ref="video"
                class="avatar"
                :autoplay="autoplay"
                :src="showVideoPath"
                :controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>
          <div class="re-content">
            <el-card
              v-for="(item, index) in comments"
              :key="index"
              class="comment1"
            >
              <div style="margin-top: 5px; margin-left: 10px">
                <div style="display: flex">
                  <img :src="item.userPortait" class="comment-img" />
                  <span class="comment1-name">
                    {{ item.sysUserName }}
                  </span>
                </div>
                <span style="margin-left: 0px">{{ item.createTime }}</span>
                <!-- <el-button
                  style="margin-left: 30px"
                  type="text"
                  @click.native="replayComments(item)"
                >
                  回复
                </el-button> -->
                <el-button
                  style="margin-left: 10px"
                  type="text"
                  @click.native="delComment(item)"
                >
                  删除
                </el-button>

                <div style="width: 95%">
                  <span>
                    {{ item.comment }}
                  </span>
                </div>
                <div
                  v-for="(items, indexs) in item.recComments"
                  :key="indexs"
                  class="comment2"
                >
                  <img :src="items.userPortait" class="comment-img" />
                  <div style="margin-top: 3px; margin-left: 10px">
                    <span
                      style="
                        display: block;
                        max-width: 80px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        color: blue;
                      "
                    >
                      {{ items.sysUserName }}
                    </span>
                    <span style="margin-left: 0px">{{ items.createTime }}</span>
                    <!-- <el-button
                      style="margin-left: 10px"
                      type="text"
                      @click.native="replayComments(items)"
                    >
                      回复
                    </el-button> -->
                    <el-button
                      style="margin-left: 10px"
                      type="text"
                      @click.native="delComment(items)"
                    >
                      删除
                    </el-button>
                    <div style="width: 95%">
                      <span>
                        {{ items.comment }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { GetFile, GetComment, DelComment, AddComment } from '@/api/common'
  import VueCookie from 'vue-cookie'
  export default {
    props: {
      news: {
        type: Object,
        default: () => {
          return {}
        },
      },
      previewUrl: {
        type: String,
        default: () => {
          return ''
        },
      },
    },

    data() {
      return {
        phoneNews: {},
        phoneInfo: '',
        pictureList: [],
        showVideoPath: '',
        controls: true,
        autoplay: false,
        comments: [],
        userId: VueCookie.get(`${firmId}_user_id`),
      }
    },

    mounted() {
      this.setContent()
    },
    methods: {
      handleChangeImg($event) {
        if ($event.currentTarget.className == 'img-list') {
          $event.currentTarget.className = 'img-list open'
        } else {
          $event.currentTarget.className = 'img-list'
        }
      },
      //处理富文本图片样式
      setContent() {
        if (this.news.content !== undefined) {
          this.phoneNews = { ...this.news }
          this.phoneInfo = `<html> <head> <style type=\"text/css\"> body{text-align: justify; margin:0px; padding-left:13.5px; padding-right:13.5px; padding-bottom:13.5px; padding-top:13.5px;} p{font-size: 8px; font-family: PingFang SC; line-height: 27px; letter-spacing: 0.5px; color: #707070; opacity: 1;} h1,h2,h3,h4,h5,h6{font-size: 9px; font-family: PingFang SC; font-weight: 500; line-height: 26px; color: #1D1D1D; letter-spacing: 0.5px; opacity: 1;} </style> </head> <body><span style='font-size: 12.5px; letter-spacing: 0.25px; font-family: PingFang SC; font-weight: 600; line-height: 29px; color: #1D1D1D; opacity: 1;'></span>${this.phoneNews.content}</body>`
          this.pictureList = [...this.phoneNews.images]
          this.getCommentList()
        }
      },
      //获取链接
      async getFile(data, type) {
        if (data) {
          await GetFile(data).then((res) => {
            if (type === 'picture') {
              this.pictureList.push({ url: res.data, path: data })
              return
            } else {
              this.showVideoPath = res.data
            }
          })
        }
      },
      //获取评论信息
      getCommentList() {
        this.comments = []
        let data = this.phoneNews.uuid
        if (data) {
          GetComment(data).then((res) => {
            if (+res.code === 0) {
              this.comments = res.data.list
            }
          })
        }
      },
      //删除评论
      delComment(data) {
        if (data) {
          this.$confirm('是否需要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              DelComment(data.uuid).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: '恭喜你，删除成功',
                    type: 'success',
                  })
                  this.getCommentList()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除',
              })
            })
        }
      },
      //回复评论
      replayComments(data) {
        if (data) {
          this.$prompt('请输入回复内容', '回复内容', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          })
            .then(({ value }) => {
              let info = {
                comment: value,
                commentType: 'Ablum',
                recCommentId: data.uuid,
                relatedId: this.phoneNews.id,
                sysUserId: this.userId,
                sysUserName: this.$store.state.user.username,
              }
              AddComment(info).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: '恭喜你，删除成功',
                    type: 'success',
                  })
                  this.getCommentList()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '取消回复',
              })
            })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .iframe {
    width: 100%;
    height: 95%;
    border-radius: 25px;
  }
  .comment-img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .comment1-name {
    margin-left: 5px;
    display: block;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: blue;
    margin-top: 5px;
  }
  .comment1 {
    margin: 5px;
    display: flex;
    border-bottom: 1px solid #eeeeee;
  }
  .comment2 {
    padding-top: 5px;
    display: flex;
    border-bottom: 1px solid #eeeeee;
    border-top: 1px solid #eeeeee;
    width: 240px;
  }
  .phone {
    width: 340px;
    height: 655px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    z-index: 0;
  }
  .phone-show {
    background: url('../../../assets/images/phone.png');
    background-size: cover;
    width: 315px;
    height: 660px;
    padding: 8px 10px;
    margin: auto;
    overflow: hidden;
  }
  .phone-header {
    border-radius: 38px;
    position: relative;
  }
  .phone-content {
    width: 290px;
    height: 300px;
    overflow: scroll;
    overflow-x: hidden;
    margin-left: 5px;
    border: 2px solid #eeee;
    border-radius: 5px;
  }
  .phone-content .pic-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .phone-content .video-content .avatar {
    width: 270px;
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
  .re-content {
    border-top: 1px solid #eeeeee;
    margin-top: 20px;
    height: 250px;
    width: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }
  .img-list {
    display: block;
    cursor: zoom-in;
    max-width: 80px;
    max-height: 80px;
    min-height: 80px;
    // width: 80px;
    // height: 80px;
    border-radius: 10px;
    margin-left: 2px;
  }
  .img-list.open {
    cursor: zoom-out;
    max-width: 270px;
    max-height: 250px;
  }
</style>
