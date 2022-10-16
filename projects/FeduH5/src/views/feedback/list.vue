<template>
<div class="list">
  <my-head
      title="反馈列表"
      @leftClick="$router.back()"
      closeBtn
      @closeClick="backClick"
  >
  </my-head>
  <div class="content">
    <div class="normal" v-if="list.length === 0">
      <img src="@/assets/image/normal.png" alt="" />
      <span>感觉您对金树树丫的关注和支持，我们期待您的见意和反馈。</span>
    </div>
    <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"

      >
        <van-cell :border="false" class="item" v-for="item in list" :key="item.id">
          <div class="timeBox">
            <!--        <div class="point"></div>-->
            <div class="time">{{dayjs(item.createTime).format('YYYY年MM月DD日 AHH:mm')}}</div>
          </div>
         <div class="itemData">
           <div class="itemContent">
             <div class="itemTitle">
               <div class="title">{{item.type}}</div>
               <div class="delBtn" @click="deleteItem(item.id)">
                 <img src="@/assets/image/feedback/delBtn.png" alt="">
               </div>
             </div>
             <div class="message">{{item.message}}</div>
             <div class="imgBox">
               <img :src="url" @click="reviewImg(item.images, index)" alt="" v-for="(url, index) in item.images" :key="url" />
             </div>
           </div>
           <div class="remark" v-if="item.reply">
             {{ item.reply }}
           </div>
         </div>
        </van-cell>
      </van-list>
  </van-pull-refresh>
  </div>
  <div class="delModal" v-if="deleteId">
    <div class="content">
      <div class="title">确定删除这条反馈吗</div>
      <div class="btnBox">
        <div class="btn ok" @click="deleteId = ''">取消</div>
        <div class="btn" @click="deleteData">确定</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import MyHead from "../userCamera/component/head";
import dayjs from 'dayjs'
export default {
  name: "list",
  components: {MyHead},
  created() {
    this.getList().then(list => {
      this.list = list
    })
  },
  data() {
    return{
      dayjs,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 1,
      deleteId: ''
    }
  },
  methods: {
    onLoad() {
      this.page++;
      this.getList().then(list => {
        this.list = this.list.concat(list)
      })
    },
    onRefresh() {
      this.page = 1;
      this.finished = false;
      this.getList().then(() => {
        this.refreshing = false;

      })
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
    onClickRight() {},
    getList() {
      return new Promise((resolve, reject) => {
        this.$request('/schools/feedback/queryByUserId', {
          method: 'get',
          params: {
            pageNo: this.page,
            pageSize: 10
          }
        }).then(res => {
          if(res.code === 0) {
            this.page = res.data.page.pageNo;
            if(this.refreshing||+res.data.page.totalPage === 0|| this.page === 1) {
              this.list = res.data.list
            }

            if(+this.page === +res.data.page.totalPage||+res.data.page.totalPage === 0) {
              this.finished = true;
            }
            resolve(res.data.list)
          } else {
            reject(res.msg)
          }
        }).finally(() =>{
          this.loading = false;
        })
      })
    },
    reviewImg(list, index) {
      vant.ImagePreview({
        images: list,
        startPosition: index,
        closeable: true,
      })
    },
    deleteItem(id) {
      // vant.Dialog.confirm({
      //   title: '确定删除这条反馈吗？',
      //   // message: '弹窗内容',
      //   // theme: 'round-button',
      //   confirmButtonText: '确认',
      //   confirmButtonColor: '#F2F2F2',
      //   cancelButtonText: '取消',
      //   cancelButtonColor: '#FF9F3D'
      // }).then(() => {
      //
      // })
      this.deleteId = id
    },
    deleteData() {
      if(!this.deleteId) {
        return
      }
      this.$request(`/schools/feedback/deleteFeedback/${this.deleteId}`, {
        method: 'delete'
      }).then(res => {
        if(+res.code === 0) {
          vant.Toast.success('删除反馈成功');
          this.getList()
        } else {
          vant.Notify({ type: 'warning', message: res})
        }
      }).finally(() => {
        this.deleteId = ''
      })
    }
  }
}
</script>

<style lang="less">
.list{
  .van-cell{
    background-color: rgba(255,255,255, 0);
  }

}
</style>

<style scoped lang="less">
.list{
  width: 100vw;
  min-height: 100vh;
  //display: flex;
  flex-direction: column;
  background: #f6f7f9;
  .content{
    flex: 1;
    width: 100%;
    //overflow-y: auto;
    padding: 23px 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    >div {
      flex: 1;
    }
    .normal{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      img{
        width: 183px;
        height: 151px;
      }
      span{
        padding: 0 40px;
        margin-top:7px;
        color: #C1C1C1;
        font-size: 14px;
        text-align: center;
      }
    }
    .item{
      //border-left: 2px solid #E5E5E5;
      padding-left: 22px;
      box-sizing: border-box;
      position: relative;
      padding-bottom: 0;
      padding-top: 0;
      overflow: auto;
      &:nth-last-child(3){
        .itemData{
          &:before{
            content: "";
            position: absolute;
            top: 0;

            width: 2px;
            height: 100%;
            //background: red;
            opacity: 0;
          }
        }
      }
      .van-cell__value{
        overflow: initial;
      }
      .timeBox{
        display: flex;
        align-items: center;
        position: relative;
        line-height:16px;
        &:after{
          content: "";
          position: absolute;
          left: -22px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #B0B0B0;
          transform: scale(1) !important;
        }
        .point{
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #B0B0B0;
        }
        .time{
          color: #999999;
          font-size: 13px;
        }
      }
      .itemData{
        position: relative;
        padding-bottom: 30px;
        padding-top: 8px;
        &:before{
          content: "";
          position: absolute;
          top: 0;
          left: -18px;
          width: 2px;
          height: 100%;
          background: #e5e5e5;
        }
      }

      .itemContent{
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        padding: 12px 16px 16px;
        box-sizing: border-box;
        background: #ffffff;
        .itemTitle{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title{
            color: #1C1C1C;
            font-size: 16px;
            font-weight: bold;
          }
          .delBtn{
            width: 28px;
            height: 28px;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .message{
          margin-top: 6px;
          color: #25262B;
          font-size: 14px;
          word-wrap: break-word;
        }
        .imgBox{
          margin-top: 10px;
          img{
            width: 56px;
            height: 56px;
            margin-right: 8px;
            border-radius: 6px;
          }
        }
      }
      .remark{
        word-wrap: break-word;
        margin-top: 12px;
        background: rgba(255,170,83,0.12);
        border-radius: 8px;
        color: #FF9223;
        font-size: 14px;
        padding: 16px;
        box-sizing: border-box;
      }
    }
  }
  .delModal{
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    .content{
      background: #ffffff;
      margin: 0 33px;
      border-radius: 16px;
      box-sizing: border-box;
      padding: 20px 16px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title{
        color: #000000;
        font-size: 17px;
        font-weight: bold;
      }
      .btnBox{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        width: 100%;
        .btn{
          height: 44px;
          background: #F2F2F2;
          opacity: 1;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: #6A6A6A;
          font-size: 17px;
          &.ok{
            margin-right: 10px;
            background: #FF9F3D;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
