<template>
  <div
    v-show="show"
    v-if="isModal"
    class="uploadMock"
  ></div>
  <el-card
    v-if="show"
    class="upload"
    :class="[isModal ? 'modalUpload' : 'uploadBox']"
  >
    <div class="uploadBox">
      <div class="fileName">
        <div>正在上传，请稍等</div>
        <!-- <div v-show="!isModal">取消上传</div> -->
      </div>
      <div class="fileInfo">
        <div :style="{ width: schedule }"></div>
      </div>
      <div
        class="uploadInfo"
        v-if="isModal"
      >
        <span>{{ uploadText }}</span>
        <span>{{ schedule }}</span>
      </div>
      <div
        class="close"
        v-if="isModal"
      >
        <i
          class="el-icon-close"
          @click="close"
        ></i>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, getCurrentInstance, ref } from "vue";
import { useStore } from "vuex";

interface uploadOption {
  section?: boolean;
  show?: boolean;
  multipleLengths?: number;
}

type callback = () => void;

export default defineComponent({
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const $store = useStore();
    const uploadText = ref("1");
    const show = ref(false);
    const schedule = ref("0%");
    const isLoading = ref(false);
    const fileAction = "";
    const imageFileAction =
      process.env.VUE_APP_BASE_API + "/mamserver/api/file/upload";
    const videoUploadUrl =
      process.env.VUE_APP_BASE_API + "/mamserver/api/file/uploadPart";
    const chunkSize = 5 * 1024 * 1024;
    let source = axios.CancelToken.source();
    const upload = (accept = "", opt: uploadOption) => {
      console.log(opt);
      uploadText.value = "上传中";
      return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.multiple = true;
        input.onchange = (e: Event) => {
          show.value = opt?.show ? opt.show : true;
          const target = e.target;
          const fileList: FileList | null = (target as HTMLInputElement).files;
          if (fileList && fileList.length) {
            if (opt?.multipleLengths) {
              if (fileList.length > opt.multipleLengths) {
                reject("文件选择数量超过限制");
                return;
              }
            }
            const list: Array<Promise<any>> = [];
            for (let i = 0; i < fileList.length; i++) {
              if (fileList[i].type.indexOf("image") == -1) {
                list.push(splitUpload(fileList[i]));
              } else {
                list.push(uploadImageFile(fileList[i]));
              }
            }
            Promise.all(list).then((res) => {
              uploadText.value = "上传完成";
              schedule.value = "100%";
              show.value = false;
              schedule.value = "0%";
              resolve(res);
            });
          }
        };
        input.click();
      });
    };
    // 上传到文件服务器
    const uploadImageFile = (file: File) => {
      return new Promise((resolve, reject) => {
        let data = new FormData();
        data.append("file", file);
        data.append("type", "course");
        data.append("bizType", "album");
        source = axios.CancelToken.source();
        axios({
          url: imageFileAction,
          method: "post",
          data,
          cancelToken: source.token,
          headers: {
            firmId: "",
            token: sessionStorage.getItem("token"),
            userId: sessionStorage.getItem("userId"),
          },
          //原生获取上传进度的事件
          // onUploadProgress: function (progressEvent) {
          //   //   let complete =
          //   //     ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          //   //   console.log("上传 " + complete);
          //   //   schedule.value = (+complete === 100 ? 99 : complete) + "%";
        })
          .then((res) => {
            if (+res.data.code === 0) {
              resolve({
                url: URL.createObjectURL(file),
                data: res.data.data,
                type: "image",
                attach: res.data.attach,
              });
            } else {
              if (+res.data.code === 401) {
                $store.dispatch("loginOut");
              }
              reject(res.data);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    };
    // 文件切片上传
    const splitUpload = (file: File) => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        if (file && limitedVideo(file)) {
          show.value = true;
          const fileDataList = createFileChunk(file);
          console.log(fileDataList);
          let size = 0;
          let isComplete = false;
          let index = 0;
          let partId = "";
          let fileTempName = file.name;
          console.log(fileTempName);
          if (+fileDataList.length > 1) {
            for (let item of fileDataList) {
              index++;
              if (index === fileDataList.length) {
                isComplete = true;
              }
              const res = await splitUploadOpen(
                item.file,
                {
                  fileName: fileTempName,
                  isComplete,
                  partId,
                },
                (prog: ProgressEvent) => {
                  console.log(prog);
                }
              );
              if (+(res as any).code === 0) {
                size += item.file.size;
                partId = (res as any).data.uploadId;
                fileTempName = (res as any).data.fileName;

                let complete = ((size / file.size) * 100) | 0;
                schedule.value = (+complete === 100 ? 99 : complete) + "%";
                if (fileDataList.length === index) {
                  show.value = false;
                  close();
                  resolve({
                    url: URL.createObjectURL(file),
                    data: (res as any).data,
                    type: "video",
                  });
                }
              } else {
                console.log(res);
                if (+(res as any).code === 401) {
                  $store.dispatch("loginOut");
                }
                // this.$message.error(err.msg);
              }
            }
          } else {
            const res = await splitUploadOpen(
              file,
              {
                fileName: fileTempName,
                isComplete: true,
                partId,
              },
              (progressEvent: ProgressEvent) => {
                let complete =
                  ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                schedule.value = (+complete === 100 ? 99 : complete) + "%";
              }
            );
            if (+(res as any).code === 0) {
              show.value = false;
              close();
              resolve({
                url: URL.createObjectURL(file),
                data: (res as any).data,
                type: "video",
              });
            } else {
              // this.$message.error(err.msg);
            }
          }
        }
      });
    };
    const splitUploadOpen = (file: File | Blob, params: any, call: any) => {
      return new Promise((resolve, reject) => {
        let data = new FormData();
        data.append("file", file);
        data.append("bizType", "Video");
        for (let paramsKey in params) {
          data.append(paramsKey, params[paramsKey]);
        }
        axios({
          url: videoUploadUrl,
          method: "post",
          data,
          headers: {
            firmId: "",
            token: sessionStorage.getItem("token"),
            userId: sessionStorage.getItem("userId"),
          },
          //原生获取上传进度的事件
          onUploadProgress: function (progressEvent) {
            if (call) {
              call(progressEvent);
            }
          },
        })
          .then((res) => {
            if (+res.data.code === 0) {
              resolve(res.data);
            }
            if (+res.data.code === 401) {
              const vm = getCurrentInstance();
              if (vm) {
                vm.appContext.config.globalProperties.$message.error(res.data);
              }
              $store.dispatch("loginOut");
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    };
    //视频分割
    const createFileChunk = (file: File, size = chunkSize) => {
      isLoading.value = true;
      const fileChunkList = [];
      let count = 0;
      while (count < file.size) {
        fileChunkList.push({
          file: file.slice(count, count + size),
        });
        count += size;
      }
      return fileChunkList;
    };
    //视频上传验证
    const limitedVideo = (file: File) => {
      console.log(file.type);
      const isLt500M = file.size / 1024 / 1024 < 2048;
      if (
        [
          "video/mp4",
          // 'video/ogg',
          // 'video/flv',
          // 'video/avi',
          // 'video/wmv',
          // 'video/rmvb',
        ].indexOf(file.type) === -1
      ) {
        // _this.$message.error("请上传正确的音视频格式");
        return false;
      }
      if (!isLt500M) {
        // _this.$message.error("上传视频大小不能超过2GB哦!");
        return false;
      }
      return true;
    };

    const close = () => {
      if (source) {
        source.cancel();
      }
      show.value = false;
      schedule.value = "0%";
    };

    return {
      show,
      schedule,
      isLoading,
      uploadText,
      upload,
      uploadImageFile,
      splitUpload,
    };
  },
});
</script>

<style lang="less">
.uploadMock {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9000;
  width: 100vw;
  height: 100vh;
}
.modalUpload {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9000;
  width: 470px;
  height: 120px;
  transform: translate(-50%, -50%);
}
.uploadBox {
  border: none;
  box-shadow: none !important;
}
.upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  background: #ffffff;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .close {
    position: absolute;
    top: 4px;
    right: 4px;
    i {
      cursor: pointer;
    }
  }
  .uploadBox {
    width: 90%;
    height: 100%;
    .uploadInfo {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      color: rgba(0, 0, 0, 1);
    }
  }
  .fileName {
    font-size: 12px;
    color: #222222;
    display: flex;
    justify-content: space-between;
    > div {
      &:last-child {
        user-select: none;
        cursor: pointer;
        color: #bfbfbf;
        font-size: 12px;
        &:hover {
          color: #999999;
        }
        &:active {
          color: #bfbfbf;
        }
      }
    }
  }
  .fileInfo {
    position: relative;
    width: 100%;
    height: 4px;
    margin-top: 14px;
    font-size: 18px;
    color: #1890ff;
    background: #dcdfe6;
    border-radius: 2px;
    span {
      position: absolute;
      top: -38px;
      right: 0;
    }
    > div {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: #ff9900;
      border-radius: 2px;
      transition: 0.5s;
    }
  }
}
</style>
