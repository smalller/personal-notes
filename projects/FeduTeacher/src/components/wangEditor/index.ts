import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import WangEditor from "wangeditor";

interface uploadRespon {
  data: string;
  type: string;
  url: string;
  attach: string;
}

export default {
  props: {
    initValue: String,
  },
  setup(props: any, content: any) {
    const editor = ref(null);
    const cmsUpload = ref(null);
    let instance: any = ""; //编辑器实例
    onMounted(() => {
      instance = new WangEditor(editor.value);

      // 自定义菜单
      instance.config.menus = [
        "head",
        "bold",
        "fontSize",
        "italic",
        "underline",
        "foreColor",
        // "link",
        // "todo",
        "justify",
        // "quote",
        "image",
        // "video",
        "splitLine",
        "undo",
        "redo",
      ];

      // 自定义上传图片
      instance.config.customUploadImg = function (
        resultFiles: any,
        insertImgFn: any
      ) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        (cmsUpload.value as any)
          .uploadImageFile(resultFiles[0])
          .then((res: uploadRespon) => {
            // 上传图片，返回结果，将图片插入到编辑器中
            insertImgFn(res.attach);
          });
      };

      // 自定义上传视频
      instance.config.customUploadVideo = function (
        resultFiles: any,
        insertVideoFn: any
      ) {
        // resultFiles 是 input 中选中的文件列表
        // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
        (cmsUpload.value as any)
          .uploadImageFile(resultFiles[0])
          .then((res: uploadRespon) => {
            // 上传视频，返回结果，将视频地址插入到编辑器中
            insertVideoFn(res.attach);
          });
      };

      // 限制上传图片格式
      instance.config.uploadImgAccept = ["jpg", "jpeg", "png", "gif", "bmp"];
      // 设置编辑器高度
      instance.config.height = 400;
      // 设置编辑器页面层级
      instance.config.zIndex = 10;
      // 设置编辑器placeholder
      instance.config.placeholder = "请输入内容";
      // 配置编辑器显示颜色
      instance.config.colors = ["#000000", "#eeece0", "#1c487f", "#4d80bf"];
      // 忽略粘贴内容中的图片
      instance.config.pasteIgnoreImg = true;
      // 配置全屏功能按钮是否展示
      instance.config.showFullScreen = false;

      // 隐藏网络图片
      instance.config.showLinkImg = false;

      Object.assign(instance.config, {
        // 输入值发生变化的时候
        onchange() {
          // 将值传递至父组件
          content.emit("getWangEditorValue", instance.txt.html());
        },
        // 上传网络图片回调
        linkImgCallback(src: string) {
          // console.log("图片 src ", src);
        },
        // 上传网络视频回调
        onlineVideoCallback(video: string) {
          // console.log("插入视频内容", video);
        },
      });

      instance.create();
      // instance.txt.html(`<p>欢迎大家来到直播间！</p>`); // 重新设置编辑器内容

      // 初始化编辑器内容
      const textValue = computed(() => props.initValue);
      instance.txt.html(textValue.value); // 重新设置编辑器内容

      watch(
        () => props.initValue,
        () => {
          instance.txt.html(props.initValue); // 重新设置编辑器内容
        }
      );
    });

    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });

    return {
      editor,
      cmsUpload,
    };
  },
};
