import { ref, createVNode, render } from "vue";
import MessageComponent from "./index.vue";

const timer = ref(3000); // 消息显示时长
let seed = 0; //索引
const instances: Array<HTMLElement> = []; //message列表
const container: HTMLElement = document.createElement("div");
container.style.cssText = `
position: fixed;
left: 50%;
transform: translateX(-50%)
`;
// 处理数据
function handleData(type: string, title: TitleType): void {
  const box: HTMLElement = document.createElement("div");
  seed++;
  // console.log(seed);
  const id = "ui_message_" + instances.length;
  // 创建一个div节点容器

  // 要传给组件的参数
  const messageInfo = {
    type,
    title,
    id,
    top: seed * 60,
  };

  // 创建一个虚拟节点
  const vm = createVNode(MessageComponent, { messageInfo });
  // console.log(vm.el);
  // container.appendChild(vm.el as Node);
  // 渲染到创建的div节点上
  render(vm, box);

  if (instances.length === 0) {
    // 将container元素挂载到body中
    document.body.appendChild(container);
  }
  const el = box.firstElementChild;
  container.appendChild(el as Node);
  instances.push(el as HTMLElement);

  // 卸载节点
  setTimeout(() => {
    // instances.forEach((item) => {
    //   render(null, item);
    // });
    container.removeChild(el as Node);
    // instances = instances.filter(
    //   (item) => item !== (box.firstElementChild as HTMLElement)
    // );
    // if (instances.length === 0) {
    //   document.body.removeChild(container);
    // }
    // seed = 0;
    // instances = [];
  }, timer.value);
}

type TitleType = string | number | undefined | null;

interface MessageImplements {
  success(title: TitleType): void;
  error(title: TitleType): void;
  warning(title: TitleType): void;
}

// interface Option {
//   message?: string;
//   type?: string;
//   duration?: number;
// }

class MessageClass implements MessageImplements {
  // constructor(public option?: Option) {
  //   console.log(option);
  // }

  // 成功提示
  success(title: TitleType): void {
    handleData("success", title);
  }

  // 错误提示
  error(title: TitleType): void {
    handleData("error", title);
  }

  // 警告提示
  warning(title: TitleType): void {
    handleData("warning", title);
  }
}

const Message = new MessageClass();

export default Message;
