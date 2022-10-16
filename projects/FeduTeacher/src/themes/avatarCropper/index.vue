<template>
  <div
    name="avatarCropper"
    style="z-index: 999"
  >
    <div class="avatar">
      <!-- <span class="close-icon">x</span> -->
      <ui-icon
        style=" 
    color: #999999;
    float: right;
    margin-right: 20px;
    margin-top: 20px;"
        icon="icon-a-zu238"
        @click="cancelImg"
      />
      <div class="title">编辑头像</div>
      <div class="content">
        <div class="content-box">
          <div>
            <!-- <input type="file" style="display：none"  /> -->
            <div v-if="!showLocal">
              <ui-tab
                style="margin-left: -3px"
                v-model:index="tableIndex"
                @click="getTableIndex"
                :list="['标准', '精选']"
              ></ui-tab>
              <div style="
                  width: 336px;
                  height: 2px;
                  background: #f2f2f2;
                  margin-left: 13px;
                  margin-top: -2px;
                "></div>
              <div class="content-icon">
                <ul>
                  <li
                    v-for="(item, index) in classIconList"
                    :key="index"
                  >
                    <div
                      class="icon-box"
                      v-if="item.type === tableIndex + 1"
                    >
                      <span class="icon-name">{{ item.name }}</span>
                      <div class="icon-list">
                        <img
                          v-for="(items, indexs) in item.children"
                          :key="indexs"
                          :class="[
                            'icon-img',
                            items.id === iconIndex ? 'icon-active' : '',
                          ]"
                          :src="items.pic"
                          @click="getIcon(items)"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="showLocal && !showPhoto">
              <ui-button
                class="content-button"
                @click.prevent="chooseImg"
              >选择图片
              </ui-button>
              <span class="content-title">支持jpg、png格式的图片，大小不超过3M</span>
            </div>
          </div>
          <div>
            <canvas
              id="originalCanvasBox"
              @mousedown.prevent="
                hasImgSrc ? pressDown(settings.originalCtx, $event) : false
              "
              @mousemove="settings.mouseDown ? moveMouse($event) : false"
              @mouseup="stopCut"
              @mousewheel="onMouseWheel($event)"
            >
              您的浏览器不支持canvas，请升级最新版本
            </canvas>
          </div>
        </div>
        <div class="preview-box">
          <span style="font-size: 12px; color: #999999">预览</span>
          <div class="preview-img img1">
            <canvas
              v-show="false"
              id="cutCanvasBox"
            ></canvas>
            <img
              :src="src"
              style="width: 92px"
            />
          </div>
          <div class="preview-img img2">
            <img
              :src="src"
              style="width: 48px"
            />
          </div>
          <div class="preview-img img3">
            <img
              :src="src"
              style="width: 32px"
            />
          </div>
        </div>
      </div>
      <div style="width: 478px;
height: 1px;
background: #E8E8E8;
margin:auto
"></div>
      <div class="footer-box">
        <ui-button
          class="button re-button"
          @click="showLocal = !showLocal"
        >{{
          showLocal ? "返回" : "本地图片"
        }}</ui-button>
        <ui-button
          v-if="hasImgSrc"
          class="button re-button"
          @click="reUplod"
        >重新上传</ui-button>
        <ui-button
          @click="sendImg"
          class="button save"
        >保存</ui-button>
        <ui-button
          @click="cancelImg"
          class="button"
        >取消</ui-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { imgInfo } from "../../assets/logo.png";
