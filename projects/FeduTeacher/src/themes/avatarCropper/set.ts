export interface setting {
  originalCanvas: any; // 原图 画布
  originalCtx: any; // 原图 上下文
  originalImg: any; // 原图片的对象
  cutCanvas: any; // 显示裁剪后图片的画布
  cutCtx: any; // 裁图 画布 上下文
  cutCtx1: any;
  cutCtx2: any;
  cutImg: any; // 裁剪后 图片的对象
  originalCanvasWidth: number; // 原图 压缩后 宽度
  originalCanvasHeight: number; // 原图 压缩后 高度
  scaleSize: number; // 原图压缩的尺寸
  cutSize: number; // 裁剪 正方形的宽高
  cutSize1: number; //
  cutSize2: number;
  centerX: number; // 原图画布中心 X坐标
  centerY: number; // 原图画布中心 Y坐标
  mouseX: number; // 鼠标所在点 X坐标
  mouseY: number; // 鼠标所在点 Y坐标
  differenceX: number; // 原点X - 鼠标X点 差值
  differenceY: number; // 原点Y - 鼠标Y点 差值
  mouseDown: boolean; // 鼠标是否点击
  imageData: any; // 截图 对象
  tempImageData: any; // 实时截图 缓存对象
  imgFormat: string[]; // 图片上传格式
}
