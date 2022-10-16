<template>
  <el-dialog :model-value="show" width="600px" @close="close">
    <el-row>
      <el-col :span="10">
        <el-row justify="center">
          <img :src="QrCodeUrl" alt="">
        </el-row>
        <el-row justify="center">
          <el-button @click="upload">上传logo</el-button>
        </el-row>
      </el-col>
      <el-col :offset="2" :span="12">
        <el-row style="margin-top: 10px">
          <h4>链接</h4>
          <el-input readonly v-model="qrCodeInfo.createQrCode"></el-input>
        </el-row>
        <h4 style="margin-top: 10px">下载二维码</h4>
        <div style="margin-top: 10px">
          <el-button @click="download">仅下载二维码</el-button>
        </div>
        <div style="margin-top: 10px">
          <el-button @click="downloadMax">仅下载立牌式二维码</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
  <div class="qrCodeBox" ref="qrCodeBox">
    <img :src="QrCodeUrl" class="qrCode" alt="">
    <div class="logoBox">
      <img src="@/assets/images/alipay.png" class="" alt="">
      <img src="@/assets/images/wechat.png" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import {computed, ref, watch} from "vue";
import {QrCodeListItem} from "@/views/incomeScan/scan/data";
import {createQRCodeImg} from "@/views/incomeScan/scan/api";
import {uploadFile} from "@/utils/base";
import micell from "micell";
import html2canvas from 'html2canvas'

export default {
  name: "qrCodeMadel",
  props: {
    visibility: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:visibility': (visibility: boolean) => {
      return visibility
    }
  },
  setup(props, { emit }) {
    const show = ref<boolean>(props.visibility)
    const qrCodeInfo = ref<QrCodeListItem>()
    const QrCodeUrl = ref<string>('')
    const logoUrl = ref<string>('')
    const close = () => {
      show.value = false
      // emit('update:visibility',show.value)
      emit('close', show.value)
    }
    // watch(() => props.visibility, () => {
    //   show.value = props.visibility
    // })

    const upload = () => {
      uploadFile({}).then((res: any) => {
        logoUrl.value = res[0].imageUrl
        createQrCode()
      })
    }

    const createQrCode = () => {
      createQRCodeImg({
        content: qrCodeInfo.value?.createQrCode as string,
        logoUrl: logoUrl.value
      }).then(res => {
        QrCodeUrl.value = res.data
      })

    }

    const download = () => {
      if(QrCodeUrl.value){
        micell.download(QrCodeUrl.value, 'QrCode.png')
      }
    }

    const qrCodeBox = ref(null)
    const downloadMax = () => {
      // console.log(qrCodeBox.value)
      html2canvas((qrCodeBox.value as never as HTMLElement)).then(canvas => {
        canvas.toBlob(blob => {
          // console.log(blob)
          const url = URL.createObjectURL(blob);
          micell.download(url, 'QrCodeMax.png')
        })
      })
    }

    const open = (data:QrCodeListItem) => {
      show.value = true
      qrCodeInfo.value = data
      createQrCode()
    }
    return {
      close,
      open,
      show,
      qrCodeInfo,
      QrCodeUrl,
      upload,
      download,
      downloadMax,
      qrCodeBox
    }
  }
}
</script>

<style scoped lang="scss">
.qrCodeBox{
  position: fixed;
  top: 0;
  z-index: 5000;
  width: 500px;
  height: 900px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  left: -9999px;
  .qrCode{
    width: 100%;
  }
  .logoBox{
    display: flex;
    justify-content: space-around;
    padding-bottom: 160px;
    img{
      width: 30%;
    }
  }
}
</style>
