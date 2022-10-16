<template>
  <div class="review-textarea">
    <textarea
      class="review-input"
      v-model="modelValue"
      :placeholder="placeholder"
      maxlength="150"
    >
    </textarea>
    <div class="review-btn">
      <ui-button
        :disabled="modelValue == '' || /(^[ ]+$)/.test(modelValue)"
        type="primary-review"
        @click="handleReview"
        >评论</ui-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    placeholder: {
      type: String,
      default: "请输入...",
    },
  },
  emits: ["handleReview"],
  setup(props, { emit }) {
    const modelValue = ref("");

    function handleReview() {
      emit("handleReview", modelValue.value); // 将输入的值派发出去
      modelValue.value = "";
    }

    return {
      modelValue,
      handleReview,
    };
  },
});
</script>
<style lang="less" scoped>
.review-textarea {
  width: 100%;
  height: 148px;
  background-color: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .review-input {
    background-color: #f8f8f8;
    height: 100%;
    border: none;
    resize: none;

    // 滚动条宽度
    &::-webkit-scrollbar {
      width: 6px;
    }
    // 滚动条中滑块的样式
    &::-webkit-scrollbar-thumb {
      background-color: #bfbfbf;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      cursor: pointer;
    }
  }

  .review-btn {
    text-align: right;
    margin-top: 14px;
  }
}
</style>
