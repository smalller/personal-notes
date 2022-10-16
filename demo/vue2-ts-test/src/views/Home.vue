<template>
  <div class="home">
    数组长度：{{ count }}
    <button @click="pushNumToArr(numArr.length)">添加</button>
    <input type="text" @keydown.enter="popNumToArr" />
    <!-- {{ inputText }} -->
    <div v-for="(item, index) in numArr" :key="index">{{ item }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Home extends Vue {
  @Prop() public text!: string; // !表赋值断言，表示让编译器不要担心，以后会有人给这个变量赋值

  numArr: Array<string | number> = ["1", 2, 3, "4"];
  inputText: string;

  pushNumToArr(num: number) {
    this.numArr.push(num);
  }

  // KeyboardEvent表键盘事件类型
  popNumToArr(e: KeyboardEvent) {
    // 断言：表用户确定一下变量的类型，让编译器不用操心要获取的是什么类型
    const el = e.target as HTMLInputElement;
    // this.inputText = el.value;
    this.numArr.push(el.value);
  }

  // 寄存器作为计算属性来使用，和vue中的计算属性是一样的效果，是有缓存的，且是只读，没有set
  get count() {
    return this.numArr.length;
  }
}
</script>