import { setting } from "./set";
import { GetClassIcon } from "@/api/common";
import Message from "@/themes/message";
import { sendFile } from "@/api/common";
const Component = defineComponent({
  name: "ui-avatar-cropper",
  props: {},
  emits: {
    error: null,
    sendImgInfo: null,
    cancelImg: null,
  },

  setup(props, cxt) {
    const src = ref("");
    const showLocal = ref(false);
    const tableIndex = ref(0);
    var settings: setting = {
      originalCanvas: null, // 原图 画布
      originalCtx: null, // 原图 上下文
      originalImg: Object, // 原图片的对象
      cutCanvas: null, // 显示裁剪后图片的画布
      cutCtx: null, // 裁图 画布 上下文
      cutCtx1: null,
      cutCtx2: null,
      cutImg: null, // 裁剪后 图片的对象
      originalCanvasWidth: 0, // 原图 压缩后 宽度
      originalCanvasHeight: 0, // 原图 压缩后 高度
      scaleSize: 340, // 原图压缩的尺寸
      cutSize: 92, // 裁剪 正方形的宽高
      cutSize1: 48,
      cutSize2: 32,
      centerX: 0, // 原图画布中心 X坐标
      centerY: 0, // 原图画布中心 Y坐标
      mouseX: 0, // 鼠标所在点 X坐标
      mouseY: 0, // 鼠标所在点 Y坐标
      differenceX: 0, // 原点X - 鼠标X点 差值
      differenceY: 0, // 原点Y - 鼠标Y点 差值
      mouseDown: false, // 鼠标是否点击
      imageData: null, // 截图 对象
      tempImageData: null, // 实时截图 缓存对象
      imgFormat: ["jpg", "png"], // 图片上传格式
    };
    onMounted(() => {
      // 初始化 原图的画布
      const originalCanvasBox = document.getElementById(
        "originalCanvasBox"
      ) as HTMLCanvasElement;
      const cutCanvasBox = document.getElementById(
        "cutCanvasBox"
      ) as HTMLCanvasElement;
      if (originalCanvasBox) {
        let originalCanvas = (settings.originalCanvas = originalCanvasBox);
        let originalCtx = (settings.originalCtx = originalCanvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D);
        if (cutCanvasBox) {
          // 初始化 裁图 画布
          let cutCanvas = cutCanvasBox;
          settings.cutCtx = cutCanvas.getContext(
            "2d"
          ) as CanvasRenderingContext2D;
          cutCanvas.width = settings.cutSize;
          cutCanvas.height = settings.cutSize;
        }
        originalCanvas.width = settings.originalCanvasWidth =
          settings.scaleSize;
        originalCanvas.height = settings.originalCanvasHeight =
          settings.scaleSize;
        // 绘制默认图片
        if (originalCanvas) {
          let originalImg = (settings.originalImg = new Image());
          originalImg.src = imgInfo;
          originalImg.onload = () => {
            originalCtx.drawImage(
              originalImg,
              originalCanvas.width / 4 - settings.cutSize / 4,
              originalCanvas.height / 4 - settings.cutSize / 4,
              settings.cutSize,
              settings.cutSize
            );
          };
        }
      }
    });
    const changeDataURL = (fileObj: any, callback: any) => {
      let file = new FileReader();
      file.readAsDataURL(fileObj);
      file.onload = (e: any) => {
        callback(e.target.result);
      };
    };
    const clearCanvas = () => {
      // 绘制原图片
      settings.originalCtx.clearRect(
        0,
        0,
        settings.originalCanvasWidth,
        settings.originalCanvasHeight
      );
    };
    // 绘制 压缩后的图片
    const drawOriginal = (img: string, width: number, height: number) => {
      // 绘制 原图
      settings.originalCtx.drawImage(img, 0, 0, width, height);
      // 缓存 截图对象
      settings.imageData = settings.originalCtx.getImageData(
        settings.centerX - settings.cutSize / 2,
        settings.centerY - settings.cutSize / 2,
        settings.cutSize,
        settings.cutSize
      );
      // 清除截图区域时使用
      settings.tempImageData = settings.originalCtx.getImageData(
        settings.centerX - settings.cutSize / 2 - 1,
        settings.centerY - settings.cutSize / 2 - 1,
        settings.cutSize + 2,
        settings.cutSize + 2
      );
      // 绘制 截图框
      drawCuttingFrame(
        settings.originalCtx,
        settings.centerX,
        settings.centerY,
        settings.cutSize / 2,
        20
      );
      // 绘制 裁剪图片
      drawCutImage(settings.imageData);
    };
    // 绘制截图框
    const drawCuttingFrame = (
      ctx: any,
      x: number,
      y: number,
      m: number,
      d: number
    ) => {
      ctx.setLineDash([5, 10]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      // 右上框
      ctx.moveTo(x, y - m);
      ctx.lineTo(x + m, y - m);
      ctx.lineTo(x + m, y - d);
      // // 右下框
      // ctx.moveTo(x + m, y + d);
      ctx.lineTo(x + m, y + m);
      ctx.lineTo(x + d, y + m);
      // // 左下框
      // ctx.moveTo(x - d, y + m);
      ctx.lineTo(x - m, y + m);
      ctx.lineTo(x - m, y + d);
      // //左上框
      // ctx.moveTo(x - m, y - d);
      ctx.lineTo(x - m, y - m);
      ctx.lineTo(x, y - m);
      ctx.stroke();
      ctx.closePath();
    };

    const drawCutImage = (imageData: any) => {
      settings.cutCtx.putImageData(imageData, 0, 0);
      src.value = settings.cutCtx.canvas.toDataURL("image/png");
    };
    const onMouseWheel = (e: any) => {
      let z: number = e.deltaY > 0 ? -0.1 : 0.1;
      if (z > 0) {
        plusSize();
      } else {
        reduceSize();
      }
    };
    const pressDown = (ctx: any, e: any) => {
      // 鼠标 坐标
      settings.mouseX = e.offsetX;
      settings.mouseY = e.offsetY;
      // 原点到鼠标之间的差值
      settings.differenceX = settings.centerX - settings.mouseX;
      settings.differenceY = settings.centerY - settings.mouseY;
      // 截图框内才能拖动
      if (
        Math.abs(settings.differenceX) <= settings.cutSize / 2 &&
        Math.abs(settings.differenceY) <= settings.cutSize / 2
      ) {
        // 允许鼠标移动事件
        settings.mouseDown = true;
      }
    };
    // 鼠标移动事件
    const moveMouse = (e: any) => {
      if (settings.mouseDown) {
        // 清空 上个路径的截图框 X、Y坐标 - 1 宽高 + 2 彻底清除整个截图框区域
        // settings.originalCtx.clearRect(
        //   settings.centerX - settings.cutSize / 2 - 1,
        //   settings.centerY - settings.cutSize / 2 - 1,
        //   settings.cutSize + 2,
        //   settings.cutSize + 2
        // );
        settings.originalCtx.putImageData(
          settings.tempImageData,
          settings.centerX - settings.cutSize / 2 - 1,
          settings.centerY - settings.cutSize / 2 - 1
        );
        // 重新赋值 截图框原点位置
        if (
          e.offsetX > settings.cutSize / 2 - settings.differenceX &&
          e.offsetX + settings.cutSize / 2 + settings.differenceX <
            settings.originalCanvas.width
        ) {
          // 可移动范围内赋值
          // console.log("可移动");
          settings.centerX = e.offsetX + settings.differenceX;
        } else {
          // 不可移动范围内赋值
          // console.log("不可移动");

          settings.centerX =
            e.offsetX <= settings.cutSize / 2 - settings.differenceX
              ? settings.cutSize / 2
              : settings.originalCanvas.width - settings.cutSize / 2;
        }
        if (
          e.offsetY > settings.cutSize / 2 - settings.differenceY &&
          e.offsetY + settings.cutSize / 2 + settings.differenceY <
            settings.originalCanvas.height
        ) {
          settings.centerY = e.offsetY + settings.differenceY;
        } else {
          settings.centerY =
            e.offsetY <= settings.cutSize / 2 - settings.differenceY
              ? settings.cutSize / 2
              : settings.originalCanvas.height - settings.cutSize / 2;
        }
        // 缓存 截图对象
        settings.imageData = settings.originalCtx.getImageData(
          settings.centerX - settings.cutSize / 2,
          settings.centerY - settings.cutSize / 2,
          settings.cutSize,
          settings.cutSize
        );
        // 缓存 清除截图框的 绘图模块
        settings.tempImageData = settings.originalCtx.getImageData(
          settings.centerX - settings.cutSize / 2 - 1,
          settings.centerY - settings.cutSize / 2 - 1,
          settings.cutSize + 2,
          settings.cutSize + 2
        );
        // 重绘截图框
        drawCuttingFrame(
          settings.originalCtx,
          settings.centerX,
          settings.centerY,
          settings.cutSize / 2,
          20
        );
        // 绘制 裁剪图片
        drawCutImage(settings.imageData);
      }
    };
    // 松开鼠标点击
    const stopCut = () => {
      // 停止鼠标拖动事件
      settings.mouseDown = false;
    };
    // 尺寸减1 重绘
    const reduceSize = () => {
      // 不能小于裁剪大小
      if (
        settings.originalCanvasWidth > settings.cutSize &&
        settings.originalCanvasHeight > settings.cutSize
      ) {
        // 清除画布
        clearCanvas();
        // 固定短边，计算长边的值
        if (settings.originalCanvasWidth > settings.originalCanvasHeight) {
          settings.originalCanvas.height = settings.originalCanvasHeight -= 10;
          settings.originalCanvas.width = settings.originalCanvasWidth =
            (settings.originalCanvasHeight /
              (settings.originalCanvasHeight + 10)) *
            settings.originalCanvasWidth;
        } else if (
          settings.originalCanvasWidth < settings.originalCanvasHeight
        ) {
          settings.originalCanvas.width = settings.originalCanvasWidth -= 10;
          settings.originalCanvas.height = settings.originalCanvasHeight =
            (settings.originalCanvasWidth /
              (settings.originalCanvasWidth + 10)) *
            settings.originalCanvasHeight;
        } else {
          settings.originalCanvas.width = settings.originalCanvasWidth -= 10;
          settings.originalCanvas.height = settings.originalCanvasHeight -= 10;
        }
        // 设置绘图原点
        settings.centerX = Math.round(settings.originalCanvas.width / 2);
        settings.centerY = Math.round(settings.originalCanvas.height / 2);
        // 绘制 原图 截图框
        drawOriginal(
          settings.originalImg,
          settings.originalCanvasWidth,
          settings.originalCanvasHeight
        );
      }
    };
    // 尺寸加1 重绘
    const plusSize = () => {
      if (
        !(
          settings.originalCanvasWidth >= 800 &&
          settings.originalCanvasHeight >= 800
        )
      ) {
        // 清除画布
        // this.clearCanvas()
        // 计算长边的值
        if (settings.originalCanvasWidth > settings.originalCanvasHeight) {
          settings.originalCanvas.height = settings.originalCanvasHeight += 10;
          settings.originalCanvas.width = settings.originalCanvasWidth =
            (settings.originalCanvasHeight /
              (settings.originalCanvasHeight - 10)) *
            settings.originalCanvasWidth;
        } else if (
          settings.originalCanvasWidth < settings.originalCanvasHeight
        ) {
          settings.originalCanvas.width = settings.originalCanvasWidth += 10;
          settings.originalCanvas.height = settings.originalCanvasHeight =
            (settings.originalCanvasWidth /
              (settings.originalCanvasWidth - 10)) *
            settings.originalCanvasHeight;
        } else {
          settings.originalCanvas.width = settings.originalCanvasWidth += 10;
          settings.originalCanvas.height = settings.originalCanvasHeight += 10;
        }
        // 设置绘图原点
        settings.centerX = Math.round(settings.originalCanvas.width / 2);
        settings.centerY = Math.round(settings.originalCanvas.height / 2);
        // 绘制 原图 截图框
        drawOriginal(
          settings.originalImg,
          settings.originalCanvasWidth,
          settings.originalCanvasHeight
        );
      }
    };
    const showPhoto = ref(false);
    const hasImgSrc = ref(false); // 是否有可裁剪图片
    const chooseImg = async (accept = "image/*") => {
      // 选中文件择执行
      let uploader = document.createElement("input");
      uploader.type = "file";
      uploader.accept = accept;
      uploader.click();
      uploader.onchange = (e: Event) => {
        const target = e.target;
        const fileList: FileList | null = (target as HTMLInputElement).files;
        if (fileList && fileList.length) {
          // // 获取文件
          // // 限定上传格式
          let arr: Array<string> = settings.imgFormat;
          let str: any = fileList[0].name.split(".").pop();
          if (arr.indexOf(str) !== -1) {
            showPhoto.value = true;
            // 转换成Base 64位
            changeDataURL(fileList[0], (dataUrl: string) => {
              settings.originalImg.src = dataUrl;
              // 获取图片 宽高
              let width = settings.originalImg.width;
              let height = settings.originalImg.height;
              // 清除画布
              clearCanvas();
              // 重置画布的宽高
              const originalCanvas = settings.originalCanvas;
              originalCanvas.width = settings.originalCanvasWidth =
                settings.scaleSize;
              originalCanvas.height = settings.originalCanvasHeight =
                settings.scaleSize;
              //设置画布压缩后的宽高;
              if (width > height) {
                originalCanvas.width = settings.originalCanvasWidth =
                  (width * settings.scaleSize) / height;
              } else if (width < height) {
                originalCanvas.height = settings.originalCanvasHeight =
                  (height * settings.scaleSize) / width;
              }
              // 设置绘图原点
              settings.centerX = Math.round(originalCanvas.width / 2);
              settings.centerY = Math.round(originalCanvas.height / 2);
              // 图片加载完成 绘制选中的图片
              settings.originalImg.onload = () => {
                // 允许鼠标点击事件
                hasImgSrc.value = true;
                // 绘制图片
                drawOriginal(
                  settings.originalImg,
                  originalCanvas.width,
                  originalCanvas.height
                );
              };
            });
          } else {
            alert("图片格式错误");
          }
        }
      };
    };
    //重新上传
    const reUplod = () => {
      showPhoto.value = !showPhoto.value;
      hasImgSrc.value = !hasImgSrc.value;
      clearCanvas();
      src.value = "";
    };
    const iconInfo = ref({} as any);

    //上传图片
    const sendImg = () => {
      if (!showLocal.value) {
        cxt.emit("sendImgInfo", {
          data: iconInfo.value.picId,
          attach: iconInfo.value.pic,
        });
        clearCanvas();
      } else if (src.value) {
        let file = base64ToFile(src.value, "headerimg.jpg");
        sendFile(file).then((res) => {
          if (+res.code === 0) {
            Message.success("图片上传成功!");
            cxt.emit("sendImgInfo", res);
            clearCanvas();
          }
        });
      } else {
        Message.warning("请选择图片");
      }
    };
    //取消上传
    const cancelImg = () => {
      cxt.emit("cancelImg", false);
      clearCanvas();
    };
    //base64转 file
    const base64ToFile = (urlData: any, fileName: string) => {
      let arr = urlData.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bytes = atob(arr[1]); // 解码base64
      let n = bytes.length;
      let ia = new Uint8Array(n);
      while (n--) {
        ia[n] = bytes.charCodeAt(n);
      }
      return new File([ia], fileName, { type: mime });
    };
    const classIconList = ref([] as Array<any>);

    //获取班徽列表
    const getIconList = async () => {
      let item = {};
      let { data, code } = await GetClassIcon();
      if (code === 0) {
        for (let i = 0; i < data.length; i++) {
          let { id, name, pic, picId } = data[i];
          item = {
            id: id,
            name: name,
            pic: pic,
            picId: picId,
          };
          data[i].children.unshift(item);
        }
        classIconList.value = [...data];
        iconInfo.value = data[0].children[0];
        src.value = data[0].children[0].pic;
      }
    };
    onMounted(() => {
      getIconList();
      // getSubjectData();
    });
    const iconIndex = ref(1);
    const getIcon = (data: any) => {
      let item = {};
      if (data) {
        src.value = data.pic;
        iconIndex.value = data.id;
        iconInfo.value = Object.assign({}, data);
        // item = {
        //   data: data.pic,
        //   id: data.picId,
        // };
        // console.log(item);
        // cxt.emit("sendImgInfo", item);
      }
    };
    return {
      showPhoto,
      chooseImg,
      settings,
      hasImgSrc,
      src,
      onMouseWheel,
      pressDown,
      moveMouse,
      stopCut,
      reUplod,
      sendImg,
      cancelImg,
      classIconList,
      tableIndex,
      getIcon,
      iconIndex,
      showLocal,
    };
  },
});

export default Component;
</script>
<style scoped lang="less">
.ui-tab {
  /deep/ div {
    font-size: 14px !important;
    margin-left: 16px !important;
  }
}
&::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  position: absolute;
  right: 0;
}
&::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  width: 6px;
  height: 90px;
  background-color: #bfbfbf;
  border-radius: 4px;
}
&::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 34, 68, 0.01);
  border-radius: 4px;
  background: rgba(0, 34, 68, 0);
}
.avatar {
  width: 538px;
  height: 545px;
  background: #ffffff;
  border: 1px solid #eee;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  opacity: 1;
  z-index: 99999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;

  .title {
    margin: 30px 0 0 30px;
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    color: #222222;
    opacity: 1;
  }
  .content {
    margin-top: 20px;
    display: flex;
    width: 100%;
    padding-bottom: 30px;
    .content-box {
      text-align: center;
      margin-left: 30px;
      width: 360px;
      overflow: hidden;
      height: 360px;
      // background: #f2f2f2;
      border: 1px solid rgba(0, 0, 0, 0.050980392156862744);
      .content-icon {
        height: 335px;
        width: 100%;
        margin-top: 2px;
        overflow-y: scroll;
        overflow-x: hidden;
        .icon-box {
          width: 100%;
          display: block;
          .icon-name {
            width: 100%;
            text-align: left;
            display: block;
            margin-left: 12px;
            margin-top: 6px;
            margin-bottom: 5px;
            font-size: 14px;
            color: #222222;
          }
          .icon-list {
            width: 100%;
            display: grid;
            margin-left: 12px;
            grid-template-rows: repeat(auto-fill, 54px);
            grid-template-columns: repeat(auto-fill, 54px);
            grid-row-gap: 13px;
            grid-column-gap: 15px;
            .icon-img {
              width: 54px;
              // border: 1px solid red;
              cursor: pointer;
              border: 2px solid rgba(0, 0, 0, 0.078);
              border-radius: 4px;
            }
            .icon-active {
              border: 2px solid #ff9900;
              border-radius: 4px;
            }
          }
        }
      }
      .content-button {
        margin-top: 40%;
        background: #ff9900;
        color: #ffffff;
        font-size: 14px;
      }
      .content-title {
        display: block;
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        line-height: 25px;
        color: #666666;
      }
      // .icon-list {
      //   .ui-tab {
      //     > div {
      //       font-size: 12px;
      //     }
      //   }
      //   span {
      //   }
      // }
    }
    .preview-box {
      text-align: center;
      width: 25%;
      // display: grid;
      .img1 {
        width: 90px;
        height: 90px;
        margin: auto;
        margin-top: 15px;
      }
      .img2 {
        width: 48px;
        height: 48px;
        margin: auto;
        margin-top: 40px;
      }
      .img3 {
        width: 32px;
        height: 32px;
        margin: auto;
        margin-top: 40px;
      }
      .preview-img {
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.050980392156862744);
        opacity: 1;
        border-radius: 4px;
      }
    }
  }
  .footer-box {
    margin-top: 30px;
    .button {
      font-size: 14px;
      margin-right: 16px;
      float: right;
    }
    .re-button {
      float: left;
      margin-left: 16px;
    }
    .save {
      background: #ff9900;
      color: #ffffff;
    }
  }
}
</style>
